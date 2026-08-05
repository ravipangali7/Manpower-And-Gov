# Department of Foreign Employment (DoFE) Portal

Official-style public portal for the Department of Foreign Employment, Ministry of Youth, Labour and Employment, Government of Nepal.

## Stack

- **Frontend:** TanStack Start (React 19) + Vite + Tailwind CSS
- **Backend:** Django REST API (`../server`)

## Development

```sh
npm install
npm run dev
```

Production build:

```sh
npm run build
npm run preview
```

Set `VITE_SITE_URL` to the public origin (e.g. `https://www.dofe.gov.np`) for correct canonical and Open Graph URLs. Optional: `VITE_GSC_VERIFICATION`, `VITE_GA_ID`, `VITE_PLAUSIBLE_DOMAIN`.
