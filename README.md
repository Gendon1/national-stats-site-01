# Indonesia National Statistics — make.fun Entry

**Bounty:** `best-national-statistics-site-20261126-0539`

![make.fun badge](https://make.fun/badges/best-national-statistics-site-20261126-0539.svg)
![make.fun rank](https://make.fun/badges/best-national-statistics-site-20261126-0539/rank.svg)
![make.fun score](https://make.fun/badges/best-national-statistics-site-20261126-0539/score.svg)

## Overview

A static, single-page application presenting Indonesia's key national statistics from the World Bank World Development Indicators (WDI), 2015–2024. Features interactive SVG charts, ASEAN peer comparisons, full-text search, dark mode, and CSV export — all client-side with zero network requests.

## Data

- **Source:** World Bank WDI (2024 vintage)
- **Country:** Indonesia (primary, 10-year series)
- **ASEAN Peers:** Singapore, Malaysia, Thailand, Vietnam, Philippines (2024 snapshot)
- **Indicators:** 17 series across 7 categories
  - Economy: GDP, GDP Growth, GDP per Capita, Inflation
  - People: Population, Population Growth, Life Expectancy
  - Health: Under-5 Mortality, Health Expenditure (% GDP)
  - Education: Primary, Secondary, Tertiary Enrolment
  - Energy & Environment: Energy Use per Capita
  - Trade: Exports/Imports (% GDP)
  - Labour: Labour Force, Unemployment

## Features

- **Hash routing:** `#/`, `#/category/<id>`, `#/indicator/<id>`, `#/compare`, `#/methodology`, `#/sources`, `#/glossary`, `#/search?q=`
- **Live search:** filters indicators by name, code, category
- **Year-range filter:** All (2015–2024), Pre-COVID (2015–2019), COVID & Recovery (2020–2024)
- **Charts:** Custom SVG line charts (axes, gridlines, tooltips) + bar charts
- **Normalized index:** Compare any two indicators rebased to 2015 = 100
- **Dark mode:** Persisted in localStorage, respects `prefers-color-scheme`
- **CSV download:** Exports visible dataset with source attribution
- **Accessibility:** Skip link, ARIA labels, keyboard navigation, reduced motion support
- **Zero dependencies:** No fetch, no external URLs, no build step

## Local Development

```bash
# Serve the app
node serve.ts
# Open http://localhost:8080

# Build dossier for submission
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Screenshots

| File | View | Size |
|------|------|------|
| `screenshots/1-home.jpg` | Homepage (1280×720) | ≤256 KiB |
| `screenshots/2-indicator.jpg` | Indicator page GDP (1280×720) | ≤256 KiB |
| `screenshots/3-compare.jpg` | ASEAN Compare (1280×720) | ≤256 KiB |
| `screenshots/4-phone.jpg` | Homepage mobile (390×844) | ≤256 KiB |

## License

MIT — see [LICENSE](LICENSE)