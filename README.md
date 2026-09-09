# jptechnology.dev

A repository for the JP Technology Development LLC website

## Idea submissions

The idea form posts to `/api/ideas` and emails each submission to `hello@jptechnology.dev` through Resend. Add these server-only variables to `.env.local`:

```env
RESEND_API_KEY=re_your_api_key
IDEA_FROM_EMAIL=JP Technology <ideas@jptechnology.dev>
```

The sender domain must be verified in Resend before production delivery. The visitor's email is used as `Reply-To` so replies go directly to them.
