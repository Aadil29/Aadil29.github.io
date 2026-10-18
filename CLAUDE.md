# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio built with Astro and Tailwind CSS v4, styled after apple.com product pages: large type, generous whitespace, alternating white/grey sections, glass navigation, a bento project grid with device-framed screenshots, and light/dark themes. All content lives in a single configuration file.

## Tech Stack

- **Astro**: Static site generator, `output` stays static. Moving to Cloudflare Pages (build `npm run build`, output `dist`); `.github/workflows/deploy.yml` (GitHub Pages) still exists but cannot run the contact function.
- **Cloudflare Pages Functions**: `functions/api/contact.ts` (contact form -> Resend). Pages picks up `functions/` automatically; Astro never imports it, so it is not in `dist/`. Env: `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`, optional `TURNSTILE_SECRET`; KV binding `RATE_LIMIT` (required in production, fails open with a warning when missing) for daily limits of 2 per IP, 2 per email, 20 global, counted only after Resend succeeds, keys hold SHA-256 hashes only. All limits are constants at the top of the file. Setup steps are in `README.md`.
- **Tailwind CSS v4**: via the `@tailwindcss/vite` plugin; design tokens exposed with `@theme inline`
- **TypeScript**: typed config (`SiteConfig` and friends in `src/config.ts`)
- **@fontsource-variable/inter**: self-hosted Inter, used only where the system font is not SF Pro
- **Tabler Icons**: inlined SVG paths in `src/components/Icon.astro`

## Development Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## Architecture

- **Layout** (`src/layouts/Base.astro`): `<head>` (meta, OG, no-flash theme script), skip link, Header, `<main>`, Footer, and the scroll-reveal fallback script.
- **Pages**: `src/pages/index.astro` (Hero, Projects, About, Experience, Education, Contact) and `src/pages/projects/[slug].astro` (case-study page per project with a `slug`).
- **Components** (`src/components/`): one per section, plus `ProjectMedia` (browser frame / phone frames / non-image fallback tile), `Picture` (WebP `<picture>` with intrinsic size), `ThemeToggle`, `Icon`.
- **Contact** (`src/components/Contact.astro`): form shown only when `contact.formEndpoint` is set; posts JSON with fetch, falls back to a plain form POST without JS (the function then returns a small HTML page). Honeypot field `website`, hidden `t` load timestamp, live character counter (visible count is not a live region; a separate `sr-only` polite region announces only at 100/25/0 left), optional Turnstile widget rendered only when `contact.turnstileSiteKey` is set (script injected by JS, re-rendered on `themechange`). Field limits in `MAX` must match the constants at the top of `functions/api/contact.ts` (name 80, email 254, message 10 to 1,000).
- **Lib** (`src/lib/`): `nav.ts` (nav items derived from which config sections exist), `media.ts` (build-time image dimensions + sibling `.webp` detection for files in `public/`).
- **Styles** (`src/styles/global.css`): tokens, dark tokens, materials, frames, motion. Custom classes sit in `@layer base` / `@layer components` so Tailwind utilities always override them; keep it that way.

### Key Architectural Decisions

1. **Single configuration file**: all content is in `src/config.ts`.
2. **Conditional rendering**: every optional field hides its UI when unset (sections, nav items, CTAs, links, stats, case-study rows).
3. **Never render placeholders**: unknown facts stay unset, with `TODO(owner)` notes in config comments only.
4. **Theme**: `data-theme="light|dark"` on `<html>` is the only switch. The inline script in `Base.astro` sets it before paint (stored toggle choice wins, else the OS, and it keeps following OS changes live until the user picks), updates `meta[name=theme-color]`, syncs across tabs, and exposes `window.__setTheme(t, persist)` which fires a `themechange` event (ThemeToggle listens). Every section follows the theme: there are no fixed-dark subtrees (`.scheme-dark` was removed), and theme-dependent styling goes through tokens (`--tile-art`, `--tag-bg`, `--img-dim`, `--specular-hi`, ...), never `[data-theme="dark"] .x` selectors or hardcoded colours. The no-JS media-query copy of the dark tokens is guarded by `:root:not([data-theme])`, so it can never override `data-theme="light"`; when adding a dark token, add it to both the `[data-theme="dark"]` block and the media-query copy. Only deliberate exception: the phone bezel (`.phone`, device hardware) is dark in both themes.
5. **Accent**: Apple blue by default. `accentColor` in config optionally overrides the fill colour (buttons, focus rings); it must give >= 4.5:1 with white text. Text links use `--accent-text`, not `--accent`.
6. **No email address in the site**: there is no `social.email`; contact goes through the form. Never render a `mailto:` or the owner's address.

