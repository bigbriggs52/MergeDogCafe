// Pup Café: main game logic
'use strict';

const SAVE_KEY = 'pupcafe-save-v1';
const $ = (s, el = document) => el.querySelector(s);
const rand = (n) => Math.floor(Math.random() * n);
const pick = (a) => a[rand(a.length)];

let S = null;          // game state
let selected = -1;     // selected board cell
let tab = 'board';

/* ---------- State ---------- */
function newGame() {
  const board = new Array(COLS * ROWS).fill(null);
  const s = {
    v: 1, board, paw: PAW_BASE_MAX, pawTime: Date.now(), coins: 20, stars: 0, totalStars: 0, level: 1,
    orders: [null, null, null], rooms: ROOMS.map((r) => ({ done: r.tasks.map(() => null) })),
    book: {}, tip: 0, sfx: 0.7, music: 0.4, finale: false, pending: [], gens: ['bakery', 'drinks'],
    served: 0, created: Date.now(),
  };
  // Pillows around the edge, with small surprises inside
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const edge = r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1;
    const corner2 = (r <= 1 || r >= ROWS - 2) && (c <= 1 || c >= COLS - 2);
    if (edge || corner2) {
      const roll = Math.random();
      const inner = roll < 0.12 ? { t: 'help', h: 'paw', l: 1 } : roll < 0.22 ? { t: 'help', h: 'coin', l: 1 }
        : roll < 0.3 ? { t: 'gift' } : { t: 'item', c: pick(['bakery', 'drinks']), l: 1 + (Math.random() < 0.3 ? 1 : 0) };
      board[r * COLS + c] = { t: 'pillow', inner };
    }
  }
  board[idx(3, 4)] = { t: 'gen', c: 'bakery', l: 1 };
  board[idx(4, 4)] = { t: 'gen', c: 'drinks', l: 1 };
  board[idx(3, 3)] = { t: 'item', c: 'bakery', l: 1 };
  board[idx(4, 5)] = { t: 'item', c: 'drinks', l: 1 };
  board[idx(2, 6)] = { t: 'help', h: 'paw', l: 1 };
  return s;
}
function idx(c, r) { return r * COLS + c; }
function rc(i) { return [i % COLS, Math.floor(i / COLS)]; }

let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 300);
}
function saveNow() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* storage full or blocked */ }
}
function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) { const s = JSON.parse(raw); if (s && s.v === 1 && Array.isArray(s.board)) return s; }
  } catch (e) { /* ignore broken save */ }
  return null;
}

/* ---------- Derived values ---------- */
const roomsDone = () => S.rooms.filter((r) => r.done.every((d) => d !== null)).length;
const currentRoom = () => Math.min(roomsDone(), ROOMS.length - 1);
const pawMax = () => PAW_BASE_MAX + (S.level - 1) * 5;
const levelNeed = (lvl) => 6 + lvl * 4; // stars to reach next level
function itemDef(it) {
  if (it.t === 'item') { const [icon, name] = CHAINS[it.c].items[it.l - 1]; return { icon, name, color: CHAINS[it.c].color }; }
  if (it.t === 'gen') return { icon: CHAINS[it.c].gen.icon, name: CHAINS[it.c].gen.name, color: CHAINS[it.c].deep };
  if (it.t === 'help') { const h = HELPERS[it.h]; return { icon: h.icons[it.l - 1], name: h.name, color: h.color }; }
  if (it.t === 'gift') return { icon: '🎁', name: 'Gift Box', color: '#FFE1EC' };
  if (it.t === 'pillow') return { icon: '💤', name: 'Sleepy Pillow', color: '#EEE8F7' };
  return { icon: '?', name: '?', color: '#eee' };
}
function artKey(it) {
  if (it.t === 'item') return `${it.c}-${it.l}`;
  if (it.t === 'gen') return `gen-${it.c}`;
  if (it.t === 'help') return it.l === 1 ? it.h : `${it.h}-${it.l}`;
  return it.t; // gift, pillow
}
const ICONS = { '🐾': 'paw', '🪙': 'coin', '⭐': 'star' };
function withArt(str) {
  return str.replace(/🐾|🪙|⭐/g, (m) => PLUSH.use(ICONS[m], 'inline-art'));
}
function sameKind(a, b) {
  if (!a || !b || a.t !== b.t) return false;
  if (a.t === 'item') return a.c === b.c && a.l === b.l && a.l < MAX_LEVEL;
  if (a.t === 'gen') return a.c === b.c && a.l === b.l && a.l < GEN_MAX_LEVEL;
  if (a.t === 'help') return a.h === b.h && a.l === b.l && a.l < 4;
  return false;
}
function sellValue(it) {
  if (it.t === 'item') return Math.max(1, Math.round(Math.pow(2, it.l - 1)));
  if (it.t === 'gen') return 0;
  return 1;
}

/* ---------- Energy ---------- */
function tickPaw() {
  const now = Date.now();
  const max = pawMax();
  if (S.paw >= max) { S.pawTime = now; return; }
  const gain = Math.floor((now - S.pawTime) / PAW_REGEN_MS);
  if (gain > 0) {
    S.paw = Math.min(max, S.paw + gain);
    S.pawTime += gain * PAW_REGEN_MS;
    if (S.paw >= max) S.pawTime = now;
    renderTop(); save();
  }
}
function addPaw(n, el) { S.paw += n; floatText(`+${n} 🐾`, el); renderTop(); save(); }
function addCoins(n, el) { S.coins += n; floatText(`+${n} 🪙`, el); renderTop(); save(); }

