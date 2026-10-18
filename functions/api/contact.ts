// Cloudflare Pages Function: POST /api/contact
//
// Receives the portfolio contact form (JSON or urlencoded/multipart form POST)
// and forwards it to the owner's inbox through the Resend HTTP API.
//
// Environment (set in the Cloudflare Pages dashboard, never in the repo):
//   RESEND_API_KEY    secret  Resend API key with "sending access"
//   CONTACT_TO        secret  recipient address(es), comma separated
//   CONTACT_FROM      var     verified Resend sender, e.g. "Portfolio <contact@yourdomain.com>"
//   RATE_LIMIT        KV      Workers KV namespace binding (required in production)
//   TURNSTILE_SECRET  secret  optional; when set, a valid Turnstile token is required
//
// This file is picked up by Cloudflare Pages automatically (functions/ at the
// repo root). It is not imported by Astro, so it never ends up in dist/.

// ---------------------------------------------------------------------------
// Limits. Change them here. The field lengths are mirrored in
// src/components/Contact.astro (MAX); keep the two in sync.
// ---------------------------------------------------------------------------

/** Successful sends allowed per visitor IP per UTC day. */
export const PER_IP_PER_DAY = 2;
/** Successful sends allowed per sender email address per UTC day. */
export const PER_EMAIL_PER_DAY = 2;
/** Successful sends allowed across all visitors per UTC day (backstop). */
export const GLOBAL_PER_DAY = 20;
/** Counter keys expire a little after the UTC day they count. */
export const COUNTER_TTL_SECONDS = 26 * 60 * 60;

export const NAME_MAX = 80;
export const EMAIL_MAX = 254;
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 1000;
/** Most links allowed in one message. */
export const MAX_URLS = 2;
/** A run of this many identical characters is collapsed to three. */
export const REPEAT_RUN = 30;
/** Whole request body, bytes. Leaves room for a Turnstile token (up to 2,048
 *  chars) and multi-byte text on top of the field limits. */
export const BODY_MAX_BYTES = 8 * 1024;
/** Submissions faster than this after page load are treated as bots. */
export const MIN_FILL_MS = 3000;

export const LIMITS = {
  name: NAME_MAX,
  email: EMAIL_MAX,
  message: MESSAGE_MAX,
  messageMin: MESSAGE_MIN,
  body: BODY_MAX_BYTES,
  minFillMs: MIN_FILL_MS,
  urls: MAX_URLS,
  perIp: PER_IP_PER_DAY,
  perEmail: PER_EMAIL_PER_DAY,
  global: GLOBAL_PER_DAY,
};

// Minimal Workers KV surface we use (avoids a types dependency).
interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  RATE_LIMIT?: KV;
  TURNSTILE_SECRET?: string;
}

// Minimal shape of the Pages Functions context.
interface Context {
  request: Request;
  env: Env;
}

const RESEND_URL = "https://api.resend.com/emails";
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const URL_RE = /\b(?:https?:\/\/|www\.)[^\s<>"']+/gi;
// CR/LF/NUL (raw or percent-encoded) and header-like tokens: header injection.
const INJECTION_RE = /[\r\n\u0000]|%0[ad]|%00|\b(?:bcc|cc|to|content-type)\s*:/i;

type FieldName = "name" | "email" | "message";
type Fields = Partial<Record<FieldName, string>>;
type Body = { ok: boolean; error?: string; fields?: Fields };

const wantsJson = (req: Request) => {
  const accept = req.headers.get("accept") ?? "";
  const type = req.headers.get("content-type") ?? "";
  return accept.includes("application/json") || type.includes("application/json");
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const baseHeaders = { "cache-control": "no-store" };

// Plain-HTML answer for the no-JS form POST fallback.
const page = (status: number, title: string, message: string, headers: Record<string, string>) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="robots" content="noindex"><title>${escapeHtml(title)}</title><style>body{font:17px/1.5 -apple-system,BlinkMacSystemFont,"Inter Variable",system-ui,sans-serif;max-width:36rem;margin:0 auto;padding:4rem 16px;background:#fff;color:#1d1d1f}a{color:#0066cc}@media (prefers-color-scheme:dark){body{background:#000;color:#f5f5f7}a{color:#2997ff}}</style></head><body><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p><p><a href="/#contact">Back to the site</a></p></body></html>`,
    { status, headers: { ...baseHeaders, ...headers, "content-type": "text/html; charset=utf-8" } },
  );

function respond(req: Request, status: number, body: Body, headers: Record<string, string> = {}) {
  if (wantsJson(req)) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { ...baseHeaders, ...headers, "content-type": "application/json; charset=utf-8" },
    });
  }
  if (body.ok) return page(200, "Message sent", "Thanks, your message has been sent. I'll reply to the email you gave.", headers);
  const detail = body.fields ? Object.values(body.fields).join(" ") : "";
  return page(status, "Message not sent", `${body.error ?? "Something went wrong."} ${detail}`.trim(), headers);
}

