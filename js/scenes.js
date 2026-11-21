// Pup Café: illustrated café rooms. Each finished task draws its piece into the room, in the chosen style.
'use strict';

const SCENES = (() => {
  const W = 400, H = 260, FLOOR = 172;
  const O = '#5E4650';
  const st = (w = 3) => `stroke="${O}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const use = (key, x, y, s) => `<use href="#p-${key}" x="${x}" y="${y}" width="${s}" height="${s}"/>`;

  // Style palettes: Cozy Cottage, Pastel Bakery, Garden Picnic
  const PAL = [
    { main: '#D9A06B', dark: '#B97E4B', light: '#F8E9D4', accent: '#EF8E6A', wall: '#F6E7D3', wall2: '#EBD5B8', floor: '#C99A6E', floor2: '#B88759' },
    { main: '#F7A8C4', dark: '#E583A6', light: '#FFF0F5', accent: '#8FD3FF', wall: '#FCE8EF', wall2: '#F7D3E1', floor: '#F4C9D7', floor2: '#FFFFFF' },
    { main: '#8DCB86', dark: '#69AE63', light: '#EFF8EA', accent: '#FFD84D', wall: '#E7F5E4', wall2: '#D3EBCB', floor: '#B9DDA0', floor2: '#A6CF8A' },
  ];

  const defs = `<defs>
    <pattern id="wp0" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#F6E7D3"/><rect width="12" height="28" fill="#EFDCC3"/></pattern>
    <pattern id="wp1" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="#FCE8EF"/><circle cx="6" cy="6" r="3" fill="#F7C9DA"/><circle cx="19" cy="19" r="3" fill="#FFFFFF"/></pattern>
    <pattern id="wp2" width="34" height="34" patternUnits="userSpaceOnUse"><rect width="34" height="34" fill="#E7F5E4"/><path d="M8 20 q4 -8 8 0 M12 20 l0 -8" stroke="#BFE0B6" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="26" cy="8" r="2.5" fill="#FFD6E7"/></pattern>
    <pattern id="fl0" width="80" height="22" patternUnits="userSpaceOnUse"><rect width="80" height="22" fill="#C99A6E"/><path d="M0 21 L80 21 M40 0 L40 11" stroke="#A97A50" stroke-width="2"/><path d="M0 10 L80 10" stroke="#B88759" stroke-width="1"/></pattern>
    <pattern id="fl1" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="#FFFFFF"/><rect width="15" height="15" fill="#F7C6D9"/><rect x="15" y="15" width="15" height="15" fill="#F7C6D9"/></pattern>
    <pattern id="fl2" width="36" height="24" patternUnits="userSpaceOnUse"><rect width="36" height="24" fill="#B9DDA0"/><rect x="2" y="2" width="32" height="20" rx="5" fill="#C8E6B2"/></pattern>
    <pattern id="grass" width="30" height="20" patternUnits="userSpaceOnUse"><rect width="30" height="20" fill="#A9D49C"/><path d="M6 14 l2 -6 2 6 M20 8 l2 -6 2 6" stroke="#8CC07D" stroke-width="2" fill="none" stroke-linecap="round"/></pattern>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9DDFB"/><stop offset="1" stop-color="#E9F7FF"/></linearGradient>
    <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9A6E8"/><stop offset=".6" stop-color="#FFC2D4"/><stop offset="1" stop-color="#FFE3C2"/></linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#FFE9A0" stop-opacity=".75"/><stop offset="1" stop-color="#FFE9A0" stop-opacity="0"/></radialGradient>
  </defs>`;

  /* ---------- Shared pieces ---------- */
  const cloud = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 14 Q0 0 14 2 Q20 -8 32 0 Q46 -2 46 12 Q52 22 40 24 L6 24 Q-6 22 0 14Z" fill="#fff" opacity=".95"/></g>`;
  const plainWindow = (x, y, w, h) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2.6}" fill="#CFE8F5" ${st()}/>` +
    `<path d="M${x + w / 2} ${y + 2} L${x + w / 2} ${y + h - 2} M${x + 2} ${y + h * 0.52} L${x + w - 2} ${y + h * 0.52}" ${st(2.5)}/>` +
    `<rect x="${x - 6}" y="${y + h - 2}" width="${w + 12}" height="8" rx="4" fill="#F4E6D6" ${st(2.5)}/>`;
  const dust = (n) => [[40, 205], [150, 232], [260, 214], [350, 240], [90, 246], [300, 196]].slice(0, n).map(([x, y]) =>
    `<ellipse cx="${x}" cy="${y}" rx="22" ry="5" fill="#9C8C80" opacity=".25"/>`).join('');
  const cobweb = (x, flip) => `<g transform="translate(${x} 0) scale(${flip ? -1 : 1} 1)" opacity=".55"><path d="M0 0 L40 0 M0 0 L0 40 M0 0 L30 30 M0 14 Q10 12 14 0 M0 26 Q20 22 26 0 M0 38 Q28 32 38 0" stroke="#fff" stroke-width="1.6" fill="none"/></g>`;
  const paw = (x, y, s, fill) => `<ellipse cx="${x}" cy="${y + 3 * s}" rx="${6 * s}" ry="${5 * s}" fill="${fill}"/>` +
    [[-6.5, -4.5], [-2.2, -8], [2.2, -8], [6.5, -4.5]].map(([dx, dy]) => `<ellipse cx="${x + dx * s}" cy="${y + dy * s}" rx="${2.3 * s}" ry="${2.8 * s}" fill="${fill}"/>`).join('');
  const dog = (breed, x, y, s, mood, cls = '') => {
    const inner = dogSVG(breed, { mood }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    return `<g class="sdog ${cls}"><svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="-4 -2 108 104" overflow="visible">${inner}</svg></g>`;
  };
  const indoorWall = (p, sIdx) => `<rect width="${W}" height="${FLOOR}" fill="url(#wp${sIdx})"/>` +
    `<rect y="${FLOOR - 34}" width="${W}" height="34" fill="${p.wall2}"/><path d="M0 ${FLOOR - 34} L${W} ${FLOOR - 34}" stroke="${p.dark}" stroke-width="4"/>`;
  const indoorFloor = (sIdx) => `<rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="url(#fl${sIdx})"/><path d="M0 ${FLOOR} L${W} ${FLOOR}" ${st(3)}/>`;
  const dullFloor = () => `<rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#CDBBA9"/><path d="M0 ${FLOOR} L${W} ${FLOOR}" ${st(3)}/>`;
  const stringLights = (y0, sag, colors, kind = 'bulb') => {
    let s = `<path d="M0 ${y0} Q100 ${y0 + sag} 200 ${y0} Q300 ${y0 + sag} 400 ${y0}" fill="none" ${st(2)}/>`;
    for (let k = 0; k < 9; k++) {
      const x = 22 + k * 45, t = (x % 200) / 200, y = y0 + sag * 4 * t * (1 - t) * 0.5 + 2;
      const c = colors[k % colors.length];
      s += `<circle cx="${x}" cy="${y + 10}" r="14" fill="url(#glow)"/>`;
      s += kind === 'star'
        ? `<path d="M${x} ${y} l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1Z" fill="${c}" ${st(1.6)}/>`
        : kind === 'flag'
          ? `<path d="M${x - 10} ${y - 2} L${x + 10} ${y - 2} L${x} ${y + 20}Z" fill="${c}" ${st(2)}/>`
          : kind === 'lantern'
            ? `<path d="M${x} ${y - 2} l0 4" ${st(1.5)}/><ellipse cx="${x}" cy="${y + 12}" rx="9" ry="11" fill="${c}" ${st(2)}/><path d="M${x - 4} ${y + 2} L${x + 4} ${y + 2} M${x - 4} ${y + 22} L${x + 4} ${y + 22}" ${st(3)}/>`
            : `<path d="M${x} ${y} q-6 10 0 16 q6 -6 0 -16Z" fill="${c}" ${st(1.6)}/>`;
    }
    return s;
  };

  /* ---------- Rooms ---------- */
  // Each task: { z: draw order, draw(p, sIdx) }. Base(p, sIdx, done) draws the room before any tasks.
  const ROOM_ART = [
    { // 1. Front Counter
      kind: 'indoor', floorTask: 0,
      base: (p, s, done) => plainWindow(28, 26, 66, 86) + (done[1] === null
        ? `<rect x="136" y="140" width="66" height="60" rx="4" fill="#CFC3B6" ${st()}/><path d="M146 150 L190 190 M190 150 L146 190" stroke="#B3A698" stroke-width="3"/>` +
          `<rect x="214" y="176" width="90" height="14" rx="3" transform="rotate(-14 260 183)" fill="#BFB1A2" ${st(2.5)}/><rect x="226" y="186" width="40" height="18" rx="3" fill="#CFC3B6" ${st(2.5)}/>`
        : '') + (done[0] === null ? `<path d="M60 236 l8 -6 6 7 -8 5Z M320 212 l9 -4 3 8 -9 3Z" fill="#E9E1D6" ${st(1.5)}/>` : ''),
      dogs: (happy, done) => [done[1] !== null ? ['pug', 176, 64, 52, happy ? 'happy' : '', 'back'] : ['pug', 186, 186, 54, '', 'front'], ['shiba', 62, 178, 62, happy ? 'happy' : '', 'front'], ['corgi', 318, 174, 64, '', 'front']],
      tasks: [
        { z: 0, draw: () => '' }, // floor: drawn as the clean floor
        { z: 2, draw: (p) =>
          `<rect x="112" y="108" width="196" height="16" rx="7" fill="${p.light}" ${st()}/>` +
          `<rect x="120" y="122" width="180" height="78" rx="8" fill="${p.main}" ${st()}/>` +
          [130, 190, 250].map((x) => `<rect x="${x}" y="134" width="40" height="54" rx="8" fill="${p.light}" opacity=".45"/>`).join('') +
          `<circle cx="210" cy="161" r="15" fill="${p.light}" ${st(2.5)}/>` + paw(210, 162, 1, p.dark) },
        { z: 1, draw: (p) =>
          `<path d="M172 0 L182 22 M228 0 L218 22" ${st(2)}/>` +
          `<rect x="136" y="18" width="128" height="44" rx="14" fill="${p.light}" ${st()}/>` +
          `<rect x="143" y="25" width="114" height="30" rx="9" fill="none" stroke="${p.accent}" stroke-width="2.5" stroke-dasharray="6 4"/>` +
          `<text x="208" y="47" text-anchor="middle" font-family="ui-rounded, 'SF Pro Rounded', system-ui, sans-serif" font-weight="800" font-size="19" fill="${O}">Pup Café</text>` +
          paw(156, 40, 0.75, p.dark) },
        { z: 3, draw: (p) =>
          `<rect x="128" y="62" width="46" height="48" rx="10" fill="${p.accent}" ${st()}/><rect x="134" y="70" width="34" height="12" rx="5" fill="${p.light}" ${st(2)}/>` +
          `<path d="M151 82 L151 92" ${st(4)}/><rect x="140" y="96" width="22" height="10" rx="4" fill="#fff" ${st(2)}/>` + use('drinks-3', 172, 76, 34) },
        { z: 3, draw: (p) =>
          `<rect x="228" y="98" width="72" height="12" rx="5" fill="${p.dark}" ${st(2.5)}/>` +
          `<path d="M232 98 L232 64 Q264 46 296 64 L296 98Z" fill="#E9F6FF" fill-opacity=".75" ${st(2.5)}/>` +
          use('bakery-6', 234, 66, 32) + use('bakery-5', 264, 72, 28) + `<path d="M242 62 Q252 56 262 58" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>` },
        { z: 4, draw: (p) => [110, 310].map((x) =>
          `<circle cx="${x}" cy="58" r="44" fill="url(#glow)"/><path d="M${x} 0 L${x} 30" ${st(2)}/>` +
          `<path d="M${x - 22} 50 Q${x - 22} 28 ${x} 28 Q${x + 22} 28 ${x + 22} 50Z" fill="${p.accent}" ${st()}/><circle cx="${x}" cy="54" r="6" fill="#FFE27A" ${st(2)}/>`).join('') },
        { z: 1, draw: (p) =>
          `<rect x="296" y="226" width="92" height="28" rx="12" fill="${p.accent}" ${st()}/><rect x="303" y="231" width="78" height="18" rx="8" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="5 4"/>` +
          paw(330, 240, 0.7, '#fff') + paw(358, 238, 0.7, '#fff') },
        { z: 5, draw: (p) =>
          `<rect x="6" y="210" width="62" height="12" rx="5" fill="${p.dark}" ${st(2.5)}/><path d="M14 222 L12 252 M60 222 L62 252" ${st(4)}/>` + use('garden-6', -2, 128, 82) },
      ],
    },
    { // 2. Seating Nook
      kind: 'indoor',
      base: (p, s, done) => done[3] === null ? plainWindow(166, 28, 68, 80) : '',
      dogs: (happy, done) => [done[3] !== null ? ['golden', 210, 70, 44, happy ? 'happy' : '', 'back'] : ['golden', 246, 190, 52, '', 'front'], ['pug', 168, 182, 56, happy ? 'happy' : '', 'front'], ['corgi', 330, 184, 58, '', 'front']],
      tasks: [
        { z: 3, draw: (p) => [[120, 'drinks-4'], [290, 'bakery-4']].map(([x, k]) =>
          `<path d="M${x} 196 L${x} 238 M${x - 16} 240 L${x + 16} 240" ${st(5)}/>` +
          `<ellipse cx="${x}" cy="194" rx="42" ry="11" fill="${p.light}" ${st()}/>` +
          `<path d="M${x - 42} 196 Q${x - 34} 208 ${x - 26} 200 Q${x - 18} 210 ${x - 10} 201 Q${x - 2} 210 ${x + 6} 201 Q${x + 14} 210 ${x + 22} 200 Q${x + 32} 208 ${x + 42} 196" fill="${p.main}" ${st(2)}/>` +
          use(k, x - 14, 164, 28)).join('') },
        { z: 2, draw: (p) => [56, 180, 228, 352].map((x, k) =>
          `<rect x="${x - 16}" y="150" width="32" height="36" rx="12" fill="${k % 2 ? p.light : p.main}" ${st()}/>` +
          `<rect x="${x - 20}" y="184" width="40" height="14" rx="6" fill="${p.accent}" ${st()}/><path d="M${x - 14} 198 L${x - 16} 230 M${x + 14} 198 L${x + 16} 230" ${st(4)}/>`).join('') },
        { z: 1, draw: (p) =>
          `<rect x="10" y="30" width="62" height="160" rx="8" fill="${p.main}" ${st()}/>` +
          [72, 112, 152].map((y) => `<path d="M12 ${y} L70 ${y}" ${st(3)}/>`).join('') +
          [[16, 42, '#FF8FB1'], [26, 46, '#8FD3FF'], [36, 40, '#FFD84D'], [50, 46, '#B79CF2'], [16, 84, '#B9E7C8'], [26, 80, '#FF9F7A'], [56, 84, '#8FD3FF'], [18, 124, '#B79CF2'], [28, 122, '#FFD84D']].map(([x, y, c]) =>
            `<rect x="${x}" y="${y}" width="9" height="${(Math.floor(y / 40) * 40 + 32) - y}" rx="2" fill="${c}" ${st(1.8)}/>`).join('') +
          use('toys-5', 38, 112, 32) + use('toys-2', 34, 158, 24) },
        { z: 0, draw: (p) =>
          `<rect x="160" y="22" width="80" height="92" rx="34" fill="#CFE8F5" ${st()}/><path d="M200 24 L200 112 M162 70 L238 70" ${st(2.5)}/>` + cloud(172, 38, 0.6) +
          `<rect x="150" y="110" width="100" height="22" rx="10" fill="${p.accent}" ${st()}/><rect x="156" y="104" width="36" height="14" rx="7" fill="${p.light}" ${st(2)}/><rect x="208" y="104" width="36" height="14" rx="7" fill="${p.main}" ${st(2)}/>` },
        { z: 0, draw: (p) =>
          `<rect x="290" y="30" width="54" height="46" rx="6" fill="${p.accent}" ${st()}/><rect x="297" y="37" width="40" height="32" rx="3" fill="#FFF6EC"/>` + dog('shiba', 300, 38, 34, 'happy') +
          `<rect x="350" y="52" width="40" height="38" rx="6" fill="${p.main}" ${st()}/><rect x="356" y="58" width="28" height="26" rx="3" fill="#FFF6EC"/>` + dog('corgi', 357, 60, 26, 'happy') },
        { z: 6, draw: () => stringLights(6, 28, ['#FF8FB1', '#FFD84D', '#8FD3FF', '#B9E7C8', '#B79CF2']) },
        { z: 0, draw: (p) => `<ellipse cx="205" cy="230" rx="160" ry="24" fill="${p.accent}" ${st()}/><ellipse cx="205" cy="230" rx="128" ry="16" fill="none" stroke="${p.light}" stroke-width="5"/>` },
        { z: 1, draw: (p) =>
          `<circle cx="112" cy="54" r="22" fill="${p.light}" ${st()}/><circle cx="112" cy="54" r="16" fill="none" stroke="${p.main}" stroke-width="2.5"/>` +
          `<path d="M112 54 L112 42 M112 54 L120 58" ${st(3)}/><path d="M94 38 L88 28 L100 32 M130 38 L136 28 L124 32" fill="${p.main}" ${st(2)}/>` },
      ],
    },
    { // 3. Nap Corner
      kind: 'indoor',
      base: () => plainWindow(156, 26, 70, 82),
      dogs: (happy) => [['pug', 64, 184, 54, 'sleepy', 'front'], ['shiba', 228, 190, 54, happy ? 'sleepy' : '', 'front'], ['corgi', 150, 120, 46, '', 'back']],
      tasks: [
        { z: 1, draw: (p) => [[92, 226], [256, 232]].map(([x, y]) =>
          `<ellipse cx="${x}" cy="${y}" rx="56" ry="20" fill="${p.main}" ${st()}/><ellipse cx="${x}" cy="${y - 4}" rx="40" ry="11" fill="${p.light}" ${st(2.5)}/>` + paw(x + 26, y + 8, 0.6, p.light)).join('') },
        { z: 2, draw: (p) =>
          `<rect x="306" y="196" width="80" height="44" rx="8" fill="${p.dark}" ${st()}/>` +
          [[312, 182, p.accent], [316, 168, p.light], [310, 154, p.main]].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="70" height="16" rx="7" fill="${c}" ${st(2.5)}/>`).join('') },
        { z: 3, draw: (p) =>
          `<path d="M130 214 Q128 200 142 200 L178 202 Q190 202 188 216 Q186 228 172 226 L140 226 Q130 226 130 214Z" fill="${p.accent}" ${st()}/>` + use('d-cushion', 150, 172, 42) },
        { z: 2, draw: (p) =>
          `<rect x="14" y="146" width="48" height="10" rx="4" fill="${p.main}" ${st(2.5)}/><path d="M20 156 L18 196 M56 156 L58 196" ${st(4)}/>` +
          `<circle cx="38" cy="120" r="34" fill="url(#glow)"/>` + use('d-moon', 14, 98, 50) },
        { z: 3, draw: (p) =>
          `<rect x="330" y="214" width="62" height="38" rx="8" fill="${p.main}" ${st()}/>` + use('toys-5', 336, 178, 38) + use('toys-2', 364, 196, 24) +
          `<rect x="330" y="214" width="62" height="38" rx="8" fill="${p.main}" ${st()}/>` + paw(361, 234, 0.8, p.light) },
        { z: 1, draw: (p) => `<rect x="270" y="72" width="64" height="10" rx="4" fill="${p.main}" ${st(2.5)}/>` + use('d-musicbox', 280, 32, 42) },
        { z: 0, draw: (p) =>
          `<rect x="140" y="18" width="102" height="8" rx="4" fill="${p.dark}" ${st(2.5)}/>` +
          `<path d="M144 26 L170 26 Q164 70 168 104 Q156 112 146 120 L144 120Z M238 26 L212 26 Q218 70 214 104 Q226 112 236 120 L238 120Z" fill="${p.accent}" ${st()}/>` +
          `<path d="M150 30 Q152 70 150 114 M232 30 Q230 70 232 114" stroke="#fff" stroke-width="2.5" fill="none" opacity=".7"/>` },
        { z: 0, draw: (p) =>
          `<rect x="306" y="86" width="90" height="86" rx="6" fill="${p.light}" ${st()}/>` +
          [[312, 96], [340, 96], [368, 96], [312, 112], [368, 112]].map(([x, y]) => `<rect x="${x}" y="${y}" width="24" height="12" rx="3" fill="${p.wall2}"/>`).join('') +
          `<rect x="300" y="80" width="102" height="12" rx="5" fill="${p.main}" ${st()}/>` +
          `<path d="M326 172 L326 132 Q326 116 351 116 Q376 116 376 132 L376 172Z" fill="#4A3B44"/>` +
          `<circle cx="351" cy="150" r="30" fill="url(#glow)"/>` +
          `<path d="M351 168 Q334 164 338 150 Q342 140 348 144 Q346 132 356 128 Q356 140 362 142 Q370 150 364 162 Q360 168 351 168Z" fill="#FF9F43" ${st(2)}/>` +
          `<path d="M351 166 Q344 162 346 155 Q349 150 353 154 Q357 150 358 158 Q358 165 351 166Z" fill="#FFE27A"/>` },
      ],
    },
    { // 4. Back Garden (outdoors)
      kind: 'garden',
      base: (p, s, done) => cloud(240, 18, 1) + cloud(60, 30, 0.7) +
        (done[0] === null ? `<path d="M0 150 Q40 140 80 152 Q130 138 180 150 Q240 140 300 152 Q350 142 400 150 L400 ${FLOOR} L0 ${FLOOR}Z" fill="#9FCB8E"/>` : '') +
        [[40, 200], [140, 250], [260, 210], [370, 230]].map(([x, y]) => `<path d="M${x} ${y} l4 -14 4 14 M${x + 6} ${y} l6 -12 2 12" stroke="#7FB06E" stroke-width="3" fill="none" stroke-linecap="round"/>`).join(''),
      dogs: (happy) => [['golden', 150, 188, 56, happy ? 'happy' : '', 'front'], ['corgi', 252, 176, 52, happy ? 'happy' : '', 'front'], ['shiba', 330, 196, 50, '', 'front']],
      tasks: [
        { z: 0, draw: (p) =>
          `<path d="M0 126 L400 126 M0 154 L400 154" stroke="${O}" stroke-width="10"/><path d="M0 126 L400 126 M0 154 L400 154" stroke="${p.main}" stroke-width="5"/>` +
          [...Array(13)].map((_, k) => { const x = 10 + k * 32; return `<path d="M${x - 9} ${FLOOR} L${x - 9} 112 L${x} 102 L${x + 9} 112 L${x + 9} ${FLOOR}Z" fill="${p.light}" ${st(2.5)}/>`; }).join('') },
        { z: 4, draw: (p) =>
          `<path d="M4 252 Q4 220 64 220 Q124 220 124 252Z" fill="#B98763" ${st()}/>` +
          use('garden-4', 8, 186, 40) + use('garden-3', 44, 180, 40) + use('garden-4', 80, 188, 40) +
          [[20, 230], [62, 226], [104, 232]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${p.accent}" ${st(1.5)}/>`).join('') },
        { z: 4, draw: (p) => [[180, 240], [214, 244]].map(([x, y]) =>
          `<path d="M${x - 16} ${y - 8} L${x + 16} ${y - 8} L${x + 12} ${y + 6} Q${x} ${y + 10} ${x - 12} ${y + 6}Z" fill="${p.accent}" ${st(2.5)}/><ellipse cx="${x}" cy="${y - 8}" rx="16" ry="4" fill="#9EDBFF" ${st(2)}/>`).join('') },
        { z: 2, draw: (p) =>
          `<path d="M300 138 L300 206 L392 206 L392 138" fill="${p.light}" ${st()}/>` +
          `<path d="M290 142 L346 96 L402 142 L392 148 L346 110 L300 148Z" fill="${p.main}" ${st()}/>` +
          `<path d="M326 206 L326 178 Q346 158 366 178 L366 206Z" fill="#4A3B44"/>` +
          `<rect x="330" y="124" width="32" height="12" rx="4" fill="#fff" ${st(2)}/>` + paw(346, 130, 0.4, p.dark) },
        { z: 1, draw: (p) =>
          `<path d="M36 ${FLOOR + 8} L42 70 L58 70 L64 ${FLOOR + 8}Z" fill="#B98763" ${st()}/>` +
          `<path d="M58 84 L110 76" ${st(8)}/><path d="M58 84 L110 76" stroke="#B98763" stroke-width="4" stroke-linecap="round"/>` +
          `<circle cx="20" cy="56" r="30" fill="#7FCB8A" ${st()}/><circle cx="62" cy="40" r="34" fill="#8DD48F" ${st()}/><circle cx="100" cy="60" r="24" fill="#7FCB8A" ${st()}/>` +
          `<circle cx="40" cy="40" r="4" fill="#FF8FB1"/><circle cx="80" cy="30" r="4" fill="#FF8FB1"/>` +
          `<path d="M82 80 L80 150 M106 77 L108 150" ${st(2)}/><rect x="72" y="146" width="44" height="10" rx="5" fill="${p.accent}" ${st(2.5)}/>` },
        { z: 3, draw: (p) =>
          `<ellipse cx="270" cy="232" rx="58" ry="18" fill="${p.accent}" ${st()}/><ellipse cx="270" cy="228" rx="46" ry="11" fill="#9EDBFF" ${st(2)}/>` +
          `<path d="M246 228 Q252 224 258 228 M280 230 Q286 226 292 230" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>` + use('toys-3', 276, 204, 26) },
        { z: 2, draw: (p) =>
          `<path d="M156 182 L146 222 M234 182 L244 222" ${st(5)}/>` +
          `<rect x="144" y="170" width="104" height="16" rx="5" fill="${p.light}" ${st()}/>` +
          `<path d="M150 186 L242 186" stroke="${p.accent}" stroke-width="6" stroke-dasharray="8 8"/>` + use('gen-toys', 176, 138, 36) + use('bakery-3', 212, 152, 22) },
        { z: 5, draw: (p) => stringLights(16, 30, [p.accent, '#FF8FA3', p.main], 'lantern') },
      ],
    },
    { // 5. Upstairs Lounge
      kind: 'indoor',
      base: () => '',
      dogs: (happy) => [['shiba', 196, 196, 54, happy ? 'happy' : '', 'front'], ['pug', 296, 186, 50, happy ? 'sleepy' : '', 'front'], ['corgi', 34, 186, 50, '', 'front']],
      tasks: [
        { z: 1, draw: (p) =>
          `<path d="M0 ${H} L0 96 L22 96 L22 118 L44 118 L44 140 L66 140 L66 162 L88 162 L88 ${H}Z" fill="${p.main}" ${st()}/>` +
          `<path d="M0 118 L22 118 M0 140 L44 140 M0 162 L66 162" stroke="${p.dark}" stroke-width="3"/>` +
          `<path d="M8 96 L8 70 M30 118 L30 92 M52 140 L52 114 M74 162 L74 136" ${st(3)}/><path d="M0 74 L84 134" ${st(5)}/>` },
        { z: 1, draw: (p) =>
          `<rect x="318" y="44" width="74" height="${FLOOR + 12 - 44}" rx="8" fill="${p.light}" ${st()}/><path d="M355 46 L355 ${FLOOR + 10}" ${st(2.5)}/>` +
          `<rect x="324" y="56" width="26" height="80" rx="4" fill="#FFF6EC" ${st(2)}/><path d="M330 66 Q337 58 344 66 L346 120 L328 120Z" fill="${p.accent}" ${st(2)}/>` +
          `<circle cx="350" cy="110" r="2.5" fill="${O}"/><circle cx="360" cy="110" r="2.5" fill="${O}"/>` },
        { z: 0, draw: (p) =>
          `<ellipse cx="272" cy="76" rx="22" ry="32" fill="${p.accent}" ${st()}/><ellipse cx="272" cy="76" rx="15" ry="24" fill="#E9F6FF" ${st(2)}/>` +
          `<path d="M264 64 L274 56 M264 74 L280 60" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` },
        { z: 0, draw: (p) =>
          `<path d="M74 24 Q118 34 162 24" fill="none" ${st(2)}/>` +
          [[90, 30, -8, 'shiba'], [124, 34, 4, 'corgi'], [158, 30, 10, 'pug']].map(([x, y, r, b]) =>
            `<g transform="rotate(${r} ${x} ${y + 24})"><rect x="${x - 17}" y="${y}" width="34" height="42" rx="3" fill="#fff" ${st(2.5)}/><rect x="${x - 13}" y="${y + 4}" width="26" height="26" rx="2" fill="${p.main}"/>` +
            dog(b, x - 12, y + 6, 24, 'happy') + `<circle cx="${x}" cy="${y}" r="3" fill="${p.accent}" ${st(1.2)}/></g>`).join('') },
        { z: 2, draw: (p) =>
          `<path d="M120 132 Q120 106 146 106 L222 106 Q246 106 246 132 L246 176 L120 176Z" fill="${p.main}" ${st()}/>` +
          `<rect x="116" y="170" width="134" height="18" rx="3" fill="#fff" ${st()}/>` +
          [128, 140, 158, 170, 182, 200, 212, 230].map((x) => `<rect x="${x}" y="170" width="6" height="10" fill="${O}"/>`).join('') +
          `<path d="M124 188 L124 226 M242 188 L242 226" ${st(5)}/>` +
          `<path d="M150 92 L150 82 Q156 84 156 88" fill="none" ${st(2)}/><circle cx="147" cy="92" r="3.5" fill="${O}"/>` },
        { z: 3, draw: (p) =>
          `<path d="M268 254 Q254 250 258 232 Q264 214 288 210 Q306 210 314 228 Q322 248 310 254 Q290 260 268 254Z" fill="${p.accent}" ${st()}/>` +
          `<path d="M332 254 Q320 248 326 234 Q332 220 350 218 Q368 220 374 236 Q380 252 368 256 Q350 260 332 254Z" fill="${p.light}" ${st()}/>` },
        { z: 3, draw: (p) =>
          `<ellipse cx="180" cy="234" rx="44" ry="10" fill="${p.light}" ${st()}/><path d="M152 238 L150 256 M208 238 L210 256" ${st(4)}/>` +
          use('gen-drinks', 150, 196, 36) + use('drinks-4', 186, 210, 24) },
        { z: 5, draw: () => `<circle cx="210" cy="46" r="60" fill="url(#glow)"/>` + use('d-chandelier', 178, -4, 64) },
      ],
    },
    { // 6. Rooftop Terrace (outdoors at sunset)
      kind: 'roof', floorTask: 0,
      base: () => `<path d="M0 ${FLOOR} L0 130 L30 130 L30 112 L60 112 L60 138 L96 138 L96 104 L128 104 L128 132 L170 132 L170 118 L210 118 L210 140 L250 140 L250 100 L290 100 L290 126 L330 126 L330 112 L370 112 L370 136 L400 136 L400 ${FLOOR}Z" fill="#9C8DC4" opacity=".6"/>` +
        `<circle cx="320" cy="58" r="20" fill="#FFF1C9" opacity=".9"/>` + `<rect x="0" y="${FLOOR - 16}" width="${W}" height="16" fill="#E3D9F0" ${st(2.5)}/>`,
      dogs: (happy, done) => [['shiba', 198, 190, 54, happy ? 'happy' : '', 'front'], done[5] !== null ? ['pug', 148, 140, 44, 'sleepy', 'mid'] : ['pug', 110, 196, 50, '', 'front'], ['corgi', 336, 194, 54, happy ? 'happy' : '', 'front']],
      tasks: [
        { z: 0, draw: (p, s) => `<rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="${p.floor}"/>` +
          [0, 1, 2, 3].map((k) => `<path d="M0 ${FLOOR + 22 * k + 20} L${W} ${FLOOR + 22 * k + 20}" stroke="${p.floor2}" stroke-width="3"/>`).join('') + `<path d="M0 ${FLOOR} L${W} ${FLOOR}" ${st(3)}/>` },
        { z: 3, draw: (p) => [8, 62].map((x) => `<rect x="${x}" y="214" width="50" height="34" rx="6" fill="${p.main}" ${st()}/>` + use('d-sunflower', x, 166, 50)).join('') },
        { z: 2, draw: (p) =>
          `<path d="M300 70 L300 236" ${st(5)}/>` +
          `<path d="M240 96 Q244 52 300 48 Q356 52 360 96 Q346 88 330 96 Q316 86 300 96 Q284 86 270 96 Q254 88 240 96Z" fill="${p.accent}" ${st()}/>` +
          `<path d="M300 48 Q284 70 270 96 M300 48 Q316 70 330 96" stroke="${p.light}" stroke-width="7" fill="none"/>` +
          `<ellipse cx="300" cy="208" rx="30" ry="8" fill="${p.light}" ${st()}/>` },
        { z: 5, draw: () => stringLights(8, 30, ['#FFD84D', '#FFB3CF', '#FFE27A', '#B79CF2'], 'star') },
        { z: 3, draw: () => use('d-telescope', 346, 128, 58) },
        { z: 1, draw: (p) =>
          `<path d="M110 ${FLOOR + 10} L110 120 M230 ${FLOOR + 10} L230 120" ${st(6)}/>` +
          `<path d="M110 132 L124 146 M230 132 L216 146" ${st(2)}/>` +
          `<path d="M122 146 Q170 196 218 146 Q170 172 122 146Z" fill="${p.accent}" ${st()}/><path d="M130 152 Q170 184 210 152" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="5 5"/>` },
        { z: 4, draw: (p) => `<g transform="translate(0 26)">${stringLights(10, 26, [p.accent, p.main, '#FFD84D', '#8FD3FF'], 'flag')}</g>` },
        { z: 4, draw: (p) =>
          `<rect x="162" y="226" width="80" height="12" rx="5" fill="${p.light}" ${st()}/><path d="M170 238 L168 258 M234 238 L236 258" ${st(4)}/>` + use('bakery-8', 174, 168, 58) },
      ],
    },
  ];

  function dominantStyle(done) {
    const c = [0, 0, 0]; done.forEach((d) => d !== null && c[d]++);
    const m = Math.max(...c);
    return m === 0 ? 0 : c.indexOf(m);
  }

  function render(roomIdx, done, popTask) {
    const R = ROOM_ART[roomIdx];
    const nDone = done.filter((d) => d !== null).length;
    const prog = nDone / done.length;
    const sDom = dominantStyle(done);
    const pDom = PAL[sDom];
    let svg = `<svg class="room-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${defs}`;

    // Background
    if (R.kind === 'indoor') {
      svg += nDone ? indoorWall(pDom, sDom) : `<rect width="${W}" height="${FLOOR}" fill="#E4D8CB"/><rect y="${FLOOR - 34}" width="${W}" height="34" fill="#D6C8B8"/>`;
      const ft = R.floorTask;
      if (ft !== undefined) svg += done[ft] !== null ? `<g data-restyle="${ft}" class="${popTask === ft ? 'pop-floor' : ''}">${indoorFloor(done[ft])}</g>` : dullFloor();
      else svg += nDone ? indoorFloor(sDom) : dullFloor();
    } else if (R.kind === 'garden') {
      svg += `<rect width="${W}" height="${FLOOR}" fill="url(#sky)"/><rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="url(#grass)"/>`;
    } else {
      svg += `<rect width="${W}" height="${FLOOR}" fill="url(#dusk)"/><rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#C9C0CF"/>`;
    }
    svg += `<g>${R.base(pDom, sDom, done)}</g>`;

    // Tasks in draw order, with dogs layered in between
    const order = done.map((d, i) => ({ i, d, z: R.tasks[i].z })).filter((t) => t.d !== null && !(R.floorTask === t.i && R.kind === 'indoor'))
      .sort((a, b) => a.z - b.z);
    const dogs = R.dogs(prog >= 0.5, done);
    const drawDogs = (layer) => dogs.filter((d) => d[5] === layer).map(([b, x, y, s, m]) => dog(b, x, y, s, m)).join('');
    let backDone = false, midDone = false;
    order.forEach((t) => {
      if (!backDone && t.z >= 2) { svg += drawDogs('back'); backDone = true; }
      if (!midDone && t.z >= 3) { svg += drawDogs('mid'); midDone = true; }
      const piece = R.tasks[t.i].draw(PAL[t.d], t.d);
      svg += `<g class="piece ${popTask === t.i ? 'pop' : ''}" data-restyle="${t.i}">${piece}</g>`;
    });
    if (!backDone) svg += drawDogs('back');
    if (!midDone) svg += drawDogs('mid');
    svg += drawDogs('front');

    // Dust and cobwebs fade away as the room is fixed up
    if (prog < 1) svg += `<g opacity="${(1 - prog).toFixed(2)}" pointer-events="none">${dust(6 - Math.round(prog * 6))}</g>`;
    if (nDone < 3) svg += cobweb(0, false) + cobweb(W, true);
    svg += '</svg>';
    const sat = (0.45 + 0.55 * prog).toFixed(2);
    return `<div class="room ${nDone ? '' : 'bare'}" style="--sat:${sat}">${svg}</div>`;
  }

  return { render, count: ROOM_ART.length };
})();