## Design and Accessibility Rules

- Font: system stack (`-apple-system`, SF Pro on Apple devices) with Inter as fallback. Do not self-host or `@font-face` SF Pro (licence). Monospace is only for figures and tags.
- Glass (`.glass`, `.glass-bar`) is for the nav and the hero current-role pill only, never for long text or card lists. It is near-opaque by default; blur is added only under `@supports (backdrop-filter)` and removed for `prefers-reduced-transparency`, `prefers-contrast: more` and `forced-colors`. Do not nest glass inside glass.
- Motion: `.reveal` uses scroll-driven animations with an IntersectionObserver fallback; content is visible without JS and under `prefers-reduced-motion`. Only animate `transform`/`opacity`.
- Colour and contrast (computed WCAG ratios; re-check if you change tokens):
  - Light: `--text` 16.8, `--text-2` 10.0, `--text-3` 5.07 on white / 4.66 on `--bg-alt` (lowest allowed text grey); `--accent-text` 5.57 / 5.11; white on `--accent` 4.70, on `--accent-hover` 5.94.
  - Dark: `--text-3` 8.2 on black / 5.4 on `--surface-2`; `--accent-text` 6.96 / 4.62; black on `--accent` 6.96.
  - Glass alphas (0.72 light, 0.80 dark) keep `--text-2` >= 5:1 over a pure black or white backdrop. Never put `--text-3` or link text on glass.
  - `--accent` (#0071e3) is not a text colour on `--bg-alt` (4.31). Use `--accent-text`.
  - Non-image tile art (`.tile-art`): light `#f5f5f7` with blob opacity 0.28, `--text` >= 10:1 and `--text-2` >= 6.4:1 over the brightest blend; dark `#0b0b0f`, opacity 0.45.
  - Form: `--field-border` 3.6:1 on white (light) / 4.1 on black, 3.3 on surface (dark) for the 3:1 non-text rule; `--danger` (`text-danger`) 6.0 / 5.5 light, 7.4 / 6.0 dark.
- Tap targets >= 44px for primary controls; visible focus rings everywhere (the project card ring wraps the whole card).

## Working with Components

1. Components read directly from the imported `siteConfig` object.
2. Use Tailwind utilities with the token colours (`bg-bg`, `bg-bg-alt`, `bg-surface`, `text-ink`, `text-ink-2`, `text-ink-3`, `text-accent-text`, `border-hair`, `rounded-card`) and the type classes (`t-display`, `t-h1`, `t-h2`, `t-h3`, `t-lede`, `t-eyebrow`, `t-mono`).
3. Use `Icon.astro` (Tabler paths) for icons; add new paths there.
4. Images go in `public/`; generate a sibling `.webp` (e.g. `cwebp -q 80 in.png -o in.webp`) and `Picture` will serve it automatically.

## Configuration Structure

`src/config.ts` exports `siteConfig: SiteConfig`. Optional fields are marked `?` in the interfaces.

- Basic: `name`, `title`, `description`, `accentColor?`
- Hero / P0: `availability?`, `location?`, `cvUrl?` (PDF in `public/`), `hero?: { eyebrow, lede, primaryCta, secondaryCta, showCurrentRole? }`. The hero shows no project metrics; it shows "Currently <title> at <company>" from the `experience` entry whose `dateRange` contains "Present" (set `showCurrentRole: false` to hide). Project figures belong in `projects[].stats`.
- `social: { linkedin?, twitter?, github? }` (no email field), `contact?: { heading, body, formEndpoint?, turnstileSiteKey? }`. The contact band and nav item show when `formEndpoint` or any social link exists; the form only when `formEndpoint` is set (`"/api/contact"`).
- `aboutMe?`, `skills?: { category, items[] }[]`: keep it short (about 3 groups) and only list skills that appear in projects or experience; rendered as compact rows of `.chip-sm`.
- `projects?: Project[]` with `slug?`, `name`, `category?`, `description`, `link?`, `skills?`, `role?`, `timeframe?`, `team?`, `stats?: { value, label }[]`, `links?: { repo, demo, report, video }`, `frame?: "browser" | "phone"`, `flow?: string[]`, `caseStudy?: { problem, approach, result, lessons }`, `details?: { fullDescription, highlights[], sections[], images: { src, alt, caption? }[], videoUrl, videoPoster }`
- `experience?: { company, title, dateRange, bullets[], skills? }[]`
- `education?: { school, degree, dateRange?, achievements? }[]`

Bento layout on the home page is computed from project index (pattern repeats every 4), so adding or removing projects needs no layout changes.
