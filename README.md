# Aadil Ghani portfolio

Astro + Tailwind CSS v4. All content lives in `src/config.ts`.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview
```

## Contact form (Cloudflare Pages + Resend)

The site never shows an email address. The contact section renders a form when
`contact.formEndpoint` is set in `src/config.ts` (it is set to `/api/contact`).
The form posts to a Cloudflare Pages Function, `functions/api/contact.ts`, which
validates the message and sends it to your inbox through the
[Resend](https://resend.com) HTTP API. The recipient address and the API key are
Cloudflare environment variables. They are never in the repo or the built HTML.

The Astro output stays fully static (`dist/`). Cloudflare Pages finds the
`functions/` folder at the repo root and deploys it automatically; Astro does
not import it, so it is not bundled into `dist/`. The form only works on
Cloudflare Pages: GitHub Pages cannot run the function.

### 1. Resend

1. Create a Resend account at https://resend.com.
2. **Domains → Add domain**: add a domain you own (for example
   `yourdomain.com`), then add the DNS records Resend shows (SPF/DKIM, and
   optionally DMARC) at your DNS provider. Wait until the domain shows
   *Verified*. Until then Resend only lets you send from `onboarding@resend.dev`,
   and only to the address you signed up with, which is fine for a first test.
3. **API Keys → Create API key** with *Sending access* (restricted to that
   domain if you like). Copy it: it is shown once.

### 2. Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**,
   then pick this repository and the branch to deploy (`main`).
2. Build settings:
   - Framework preset: **Astro** (or *None*)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable `NODE_VERSION` = `20` (or newer) if the build uses an
     older Node by default.
3. **Settings → Variables and Secrets** (add them for *Production*, and for
   *Preview* too if you want the form to work on preview deployments):

   | Name             | Type    | Value                                                           |
   | ---------------- | ------- | --------------------------------------------------------------- |
   | `RESEND_API_KEY` | Secret  | the Resend API key                                              |
   | `CONTACT_TO`     | Secret  | the inbox that receives messages (comma-separate for several)   |
   | `CONTACT_FROM`   | Text    | a sender on your verified domain, e.g. `Portfolio <contact@yourdomain.com>` (or `onboarding@resend.dev` while testing) |

4. **Rate-limit store (Workers KV, free tier). Required in production.**
   1. Cloudflare dashboard → **Storage & Databases → Workers KV → Create
      instance** (older dashboards: *Workers & Pages → KV → Create a namespace*).
      Name it e.g. `portfolio-contact-rate-limit`.
      CLI alternative: `npx wrangler kv namespace create portfolio-contact-rate-limit`.
   2. **Workers & Pages → your Pages project → Settings → Bindings → Add →
      KV namespace**. Variable name: `RATE_LIMIT` (exactly). KV namespace: the
      one you just created. Add the binding for **Production** and again for
      **Preview** (each environment has its own bindings list; using the same
      namespace for both is fine).
   3. Without this binding the function still sends mail but logs
      `RATE_LIMIT KV binding is missing; rate limiting is OFF` and applies no
      daily limits. That is intended for local dev only.
5. **Optional: Cloudflare Turnstile (free CAPTCHA), off by default.**
   1. Dashboard → **Turnstile → Add widget**. Hostnames: your site's domain(s)
      (add the `*.pages.dev` hostname too if you test on previews). Widget
      mode: *Managed*.
   2. Put the **site key** (public) in `src/config.ts`:
      `contact: { ..., turnstileSiteKey: "0x4AAAA..." }`.
   3. Add the **secret key** to the Pages project as a *Secret* named
      `TURNSTILE_SECRET` (Production and Preview).
   4. Deploy. The widget and its script load only when the site key is set.
      The function verifies the token with Turnstile's `siteverify` API
      whenever `TURNSTILE_SECRET` is set, and skips verification when it is
      not. Set both or neither: a secret without the site key blocks every
      message, and a site key without the secret shows a widget nobody checks.
      With Turnstile on, the form needs JavaScript (the no-JS fallback cannot
      produce a token).
6. Redeploy (Deployments → *Retry deployment*) so the function picks up the
   variables and bindings.
7. Test: send a message from the live site. Replies go straight to the sender,
   because the function sets `reply_to` to the address they typed.
8. If the site's public URL changes, update `site` in `astro.config.mjs` so
   canonical and Open Graph URLs point at the new domain.

### Limits and guardrails

All limits are constants at the top of `functions/api/contact.ts`. The field
lengths are mirrored in `MAX` in `src/components/Contact.astro` (form
`maxlength` and the character counter); change both together.

| Constant            | Value  | Meaning |
| ------------------- | ------ | ------- |
| `PER_IP_PER_DAY`    | 2      | successful sends per visitor IP (`CF-Connecting-IP`) per UTC day |
| `PER_EMAIL_PER_DAY` | 2      | successful sends per sender email (case-insensitive) per UTC day |
| `GLOBAL_PER_DAY`    | 20     | successful sends across all visitors per UTC day (backstop) |
| `NAME_MAX`          | 80     | name characters |
| `EMAIL_MAX`         | 254    | email characters |
| `MESSAGE_MIN` / `MESSAGE_MAX` | 10 / 1,000 | message characters, after whitespace clean-up |
| `MAX_URLS`          | 2      | links (`http://`, `https://`, `www.`) per message |
| `REPEAT_RUN`        | 30     | a run of this many identical characters is collapsed to three |
| `BODY_MAX_BYTES`    | 8 KB   | whole request body (room for a Turnstile token and multi-byte text) |
| `MIN_FILL_MS`       | 3 s    | submissions sooner than this after page load are rejected |