async function readBody(req: Request): Promise<Record<string, unknown> | null> {
  const type = req.headers.get("content-type") ?? "";
  const text = await req.text();
  if (new TextEncoder().encode(text).length > BODY_MAX_BYTES) return null;
  if (type.includes("application/json")) {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  }
  if (type.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(text));
  }
  if (type.includes("multipart/form-data")) {
    const form = await new Response(text, { headers: { "content-type": type } }).formData();
    const out: Record<string, unknown> = {};
    form.forEach((v, k) => (out[k] = typeof v === "string" ? v : ""));
    return out;
  }
  throw new Error("unsupported content type");
}

const str = (v: unknown) => (typeof v === "string" ? v : "");
const collapseRuns = (s: string) =>
  s.replace(new RegExp(`(\\S)\\1{${REPEAT_RUN - 1},}`, "gu"), "$1$1$1");
// Single-line fields: control characters become spaces, whitespace collapses.
const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
// Message: normalise newlines, drop other control characters, collapse runs of
// spaces/tabs, at most one blank line in a row, and long runs of one character.
const multiLine = (s: string) =>
  collapseRuns(
    s
      .replace(/\r\n?/g, "\n")
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
      .replace(/[ \t ]+/g, " ")
      .replace(/ *\n */g, "\n")
      .replace(/\n{3,}/g, "\n\n"),
  ).trim();

/** True when the text is (nearly) all capital letters. */
function shouting(s: string) {
  const upper = (s.match(/\p{Lu}/gu) ?? []).length;
  const lower = (s.match(/\p{Ll}/gu) ?? []).length;
  return upper + lower >= 12 && upper / (upper + lower) > 0.9;
}

// ---------------------------------------------------------------------------
// Rate limiting (Workers KV). Keys hold only a count; identities are SHA-256
// hashes. KV is eventually consistent and has no atomic increment, so two
// requests racing in the same second can both pass: best effort, which is fine
// for a portfolio contact form.
// ---------------------------------------------------------------------------

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const utcDay = (now: Date) => now.toISOString().slice(0, 10);
const secondsToUtcMidnight = (now: Date) => {
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return Math.max(1, Math.ceil((next - now.getTime()) / 1000));
};

type Counter = { key: string; limit: number; count: number; kind: "ip" | "email" | "global" };

async function loadCounters(kv: KV, ip: string, email: string, day: string): Promise<Counter[]> {
  const defs: Omit<Counter, "count">[] = [
    { kind: "ip", key: `rl:ip:${await sha256(ip)}:${day}`, limit: PER_IP_PER_DAY },
    { kind: "email", key: `rl:email:${await sha256(email.toLowerCase())}:${day}`, limit: PER_EMAIL_PER_DAY },
    { kind: "global", key: `rl:global:all:${day}`, limit: GLOBAL_PER_DAY },
  ];
  const values = await Promise.all(defs.map((d) => kv.get(d.key)));
  return defs.map((d, i) => ({ ...d, count: Number.parseInt(values[i] ?? "0", 10) || 0 }));
}

const bump = (kv: KV, counters: Counter[]) =>
  Promise.all(counters.map((c) => kv.put(c.key, String(c.count + 1), { expirationTtl: COUNTER_TTL_SECONDS })));

async function verifyTurnstile(secret: string, token: string, ip: string | null) {
  if (!token) return false;
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set("remoteip", ip);
  const res = await fetch(SITEVERIFY_URL, { method: "POST", body: form }).catch(() => null);
  if (!res || !res.ok) return false;
  const out = (await res.json().catch(() => ({}))) as { success?: boolean };
  return out.success === true;
}

