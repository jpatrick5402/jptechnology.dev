import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { logSiteAction } from "@/lib/supabase/logSiteAction";

function getToken(email: string) {
	const secret = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET;
	if (!secret) return null;

	const encodedEmail = Buffer.from(email.toLowerCase()).toString("base64url");
	const signature = createHmac("sha256", secret)
		.update(encodedEmail)
		.digest("base64url");
	return `${encodedEmail}.${signature}`;
}

function getEmailFromToken(token: string) {
	const [encodedEmail, signature] = token.split(".");
	if (!encodedEmail || !signature) return null;

	const expectedSignature = getToken(
		Buffer.from(encodedEmail, "base64url").toString(),
	)?.split(".")[1];
	if (!expectedSignature) return null;

	const received = Buffer.from(signature);
	const expected = Buffer.from(expectedSignature);
	if (
		received.length !== expected.length ||
		!timingSafeEqual(received, expected)
	) {
		return null;
	}

	const email = Buffer.from(encodedEmail, "base64url").toString();
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function htmlResponse(message: string, status = 200) {
	return new NextResponse(
		`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>JP Technology</title></head><body style="background:#18231f;color:#f4f0e8;font-family:Arial,sans-serif;margin:0;padding:48px 24px"><main style="max-width:560px;margin:auto"><p style="color:#d9f95b;font-size:28px">+</p><h1 style="font-size:38px">${message}</h1><p style="color:#a9b3a8">You can close this window.</p></main></body></html>`,
		{ status, headers: { "Content-Type": "text/html; charset=utf-8" } },
	);
}

export async function GET(request: Request) {
	const token = new URL(request.url).searchParams.get("token");
	const email = token ? getEmailFromToken(token) : null;
	const audienceId = process.env.RESEND_AUDIENCE_ID;
	const apiKey = process.env.RESEND_API_KEY;

	if (!email || !apiKey || !audienceId) {
		return htmlResponse(
			"This unsubscribe link is invalid or unavailable.",
			400,
		);
	}

	const resend = new Resend(apiKey);
	const { error } = await resend.contacts.update({
		audienceId,
		email,
		unsubscribed: true,
	});
	if (error && error.statusCode !== 404) {
		return htmlResponse("We could not update your subscription.", 500);
	}
	await logSiteAction(request, "newsletter_unsubscribe", "Unsubscribed from the newsletter");

	return htmlResponse("You have been unsubscribed.");
}

export function createUnsubscribeUrl(email: string, requestOrigin?: string) {
	const siteUrl = requestOrigin || process.env.NEWSLETTER_SITE_URL;
	const token = getToken(email);
	if (!siteUrl || !token) return null;
	return `${siteUrl.replace(/\/$/, "")}/api/unsubscribe?token=${encodeURIComponent(token)}`;
}
