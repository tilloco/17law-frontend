# 17 Law — frontend

A React app that talks to your Rust backend: Google sign-in, a quiz list,
a one-question-at-a-time quiz player with a scored result screen, and a
basic admin panel for creating quizzes.

## Before you start

You need **Node.js** installed (separate from Rust). Check by running:

```
node -v
```

If that fails, download it from https://nodejs.org (the LTS version) and
install it, then reopen your terminal.

## Setup

1. Unzip this folder somewhere convenient — it does **not** need to be
   inside your Rust project folder, it's a separate app.
2. Open a terminal in this folder (`17law-frontend`).
3. Copy `.env.example` to a new file named `.env`, then open `.env` and
   fill in your real `VITE_GOOGLE_CLIENT_ID` (the one you got from Google
   Cloud Console). Leave `VITE_API_BASE_URL` as-is if your Rust backend
   runs on port 8080.
4. Install dependencies:
   ```
   npm install
   ```
5. Start it:
   ```
   npm run dev
   ```
6. Open the URL it prints (usually `http://localhost:5173`).

**Important:** your Rust backend needs to be running at the same time
(`cargo run` in the other project, in its own terminal window). The
frontend has no data of its own — every quiz, login, and score comes
from your backend.

## If something doesn't match up

This was built by guessing reasonable field names for your API (things
like `id_token`, `question_id`, `option_id`, `is_correct`) since I
haven't seen your actual Rust request/response structs. If sign-in,
loading quizzes, or submitting an attempt throws an error, it's most
likely a field name mismatch — open `src/api.js`, that's the only file
that talks to your backend, and everything the app sends/receives runs
through it. Paste me the relevant struct from your Rust code and I'll
line it up exactly.

## What's here

- `src/pages/Login.jsx` — Google sign-in landing page
- `src/pages/Quizzes.jsx` — quiz list with like buttons
- `src/pages/QuizTake.jsx` — the quiz player + results (with the seal-stamp animation)
- `src/pages/Admin.jsx` — create a quiz, add questions/options, publish
- `src/api.js` — every backend call, in one place
- `src/styles.css` — all the visual design (colors, fonts, layout)