export async function onRequest({ request, env }: Context): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed." }), {
      status: 405,
      headers: { allow: "POST", "content-type": "application/json; charset=utf-8" },
    });
  }

  // Same-origin only: browsers always send Origin on cross-site POSTs.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return respond(request, 403, { ok: false, error: "Cross-origin requests are not allowed." });
  }

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > BODY_MAX_BYTES) {
    return respond(request, 413, { ok: false, error: "The message is too large." });
  }

  let data: Record<string, unknown> | null;
  try {
    data = await readBody(request);
  } catch {
    return respond(request, 400, { ok: false, error: "The request could not be read." });
  }
  if (!data) return respond(request, 413, { ok: false, error: "The message is too large." });

  // Honeypot: real visitors never see this field. Pretend success so bots
  // get no signal, but send nothing.
  if (str(data.website).trim() !== "") return respond(request, 200, { ok: true });

  // Timing guard: the page sets t=Date.now() on load (JS only). A submission
  // within a few seconds of load is almost certainly automated.
  const t = Number(str(data.t));
  if (Number.isFinite(t) && t > 0) {
    const elapsed = Date.now() - t;
    if (elapsed >= 0 && elapsed < MIN_FILL_MS) {
      return respond(request, 429, { ok: false, error: "That was quick. Please wait a few seconds and send again." }, { "retry-after": "3" });
    }
  }

  const rawName = str(data.name);
  const rawEmail = str(data.email);
  const name = oneLine(rawName);
  const email = oneLine(rawEmail);
  const message = multiLine(str(data.message));

  const fields: Fields = {};
  if (!name) fields.name = "Please enter your name.";
  else if (name.length > NAME_MAX) fields.name = `Name must be ${NAME_MAX} characters or fewer.`;
  else if (INJECTION_RE.test(rawName) || /[<>]/.test(name)) fields.name = "Please use only your name, without line breaks or symbols like < >.";
  if (!email) fields.email = "Please enter your email address.";
  else if (email.length > EMAIL_MAX || INJECTION_RE.test(rawEmail) || !EMAIL_RE.test(email)) fields.email = "Please enter a valid email address.";
  if (!message) fields.message = "Please enter a message.";
  else if (message.length < MESSAGE_MIN) fields.message = `Message must be at least ${MESSAGE_MIN} characters.`;
  else if (message.length > MESSAGE_MAX) fields.message = `Message must be ${MESSAGE_MAX.toLocaleString("en-GB")} characters or fewer.`;
  else if ((message.match(URL_RE) ?? []).length > MAX_URLS) fields.message = `Please include no more than ${MAX_URLS} links.`;
  else if (shouting(message)) fields.message = "Please don't write the whole message in capital letters.";
  if (Object.keys(fields).length) {
    return respond(request, 422, { ok: false, error: "Please check the highlighted fields.", fields });
  }

  // Rate limit check (before sending). Counted only after Resend succeeds.
  const ip = request.headers.get("cf-connecting-ip");
  const now = new Date();
  let counters: Counter[] | null = null;
  if (!env.RATE_LIMIT) {
    console.warn("contact: RATE_LIMIT KV binding is missing; rate limiting is OFF (fine locally, required in production)");
  } else {
    try {
      counters = await loadCounters(env.RATE_LIMIT, ip ?? "unknown", email, utcDay(now));
    } catch (err) {
      console.warn("contact: rate limit lookup failed; allowing request", err);
    }
    const hit = counters?.find((c) => c.count >= c.limit);
    if (hit) {
      const error =
        hit.kind === "global"
          ? "The contact form has reached its daily limit. Please try again tomorrow, or reach me on LinkedIn."
          : `You've reached the limit of ${hit.limit} messages a day. Please try again tomorrow, or reach me on LinkedIn.`;
      return respond(request, 429, { ok: false, error }, { "retry-after": String(secondsToUtcMidnight(now)) });
    }
  }

  // Optional Cloudflare Turnstile: enforced whenever the secret is configured.
  if (env.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(env.TURNSTILE_SECRET, str(data["cf-turnstile-response"]), ip);
    if (!ok) {
      return respond(request, 403, { ok: false, error: "Please complete the verification check and send again." });
    }
  }

  const to = (env.CONTACT_TO ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM || to.length === 0) {
    console.error("contact: RESEND_API_KEY, CONTACT_FROM or CONTACT_TO is not configured");
    return respond(request, 503, { ok: false, error: "The contact form is not available right now. Please try again later." });
  }

  const sent = await fetch(RESEND_URL, {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to,
      reply_to: email,
      subject: `Portfolio contact from ${name}`.slice(0, 150),
      // Plain text only: user input is never interpreted as HTML.
      text: `Name: ${name}\nEmail: ${email}\n\n${message}\n`,
    }),
  }).catch(() => null);

  if (!sent || !sent.ok) {
    console.error("contact: Resend request failed", sent?.status, sent ? await sent.text().catch(() => "") : "network");
    return respond(request, 502, { ok: false, error: "Sorry, the message could not be sent. Please try again later." });
  }

  if (env.RATE_LIMIT && counters) {
    await bump(env.RATE_LIMIT, counters).catch((err) => console.warn("contact: rate limit update failed", err));
  }
  return respond(request, 200, { ok: true });
}
