import { NextResponse } from "next/server";
import { Resend } from "resend";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PIECES = 200;

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const email = typeof body.email === "string" ? body.email.trim() : "";
		const design = body.design;

		if (!emailPattern.test(email) || email.length > 320) {
			return NextResponse.json(
				{ error: "Please enter a valid email address." },
				{ status: 400 },
			);
		}

		if (
			!design ||
			typeof design !== "object" ||
			typeof design.name !== "string" ||
			typeof design.description !== "string" ||
			typeof design.footprintId !== "string" ||
			!Array.isArray(design.pieces)
		) {
			return NextResponse.json(
				{ error: "This design could not be read. Please try again." },
				{ status: 400 },
			);
		}

		if (design.pieces.length === 0 || design.pieces.length > MAX_PIECES) {
			return NextResponse.json(
				{ error: "Add at least one piece to your booth before sending." },
				{ status: 400 },
			);
		}

		const boothName = design.name.trim().slice(0, 200) || "Untitled booth";
		const description = design.description.trim().slice(0, 5000);
		const designJson = JSON.stringify(design, null, 2);

		const apiKey = process.env.RESEND_API_KEY;
		const fromAddress = process.env.IDEA_FROM_EMAIL;
		if (!apiKey || !fromAddress) {
			return NextResponse.json(
				{ error: "Design submissions are not configured yet." },
				{ status: 503 },
			);
		}

		const resend = new Resend(apiKey);
		const { error } = await resend.emails.send({
			from: fromAddress,
			to: ["hello@jptechnology.dev"],
			replyTo: email,
			subject: `New booth design: ${boothName}`,
			text: `A new booth design was submitted through jptechnology.dev/booth-builder.\n\nFrom: ${email}\nBooth: ${boothName}\nFootprint: ${design.footprintId}\nPieces: ${design.pieces.length}\n\nDescription:\n${description || "(none provided)"}`,
			attachments: [
				{
					filename: "booth-design.json",
					content: Buffer.from(designJson, "utf-8").toString("base64"),
				},
			],
		});
		if (error) throw new Error(error.message);

		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json(
			{ error: "We could not send your design right now. Please try again." },
			{ status: 500 },
		);
	}
}
