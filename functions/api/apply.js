// POST /api/apply: the careers application form (src/pages/careers/[slug].astro).
// Runs as a Cloudflare Pages Function. It checks every answer and the CV again, verifies Cloudflare Turnstile, then
// sends two emails: the application with the CV attached to the hiring mailbox (reply goes to the applicant), and a
// confirmation to the applicant (reply goes to the hiring mailbox). Nothing is stored here: the CV passes straight
// into the email.
//
// Sending: through Resend when RESEND_API_KEY is set (the client's choice, 2026-11-21), otherwise through Microsoft
// 365 (Microsoft Graph, app-only) when the three MS_ settings are set.
//
// Settings (Cloudflare Pages > Settings > Variables and secrets; see README):
//   TURNSTILE_SECRET_KEY   secret key of the Turnstile widget
//   HR_MAILBOX             mailbox that receives applications (default hr@crescoprime.com)
//   RESEND_API_KEY         Resend API key (sending access, careers.crescoprime.com only)
//   MAIL_FROM              sender for Resend (default "Cresco Prime Careers <apply@careers.crescoprime.com>")
//   MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET   the Microsoft 365 alternative; sends as HR_MAILBOX
//   MAIL_DRY_RUN           "1" only for local testing: return the two emails instead of sending them
import { jobs } from '../../src/lib/jobs.js';

const MAX_CV = 3 * 1000 * 1000; // 3 MB: within both Resend's limit and Graph's sendMail limit
const CV_TYPES = {
  pdf: { mime: 'application/pdf', magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  docx: { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', magic: [0x50, 0x4b, 0x03, 0x04] },
  doc: { mime: 'application/msword', magic: [0xd0, 0xcf, 0x11, 0xe0] },
};

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const base64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
};

export async function onRequestPost({ request, env }) {
  const mailbox = env.HR_MAILBOX || 'hr@crescoprime.com';
  const fallback = `Please email your CV to ${mailbox} instead, with the role in the subject line.`;

  let form;
  try {
    form = await request.formData();
  } catch {
    return json(400, { ok: false, message: `We could not read the form. ${fallback}` });
  }

  // The hidden trap field: people never see it, bots fill it in. Pretend it worked.
  if (form.get('website')) return json(200, { ok: true });

  const job = jobs.find((j) => j.slug === form.get('role'));
  if (!job) return json(400, { ok: false, message: `This role is no longer open. ${fallback}` });

  const text = (name, max) => String(form.get(name) ?? '').trim().slice(0, max);
  const a = {
    name: text('name', 120),
    email: text('email', 200),
    phone: text('phone', 40),
    location: text('location', 120),
    experience_total: text('experience_total', 3),
    experience_core: text('experience_core', 3),
    current_role: text('current_role', 160),
    notice: text('notice', 120),
    compensation: text('compensation', 120),
    linkedin: text('linkedin', 300),
    note: text('note', 1500),
    consent: form.get('consent') === 'yes',
  };

  const errors = {};
  for (const n of ['name', 'phone', 'location', 'notice']) if (!a[n]) errors[n] = 'Please fill this in.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)) errors.email = 'Please enter a valid email address.';
  for (const n of ['experience_total', 'experience_core']) {
    if (!/^\d{1,2}$/.test(a[n]) || Number(a[n]) > 60) errors[n] = 'Please enter a number of years, 0 to 60.';
  }
  if (a.linkedin && !/^https:\/\/\S+$/.test(a.linkedin)) errors.linkedin = 'Please paste the full link, starting with https://';
  if (!a.consent) errors.consent = 'Please tick this box to send your application.';

  // The CV: right size, a PDF or Word extension, and file contents that really are that type.
  const cv = form.get('cv');
  let cvType = null;
  let cvBytes = null;
  if (!cv || typeof cv === 'string' || cv.size === 0) errors.cv = 'Please attach your CV.';
  else if (cv.size > MAX_CV) errors.cv = 'This file is over 3 MB. Please attach a smaller version.';
  else {
    const ext = (cv.name.match(/\.([a-z]+)$/i)?.[1] || '').toLowerCase();
    cvType = CV_TYPES[ext];
    cvBytes = new Uint8Array(await cv.arrayBuffer());
    if (!cvType || !cvType.magic.every((b, i) => cvBytes[i] === b)) errors.cv = 'Please attach a PDF or Word file.';
  }

  if (Object.keys(errors).length) return json(400, { ok: false, errors, message: 'Please check the highlighted fields.' });

  // Switched off until the settings exist, so a half-configured site never loses an application silently.
  const dryRun = env.MAIL_DRY_RUN === '1';
  const via = env.RESEND_API_KEY ? 'resend' : env.MS_TENANT_ID && env.MS_CLIENT_ID && env.MS_CLIENT_SECRET ? 'microsoft' : null;
  if (!env.TURNSTILE_SECRET_KEY || (!dryRun && !via)) {
    return json(503, { ok: false, message: `Online applications are not switched on yet. ${fallback}` });
  }

  // Cloudflare Turnstile: was this sent by a person?
  const verdict = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: String(form.get('cf-turnstile-response') || ''),
      remoteip: request.headers.get('CF-Connecting-IP') || '',
    }),
  })
    .then((r) => r.json())
    .catch(() => ({ success: false }));
  if (!verdict.success) return json(403, { ok: false, message: 'The spam check did not pass. Please wait a moment and send the form again.' });

  // The two emails.
  const submitted = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  const rows = [
    ['Role', job.title],
    ['Name', a.name],
    ['Email', a.email],
    ['Phone', a.phone],
    ['Based in', a.location],
    ['Total experience', `${a.experience_total} years`],
    [`Years with ${job.core}`, `${a.experience_core} years`],
    ['Current or most recent role', a.current_role || 'Not given'],
    ['Notice period or start date', a.notice],
    ['Expected compensation', a.compensation || 'Not given'],
    ['LinkedIn', a.linkedin || 'Not given'],
    ['Anything else', a.note || 'Nothing added'],
    ['Consent', `Agreed to the privacy policy, ${submitted}`],
  ];
  const cell = 'padding:8px 12px;border-bottom:1px solid #e3e3df;vertical-align:top;';
  const hrHtml = `<div style="font:15px/1.5 Arial,sans-serif;color:#242424">
<h2 style="margin:0 0 16px;font-size:20px">New application: ${escape(job.title)}</h2>
<table style="border-collapse:collapse;max-width:640px">${rows
    .map(([k, v]) => `<tr><td style="${cell}color:#6b6b66;white-space:nowrap">${escape(k)}</td><td style="${cell}white-space:pre-wrap">${escape(v)}</td></tr>`)
    .join('')}</table>
<p style="margin:16px 0 0;color:#6b6b66;font-size:13px">Sent from the careers form on crescoprime.com. The CV is attached. Reply to this email to answer ${escape(a.name)}.</p></div>`;

  const first = a.name.split(/\s+/)[0];
  const ackHtml = `<div style="font:15px/1.6 Arial,sans-serif;color:#242424;max-width:560px">
<p>Hi ${escape(first)},</p>
<p>Thank you for applying for the <strong>${escape(job.title)}</strong> role at Cresco Prime. Your application and CV have reached our hiring team.</p>
<p>We read every application and will contact you if your experience matches what this role needs.</p>
<p>Cresco Prime<br><span style="color:#6b6b66">IT services and consulting, Frisco, Texas<br>crescoprime.com</span></p></div>`;

  const safeName = a.name.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'Applicant';
  const ext = Object.keys(CV_TYPES).find((k) => CV_TYPES[k] === cvType);
  // Two plain messages; the sender turns them into Resend's or Microsoft's format.
  const hrMail = {
    to: { address: mailbox },
    replyTo: { address: a.email, name: a.name },
    subject: `Application: ${job.title} | ${a.name}`,
    html: hrHtml,
    attachment: { name: `${safeName}-CV.${ext}`, type: cvType.mime, bytes: cvBytes },
  };
  const ackMail = {
    to: { address: a.email, name: a.name },
    replyTo: { address: mailbox },
    subject: `We received your application: ${job.title}`,
    html: ackHtml,
  };

  if (dryRun) {
    const strip = ({ attachment, ...m }) => ({ ...m, ...(attachment && { attachment: { name: attachment.name, type: attachment.type, bytes: attachment.bytes.length } }) });
    return json(200, { ok: true, dryRun: { via: via || 'none', from: senderOf(env, mailbox, via), hr: strip(hrMail), applicant: strip(ackMail) } });
  }

  const send = via === 'resend' ? (m) => sendResend(env, m) : async (m) => sendGraph(await graphToken(env), mailbox, m);
  try {
    await send(hrMail);
  } catch (error) {
    console.error('Application not delivered:', error.message); // no applicant data in the logs
    return json(502, { ok: false, message: `Your application could not be delivered. ${fallback}` });
  }
  // The confirmation is a courtesy: if it fails, the application has still reached the team.
  try {
    await send(ackMail);
  } catch (error) {
    console.error('Confirmation not sent:', error.message);
  }
  return json(200, { ok: true });
}

