# HiFLY presentation demo

An English / GBP travel prototype using the original transparent HiFLY logo, blue `#064BCE` and yellow `#FFE31A`.

## Start

- `npm run dev` starts the development preview.
- `npm run vercel-build` builds the Next.js app for Vercel.
- `npx next start --hostname 0.0.0.0 --port 3001` serves the built demo on the local network. A phone must be connected to the same Wi-Fi. Open `http://<computer-local-IP>:3001`.
- `npm test` builds the Vinext/Sites bundle and verifies server-rendered content.

Next.js and Vinext share `.next` generated types. After a Vinext build, run `npx next typegen` before a standalone `npx tsc --noEmit` check.

## Suggested walkthrough

1. Search Greece from the homepage; choose the Santorini result.
2. Save the trip using the heart. View its gallery, itinerary and inclusions.
3. Choose an upcoming date and three travellers. The total is £567.
4. Reserve, sign in using the prefilled demo account and confirm. The trip and total survive sign-in.
5. Open My trips, view the booking and download its confirmation. Demonstrate cancellation and the Cancelled tab.
6. Search a flight route, try direct-only / airline filters and choose a fare. Selected route, dates, travellers and total carry into the reservation.
7. Refresh the browser to show that trips, saved places and the profile persist.
8. On mobile, use the bottom navigation, expandable filters and the tour’s Reserve shortcut.

## Demo boundaries

All fares, ratings, schedules, itineraries and availability are illustrative. No real ticket, payment, account, subscription or contact request is created. No password or payment data is stored. The demo profile, reservations and favourites stay in this browser’s local storage (`hifly-demo-v2`); browsers and devices do not share them. Destination photographs load from Unsplash and require internet access.

## Verified

The Next.js production build and the Vinext server-render test pass. Browser checks cover destination search, mobile filters and empty states, traveller totals, sign-in continuation, tour and flight reservations, cancellation, downloaded confirmation, saved-trip persistence, original logo rendering and layouts at mobile and desktop widths.
