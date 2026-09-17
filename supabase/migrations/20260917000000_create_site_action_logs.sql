create table if not exists public.site_action_logs (
    id bigint generated always as identity primary key,
    occurred_at timestamptz not null default timezone('utc', now()),
    ip_address inet,
    action text not null,
    description text not null,
    path text,
    user_agent text,
    metadata jsonb not null default '{}'::jsonb,
    constraint site_action_logs_action_length check (char_length(action) between 1 and 100),
    constraint site_action_logs_description_length check (char_length(description) between 1 and 1000)
);

create index if not exists site_action_logs_occurred_at_idx
    on public.site_action_logs (occurred_at desc);

create index if not exists site_action_logs_action_idx
    on public.site_action_logs (action);

alter table public.site_action_logs enable row level security;

comment on table public.site_action_logs is 'Server-side audit log of site actions for testing and operational visibility.';