/* ---------- Board actions ---------- */
function emptyCellsNear(i) {
  const [c0, r0] = rc(i);
  const cells = [];
  S.board.forEach((v, j) => { if (!v) { const [c, r] = rc(j); cells.push([j, Math.abs(c - c0) + Math.abs(r - r0)]); } });
  cells.sort((a, b) => a[1] - b[1] || Math.random() - 0.5);
  return cells.map((x) => x[0]);
}
function placeNear(i, it) {
  const free = emptyCellsNear(i);
  if (!free.length) return -1;
  S.board[free[0]] = it;
  return free[0];
}
function tapGenerator(i) {
  const g = S.board[i];
  if (S.paw < 1) { openNap(); return; }
  const free = emptyCellsNear(i);
  if (!free.length) { toast('The board is full. Merge or sell something to make room.'); Sound.play('nope'); return; }
  S.paw -= 1;
  if (S.paw < pawMax() && S.pawTime > Date.now()) S.pawTime = Date.now();
  let it;
  const roll = Math.random();
  const lvl2 = [0, 0.1, 0.25, 0.4][g.l];
  if (roll < 0.04) it = { t: 'help', h: 'paw', l: 1 };
  else if (roll < 0.07) it = { t: 'help', h: 'coin', l: 1 };
  else it = { t: 'item', c: g.c, l: Math.random() < lvl2 ? (g.l === 3 && Math.random() < 0.3 ? 3 : 2) : 1 };
  const j = free[0];
  S.board[j] = it;
  Sound.play('pop');
  renderBoard(); renderTop();
  bounceCell(i, 'squish'); bounceCell(j, 'appear', i);
  if (S.tip === 0) advanceTip(1);
  save();
}
function collectHelper(i) {
  const h = S.board[i];
  const val = HELPERS[h.h].values[h.l - 1];
  S.board[i] = null;
  const el = cellEl(i);
  if (h.h === 'paw') { addPaw(val, el); Sound.play('boop'); } else { addCoins(val, el); Sound.play('coin'); }
  if (selected === i) selected = -1;
  renderBoard(); renderInfo();
}
function openGift(i) {
  S.board[i] = null;
  const n = 2 + rand(2);
  const chains = S.gens;
  const placed = [];
  for (let k = 0; k < n; k++) {
    const roll = Math.random();
    const it = roll < 0.2 ? { t: 'help', h: 'paw', l: 1 + (Math.random() < 0.3 ? 1 : 0) }
      : roll < 0.35 ? { t: 'help', h: 'coin', l: 1 + (Math.random() < 0.3 ? 1 : 0) }
      : { t: 'item', c: pick(chains), l: 1 + rand(3) };
    const j = k === 0 ? (S.board[i] = it, i) : placeNear(i, it);
    if (j >= 0) placed.push(j); else S.pending.push(it);
  }
  Sound.play('tada');
  if (selected === i) selected = -1;
  renderBoard(); renderInfo();
  placed.forEach((j) => bounceCell(j, 'appear', i));
  save();
}
function wakePillowsAround(i) {
  const [c, r] = rc(i);
  [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dc, dr]) => {
    const nc = c + dc, nr = r + dr;
    if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS) return;
    const j = idx(nc, nr);
    const p = S.board[j];
    if (p && p.t === 'pillow') {
      S.board[j] = p.inner;
      setTimeout(() => bounceCell(j, 'appear'), 30);
    }
  });
}
function tryMove(from, to) {
  if (from === to) return false;
  const a = S.board[from], b = S.board[to];
  if (!a || a.t === 'pillow') return false;
  if (b && b.t === 'pillow') { Sound.play('nope'); toast('Merge something next to a sleepy pillow to wake it up.'); return false; }
  if (sameKind(a, b)) {
    const merged = { ...b, l: b.l + 1 };
    S.board[to] = merged; S.board[from] = null;
    wakePillowsAround(to);
    Sound.play('merge', merged.l);
    selected = to;
    renderBoard(); renderInfo(); renderOrders();
    bounceCell(to, 'merge'); sparkle(cellEl(to));
    if (merged.t === 'item' && merged.l === MAX_LEVEL) toast(`Amazing! You made the ${itemDef(merged).name}!`);
    if (S.tip === 1) advanceTip(2);
    save();
    return true;
  }
  // move or swap
  S.board[to] = a; S.board[from] = b || null;
  selected = to;
  Sound.play('tap');
  renderBoard(); renderInfo(); renderOrders();
  save();
  return true;
}
function sellSelected() {
  const it = S.board[selected];
  if (!it || it.t === 'pillow') return;
  if (it.t === 'gen') { toast('Treat boxes are too precious to sell!'); return; }
  const v = sellValue(it);
  const el = cellEl(selected);
  S.board[selected] = null; selected = -1;
  addCoins(v, el); Sound.play('coin');
  renderBoard(); renderInfo(); renderOrders();
}
function placePending() {
  while (S.pending.length) {
    const j = placeNear(idx(3, 4), S.pending[0]);
    if (j < 0) break;
    S.pending.shift();
    bounceCell(j, 'appear');
  }
}

