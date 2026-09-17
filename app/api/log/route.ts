import { NextResponse } from "next/server";
import { logSiteAction } from "@/lib/supabase/logSiteAction";

const publicActions = {
	page_view: "Viewed the homepage",
	section_view: "Viewed the {target} section",
} as const;

type PublicAction = keyof typeof publicActions;

function isPublicAction(action: unknown): action is PublicAction {
	return typeof action === "string" && action in publicActions;
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const action = body?.action;
		const target = typeof body?.target === "string" ? body.target.trim() : "";

		if (!isPublicAction(action) || (action === "section_view" && !target)) {
			return NextResponse.json({ error: "Invalid action." }, { status: 400 });
		}

		const description = publicActions[action].replace("{target}", target);
		await logSiteAction(request, action, description, target ? { target } : {});
		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json({ error: "Invalid action." }, { status: 400 });
	}
}