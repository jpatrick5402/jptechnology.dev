# jptechnology.dev

A repository for the JP Technology Development LLC website

## Environment

Copy `.env.example` to `.env.local` and set the Supabase project URL and server-only service-role key. The service-role key must never be exposed to client components or variables prefixed with `NEXT_PUBLIC_`.

The server client is available from `lib/supabase/server.ts`:

```ts
import { createSupabaseServerClient } from "@/lib/supabase/server";

const supabase = createSupabaseServerClient();
```

## Supabase schema

The migration files are versioned SQL; they are not applied automatically by Next.js, Vercel, or GitHub. For the first setup, copy the SQL in `supabase/migrations/20260917000000_create_site_action_logs.sql` into the Supabase SQL Editor and click **Run**. It creates the `site_action_logs` table and indexes for recent activity and action type. The service-role client is the only application path that can insert rows because Row Level Security is enabled.

For repeatable deployments, install the Supabase CLI, link this repository to the project, and apply pending migrations:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Pushing to GitHub only changes the repository. Automatic database updates require a CI workflow or Supabase integration that runs `supabase db push` with the project credentials.

To inspect recent activity:

```sql
select occurred_at, ip_address, action, description
from public.site_action_logs
order by occurred_at desc
limit 100;
```

The site records page views, section views, idea submissions, newsletter subscriptions, and newsletter unsubscribes. Logging failures are reported server-side and do not interrupt the visitor's action.