/* ---------- Orders ---------- */
function availableVisitors() {
  const rd = roomsDone();
  return VISITORS.filter((v) => v.room <= rd);
}
function makeOrder(slot) {
  const rd = roomsDone();
  const chains = S.gens;
  const maxL = Math.min(MAX_LEVEL, 2 + rd + Math.floor(S.level / 2) + (S.served < 3 ? 0 : 1));
  const minL = Math.max(1, maxL - 3);
  const nItems = S.served < 2 ? 1 : (Math.random() < 0.45 ? 2 : 1);
  const items = [];
  for (let k = 0; k < nItems; k++) {
    const l = S.served < 2 ? 2 : minL + rand(maxL - minL + 1);
    const c = S.served < 2 ? chains[slot % chains.length] : pick(chains);
    items.push({ c, l });
  }
  const others = S.orders.filter(Boolean).map((o) => o.dog);
  let pool = availableVisitors().filter((v) => !v.rare && !others.includes(v.id));
  let dog = pick(pool.length ? pool : VISITORS).id;
  if (Math.random() < 0.05 && !others.includes('mochi')) dog = 'mochi';
  return { dog, items, petted: false, slot };
}
function fillOrders() {
  S.orders.forEach((o, k) => { if (!o) S.orders[k] = makeOrder(k); });
}
function boardHas(items) {
  // returns list of cells that satisfy the order (distinct), or null
  const used = new Set();
  const cells = [];
  for (const want of items) {
    let found = -1;
    for (let i = 0; i < S.board.length; i++) {
      const it = S.board[i];
      if (!used.has(i) && it && it.t === 'item' && it.c === want.c && it.l === want.l) { found = i; break; }
    }
    if (found < 0) return null;
    used.add(found); cells.push(found);
  }
  return cells;
}
function orderReward(o) {
  const coins = o.items.reduce((s, it) => s + 3 + it.l * it.l * 2, 0);
  const stars = o.items.reduce((s, it) => s + 1 + (it.l >= 5 ? 1 : 0), 0);
  return { coins, stars };
}
function serve(k) {
  const o = S.orders[k];
  if (!o) return;
  const cells = boardHas(o.items);
  if (!cells) return;
  cells.forEach((i) => { S.board[i] = null; if (selected === i) selected = -1; });
  const { coins, stars } = orderReward(o);
  const card = document.querySelectorAll('.order')[k];
  S.coins += coins; S.stars += stars; S.totalStars += stars; S.paw += SERVE_PAW_BONUS; S.served++;
  const first = !S.book[o.dog];
  S.book[o.dog] = (S.book[o.dog] || 0) + 1;
  floatText(`+${coins} 🪙  +${stars} ⭐  +${SERVE_PAW_BONUS} 🐾`, card);
  Sound.play('serve');
  if (first) {
    const v = VISITORS.find((x) => x.id === o.dog);
    setTimeout(() => toast(`New pup in your Pup Book: ${v.name} the ${BREEDS[v.breed].label}!`), 600);
  }
  if (Math.random() < 0.3 || first) {
    const j = placeNear(idx(3, 4), { t: 'gift' });
    if (j < 0) S.pending.push({ t: 'gift' });
  }
  checkLevel();
  card && card.classList.add('leaving');
  S.orders[k] = null;
  if (S.tip === 2) advanceTip(3);
  renderBoard(); renderTop(); renderInfo();
  setTimeout(() => { S.orders[k] = makeOrder(k); renderOrders(); save(); }, 900);
  save();
}
function petDog(k, el) {
  const o = S.orders[k];
  if (!o) return;
  el.classList.remove('wiggle'); void el.offsetWidth; el.classList.add('wiggle');
  if (BREEDS[dogBreed(o.dog)].mask === 'pug' || dogBreed(o.dog) === 'bulldog' || dogBreed(o.dog) === 'frenchie') Sound.play('snort'); else Sound.play('boop');
  if (!o.petted) { o.petted = true; addPaw(PET_PAW_BONUS, el); }
}
function dogBreed(id) { const v = VISITORS.find((x) => x.id === id); return v ? v.breed : (STAFF[id] ? STAFF[id].breed : 'shiba'); }
function checkLevel() {
  let leveled = false;
  while (S.totalStars >= totalForLevel(S.level + 1)) {
    S.level++; leveled = true;
    const j = placeNear(idx(3, 4), { t: 'gift' }); if (j < 0) S.pending.push({ t: 'gift' });
    S.paw = Math.max(S.paw, pawMax());
  }
  if (leveled) setTimeout(() => { Sound.play('tada'); toast(`Café level ${S.level}! A gift box and a full paw refill.`); }, 900);
}
function totalForLevel(l) { let t = 0; for (let k = 1; k < l; k++) t += levelNeed(k); return t; }

/* ---------- Café ---------- */
let lastAdded = null;
function doTask(roomIdx, taskIdx, styleIdx) {
  const cost = taskCost(roomIdx, taskIdx);
  if (S.stars < cost) return;
  const wasDone = roomsDone();
  S.stars -= cost;
  S.rooms[roomIdx].done[taskIdx] = styleIdx;
  lastAdded = { r: roomIdx, i: taskIdx, t: Date.now() };
  Sound.play('tada');
  const nowDone = roomsDone();
  if (nowDone > wasDone) {
    viewRoom = null;
    const room = ROOMS[roomIdx];
    if (room.unlock.gen && !S.gens.includes(room.unlock.gen)) {
      S.gens.push(room.unlock.gen);
      const j = placeNear(idx(3, 4), { t: 'gen', c: room.unlock.gen, l: 1 });
      if (j < 0) S.pending.push({ t: 'gen', c: room.unlock.gen, l: 1 });
    }
    if (room.unlock.finale) { S.finale = true; setTimeout(() => showFinale(), 600); }
    else setTimeout(() => modal(`<div class="big-art">${PLUSH.use('star')}</div><h2>${room.name} finished!</h2><p>Unlocked: ${room.unlockText}.</p><p>Next up: <b>${ROOMS[roomIdx + 1].name}</b>.</p><button class="btn primary" data-close>Yay!</button>`), 400);
  }
  renderTop(); renderCafe(); save();
}
function restyle(roomIdx, taskIdx, styleIdx) {
  S.rooms[roomIdx].done[taskIdx] = styleIdx;
  lastAdded = { r: roomIdx, i: taskIdx, t: Date.now() };
  Sound.play('tap'); renderCafe(); save();
}