How the function protects itself, in order:

- POST only (405 otherwise); same-origin only (403 for a foreign `Origin`).
- Body over 8 KB → 413.
- Hidden honeypot field (`website`): if it is filled, the function reports
  success and sends nothing (and counts nothing).
- Timing guard: the page records when it loaded; a submission less than 3 s
  later gets 429. (Without JS the field is empty and only the honeypot applies.)
- Validation (422 with per-field messages): lengths above; name and email may
  not contain line breaks, `%0a`/`%0d`, `bcc:`-style header text, or `< >` in
  the name; message whitespace is trimmed and collapsed, long runs of one
  character are shortened, then it is rejected if empty, too short/long, has
  more than 2 links, or is (nearly) all capital letters.
- Rate limits (429 with a friendly message and `Retry-After` = seconds until
  the next UTC midnight). Checked before sending, but counted **only after
  Resend accepts the email**, so a Resend failure does not use up the
  visitor's quota. KV stores only counters under keys like
  `rl:ip:<sha256>:<YYYY-MM-DD>`, `rl:email:<sha256>:<YYYY-MM-DD>` and
  `rl:global:all:<YYYY-MM-DD>`, with a 26 h TTL. No raw IPs, addresses or
  message text are stored.
- Workers KV is eventually consistent and has no atomic increment, so a burst
  of simultaneous requests (or requests hitting different Cloudflare
  locations within about a minute) can get past a limit. The limits are
  best effort, which is fine for a portfolio form. If KV is missing or errors,
  the function fails open (sends, logs a warning).
- Turnstile token check (403) when `TURNSTILE_SECRET` is set.
- The email is sent as plain text, so user input is never rendered as HTML.
- Responses are JSON (`{ ok, error?, fields? }`) for the fetch-based form, and a
  small HTML page for the no-JS form POST.

For local testing with real sending you can run `npx wrangler pages dev dist`
after `npm run build`, with the variables in a `.dev.vars` file (already
git-ignored; never commit it). Add `--kv RATE_LIMIT` to get a local KV
namespace for the rate limits; without it rate limiting is skipped.
