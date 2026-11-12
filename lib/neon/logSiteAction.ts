import postgres from "postgres";

type ActionMetadata = Record<string, unknown>;

const globalForNeon = globalThis as unknown as {
	jpLogsClient?: ReturnType<typeof postgres>;
};

function client() {
	// jptechnology.dev is connected to Neon through Vercel, which provides
	// DATABASE_URL (pooled) and DATABASE_URL_UNPOOLED (direct). Prefer the
	// direct connection: postgres-js with max: 1 is happier without the
	// pooler in the middle. NEON_DATABASE_URL is kept as a fallback for a
	// manually copied connection string (e.g. the KnowAndGo app's
	// STORAGE_DATABASE_URL).
	const url =
		process.env.DATABASE_URL_UNPOOLED ||
		process.env.DATABASE_URL ||
		process.env.NEON_DATABASE_URL;
	if (!url) throw new Error("DATABASE_URL is not set");
	return (globalForNeon.jpLogsClient ??= postgres(url, { max: 1 }));
}

function getIpAddress(request: Request) {
	const forwardedFor = request.headers.get("x-forwarded-for");
	return forwardedFor?.split(",")[0].trim() || request.headers.get("x-real-ip");
}

// Set SITE_LOGGING_ENABLED=false in the environment to disable action logging.
function isLoggingEnabled() {
	return process.env.SITE_LOGGING_ENABLED !== "false";
}

export async function logSiteAction(
	request: Request,
	action: string,
	description: string,
	metadata: ActionMetadata = {},
) {
	if (!isLoggingEnabled()) {
		return;
	}

	try {
		const sql = client();
		await sql`
      insert into public.jp_site_action_logs
        (ip_address, action, description, path, user_agent, metadata)
      values (
        ${getIpAddress(request)},
        ${action},
        ${description},
        ${new URL(request.url).pathname},
        ${request.headers.get("user-agent")},
        ${JSON.stringify(metadata)}::jsonb
      )
    `;
	} catch (error) {
		console.error("Neon action logging failed:", error);
	}
}
