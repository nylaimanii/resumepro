# resumepro

ai-powered resume analyzer + builder. deterministic ats scoring, ai suggestions with one-click apply, ats-clean pdf export.

## stack

- **next.js 15** · typescript · tailwind · shadcn/ui
- **supabase** — postgres + auth + storage + row-level security
- **groq** — llama 3.3 70b + llama 3.1 8b instant
- **@react-pdf/renderer** — server-side pdf export

## features

- deterministic ats score with 6 measurable factors
- keyword match against 350+ skill taxonomy
- ai suggestions with before/after diff + one-click apply
- resume builder with 3 ats-safe templates + live preview
- tailored cover letter generation with tone slider
- pdf export for resumes + cover letters
- content-hash caching (re-analysis in <1s for same resume+jd)
- rate limiting (10 ai calls/day, shared across analyses + cover letters)
- no-signup live demo on the landing page (pure client-side scoring)

## local dev

```bash
npm install
cp .env.example .env.local  # fill in your keys
npm run dev
```

env vars needed:

| var | source |
|-----|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | supabase project settings |
| `GROQ_API_KEY` | console.groq.com |
| `NEXT_PUBLIC_APP_URL` | your deployed url (or `http://localhost:3000`) |

## built by

[nyla](https://nyla-portfolio-xi.vercel.app)
