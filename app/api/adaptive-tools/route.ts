import { NextResponse } from "next/server";
import { Resend } from "resend";
import { logSiteAction } from "@/lib/neon/logSiteAction";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const name = typeof body.name === "string" ? body.name.trim() : "";
		const email = typeof body.email === "string" ? body.email.trim() : "";
		const message = typeof body.message === "string" ? body.message.trim() : "";
		const website = typeof body.website === "string" ? body.website.trim() : "";

		if (website) {
			return NextResponse.json({ ok: true });
		}
		if (message.length < 10 || message.length > 5000) {
			return NextResponse.json(
				{
					error:
						"Please tell us a little about the task (10 to 5,000 characters).",
				},
				{ status: 400 },
			);
		}
		if (!emailPattern.test(email) || email.length > 320) {
			return NextResponse.json(
				{ error: "Please enter a valid email address." },
				{ status: 400 },
			);
		}
		if (name.length > 200) {
			return NextResponse.json(
				{ error: "Please keep your name under 200 characters." },
				{ status: 400 },
			);
		}

		const apiKey = process.env.RESEND_API_KEY;
		const fromAddress =
			process.env.IDEA_FROM_EMAIL || process.env.NEWSLETTER_FROM_EMAIL;
		if (!apiKey || !fromAddress) {
			return NextResponse.json(
				{ error: "Adaptive Tools inquiries are not configured yet." },
				{ status: 503 },
			);
		}

		const resend = new Resend(apiKey);
		const { error } = await resend.emails.send({
			from: fromAddress,
			to: ["accessibility@jptechnology.dev"],
			replyTo: email,
			subject: "Adaptive Tools inquiry from jptechnology.dev",
			text: `A new Adaptive Tools inquiry was submitted through jptechnology.dev.\n\nName: ${name || "(not given)"}\nEmail: ${email}\n\nMessage:\n${message}`,
		});
		if (error) throw new Error(error.message);
		await logSiteAction(
			request,
			"adaptive_tools_inquiry",
			"Submitted an Adaptive Tools inquiry",
		);

		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json(
			{ error: "We could not send your message right now. Please try again." },
			{ status: 500 },
		);
	}
}
