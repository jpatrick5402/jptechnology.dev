# jptechnology.dev

A repository for the JP Technology Development (a sole proprietorship — not yet an LLC) website

## Environment

Site actions (page views, section views, idea submissions, newsletter subscriptions and unsubscribes) are logged to Neon, in the `jp_site_action_logs` table of the shared Neon database (the same database KnowAndGo uses). The connection comes from the Vercel Neon integration, which provides `DATABASE_URL_UNPOOLED` (direct, preferred) and `DATABASE_URL` (pooled) as environment variables. The logger is `lib/neon/logSiteAction.ts`; it never throws, so a logging failure cannot break a visitor's action.

Set `SITE_LOGGING_ENABLED=false` in the environment to disable action logging. Anything else (including the variable being unset) leaves logging on.

## Neon schema

The table is `public.jp_site_action_logs` in the shared Neon database, created with the SQL in the migration notes (see the project history for the exact statement). It records `occurred_at`, `ip_address`, `action`, `description`, `path`, `user_agent` and `metadata` (jsonb), with indexes on recency and action type.

To inspect recent activity, run this in the Neon SQL Editor:

```sql
select occurred_at, ip_address, action, description
from public.jp_site_action_logs
order by occurred_at desc
limit 100;
```

The site records page views, section views, idea submissions, newsletter subscriptions, and newsletter unsubscribes. Logging failures are reported server-side and do not interrupt the visitor's action.
