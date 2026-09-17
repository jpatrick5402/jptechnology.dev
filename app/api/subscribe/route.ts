import { NextResponse } from "next/server";
import { Resend } from "resend";
import { logSiteAction } from "@/lib/supabase/logSiteAction";
import { createUnsubscribeUrl } from "../unsubscribe/route";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const email = typeof body.email === "string" ? body.email.trim() : "";
		const website = typeof body.website === "string" ? body.website.trim() : "";

		if (website) {
			return NextResponse.json({ ok: true });
		}
		if (!emailPattern.test(email) || email.length > 320) {
			return NextResponse.json(
				{ error: "Please enter a valid email address." },
				{ status: 400 },
			);
		}

		const apiKey = process.env.RESEND_API_KEY;
		const audienceId = process.env.RESEND_AUDIENCE_ID;
		const fromAddress =
			process.env.NEWSLETTER_FROM_EMAIL || process.env.IDEA_FROM_EMAIL;
		if (!apiKey || !audienceId || !fromAddress) {
			return NextResponse.json(
				{ error: "The mailing list is not configured yet." },
				{ status: 503 },
			);
		}

		const resend = new Resend(apiKey);
		const { data: existingContact, error: lookupError } =
			await resend.contacts.get({
				audienceId,
				id: email,
			});
		if (existingContact) {
			if (!existingContact.unsubscribed) {
				return NextResponse.json({
					ok: true,
					alreadySubscribed: true,
					message: "This email is already on the list.",
				});
			}

			const { error: resubscribeError } = await resend.contacts.update({
				audienceId,
				email,
				unsubscribed: false,
			});
			if (resubscribeError) throw new Error(resubscribeError.message);
		}
		if (lookupError && lookupError.statusCode !== 404) {
			throw new Error(lookupError.message);
		}

		if (!existingContact) {
			const { error } = await resend.contacts.create({
				email,
				audienceId,
				unsubscribed: false,
			});
			if (
				error &&
				(error.statusCode === 409 ||
					/already exists|already subscribed|contact.*exist/i.test(
						error.message,
					))
			) {
				return NextResponse.json({
					ok: true,
					alreadySubscribed: true,
					message: "This email is already on the list.",
				});
			}
			if (error) {
				throw new Error(error.message);
			}
		}
		const unsubscribeUrl = createUnsubscribeUrl(
			email,
			new URL(request.url).origin,
		);
		if (!unsubscribeUrl) {
			throw new Error("Newsletter unsubscribe links are not configured.");
		}

		const { error: emailError } = await resend.emails.send({
			from: fromAddress,
			to: [email],
			subject: "You are on the JP Technology list",
			text: `Thanks for joining the JP Technology list. We will send occasional notes about useful tools, new initiatives, and the work behind them.\n\nUnsubscribe: ${unsubscribeUrl}`,
		});
		if (emailError) throw new Error(emailError.message);
		await logSiteAction(
			request,
			"newsletter_subscribe",
			"Subscribed to the newsletter",
		);

		return NextResponse.json({
			ok: true,
			message: existingContact
				? "You are back on the list. Check your inbox for a confirmation."
				: "You are on the list. Check your inbox for a confirmation.",
		});
	} catch {
		return NextResponse.json(
			{ error: "We could not add you right now. Please try again." },
			{ status: 500 },
		);
	}
}
