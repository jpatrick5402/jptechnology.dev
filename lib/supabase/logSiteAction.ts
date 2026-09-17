import { createSupabaseServerClient } from "./server";

type ActionMetadata = Record<string, unknown>;

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
		const { error } = await createSupabaseServerClient()
			.from("site_action_logs")
			.insert({
				ip_address: getIpAddress(request),
				action,
				description,
				path: new URL(request.url).pathname,
				user_agent: request.headers.get("user-agent"),
				metadata,
			});

		if (error) {
			console.error("Supabase action logging failed:", error.message);
		}
	} catch (error) {
		console.error("Supabase action logging is unavailable:", error);
	}
}
