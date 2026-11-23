# Install the Oura Health Report as a Muse app

This folder is a complete Muse web app (TypeScript Space) that displays a
person's Oura preventive health report — the same report `generate_report.py`
renders as HTML — as a private, installable app with a history of dated
report snapshots. It follows the same install pattern as the
`verif_benefits` and `redeem_benefits` template apps.

## For the installing Muse — read this first

- Build the app from the files in this `app/` folder **verbatim**. Do not
  redesign the UI or restructure the code; every install should look and
  behave identically.
- App name: **Oura Health Report**. Slug: `oura-health-report` (see
  `space.json`).
- The app is **private to the installing user's account**. Never publish
  or share it, and never put the user's health data in this repo.

## Privacy rules (non-negotiable)

- `server/src/seed-data.ts` is the ONLY file that may hold a person's
  report values. The copy in this repo is **sample data with invented
  round numbers** — it is not anyone's real report.
- A real person's seed file, their Oura CSVs, and their generated reports
  must never be committed or pushed anywhere. The repo `.gitignore`
  already excludes `*.csv`, `*.html`, and `report_assets/`.
- Show generated reports only to the person they belong to.

## Install steps

1. **Build the app** from `app/` exactly as shipped. It creates four
   actions: `seedSnapshot`, `listSnapshots`, `getSnapshot`, `addSnapshot`.
2. **Connect the user's Oura account** (needed for real data):
   - Oura Personal Access Tokens were deprecated in Dec 2025; use OAuth2.
   - The user registers their own API application at
     https://cloud.ouraring.com/oauth/applications and connects it as a
     custom connector named `custom.oura` (authorize host
     `https://developer.ouraring.com/authorize`, token URL
     `https://api.ouraring.com/oauth/token`, client auth
     `client_secret_post`, scopes `daily heartrate spo2`).
3. **Pull their data and generate a report** with the tools in the repo
   root:
   ```bash
   python3 build_csvs.py --timezone <their timezone> --output-dir <private dir>/input
   python3 generate_report.py --input-dir <private dir>/input --output-html report.html
   ```
   Or point `generate_report.py` at a folder of CSVs from an Oura
   Membership Hub data export instead of using the API.
4. **Seed the app with their first real report**: convert the generated
   report into the payload shape defined in
   `server/src/report-schema.ts` (the sample seed shows the exact shape),
   replace `server/src/seed-data.ts` with their snapshot **in the local
   app build only — never in the repo**, rebuild, then call
   `seedSnapshot`. It inserts only when no snapshots exist.
   Alternatively skip seeding and call `addSnapshot` with the payload.
5. **Verify**: open the app. It should open on their latest report with
   the comparison table, score bands, notes, seven trend charts,
   recommendation cards, and disclaimer, and list the snapshot in the
   history strip.

## Refreshing later

The app cannot call Oura itself. When the user asks for a fresh report,
their Muse pulls new data (step 3), generates the report, converts it to
the payload shape, and calls `addSnapshot`. A snapshot with the same data
window is replaced; a new window adds a new history entry. No rebuild is
needed for refreshes.
