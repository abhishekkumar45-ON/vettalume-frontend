# Running Vettalume on another machine (collaborator setup)

The frontend calls a backend. By default that's `http://localhost:8001`, which only exists on the
machine running the backend. On a second device you get a **login error** because there's no backend
at *their* localhost. Pick ONE of the options below.

---

## Option A — Just look at the UI (no backend needed)

Fastest way to click through the app for design/frontend work. **No real data / login.**

1. In the frontend, create `.env.local`:
   ```
   NEXT_PUBLIC_DEV_BYPASS_AUTH=true
   ```
2. `npm install && npm run dev` → open http://localhost:3000

You're treated as signed in and can browse every page. Pages that pull real data (Account, the Learn
content, quizzes) will show "can't reach server" until you also do Option B or C.

---

## Option B — Use the host's backend over the internet (quick, shared data)

The friend uses **your** running backend + database. Your machine must stay on.

**On the host machine (you):**
1. Keep the backend running: `uvicorn app.main:app --port 8001` (from `vettalume-backend`).
2. Expose it with a tunnel (ngrok is installed):
   ```
   ngrok http 8001
   ```
   Copy the `https://xxxxxxxx.ngrok-free.app` URL it prints.
   *(First time only: `ngrok config add-authtoken <token>` with your free ngrok token.)*

**On the friend's machine:**
3. In the frontend `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=https://xxxxxxxx.ngrok-free.app
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=<same client id as the host>
   ```
4. `npm install && npm run dev` → login now works (email/password or Google).

Notes: the tunnel URL changes each time you restart ngrok; keep the host backend + tunnel up. This
exposes the API publicly on an unguessable URL — stop the tunnel when you're done.

---

## Option C — Friend runs their own backend (robust, independent)

Both developers run the backend locally, pointed at the **same shared Neon database**, so you share
accounts and content but neither depends on the other's machine.

**Friend needs the backend code + these `.env` values from you (share securely, not in chat/git):**
```
DATABASE_URL=postgresql+psycopg2://...neon.tech/...?sslmode=require   # the shared Neon URL
RESEND_API_KEY=re_...            # for OTP emails (optional for local testing)
MAIL_FROM=Vettalume <onboarding@resend.dev>
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
JWT_SECRET=<same value as yours>
DEV_MODE=true
```
Then on the friend's machine:
```
# backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8001

# frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<same client id>
npm install && npm run dev
```
Login works because their backend talks to the shared Neon.

---

**Recommendation:** Option C for real collaboration; Option B for a quick share; Option A when they
only need to see the UI.
