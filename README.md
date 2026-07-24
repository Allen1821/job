# Celjan's Career Garage — Airline Job Application Tracker

A mobile-first website that helps Celjan Diaz apply to airline jobs. Built with plain
HTML, CSS, and JavaScript — no frameworks, no build step. Open `index.html` and go.

## Why this exists

Celjan is applying to flight attendant and airport jobs, mostly around Tampa Bay and
Orlando. The research lived in a spreadsheet
([`Celjan_Diaz_Airline_Job_Application_Tracker.xlsx`](Celjan_Diaz_Airline_Job_Application_Tracker.xlsx),
researched July 23, 2026) — 34 verified openings with official application links, an
airline watchlist, and an application strategy. A spreadsheet is hard to use from a
phone, and most of this applying happens on a phone. This site moves everything from
the spreadsheet into a page where every job is one tap away from its official
application form.

## What the site does

- **34 preloaded jobs** from the spreadsheet, each with a plain-language summary of
  what the job involves, pay (hourly / flight-hour / salary), employment type,
  location, priority, and the requirements from the research notes.
- **APPLY → button on every card** that opens the job's official application link —
  the exact URLs from the spreadsheet's "Official Application Link" column, nothing
  third-party.
- **APPLIED checkbox** on every card: one tap marks the job Applied and stamps
  today's date. Untick to reset. Progress saves in the browser (localStorage) and
  survives reloads.
- **Race Strategy** section with the spreadsheet's best application order
  (Breeze Tampa → JetBlue Orlando → Frontier → Delta → Allegiant) and the two rules
  that matter most: Breeze accepts only **one** flight-attendant application every
  3 months (apply Tampa first), and Spirit Airlines shut down May 2026 — any Spirit
  job ad is a scam.
- **Pit Lane**: 20 official airline career pages from the watchlist sheet —
  🟢 open/recruiting now, 🟠 monitor for openings.
- **Search, region filter (Tampa Bay / Orlando / Other Florida / National), status
  filter, and sorting**, defaulting to the spreadsheet's recommended order.
- **CSV export/import** to back up progress or round-trip with Excel.
- Gauge-cluster stats up top: total, applied, interviews, offers.

## Are the links legit?

Every application link was checked. They fall into two safe categories:

1. **Official airline domains** — delta.com, careers.jetblue.com, flyfrontier.com,
   envoyair.com, psaairlines.com, piedmont-airlines.com, endeavorair.com,
   jobs.skywest.com, careers.rjet.com, careers.suncountry.com, careers.swissport.com,
   and the like.
2. **Standard corporate hiring platforms** used by the airlines themselves —
   Greenhouse (Breeze), Lever (Allegiant), UKG/UltiPro (Frontier, Menzies),
   Paycom (Contour), Paylocity (Avelo). The company-specific board IDs in these URLs
   were cross-checked against each airline's own careers site.

Rule of thumb while applying: a real airline never asks for money, gift cards, or
"training fees," and applications only go through the pages linked here.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure |
| `styles.css` | JDM/European motorsport theme (dark carbon, racing stripes) |
| `app.js` | Job data, rendering, filters, checkbox logic, CSV import/export |
| `Celjan_Diaz_Airline_Job_Application_Tracker.xlsx` | Source spreadsheet the site was built from |

## Using it on a phone

Host it anywhere static (GitHub Pages works: Settings → Pages → deploy from branch),
then bookmark the URL. Progress is stored per-browser — use **EXPORT CSV** as a
backup before clearing browser data or switching devices.