const senderOf = (env, mailbox, via) => (via === 'microsoft' ? mailbox : env.MAIL_FROM || 'Cresco Prime Careers <apply@careers.crescoprime.com>');
const named = ({ address, name }) => (name ? `${name.replace(/["<>]/g, '')} <${address}>` : address);

// Resend: https://resend.com/docs/api-reference/emails/send-email
async function sendResend(env, m) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
    body: JSON.stringify({
      from: senderOf(env, null, 'resend'),
      to: [named(m.to)],
      reply_to: named(m.replyTo),
      subject: m.subject,
      html: m.html,
      ...(m.attachment && { attachments: [{ filename: m.attachment.name, content: base64(m.attachment.bytes) }] }),
    }),
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(`resend ${response.status} ${detail.name || ''}`);
  }
}

// Microsoft 365: Microsoft Graph sendMail as the hiring mailbox.
async function sendGraph(token, mailbox, m) {
  const person = ({ address, name }) => ({ emailAddress: { address, ...(name && { name }) } });
  const message = {
    subject: m.subject,
    body: { contentType: 'HTML', content: m.html },
    toRecipients: [person(m.to)],
    replyTo: [person(m.replyTo)],
    ...(m.attachment && {
      attachments: [{ '@odata.type': '#microsoft.graph.fileAttachment', name: m.attachment.name, contentType: m.attachment.type, contentBytes: base64(m.attachment.bytes) }],
    }),
  };
  const response = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, saveToSentItems: true }),
  });
  if (response.status !== 202) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(`sendMail ${response.status} ${detail.error?.code || ''}`);
  }
}

let cached = null; // a token lasts about an hour; reuse it while this worker instance is warm
async function graphToken(env) {
  if (cached && cached.expires > Date.now() + 60_000) return cached.value;
  const response = await fetch(`https://login.microsoftonline.com/${env.MS_TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST',
    body: new URLSearchParams({
      client_id: env.MS_CLIENT_ID,
      client_secret: env.MS_CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) throw new Error(`token ${response.status} ${data.error || ''}`);
  cached = { value: data.access_token, expires: Date.now() + (data.expires_in || 3600) * 1000 };
  return cached.value;
}