/* ---------- Rendering ---------- */
function cellEl(i) { return document.querySelector(`.cell[data-i="${i}"]`); }
function tileHTML(it, i) {
  if (!it) return '';
  const d = itemDef(it);
  let extra = '';
  if (it.t === 'item') extra = `<span class="lvl">${it.l}</span>`;
  if (it.t === 'gen') extra = `<span class="gen-badge">${'★'.repeat(it.l)}</span>`;
  if (it.t === 'help') extra = `<span class="lvl help">${HELPERS[it.h].values[it.l - 1]}</span>`;
  const cls = ['tile', it.t];
  if (it.t === 'item' && wantedSet.has(`${it.c}:${it.l}`)) cls.push('wanted');
  if (i === selected) cls.push('selected');
  const bg = it.t === 'gen' ? `background: radial-gradient(circle at 35% 30%, #fff 0%, ${d.color} 70%)` : `background: radial-gradient(circle at 35% 30%, #fff 0%, ${d.color} 75%)`;
  return `<div class="${cls.join(' ')}" style="${bg}">${PLUSH.use(artKey(it), 'icon')}${extra}${cls.includes('wanted') ? '<span class="check">✓</span>' : ''}</div>`;
}
let wantedSet = new Set();
function computeWanted() {
  wantedSet = new Set();
  S.orders.forEach((o) => o && o.items.forEach((it) => wantedSet.add(`${it.c}:${it.l}`)));
}
function renderBoard() {
  computeWanted();
  const board = $('#board');
  if (!board.children.length) {
    for (let i = 0; i < COLS * ROWS; i++) {
      const c = document.createElement('div');
      c.className = 'cell'; c.dataset.i = i;
      board.appendChild(c);
    }
  }
  S.board.forEach((it, i) => {
    const el = board.children[i];
    const html = tileHTML(it, i);
    if (el._html !== html) { el.innerHTML = html; el._html = html; }
  });
}
function renderTop() {
  $('#paw-val').textContent = `${S.paw}/${pawMax()}`;
  $('#paw-fill').style.width = `${Math.min(100, (S.paw / pawMax()) * 100)}%`;
  $('#coin-val').textContent = S.coins;
  $('#star-val').textContent = S.stars;
  $('#lvl-val').textContent = S.level;
  const need = levelNeed(S.level), have = S.totalStars - totalForLevel(S.level);
  $('#lvl-ring').style.setProperty('--p', `${Math.min(100, (have / need) * 100)}%`);
  const t = $('#paw-timer');
  if (S.paw < pawMax()) {
    const left = PAW_REGEN_MS - ((Date.now() - S.pawTime) % PAW_REGEN_MS);
    t.textContent = `+1 in ${Math.ceil(left / 1000)}s`;
  } else t.textContent = S.paw > pawMax() ? 'Bonus!' : 'Full';
  $('#cafe-dot').hidden = !(S.stars >= cheapestTask());
}
function cheapestTask() {
  const r = currentRoom();
  const i = S.rooms[r].done.findIndex((d) => d === null);
  return i < 0 ? Infinity : taskCost(r, i);
}
function renderOrders() {
  computeWanted();
  const wrap = $('#orders');
  wrap.innerHTML = '';
  S.orders.forEach((o, k) => {
    const card = document.createElement('div');
    card.className = 'order';
    if (!o) { card.classList.add('empty'); card.innerHTML = '<div class="arriving">🐾</div>'; wrap.appendChild(card); return; }
    const ready = boardHas(o.items);
    const v = VISITORS.find((x) => x.id === o.dog);
    const items = o.items.map((it) => {
      const have = !!boardHas([it]);
      return `<span class="want ${have ? 'have' : ''}" style="background:${CHAINS[it.c].color}">${PLUSH.use(`${it.c}-${it.l}`)}${have ? '<i>✓</i>' : ''}</span>`;
    }).join('');
    card.innerHTML = `
      <div class="bubble">${items}</div>
      <div class="dog ${ready ? 'happy' : ''}" data-k="${k}">${dogSVG(v.breed, { mood: ready ? 'happy' : '' })}</div>
      <div class="dog-name">${v.name}</div>
      <button class="btn serve ${ready ? 'ready' : ''}" data-serve="${k}" ${ready ? '' : 'disabled'}>Serve</button>`;
    wrap.appendChild(card);
  });
}
function renderInfo() {
  const info = $('#info');
  const it = S.board[selected];
  if (!it) { info.innerHTML = `<span class="hint">Tap an item to see what it becomes.</span>`; return; }
  const d = itemDef(it);
  let text = '', btn = '';
  if (it.t === 'item') {
    const next = it.l < MAX_LEVEL ? CHAINS[it.c].items[it.l] : null;
    text = `<b>${d.name}</b> · Level ${it.l} of ${MAX_LEVEL}${next ? ` · Merge two to make a ${next[1]}` : ' · Top level!'}`;
    btn = `<button class="btn small" id="sell-btn">Sell 🪙${sellValue(it)}</button>`;
  } else if (it.t === 'gen') {
    text = `<b>${d.name}</b> ${'★'.repeat(it.l)} · Tap to make ${CHAINS[it.c].name.toLowerCase()} treats (1 🐾).${it.l < GEN_MAX_LEVEL ? ' Merge two to upgrade.' : ''}`;
  } else if (it.t === 'help') {
    text = `<b>${d.name}</b> · Tap to collect ${HELPERS[it.h].values[it.l - 1]} ${HELPERS[it.h].unit}.${it.l < 4 ? ' Merge two for more.' : ''}`;
  } else if (it.t === 'gift') text = `<b>Gift Box</b> · Tap to open!`;
  else if (it.t === 'pillow') text = `<b>Sleepy Pillow</b> · Merge something next to it to wake it up.`;
  info.innerHTML = `<span class="mini" style="background:${d.color}">${PLUSH.use(artKey(it))}</span><span class="txt">${text}</span>${btn}`;
  const sb = $('#sell-btn'); if (sb) sb.onclick = sellSelected;
}
let viewRoom = null; // which café room is on screen (null = the room being worked on)
const shownRoom = () => (viewRoom === null || viewRoom > currentRoom() ? currentRoom() : viewRoom);
function renderCafe() {
  const r = shownRoom();
  const cur = currentRoom();
  const finished = r < roomsDone();
  const room = ROOMS[r];
  const done = S.rooms[r].done;
  const pop = lastAdded && lastAdded.r === r && Date.now() - lastAdded.t < 2500 ? lastAdded.i : -1;
  const scene = `<div class="scene-wrap">${SCENES.render(r, done, pop)}<p class="scene-hint">${done.some((d) => d !== null) ? 'Tap anything you\'ve added to change its style.' : 'Spend stars on the list below to fix up this room.'}</p></div>`;
  const doneCount = done.filter((d) => d !== null).length;
  let list = '';
  room.tasks.forEach(([name, icon], i) => {
    const cost = taskCost(r, i);
    if (done[i] !== null) list += `<div class="task done"><span class="ticon">${PLUSH.use(icon)}</span><span class="tname">${name}</span><button class="btn small ghost" data-restyle="${i}">Restyle</button></div>`;
    else list += `<div class="task"><span class="ticon">${PLUSH.use(icon)}</span><span class="tname">${name}</span><button class="btn small ${S.stars >= cost ? 'primary' : ''}" data-task="${i}" ${S.stars >= cost ? '' : 'disabled'}>${withArt('⭐')} ${cost}</button></div>`;
  });
  const roomsNav = ROOMS.map((rm, k) => {
    const open = k <= cur;
    const cls = [k === r ? 'on' : '', k < roomsDone() ? 'done' : '', open ? '' : 'locked'].join(' ');
    return `<button class="room-tab ${cls}" data-room="${k}" ${open ? '' : 'disabled'} aria-label="${open ? rm.name : 'Locked room'}">${open ? k + 1 : '🔒'}</button>`;
  }).join('');
  const arrows = `<button class="room-arrow" data-room="${r - 1}" ${r > 0 ? '' : 'disabled'} aria-label="Previous room">‹</button>` +
    `<button class="room-arrow" data-room="${r + 1}" ${r < cur ? '' : 'disabled'} aria-label="Next room">›</button>`;
  $('#cafe').innerHTML = `
    <div class="room-head"><div class="room-title"><h2>${room.name}</h2><span class="room-sub">Room ${r + 1} of ${ROOMS.length}${finished ? ' · Finished' : r === cur ? ' · In progress' : ''}</span></div><div class="room-arrows">${arrows}</div></div>
    <div class="room-tabs">${roomsNav}</div>
    ${scene}
    <div class="progress-line"><div class="bar"><div style="width:${doneCount / room.tasks.length * 100}%"></div></div><span>${doneCount}/${room.tasks.length}</span></div>
    <p class="sub">${finished ? (r === cur && S.finale ? 'The café is complete! Keep serving pups and restyling rooms.' : 'All done here. Tap any piece or Restyle to change its look.') : `Finish this room to unlock: ${room.unlockText}.`}</p>${r !== cur ? `<button class="btn ghost wide back-cur" data-room="${cur}">Back to ${ROOMS[cur].name}</button>` : ''}
    <div class="tasks">${list}</div>
    <h3>Pantry shop</h3>
    <div class="tasks">
      <div class="task"><span class="ticon">${PLUSH.use('bakery-2')}</span><span class="tname">Paw snack: +50 paw points</span><button class="btn small" data-buy="paw" ${S.coins >= 40 ? '' : 'disabled'}>${withArt('🪙')} 40</button></div>
      ${S.gens.map((g) => `<div class="task"><span class="ticon">${PLUSH.use('gen-' + g)}</span><span class="tname">Extra ${CHAINS[g].gen.name}</span><button class="btn small" data-buy="gen:${g}" ${S.coins >= 250 ? '' : 'disabled'}>${withArt('🪙')} 250</button></div>`).join('')}
    </div>`;
}
function renderBook() {
  const total = VISITORS.length;
  const met = VISITORS.filter((v) => S.book[v.id]).length;
  let html = `<div class="panel-head"><h2>Pup Book</h2><span class="sub">${met}/${total} pups met</span></div>
    <h3>The café crew</h3><div class="book">`;
  Object.entries(STAFF).forEach(([id, s]) => {
    html += `<div class="page met"><div class="pdog">${dogSVG(s.breed, { mood: 'happy' })}</div><b>${s.name}</b><span>${BREEDS[s.breed].label}</span><em>${s.role}</em></div>`;
  });
  html += `</div><h3>Visitors</h3><div class="book">`;
  VISITORS.forEach((v) => {
    const n = S.book[v.id] || 0;
    const locked = v.room > roomsDone() && !n;
    html += n ? `<div class="page met" data-bio="${v.id}"><div class="pdog">${dogSVG(v.breed)}</div><b>${v.name}</b><span>${BREEDS[v.breed].label}</span><em>Served ${n}×</em></div>`
      : `<div class="page"><div class="pdog">${dogSVG(v.breed, { silhouette: true })}</div><b>???</b><span>${v.rare ? 'Rare visitor' : locked ? `Visits after room ${v.room}` : 'Not met yet'}</span></div>`;
  });
  html += '</div>';
  $('#book').innerHTML = html;
}
function renderSettings() {
  $('#settings').innerHTML = `
    <div class="panel-head"><h2>Settings</h2></div>
    <div class="card">
      <label class="srow"><span>Music</span><input type="range" min="0" max="1" step="0.05" value="${S.music}" id="music-vol"></label>
      <label class="srow"><span>Sounds</span><input type="range" min="0" max="1" step="0.05" value="${S.sfx}" id="sfx-vol"></label>
    </div>
    <h3>Backup</h3>
    <div class="card">
      <p class="sub">Your café saves on this phone automatically. A backup code lets you move it to a new phone.</p>
      <div class="row-btns"><button class="btn" id="copy-backup">Copy backup code</button><button class="btn" id="restore-backup">Restore from code</button></div>
    </div>
    <h3>Game</h3>
    <div class="card version-card">
      <div class="vrow"><div class="vart">${PLUSH.use('gen-bakery')}</div><div class="vtxt"><b>Pup Café</b><span>Version ${APP_VERSION}</span></div></div>
      <button class="btn primary wide" id="check-update">Check for update</button>
      <p class="sub update-status" id="update-status" aria-live="polite"></p>
    </div>
    <p class="sub center">No ads, no purchases, no tracking. Everything stays on this phone.<br>Served ${S.served} pups · ${S.totalStars} stars earned.</p>
    <button class="btn danger-ghost wide" id="reset-game">Start over</button>`;
  $('#music-vol').oninput = (e) => { S.music = +e.target.value; Sound.setMusic(S.music); save(); };
  $('#sfx-vol').oninput = (e) => { S.sfx = +e.target.value; Sound.setSfx(S.sfx); save(); };
  $('#copy-backup').onclick = copyBackup;
  $('#check-update').onclick = checkForUpdate;
  $('#restore-backup').onclick = () => modal(`<h2>Restore</h2><p class="sub">Paste a backup code. This replaces the café on this phone.</p><textarea id="restore-text" rows="4"></textarea><div class="row-btns"><button class="btn" data-close>Cancel</button><button class="btn primary" id="do-restore">Restore</button></div>`, () => {
    $('#do-restore').onclick = () => {
      try {
        const s = JSON.parse(decodeURIComponent(escape(atob($('#restore-text').value.trim()))));
        if (!s || s.v !== 1) throw new Error('bad');
        S = s; saveNow(); location.reload();
      } catch (e) { toast('That code didn\'t work. Check it was copied fully.'); }
    };
  });
  $('#reset-game').onclick = () => modal(`<h2>Start over?</h2><p class="sub">This erases your café and all pups you've met.</p><div class="row-btns"><button class="btn" data-close>Keep playing</button><button class="btn danger" id="do-reset">Erase and restart</button></div>`, () => {
    $('#do-reset').onclick = () => { localStorage.removeItem(SAVE_KEY); location.reload(); };
  });
}
// Quietly check for a new version when the game is opened or brought back, and refresh if there is one.
let lastAutoCheck = 0;
async function autoUpdateCheck() {
  if (Date.now() - lastAutoCheck < 60000 || !navigator.onLine) return;
  lastAutoCheck = Date.now();
  try {
    const res = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const { version } = await res.json();
    if (!version || version === APP_VERSION) return;
    saveNow();
    if ('serviceWorker' in navigator) { const reg = await navigator.serviceWorker.getRegistration(); if (reg) await reg.update().catch(() => {}); }
    if (window.caches) { const keys = await caches.keys(); await Promise.all(keys.map((k) => caches.delete(k))); }
    location.reload();
  } catch (e) { /* offline or blocked: try again next time */ }
}
async function checkForUpdate() {
  const btn = $('#check-update'), status = $('#update-status');
  btn.disabled = true; btn.textContent = 'Checking...'; status.textContent = '';
  try {
    const res = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('http');
    const { version } = await res.json();
    if (version && version !== APP_VERSION) {
      btn.textContent = 'Updating...';
      status.textContent = `Found version ${version}. Your café is saved.`;
      saveNow();
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) await reg.update().catch(() => {});
      }
      if (window.caches) { const keys = await caches.keys(); await Promise.all(keys.map((k) => caches.delete(k))); }
      setTimeout(() => location.reload(), 900);
      return;
    }
    status.textContent = 'You have the latest version.';
    Sound.play('boop');
  } catch (e) {
    status.textContent = "Couldn't check right now. Are you online?";
  }
  btn.disabled = false; btn.textContent = 'Check for update';
}
function copyBackup() {
  const code = btoa(unescape(encodeURIComponent(JSON.stringify(S))));
  const done = () => toast('Backup code copied. Paste it somewhere safe, like Notes.');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, () => showCode(code));
  else showCode(code);
}
function showCode(code) {
  modal(`<h2>Backup code</h2><p class="sub">Select all and copy this text.</p><textarea rows="5" readonly>${code}</textarea><button class="btn primary" data-close>Done</button>`);
}

