# Jean Angela at eighteen

A navy-and-silver digital invitation card inspired by printed debut stationery. Guests open an ornate cover with script lettering, a crescent moon, silver paper edges, and stars. The supplied animated starfield is integrated into `app.js` and `styles.css`, with 420 stars on phones and 700 on larger screens. It stays behind the invitation and respects reduced-motion settings; the standalone demo and previous static background have been removed. Inside are matching invitation sheets for the celebration, outfit illustrations, photographs, tribute lists, and an interactive RSVP. The cover can be opened by keyboard and closed again; direct links such as `/#rsvp` open the invitation automatically.

## Preview

Run `npm run dev` and open http://localhost:3000. Node.js is required. No dependencies are needed to serve or build the site. The optional browser tests use Playwright.

This version is a design preview for feedback: photographs and tribute names are placeholders, and RSVP collection is not connected. The form clearly marks this before visitors enter their details. Sending remains disabled until a valid Formspree endpoint is configured.

## Personalize

Edit `invitation-config.js`:

- Date is October 16, 2026, inferred from the September 2026 planning conversation. Arrival is 3:30 PM Philippine time; the visible program start window is 4:00–4:30 PM.
- All three navigation buttons use the supplied Google Maps location. Waze and Apple Maps use the destination coordinates from that link (14.1806561, 121.1749828). Confirm the arrival entrance on your phone before sharing.
- `tributes` contains five separate lists with 18 editable names each. Names are inserted as text, not HTML.
- Add photographs under `assets/photos/` and enter their paths in `photos`. A missing/incorrect photo retains its placeholder.
- The recommended photos are a vertical navy gown portrait, a close-up of the gown or flowers, and a relaxed outdoor portrait. Use your own photographs or images you have permission to use. WebP/JPEG around 1200 pixels wide and under 400 KB each is a useful starting point.
- `rsvpDeadline` stays empty: no deadline is shown. Add a contact name and `mailto:` or `tel:` link when available.
- General invitation wording and details are in `index.html`; styling is in `styles.css`.

## Connect real RSVPs

1. Create a form in your [Formspree dashboard](https://formspree.io/).
2. Put its public form endpoint (`https://formspree.io/f/your-id`) in `formspreeEndpoint` in `invitation-config.js`. Do not put account credentials or private API keys here.
3. Test one attending and one declining RSVP after deployment and confirm both appear in Formspree. Check your account's current submission allowance against your expected guest count.

The custom form collects attendance, the invited guest's name, email, and an optional message. It has review, loading, success, timeout, and retry states. It does not store replies in the browser or display a fake success before a service response. Without an endpoint, guests can explore the form but are clearly told that sending is unavailable.

The stated policy is named guests only, with no additional guests and one reply per guest. This first version does **not** authenticate names against a private guest list or prevent duplicate submissions. Review responses against your guest list in Formspree. If strict invite-only enforcement is desired, add a server-side invitation-code check; never publish the full guest list in client JavaScript.

Formspree is recommended for keeping the custom interactive form within the invitation. Google Forms is an alternative if you prefer its form editor and response workflow; a real Google Form URL and field mapping would be needed to switch providers. No Google Forms integration is included.

Reference: [Formspree HTML form setup](https://formspree.io/html/).

## Deploy with GitHub and Vercel

1. The project repository is [EmYours/Sister18th](https://github.com/EmYours/Sister18th). Generated files and local dependencies are excluded from Git.
2. In Vercel, choose **Add New → Project**, import **EmYours/Sister18th**, and select the **Other** framework preset. Keep the root directory at the repository root.
3. `vercel.json` specifies `npm run build` and the `dist` output directory. The build copies only site files and assets to `dist`.
4. No environment variables are required for this preview. Deploy and share the Vercel URL for design feedback.
5. Before sending the final invitation, add photos and names, connect Formspree, and verify both the map destinations and a real RSVP.

The site is static and needs no application server. Vercel can [deploy from a connected GitHub repository](https://vercel.com/docs/deployments/overview).

## Checks

`npm run check` checks JavaScript syntax. `npm run build` produces the deployable site.

`npm install` then `npm test` runs browser tests using installed Google Chrome. The tests use mocked RSVP responses; they never send guest data to Formspree. Screenshots are written under `test-results`.

`dist`, `test-results`, `.npm-cache`, and `node_modules` are generated locally and are not committed. Keep `package-lock.json`, the tests, and font licenses; they support repeatable installs, verification, and asset attribution.

## Optional additions to decide later

- A background song with an explicit play/pause control (no autoplay), once you have a track you may use.
- A private shared photo album or QR code for guests to contribute pictures.
- A personal welcome message or a short story about the debutante.
- A contact person and practical venue notes such as parking or the correct entrance.
- An add-to-calendar button after an approximate end time is confirmed.

Animations honor reduced-motion preferences. Content is available without JavaScript, except for the interactive RSVP and dynamically populated names. Great Vibes and Cormorant Garamond fonts are served locally from `assets/fonts`; their SIL Open Font Licenses are included alongside them.
