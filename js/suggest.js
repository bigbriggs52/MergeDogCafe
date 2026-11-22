// Ally’s Pup Café: suggestion box.
// Ideas are emailed through Web3Forms (a free form-to-email service). The access key below is
// meant to be public: it can only send messages to the inbox it was made for.
// Ideas written while offline (or before the key is set) wait on the phone and send later.
'use strict';

const SUGGEST_KEY = '32153820-a177-4dd0-a584-1ba451677c0b';
const SUGGEST_URL = 'https://api.web3forms.com/submit';
const SUGGEST_QUEUE = 'pupcafe-suggestions-v1';
const SUGGEST_MAX = 1000;

const Suggest = (() => {
  let sending = false;
  const readQueue = () => { try { return JSON.parse(localStorage.getItem(SUGGEST_QUEUE)) || []; } catch (e) { return []; } };
  const writeQueue = (q) => { try { localStorage.setItem(SUGGEST_QUEUE, JSON.stringify(q)); } catch (e) { /* storage full or blocked */ } };

  async function sendOne(s) {
    const res = await fetch(SUGGEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: SUGGEST_KEY,
        subject: 'Ally’s Pup Café suggestion',
        from_name: 'Ally’s Pup Café',
        message: s.text,
        written: new Date(s.at).toLocaleString(),
        game_version: typeof APP_VERSION === 'string' ? APP_VERSION : '',
        botcheck: '',
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) throw new Error(data.message || `http ${res.status}`);
  }

  // Send everything waiting. Returns how many were sent.
  async function flush() {
    if (sending || !SUGGEST_KEY || !navigator.onLine) return 0;
    sending = true;
    let sent = 0;
    try {
      let q = readQueue();
      while (q.length) {
        await sendOne(q[0]);
        q = readQueue().filter((s) => s.id !== q[0].id);
        writeQueue(q);
        sent++;
      }
    } catch (e) { /* offline or service hiccup: try again later */ }
    sending = false;
    return sent;
  }

  // Queue an idea, then try to send it right away.
  // Resolves to 'sent' or 'saved' (waiting to send).
  async function submit(text) {
    const s = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text: text.slice(0, SUGGEST_MAX), at: Date.now() };
    writeQueue([...readQueue(), s]);
    await flush();
    return readQueue().some((x) => x.id === s.id) ? 'saved' : 'sent';
  }

  window.addEventListener('online', flush);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) flush(); });
  setTimeout(flush, 4000);

  return { submit, flush, waiting: () => readQueue().length };
})();

function suggestCardHTML() {
  const waiting = Suggest.waiting();
  return `
    <div class="card suggest-card">
      <div class="suggest-head"><div class="suggest-dog">${dogSVG('corgi', { mood: 'happy' })}</div>
        <p class="sub">Have an idea for the café? A new pup, a treat, a cozy room? Tell ${pupName('waffles')} and it goes straight to the café team.</p></div>
      <textarea id="suggest-text" rows="3" maxlength="${SUGGEST_MAX}" placeholder="I wish the café had..." aria-label="Your suggestion"></textarea>
      <button class="btn primary wide" id="suggest-send" disabled>Send suggestion</button>
      <p class="sub suggest-status" id="suggest-status" aria-live="polite">${waiting === 1 ? "1 idea is waiting to send. It'll go out by itself soon." : waiting ? `${waiting} ideas are waiting to send. They'll go out by themselves soon.` : ''}</p>
    </div>`;
}

function setupSuggestCard() {
  const box = $('#suggest-text'), btn = $('#suggest-send');
  box.oninput = () => { btn.disabled = !box.value.trim(); };
  btn.onclick = async () => {
    const text = box.value.trim();
    if (!text) return;
    btn.disabled = true; btn.textContent = 'Sending...';
    const result = await Suggest.submit(text);
    box.value = ''; btn.textContent = 'Send suggestion';
    $('#suggest-status').textContent = '';
    Sound.play('tada');
    modal(`<div class="nap-dog">${dogSVG('corgi', { mood: 'happy' })}</div><h2>Thank you!</h2>
      <p>${result === 'sent' ? `${pupName('waffles')} wagged all the way to the mailbox. Your idea is on its way!`
        : `${pupName('waffles')} tucked your idea in a safe spot. It will send by itself as soon as it can.`}</p>
      <button class="btn primary" data-close>Yay</button>`);
  };
}