/* ---------- Effects & UI helpers ---------- */
function bounceCell(i, cls, fromI) {
  const el = cellEl(i);
  const t = el && el.firstElementChild;
  if (!t) return;
  if (fromI !== undefined && cls === 'appear') {
    const a = cellEl(fromI).getBoundingClientRect(), b = el.getBoundingClientRect();
    t.style.setProperty('--dx', `${a.left - b.left}px`); t.style.setProperty('--dy', `${a.top - b.top}px`);
  }
  t.classList.remove(cls); void t.offsetWidth; t.classList.add(cls);
}
function sparkle(el) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  for (let k = 0; k < 7; k++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.textContent = pick(['✨', '💖', '⭐', '✨']);
    s.style.left = `${r.left + r.width / 2}px`; s.style.top = `${r.top + r.height / 2}px`;
    const a = (k / 7) * Math.PI * 2;
    s.style.setProperty('--x', `${Math.cos(a) * 40}px`); s.style.setProperty('--y', `${Math.sin(a) * 40}px`);
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 700);
  }
}
function floatText(text, el) {
  const f = document.createElement('div');
  f.className = 'float';
  f.innerHTML = withArt(text);
  const r = el ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  f.style.left = `${r.left + r.width / 2}px`; f.style.top = `${r.top + r.height / 3}px`;
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1400);
}
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}
function modal(html, after) {
  const m = $('#modal');
  $('#modal-card').innerHTML = html;
  m.hidden = false;
  m.querySelectorAll('[data-close]').forEach((b) => (b.onclick = closeModal));
  if (after) after();
}
function closeModal() { $('#modal').hidden = true; }
function openNap() {
  const full = S.paw >= pawMax();
  modal(`<div class="nap-dog">${dogSVG('pug', { mood: 'sleepy' })}</div>
    <h2>${S.paw < 1 ? 'Out of paw points!' : 'Paw points'}</h2>
    <p class="sub">You have ${S.paw} of ${pawMax()}. They refill by 1 every 30 seconds. Serving a pup gives +${SERVE_PAW_BONUS}, and petting a waiting pup gives +${PET_PAW_BONUS}.</p>
    ${S.paw < 1 ? `<p>Bean can take a quick nap and refill everything, free.</p><button class="btn primary" id="nap-btn">Nap with Bean</button>` : `<p class="sub">When you run out, Bean can nap to refill you for free.</p>`}
    <button class="btn ${S.paw < 1 ? '' : 'primary'}" data-close>${full ? 'Okay' : 'Back to the café'}</button>`, () => {
    const b = $('#nap-btn');
    if (b) b.onclick = () => {
      b.disabled = true; b.textContent = 'Zzz...';
      $('.nap-dog').classList.add('napping');
      Sound.play('nap');
      setTimeout(() => { S.paw = Math.max(S.paw, pawMax()); S.pawTime = Date.now(); renderTop(); save(); closeModal(); toast('Bean feels refreshed! Paw points are full.'); Sound.play('tada'); }, 2200);
    };
  });
}
function showFinale() {
  modal(`<div class="big-art">${PLUSH.use('bakery-8')}</div><h2>The grand pup party!</h2><p>Every room of Pup Café is finished. Miso, Bean and Waffles throw the biggest party in town!</p><p class="sub">You can keep serving pups, collecting the Pup Book and restyling any room.</p><button class="btn primary" data-close>Party time!</button>`);
  Sound.play('tada');
}
function advanceTip(n) {
  S.tip = n;
  showTip();
  save();
}
function showTip() {
  const t = $('#tip');
  if (S.tip >= TIPS.length) { t.hidden = true; $('#info').hidden = false; return; }
  t.hidden = false; $('#info').hidden = true;
  t.innerHTML = `<div class="tip-dog">${dogSVG('shiba', { mood: 'happy' })}</div><div class="tip-text">${TIPS[S.tip]}</div><button class="tip-x" aria-label="Dismiss">✕</button>`;
  t.querySelector('.tip-x').onclick = () => { S.tip = S.tip === 3 ? 4 : S.tip; t.hidden = true; $('#info').hidden = false; if (S.tip >= 3) S.tip = TIPS.length; save(); };
}
function switchTab(name) {
  tab = name;
  document.querySelectorAll('.nav button').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
  ['board-view', 'cafe', 'book', 'settings'].forEach((id) => { $('#' + id).hidden = true; });
  if (name === 'board') $('#board-view').hidden = false;
  if (name === 'cafe') { renderCafe(); $('#cafe').hidden = false; if (S.tip === 3) { S.tip = TIPS.length; showTip(); save(); } }
  if (name === 'book') { renderBook(); $('#book').hidden = false; }
  if (name === 'settings') { renderSettings(); $('#settings').hidden = false; }
  Sound.play('tap');
}

