// POST /api/subscribe
// Newsletter signup: adds the address to the SendFox "NeuroDiverge Agent" list.
// No notification email; the point is the list, not the inbox.

const SENDFOX_URL = 'https://api.sendfox.com/contacts';
const LIST_ID = Number(process.env.SENDFOX_LIST_ID || 681153);

function clean(value, max) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, max);
}

function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
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

  if (clean(body.website, 200)) {
    res.status(200).json({ ok: true });
    return;
  }

  const email = clean(body.email, 200).toLowerCase();
  const firstName = clean(body.first_name || body.name, 120);

  if (!looksLikeEmail(email)) {
    res.status(400).json({ ok: false, error: 'invalid_input' });
    return;
  }

  try {
    const resp = await fetch(SENDFOX_URL, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (process.env.SENDFOX_API_KEY || ''),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, first_name: firstName, lists: [LIST_ID] }),
    });
    if (!resp.ok) {
      res.status(502).json({ ok: false, error: 'subscribe_failed' });
      return;
    }
  } catch (err) {
    res.status(502).json({ ok: false, error: 'subscribe_failed' });
    return;
  }

  res.status(200).json({ ok: true, subscribed: true });
};
