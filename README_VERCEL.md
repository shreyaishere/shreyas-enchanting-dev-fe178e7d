# Vercel deployment (TanStack Start + Vite)

## What’s already added
- `vercel.json`: config to deploy the TanStack Start build output.

## Steps
1. Push your repo to GitHub.
2. In Vercel: **Add New Project** → select this repo.
3. Set **Framework Preset** to **Other** (or leave default).
4. Ensure the following are used:
   - Install Command: `npm ci`
   - Build Command: `npm run build`
5. Deploy.

## Notes
- This app uses TanStack Start + Vite; Vercel may need a runtime entry handled by TanStack.
- Static assets are served from `public/` (e.g. `/profile.jpeg`).

