# Vettalume — Project Handoff / State

Living doc of what's built and how it fits together, so a new session can pick up instantly.

## ⚠️ Read first — folder gotcha
The three apps live in different folders. **All frontend work is in `Vettalume-Frontend-v14`** (NOT the
plain `Vettalume-Frontend`, which is a stale copy). The dev server on :3000 serves `-v14`.

| App | Folder | Port | Stack |
|---|---|---|---|
| Student frontend | `~/Desktop/Vettalume-Frontend-v14` | 3000 | Next.js (App Router) |
| Backend API | `~/Downloads/vettalume-backend` | 8001 | FastAPI + SQLAlchemy |
| Admin portal | `~/Downloads/vettalume-admin-v15` | 5173 | Vite + React |
| Database | Neon Postgres (cloud, `ap-southeast-1`) | — | shared by backend |

## How to run
- Backend: `cd ~/Downloads/vettalume-backend && ./.venv/bin/uvicorn app.main:app --port 8001`
- Frontend: `cd ~/Desktop/Vettalume-Frontend-v14 && npm run dev`
- Admin: `cd ~/Downloads/vettalume-admin-v15 && npm run dev`

## Config (locations, NOT secrets — secrets live in gitignored .env files)
- **Backend `.env`**: `DATABASE_URL` (Neon, `postgresql+psycopg2://…?sslmode=require`), `RESEND_API_KEY`,
  `MAIL_FROM`, `GOOGLE_CLIENT_ID`, `JWT_SECRET`, `DEV_MODE=true`.
- **Frontend `.env.local`**: `NEXT_PUBLIC_API_URL=http://localhost:8001`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`,
  optional `NEXT_PUBLIC_DEV_BYPASS_AUTH=true` (browse UI with no backend/login — teammate use).
- **Admin login**: an admin account = a normal account granted admin. Bootstrap:
  `./.venv/bin/python -m scripts.create_admin <email> <password>`. Current admin: `abhishek.kumar@orangenelumbo.com`
  (⚠️ its password was typed in chat during setup — should be rotated).

## What's built (this project so far)
**Auth (real, backend-backed):** signup → email OTP → verify, login, forgot-password (email→OTP→reset),
Google sign-in (`/auth/google`), all in `components/AuthModal.tsx` → `lib/api.ts` → backend. Session token in
localStorage. `UserContext` holds auth state; `AuthGuard` redirects unauthenticated users off protected routes
(`/dashboard`, `/learn`, `/mocks`, `/account`, `/notifications`); logout clears + gates back-button. Account &
Security pages persist to Neon (`/auth/profile`, `/auth/change-password`, strong-password rules + eye toggles).

**Exam switcher + entitlements:** CAT/GMAT/GRE switcher in header (`components/ExamSwitcher.tsx`), lock icons for
unowned exams (`UserContext.ownedExams`, currently owns all 3 for demo). Dashboard greeting is time-based + first name.

**Learning section (fully backend-driven & admin-authored):**
- Flow: section dashboard (`/learn/[exam]/[section]`) → chapter analysis (`/learn/[exam]/[section]/[chapter]`) →
  subtopic learning (`…/[subtopic]`, Concept/Material/Video/Quiz tabs, `components/SubtopicLearning.tsx`).
- Data model: Section → Topic (=chapter) → Concept (=subtopic), `KnowledgeNode` in backend. Content = node
  `theory` {body, videos} + `Item` rows (quiz).
- Frontend resolves the **real backend node id** from `/learn/overview` (so admin-created content with any id
  loads). Seeded with `scripts/seed_demo_content.py` (9 sections, 54 chapters, 162 subtopics, quiz) — also
  runnable via `POST /admin/seed-demo-content` (dev-only, uses warm pool to dodge Neon throttling).
- Chapter analysis + mock pages are **embedded HTML** in `/public/*.html` (site header/footer wrap them via
  `components/MockFrame.tsx`; a bridge `<script>` in each fetches data + wires nav).

**Quiz (learning):** MCQ (green correct / red wrong) + **numerical TITA** (type-in-the-answer box);
step-by-step **solution** rendering; **resume** from first unanswered question; records answers to `/learn/answer`.
**Subtopic %** = read concept 25% + watch video 25% + quiz accuracy 50% (weight in `learn_overview`). **Chapter
D1–D5 chart** = per-difficulty accuracy (difficulty −2..2 → D1..D5), fill = correct/answered.

**Video:** `SubtopicLearning` embeds Gumlet (`gumlet.tv/watch/{id}` → `play.gumlet.io/embed/{id}`), YouTube,
Vimeo, or direct files.

**Admin portal:** already authors chapters/subtopics/concept/videos/quiz (persists to backend). Added a
**Section picker** to the chapter modal; store tracks/uses chosen section (`src/store.jsx`, `src/modals.jsx`).

**Mocks:** full-mock landing/section-select/answer-panel/analysis + sectional, embedded HTML under site chrome.

**Perf/infra:** N+1 fix in `/admin/students`; `bulk_insert` helper (`app/db.py`); Neon TCP keepalives +
`pool_pre_ping=True` (re-enabled for reliability — Neon drops connections intermittently).

## Key backend endpoints (student)
`/learn/overview?exam=` · `/learn/concept/{id}` · `/learn/concept/{id}/quiz` · `/learn/concept/{id}/engage`
(`{read?,watched?}`) · `/learn/answer` · `/auth/*` · `/admin/*`.

## Known issues / not-yet-done
- **Neon instability**: intermittent `SSL connection closed` / control-plane errors → occasional 500s. Transient.
- **Resend is in sandbox** (`MAIL_FROM=onboarding@resend.dev`): only emails `abhishek.kumar@orangenelumbo.com`.
  To email any user: verify `orangenelumbo.com` at resend.com/domains, then set `MAIL_FROM` to that domain.
- **XLSX quiz import**: sheet stores MCQ answers as letters ("A"); frontend handles letter-or-value, but the
  importer would reject letter answers — needs letter→value conversion.
- **Admin numerical (TITA) authoring**: question modal may not have an MCQ/Numerical type toggle — verify/wire.
- **Not wired**: settings tabs Preferences/Notifications/Privacy/Subscription; per-exam real dashboard data;
  chapter-analysis charts other than D1–D5 (still demo).
- **Chrome MCP not reachable** in these sessions → verification was via API/curl, not visual clicks.

## Git state
- Frontend `-v14` → `github.com/krishdiwakar-jpg/Vettalume-Frontend` (branch `master`). Last push commit `bee8547`.
  **Latest work (quiz progress, video, D1–D5, admin section picker) is NOT committed/pushed yet.**
- Backend and admin repos: changes **not pushed** (separate/unknown remotes).

## Suggested next steps
1. Commit + push latest frontend; decide on backend/admin remotes and push those.
2. Rotate the admin password; verify Resend domain for real emails.
3. Wire admin TITA authoring + XLSX letter→value importer.
4. Real per-exam dashboard data; remaining settings tabs.
