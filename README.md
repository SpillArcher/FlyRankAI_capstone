# FlyRankAI

## Overview
FlyRankAI is a capstone project built during a Front End Engineering internship at FlyRank — an organic growth platform that helps D2C and SaaS brands scale traffic through SEO, AEO, and multilingual localization. This project applies those principles to a real, interactive frontend build.

## Stack
- HTML5 — semantic markup only (header, main, footer — avoiding div/span soup)
- CSS3 — Flexbox for 1D layouts, Grid for 2D layouts, box-sizing: border-box throughout
- JavaScript (ES6+) — destructuring, template literals, arrow functions, async/await
- React — data handling via map/filter/reduce
- Deployment: Vercel

## Accessibility & UX Standards
- :focus-visible on all interactive elements (never outline: none)
- :hover states throughout to signal genuine interactivity
- :disabled states on buttons during async/API calls to prevent duplicate requests
- Fully responsive across all screen sizes

## API Handling
All fetch calls check response.ok explicitly (not just try/catch) to correctly surface failed requests like 404s, avoiding silent UI breakage.

## Getting Started
```bash
npm install
npm run dev
```

## Deployment
Live on Vercel: [add link once deployed]

## Status
🚧 In progress — Front End Engineering capstone for FlyRank
