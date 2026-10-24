// POST /api/contact
// Receives the website contact form: emails Brendan through Emailit and adds the
// sender to the SendFox "NeuroDiverge Agent" list. Keys live in Vercel env vars.

const EMAILIT_URL = 'https://api.emailit.com/v2/emails';
const SENDFOX_URL = 'https://api.sendfox.com/contacts';

const TO = process.env.CONTACT_TO || 'boktoday@gmail.com';
const LIST_ID = Number(process.env.SENDFOX_LIST_ID || 681153);
const FROM = process.env.CONTACT_FROM || 'NeuroDivergeAgent website <go@getonetoeight.org>';

function clean(value, max) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, max);
}

function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

async function sendNotification(name, email, message) {
  const res = await fetch(EMAILIT_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + (process.env.EMAILIT_API_KEY || ''),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: TO,
      reply_to: email,
      subject: 'Website contact: ' + name,
      text: [
        'Name: ' + name,
        'Email: ' + email,
        '',
        message,
        '',
        'Sent from the contact form on neurodivergeagent.com',
      ].join('\n'),
    }),
  });
  return res.ok;
}

async function addToList(name, email) {
  const res = await fetch(SENDFOX_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + (process.env.SENDFOX_API_KEY || ''),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email, first_name: name, lists: [LIST_ID] }),
  });
  return res.ok;
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (err) {
      body = {};
    }
  }
  body = body || {};

  // Honeypot: a bot fills the hidden field. Pretend success, do nothing.
  if (clean(body.website, 200)) {
    res.status(200).json({ ok: true });
    return;
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200).toLowerCase();
  const message = String(body.message == null ? '' : body.message).trim().slice(0, 4000);

  if (!name || !looksLikeEmail(email) || message.length < 2) {
    res.status(400).json({ ok: false, error: 'invalid_input' });
    return;
  }

  const outcome = { email: false, list: false };
  try {
    outcome.email = await sendNotification(name, email, message);
  } catch (err) {
    outcome.email = false;
  }
  try {
    outcome.list = await addToList(name, email);
  } catch (err) {
    outcome.list = false;
  }

  if (!outcome.email && !outcome.list) {
    res.status(502).json({ ok: false, error: 'delivery_failed' });
    return;
  }

  res.status(200).json({ ok: true, notified: outcome.email, subscribed: outcome.list });
};
