import { NextResponse } from "next/server";
import { Resend } from "resend";
import { logSiteAction } from "@/lib/supabase/logSiteAction";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const idea = typeof body.idea === "string" ? body.idea.trim() : "";
		const email = typeof body.email === "string" ? body.email.trim() : "";

		if (idea.length < 10 || idea.length > 5000) {
			return NextResponse.json(
				{ error: "Please share an idea between 10 and 5,000 characters." },
				{ status: 400 },
			);
		}
		if (!emailPattern.test(email) || email.length > 320) {
			return NextResponse.json(
				{ error: "Please enter a valid email address." },
				{ status: 400 },
			);
		}

		const apiKey = process.env.RESEND_API_KEY;
		const fromAddress = process.env.IDEA_FROM_EMAIL;
		if (!apiKey || !fromAddress) {
			return NextResponse.json(
				{ error: "Idea submissions are not configured yet." },
				{ status: 503 },
			);
		}

		const resend = new Resend(apiKey);
		const { error } = await resend.emails.send({
			from: fromAddress,
			to: ["hello@jptechnology.dev"],
			replyTo: email,
			subject: "New technology idea for JP Technology",
			text: `A new idea was submitted through jptechnology.dev.\n\nFrom: ${email}\n\nIdea:\n${idea}`,
		});
		if (error) throw new Error(error.message);
		await logSiteAction(request, "idea_submit", "Submitted a technology idea");

		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json(
			{ error: "We could not send your idea right now. Please try again." },
			{ status: 500 },
		);
	}
}
