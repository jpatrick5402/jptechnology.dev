import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const response = await fetch(
			"https://knowandgo.info/api/v1/locations?limit=1",
			{ signal: AbortSignal.timeout(5000), cache: "no-store" },
		);
		if (!response.ok) throw new Error("KnowAndGo API error");
		const data = (await response.json()) as { total?: number };
		const total = typeof data.total === "number" ? data.total : undefined;
		return NextResponse.json({
			live: true,
			total,
			checkedAt: new Date().toISOString(),
		});
	} catch {
		return NextResponse.json({ live: false }, { status: 503 });
	}
}
