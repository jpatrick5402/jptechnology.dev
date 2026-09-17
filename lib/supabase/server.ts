import { createClient } from "@supabase/supabase-js";

export function createSupabaseServerClient() {
	const supabaseUrl = process.env.SUPABASE_URL;
	const serverKey =
		process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !serverKey) {
		throw new Error(
			"Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY.",
		);
	}
	if (
		serverKey.startsWith("sb_publishable_") ||
		serverKey.startsWith("sb_anon_")
	) {
		throw new Error(
			"Supabase server actions require a secret/service-role key, not a publishable/anon key.",
		);
	}

	return createClient(supabaseUrl, serverKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}