/* ---------- Input: drag and tap on the board ---------- */
function setupBoardInput() {
  const board = $('#board');
  let start = null, ghost = null, from = -1, overEl = null;
  const cellAt = (x, y) => {
    const el = document.elementFromPoint(x, y);
    const c = el && el.closest('.cell');
    return c ? +c.dataset.i : -1;
  };
  board.addEventListener('pointerdown', (e) => {
    Sound.init();
    const c = e.target.closest('.cell');
    if (!c) return;
    const i = +c.dataset.i;
    const it = S.board[i];
    if (!it) { selected = -1; renderBoard(); renderInfo(); return; }
    start = { x: e.clientX, y: e.clientY, i, moved: false };
    from = i;
    board.setPointerCapture(e.pointerId);
  });
  board.addEventListener('pointermove', (e) => {
    if (!start) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (!start.moved && Math.hypot(dx, dy) > 8) {
      const it = S.board[from];
      if (!it || it.t === 'pillow') return;
      start.moved = true;
      const tile = cellEl(from).firstElementChild;
      ghost = tile.cloneNode(true);
      ghost.classList.add('ghost');
      const r = tile.getBoundingClientRect();
      ghost.style.width = `${r.width}px`; ghost.style.height = `${r.height}px`;
      document.body.appendChild(ghost);
      tile.classList.add('lifted');
    }
    if (start.moved) {
      const r = ghost.getBoundingClientRect();
      ghost.style.left = `${e.clientX - r.width / 2}px`; ghost.style.top = `${e.clientY - r.height / 2 - 18}px`;
      const j = cellAt(e.clientX, e.clientY - 18);
      const el = j >= 0 ? cellEl(j) : null;
      if (overEl !== el) {
        overEl && overEl.classList.remove('over', 'can-merge');
        overEl = el;
        if (el && j !== from) el.classList.add(sameKind(S.board[from], S.board[j]) ? 'can-merge' : 'over');
      }
    }
  });
  const end = (e) => {
    if (!start) return;
    const s = start; start = null;
    overEl && overEl.classList.remove('over', 'can-merge'); overEl = null;
    if (s.moved) {
      const j = cellAt(e.clientX, e.clientY - 18);
      ghost && ghost.remove(); ghost = null;
      const tile = cellEl(from).firstElementChild; tile && tile.classList.remove('lifted');
      if (j >= 0 && j !== from) tryMove(from, j);
      return;
    }
    // Tap
    const it = S.board[s.i];
    if (!it) return;
    if (it.t === 'gen') { selected = s.i; tapGenerator(s.i); renderInfo(); return; }
    if (it.t === 'help') { collectHelper(s.i); return; }
    if (it.t === 'gift') { openGift(s.i); return; }
    selected = s.i;
    Sound.play('tap');
    renderBoard(); renderInfo();
    bounceCell(s.i, 'squish');
  };
  board.addEventListener('pointerup', end);
  board.addEventListener('pointercancel', (e) => { if (start && start.moved) { ghost && ghost.remove(); ghost = null; const t = cellEl(from).firstElementChild; t && t.classList.remove('lifted'); } start = null; });
}

