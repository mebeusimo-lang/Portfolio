# Portfolio — Mebeu Simo Claude Belgane

Personal portfolio site built with React + Vite + Tailwind CSS, featuring an
AI chat widget ("Ask Me Anything") that visitors can use to ask questions
about your background, skills, and projects.

## Run locally

```
npm install
npm run dev
```

Opens at http://localhost:5173

Note: the "Ask Me Anything" chat won't work locally unless you also run
`vercel dev` (see below) or set up your own local API route — it needs the
serverless function in `api/chat.js`, which only runs when deployed to
Vercel (or via the Vercel CLI locally).

## Set up the AI chat (required for it to work)

The chat feature calls `api/chat.js`, a serverless function that uses the
Anthropic API. It needs your API key set as an environment variable — never
put the key directly in your code.

1. Get a key from https://console.anthropic.com (API Keys → Create Key)
2. Add billing credit under the Billing section
3. Once deployed to Vercel (see below), go to your project → Settings →
   Environment Variables, and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: (paste your key)
4. Redeploy — the chat will start working

## Build for production

```
npm run build
```

Outputs static files to `dist/`.

## Deploy online (Vercel — recommended, since it supports the chat backend)

1. Push this project to a GitHub repo
2. Go to https://vercel.com, sign in with GitHub
3. Click "New Project", select this repo
4. Leave defaults (Vercel auto-detects Vite + the `api/` folder as
   serverless functions) → Deploy
5. Add the `ANTHROPIC_API_KEY` environment variable (see above) → Redeploy
6. Done — you get a live URL like `belgane.vercel.app`

Note: GitHub Pages and some other static hosts do NOT support the `api/`
serverless function, so the chat feature would not work there. Vercel (or
Netlify with a small config change) is required for the chat to function.

## Editing content

- Page content (bio, projects, skills, contact links): `src/App.jsx`
- Chat's knowledge about you (what the AI is allowed to say): the
  `SYSTEM_PROMPT` at the top of `api/chat.js` — update this as your
  projects and experience grow, so the chat stays accurate.

## Notes

- LinkedIn isn't linked yet — add your URL next to the GitHub link in
  `src/App.jsx` once you have it.
- Update the "Final Year" education line once you know your graduation date.
- The chat uses Claude Sonnet — each message costs a small amount of API
  credit. Fine for portfolio-level traffic, but keep an eye on usage if it
  gets shared widely.
