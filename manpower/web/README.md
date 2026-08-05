# Vision & Value Overseas (VNVNEPAL)

Public website for Vision & Value Overseas Pvt. Ltd. — ethical overseas manpower recruitment from Nepal.

## Stack

- **Frontend:** TanStack Start (React 19) + Vite + Tailwind CSS
- **Backend:** Django REST API (`../server`)

## Development

```sh
npm install
npm run dev
```

Requires the Django API on `http://127.0.0.1:8000` (Vite proxies `/api` and `/media`).

Production build:

```sh
npm run build
npm run preview
```

Set `VITE_SITE_URL` to the public origin (e.g. `https://www.vnvnepal.com`) for correct canonical and Open Graph URLs. Optional: `VITE_GOOGLE_SITE_VERIFICATION`, `VITE_GA_MEASUREMENT_ID`, `VITE_PLAUSIBLE_DOMAIN`.