function setupUI() {
  document.querySelectorAll('.nav button').forEach((b) => (b.onclick = () => switchTab(b.dataset.tab)));
  $('#orders').addEventListener('click', (e) => {
    Sound.init();
    const sb = e.target.closest('[data-serve]');
    if (sb) { serve(+sb.dataset.serve); return; }
    const d = e.target.closest('.dog');
    if (d) petDog(+d.dataset.k, d);
  });
  $('#paw-box').onclick = () => { Sound.init(); openNap(); };
  $('#cafe').addEventListener('click', (e) => {
    const nav = e.target.closest('[data-room]');
    if (nav && !nav.disabled) {
      const k = +nav.dataset.room;
      if (k >= 0 && k <= currentRoom()) { viewRoom = k === currentRoom() ? null : k; Sound.play('tap'); renderCafe(); $('#cafe').scrollTop = 0; }
      return;
    }
    const r = shownRoom();
    const t = e.target.closest('[data-task]');
    if (t) {
      const i = +t.dataset.task;
      const [name, icon] = ROOMS[r].tasks[i];
      chooseStyle(name, icon, (st) => { doTask(r, i, st); closeModal(); });
      return;
    }
    const rs = e.target.closest('[data-restyle]');
    if (rs) {
      const i = +rs.dataset.restyle;
      const [name, icon] = ROOMS[r].tasks[i];
      chooseStyle(name, icon, (st) => { restyle(r, i, st); closeModal(); }, S.rooms[r].done[i]);
      return;
    }
    const v = e.target.closest('[data-visit]');
    if (v) { restyleRoomModal(+v.dataset.visit); return; }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const what = buy.dataset.buy;
      if (what === 'paw' && S.coins >= 40) { S.coins -= 40; addPaw(50, buy); Sound.play('boop'); }
      else if (what.startsWith('gen:') && S.coins >= 250) {
        const g = what.slice(4);
        const j = placeNear(idx(3, 4), { t: 'gen', c: g, l: 1 });
        if (j < 0) { toast('The board is full. Make some room first.'); return; }
        S.coins -= 250; Sound.play('coin'); toast(`A new ${CHAINS[g].gen.name} is on your board!`);
      }
      renderTop(); renderCafe(); renderBoard(); save();
    }
  });
  $('#book').addEventListener('click', (e) => {
    const p = e.target.closest('[data-bio]');
    if (!p) return;
    const v = VISITORS.find((x) => x.id === p.dataset.bio);
    modal(`<div class="nap-dog">${dogSVG(v.breed, { mood: 'happy' })}</div><h2>${v.name}</h2><p class="sub">${BREEDS[v.breed].label}</p><p>${v.bio}</p><p class="sub">Served ${S.book[v.id]} time${S.book[v.id] > 1 ? 's' : ''}.</p><button class="btn primary" data-close>Aww</button>`);
    Sound.play('boop');
  });
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { saveNow(); Sound.pause(); } else { Sound.resume(); tickPaw(); renderTop(); autoUpdateCheck(); }
  });
  window.addEventListener('pagehide', saveNow);
  // Prevent double-tap zoom and pinch on iOS
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  let lastTouch = 0;
  document.addEventListener('touchend', (e) => { const now = Date.now(); if (now - lastTouch < 350) e.preventDefault(); lastTouch = now; }, { passive: false });
}
function chooseStyle(name, icon, cb, current) {
  modal(`<h2>${name}</h2><p class="sub">Pick a style. You can change it any time.</p>
    <div class="styles">${STYLES.map((s, k) => `<button class="style-opt ${current === k ? 'cur' : ''}" data-style="${k}" style="--pad:${s.pad};--wall:${s.wall}"><span class="sicon">${PLUSH.use(icon)}</span><span>${s.name}</span></button>`).join('')}</div>
    <button class="btn" data-close>Not now</button>`, () => {
    document.querySelectorAll('[data-style]').forEach((b) => (b.onclick = () => cb(+b.dataset.style)));
  });
}
function restyleRoomModal(r) {
  const room = ROOMS[r];
  modal(`<h2>${room.name}</h2><p class="sub">Tap a decoration to restyle it.</p>
    <div class="tasks">${room.tasks.map(([n, ic], i) => `<div class="task done"><span class="ticon">${PLUSH.use(ic)}</span><span class="tname">${n}</span><button class="btn small ghost" data-rr="${i}">${STYLES[S.rooms[r].done[i]].name}</button></div>`).join('')}</div>
    <button class="btn primary" data-close>Done</button>`, () => {
    document.querySelectorAll('[data-rr]').forEach((b) => (b.onclick = () => {
      const i = +b.dataset.rr;
      S.rooms[r].done[i] = (S.rooms[r].done[i] + 1) % STYLES.length;
      b.textContent = STYLES[S.rooms[r].done[i]].name;
      Sound.play('tap'); save();
    }));
  });
}

/* ---------- Boot ---------- */
function boot() {
  document.body.insertAdjacentHTML('afterbegin', PLUSH.sprite());
  S = load() || newGame();
  // migrate/repair
  if (!S.pending) S.pending = [];
  fillOrders();
  tickPaw();
  Sound.setSfx(S.sfx); Sound.setMusic(S.music);
  renderBoard(); renderTop(); renderOrders(); renderInfo(); showTip();
  setupBoardInput(); setupUI();
  setInterval(() => { tickPaw(); renderTop(); if (S.pending.length) { placePending(); renderBoard(); } }, 1000);
  saveNow();
  setTimeout(autoUpdateCheck, 2000);
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
}
document.addEventListener('DOMContentLoaded', boot);
