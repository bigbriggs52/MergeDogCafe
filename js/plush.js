// Pup Café: original plushy item art, drawn as SVG.
// Every item is a soft, rounded "plush" with a thick outline, a shine and (often) a little face.
'use strict';

const PLUSH = (() => {
  const O = '#5E4650';
  const st = (w = 3) => `stroke="${O}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const shadow = (rx = 30, cy = 91) => `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="5" fill="#5E4650" opacity=".1"/>`;
  const shine = (x, y, rx = 7, ry = 4, rot = -30) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${x} ${y})" fill="#fff" opacity=".7"/>`;
  function face(x, y, s = 1, mood = 'smile') {
    const ex = 8.5 * s, r = 3.1 * s;
    let eyes;
    if (mood === 'sleep') {
      eyes = `<path d="M${x - ex - r} ${y} q${r} ${r * 1.2} ${r * 2} 0 M${x + ex - r} ${y} q${r} ${r * 1.2} ${r * 2} 0" fill="none" ${st(2 * s)}/>`;
    } else if (mood === 'happy') {
      eyes = `<path d="M${x - ex - r} ${y + 1} q${r} ${-r * 1.6} ${r * 2} 0 M${x + ex - r} ${y + 1} q${r} ${-r * 1.6} ${r * 2} 0" fill="none" ${st(2 * s)}/>`;
    } else {
      eyes = `<ellipse cx="${x - ex}" cy="${y}" rx="${r}" ry="${r * 1.2}" fill="${O}"/><ellipse cx="${x + ex}" cy="${y}" rx="${r}" ry="${r * 1.2}" fill="${O}"/>` +
        `<circle cx="${x - ex + r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.42}" fill="#fff"/><circle cx="${x + ex + r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.42}" fill="#fff"/>`;
    }
    const mouth = `<path d="M${x - 3 * s} ${y + 4 * s} q${1.5 * s} ${2.2 * s} ${3 * s} 0 q${1.5 * s} ${2.2 * s} ${3 * s} 0" fill="none" ${st(2 * s)}/>`;
    const blush = `<ellipse cx="${x - ex - 3.5 * s}" cy="${y + 4 * s}" rx="${3.2 * s}" ry="${2 * s}" fill="#FF8FAB" opacity=".55"/><ellipse cx="${x + ex + 3.5 * s}" cy="${y + 4 * s}" rx="${3.2 * s}" ry="${2 * s}" fill="#FF8FAB" opacity=".55"/>`;
    return eyes + blush + mouth;
  }
  const pawPrint = (x, y, s, fill) =>
    `<ellipse cx="${x}" cy="${y + 3 * s}" rx="${6 * s}" ry="${5 * s}" fill="${fill}"/>` +
    [[-6.5, -4.5], [-2.2, -8], [2.2, -8], [6.5, -4.5]].map(([dx, dy]) => `<ellipse cx="${x + dx * s}" cy="${y + dy * s}" rx="${2.3 * s}" ry="${2.8 * s}" fill="${fill}"/>`).join('');
  const sparkle = (x, y, s = 1, c = '#FFE27A') => `<path d="M${x} ${y - 6 * s} Q${x + 1.2 * s} ${y - 1.2 * s} ${x + 6 * s} ${y} Q${x + 1.2 * s} ${y + 1.2 * s} ${x} ${y + 6 * s} Q${x - 1.2 * s} ${y + 1.2 * s} ${x - 6 * s} ${y} Q${x - 1.2 * s} ${y - 1.2 * s} ${x} ${y - 6 * s}Z" fill="${c}" stroke="${O}" stroke-width="${1.5 * s}" stroke-linejoin="round"/>`;

  const A = {};

  /* ---------- Bakery ---------- */
  A['bakery-1'] = () => shadow(18) +
    `<path d="M50 88 L50 52 M50 70 L40 56 M50 70 L60 56" fill="none" ${st(3.5)}/>` +
    [[50, 38, 0], [41, 48, -30], [59, 48, 30], [38, 62, -35], [62, 62, 35], [44, 30, -15], [56, 30, 15]].map(([x, y, r]) =>
      `<ellipse cx="${x}" cy="${y}" rx="6" ry="10" transform="rotate(${r} ${x} ${y})" fill="#F6C760" ${st(2.5)}/>`).join('') +
    `<path d="M41 76 Q50 70 59 76 L57 84 Q50 80 43 84Z" fill="#FF9EB5" ${st(2.5)}/>` + face(50, 40, 0.7);
  A['bakery-2'] = () => {
    const shapes = (extra) => `<rect x="24" y="40" width="52" height="24" rx="6" ${extra}/>` +
      [[24, 40], [24, 64], [76, 40], [76, 64]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" ${extra}/>`).join('');
    return shadow(34) + shapes(`fill="${O}" stroke="${O}" stroke-width="6"`) + shapes('fill="#F7DDB0"') +
      shine(22, 36, 4, 2.5) + face(50, 50, 0.85);
  };
  A['bakery-3'] = () => shadow(30) +
    `<circle cx="50" cy="52" r="34" fill="#E9AE6E" ${st()}/><circle cx="50" cy="52" r="27" fill="#F2C38A" opacity=".7"/>` +
    pawPrint(50, 54, 2.3, '#8A5638') + shine(32, 32, 7, 4) +
    [[24, 60], [76, 46], [70, 72], [30, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#8A5638"/>`).join('');
  A['bakery-4'] = () => shadow(34) +
    `<path d="M14 66 Q10 44 26 42 Q30 24 50 24 Q70 24 74 42 Q90 44 86 66 Q80 72 72 64 Q68 76 50 76 Q32 76 28 64 Q20 72 14 66Z" fill="#F2B05A" ${st()}/>` +
    `<path d="M30 44 Q34 56 30 64 M42 30 Q46 50 42 74 M58 30 Q54 50 58 74 M70 44 Q66 56 70 64" fill="none" stroke="#C97E33" stroke-width="2.5" stroke-linecap="round"/>` +
    shine(40, 32, 8, 3.5, -10) + face(50, 54, 0.8);
  A['bakery-5'] = () => shadow(34) +
    `<path d="M50 16 A35 35 0 1 1 49.9 16Z M50 40 A11 11 0 1 0 50.1 40Z" fill="#EDB673" fill-rule="evenodd" ${st()}/>` +
    `<path d="M22 46 Q20 24 50 22 Q80 24 78 46 Q76 56 70 52 Q66 62 60 54 Q50 66 42 56 Q34 62 30 52 Q24 58 22 46Z M50 40 A11 11 0 1 0 50.1 40Z" fill="#FF9CC2" fill-rule="evenodd" ${st(2.5)}/>` +
    [[32, 34, 20], [64, 30, -30], [70, 42, 60], [40, 26, -50], [56, 24, 10], [28, 44, 80]].map(([x, y, r], k) =>
      `<rect x="${x - 3.5}" y="${y - 1.3}" width="7" height="2.6" rx="1.3" transform="rotate(${r} ${x} ${y})" fill="${['#FFF', '#7FD1F7', '#FFE27A', '#B79CF2'][k % 4]}"/>`).join('') +
    face(50, 70, 0.8);
  A['bakery-6'] = () => shadow(26) +
    `<path d="M26 54 L74 54 L68 88 L32 88Z" fill="#8CCBF2" ${st()}/>` +
    `<path d="M38 56 L40 86 M50 56 L50 86 M62 56 L60 86" stroke="#5FA9D9" stroke-width="2.5"/>` +
    `<path d="M22 56 Q16 44 28 40 Q26 26 42 26 Q46 12 58 18 Q72 20 70 32 Q84 36 78 50 Q78 58 70 56 Z" fill="#FFB3CF" ${st()}/>` +
    `<circle cx="56" cy="12" r="6" fill="#F0506E" ${st(2.5)}/><path d="M56 6 Q58 0 64 0" fill="none" ${st(2)}/>` +
    shine(38, 34, 6, 3) + face(50, 44, 0.85);
  A['bakery-7'] = () => shadow(34) +
    `<path d="M16 50 L78 30 L86 44 L86 80 L16 84Z" fill="#FFF3E0" ${st()}/>` +
    `<path d="M16 50 L78 30 L86 44 L16 62Z" fill="#FFB8CF" ${st(2.5)}/>` +
    `<path d="M16 70 L86 62" stroke="#FF8FB1" stroke-width="5"/><path d="M86 44 L86 80" fill="none" ${st()}/>` +
    `<path d="M60 30 q2 -14 10 -12 q8 2 4 14 q-6 6 -14 -2Z" fill="#F0506E" ${st(2.5)}/><path d="M64 22 l3 -6 3 5" fill="#7FCB8A" ${st(1.5)}/>` +
    face(48, 74, 0.8);
  A['bakery-8'] = () => shadow(36) +
    `<path d="M14 62 L14 84 Q50 94 86 84 L86 62Z" fill="#FFE9C7" ${st()}/>` +
    `<path d="M14 62 Q14 74 22 70 Q26 78 32 70 Q38 80 46 72 Q52 80 58 72 Q64 80 70 70 Q76 78 80 70 Q86 74 86 62Z" fill="#FFB3CF" ${st(2.5)}/>` +
    `<ellipse cx="50" cy="62" rx="36" ry="9" fill="#FFC9DA" ${st(2.5)}/>` +
    `<path d="M26 40 L26 58 Q50 66 74 58 L74 40Z" fill="#FFF3E0" ${st()}/><ellipse cx="50" cy="40" rx="24" ry="7" fill="#FFF9F0" ${st(2.5)}/>` +
    `<path d="M30 36 L28 18 L42 32Z M70 36 L72 18 L58 32Z" fill="#E9AE6E" ${st(2.5)}/>` +
    [40, 50, 60].map((x) => `<rect x="${x - 2}" y="22" width="4" height="14" rx="2" fill="#8FD3FF" ${st(1.8)}/><path d="M${x} 21 q-3 -5 0 -9 q3 4 0 9Z" fill="#FFCC4D"/>`).join('') +
    face(50, 50, 0.75) + sparkle(84, 30, 0.8) + sparkle(16, 40, 0.6);

  /* ---------- Drinks ---------- */
  A['drinks-1'] = () => shadow(20) +
    `<path d="M50 14 Q72 44 72 60 A22 22 0 1 1 28 60 Q28 44 50 14Z" fill="#9EDBFF" ${st()}/>` + shine(40, 50, 5, 9, 20) + face(50, 64, 0.9);
  A['drinks-2'] = () => shadow(34) +
    `<path d="M16 50 L84 50 L74 84 Q50 90 26 84Z" fill="#FF9EB5" ${st()}/>` +
    `<ellipse cx="50" cy="50" rx="34" ry="9" fill="#FFFDF7" ${st()}/>` + pawPrint(50, 72, 1.3, '#fff') + shine(32, 47, 6, 2, 0);
  A['drinks-3'] = () => shadow(26) +
    `<path d="M26 46 L74 46 L70 84 Q50 90 30 84Z" fill="#F3E7DA" ${st()}/>` +
    `<path d="M72 54 q14 0 12 12 q-2 10 -14 8" fill="none" ${st(4)}/>` +
    `<path d="M24 48 Q20 36 32 34 Q32 20 48 22 Q56 12 66 22 Q80 24 76 38 Q82 46 74 48Z" fill="#FFFFFF" ${st()}/>` +
    `<path d="M30 34 L28 20 L40 28Z M68 34 L72 20 L60 28Z" fill="#E9AE6E" ${st(2)}/>` +
    `<circle cx="50" cy="26" r="2.5" fill="#B07A4F"/><circle cx="42" cy="32" r="2" fill="#B07A4F"/><circle cx="60" cy="31" r="2" fill="#B07A4F"/>` +
    face(50, 66, 0.85);
  A['drinks-4'] = () => shadow(32) +
    `<path d="M18 44 Q18 86 50 86 Q82 86 82 44Z" fill="#FFF6E8" ${st()}/>` +
    `<ellipse cx="50" cy="44" rx="32" ry="8" fill="#8DCB72" ${st()}/>` +
    `<path d="M52 30 Q66 18 74 28 Q64 38 52 30Z" fill="#7FCB8A" ${st(2.5)}/><path d="M54 30 L70 26" stroke="#4E9A5C" stroke-width="1.5"/>` +
    `<path d="M40 30 q-4 -6 0 -10 M48 26 q-4 -6 0 -10" fill="none" stroke="#C8B6D8" stroke-width="2.5" stroke-linecap="round"/>` +
    shine(28, 56, 4, 8, 10) + face(50, 66, 0.85);
  A['drinks-5'] = () => shadow(22) +
    `<path d="M30 34 L70 34 L64 88 L36 88Z" fill="#E7C29B" ${st()}/>` +
    `<path d="M28 34 Q28 18 50 18 Q72 18 72 34Z" fill="#E9F6FF" ${st()}/>` +
    `<path d="M56 22 L64 2" ${st(6)}/><path d="M56 22 L64 2" stroke="#FF8FB1" stroke-width="3" stroke-linecap="round"/>` +
    [[42, 80], [50, 82], [58, 79], [46, 74], [55, 73]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#5E4650"/>`).join('') +
    shine(38, 44, 3, 8, 5) + face(50, 56, 0.85);
  A['drinks-6'] = () => shadow(22) +
    `<path d="M30 40 L70 40 L62 86 L38 86Z" fill="#FFB8D2" ${st()}/>` +
    `<path d="M26 42 Q22 30 34 28 Q36 16 50 18 Q64 16 66 28 Q78 30 74 42Z" fill="#FFFFFF" ${st()}/>` +
    `<path d="M58 24 L70 0" ${st(6)}/><path d="M58 24 L70 0" stroke="#8FD3FF" stroke-width="3" stroke-linecap="round"/>` +
    `<circle cx="44" cy="16" r="6" fill="#F0506E" ${st(2.5)}/>` +
    `<path d="M32 52 L68 52" stroke="#FF8FB1" stroke-width="3"/>` + shine(38, 62, 3, 7, 5) + face(50, 66, 0.85);
  A['drinks-7'] = () => shadow(26) +
    `<path d="M24 52 Q24 74 50 74 Q76 74 76 52Z" fill="#E9F6FF" ${st()}/><path d="M46 74 L44 86 L56 86 L54 74" fill="#E9F6FF" ${st()}/><ellipse cx="50" cy="88" rx="16" ry="4" fill="#E9F6FF" ${st(2.5)}/>` +
    `<circle cx="36" cy="46" r="13" fill="#FFF1C9" ${st()}/><circle cx="64" cy="46" r="13" fill="#B9E7C8" ${st()}/><circle cx="50" cy="34" r="14" fill="#FFB8D2" ${st()}/>` +
    `<circle cx="50" cy="16" r="6" fill="#F0506E" ${st(2.5)}/>` + face(50, 36, 0.7) + shine(42, 26, 4, 2);
  A['drinks-8'] = () => shadow(30) +
    `<path d="M22 44 Q14 86 50 86 Q86 86 78 44Z" fill="#F7C34B" ${st()}/>` +
    `<rect x="24" y="32" width="52" height="14" rx="7" fill="#FFE08A" ${st()}/>` +
    `<path d="M28 46 Q28 58 34 56 Q36 64 42 54 Q48 60 52 50" fill="#FFCF52" ${st(2)}/>` +
    `<path d="M40 30 L40 22 M40 22 Q50 16 60 22" fill="none" ${st(3)}/>` +
    shine(32, 62, 4, 9, 10) + face(54, 66, 0.9) + sparkle(84, 26, 0.9) + sparkle(16, 34, 0.7);

  /* ---------- Toys ---------- */
  A['toys-1'] = () => shadow(32) +
    `<path d="M18 64 Q34 30 50 50 Q66 70 82 36" fill="none" ${st(16)}/><path d="M18 64 Q34 30 50 50 Q66 70 82 36" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>` +
    `<path d="M18 64 Q34 30 50 50 Q66 70 82 36" fill="none" stroke="#FF8FB1" stroke-width="10" stroke-dasharray="6 6" stroke-linecap="butt"/>` +
    `<circle cx="18" cy="66" r="10" fill="#8FD3FF" ${st()}/><circle cx="82" cy="34" r="10" fill="#8FD3FF" ${st()}/>`;
  A['toys-2'] = () => shadow(28) +
    `<circle cx="50" cy="52" r="32" fill="#DDF26B" ${st()}/>` +
    `<path d="M22 36 Q42 52 22 70 M78 36 Q58 52 78 70" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` +
    shine(36, 32, 7, 4) + face(50, 54, 0.9);
  A['toys-3'] = () => shadow(32) +
    `<path d="M18 62 Q14 84 46 86 Q80 88 84 64 Q86 52 74 50 L40 52 Q24 48 18 62Z" fill="#FFDB4D" ${st()}/>` +
    `<circle cx="40" cy="38" r="18" fill="#FFDB4D" ${st()}/>` +
    `<path d="M20 40 Q12 38 14 46 Q20 48 24 44Z" fill="#FF9F43" ${st(2.5)}/>` +
    `<path d="M54 64 Q66 58 72 68" fill="none" stroke="#E9B830" stroke-width="3" stroke-linecap="round"/>` +
    face(40, 38, 0.75) + shine(36, 26, 5, 2.5);
  A['toys-4'] = () => shadow(36, 84) +
    `<ellipse cx="50" cy="60" rx="38" ry="20" fill="#FF9F7A" ${st()}/><ellipse cx="50" cy="56" rx="26" ry="12" fill="#FFC2A8" ${st(2.5)}/>` +
    `<path d="M12 60 Q50 92 88 60" fill="none" ${st()}/>` + shine(36, 50, 7, 2.5, -8) + face(50, 56, 0.8);
  A['toys-5'] = () => shadow(30) +
    `<circle cx="30" cy="22" r="9" fill="#D99A62" ${st()}/><circle cx="70" cy="22" r="9" fill="#D99A62" ${st()}/>` +
    `<ellipse cx="50" cy="72" rx="26" ry="18" fill="#D99A62" ${st()}/>` +
    `<circle cx="28" cy="66" r="8" fill="#D99A62" ${st()}/><circle cx="72" cy="66" r="8" fill="#D99A62" ${st()}/>` +
    `<circle cx="50" cy="38" r="23" fill="#E3AA72" ${st()}/><circle cx="30" cy="22" r="4" fill="#F7D3B0"/><circle cx="70" cy="22" r="4" fill="#F7D3B0"/>` +
    `<ellipse cx="50" cy="46" rx="9" ry="6.5" fill="#F7D3B0" ${st(2)}/><ellipse cx="50" cy="43.5" rx="3" ry="2" fill="${O}"/>` +
    `<ellipse cx="50" cy="74" rx="12" ry="9" fill="#F7D3B0"/><path d="M40 60 L50 66 L60 60 L56 70 L50 66 L44 70Z" fill="#FF8FB1" ${st(1.8)}/>` +
    face(50, 37, 0.75).replace(/<path d="M[^"]*q[^"]*q[^"]*"[^>]*\/>$/, '');
  A['toys-6'] = () => shadow(18) +
    `<path d="M50 10 L80 42 L50 76 L20 42Z" fill="#8FD3FF" ${st()}/>` +
    `<path d="M50 10 L50 76 M20 42 L80 42" stroke="${O}" stroke-width="2" opacity=".5"/>` +
    `<path d="M50 10 L80 42 L50 42Z M50 42 L20 42 L50 76Z" fill="#FFB3CF" opacity=".9"/>` +
    `<path d="M50 76 Q42 84 52 88 Q60 92 50 98" fill="none" ${st(2.5)}/>` +
    `<path d="M46 84 l-6 -3 0 6Z M54 92 l6 -3 0 6Z" fill="#FFDB4D" ${st(1.8)}/>` + face(50, 42, 0.8);
  A['toys-7'] = () => shadow(36) +
    `<rect x="14" y="44" width="58" height="30" rx="10" fill="#FF8FA3" ${st()}/>` +
    `<rect x="50" y="24" width="30" height="50" rx="9" fill="#FFB3C1" ${st()}/><rect x="56" y="30" width="18" height="14" rx="5" fill="#E9F6FF" ${st(2.5)}/>` +
    `<path d="M22 44 L20 28 L36 28 L34 44" fill="#8FD3FF" ${st()}/><rect x="16" y="22" width="24" height="8" rx="4" fill="#8FD3FF" ${st(2.5)}/>` +
    [28, 52, 72].map((x) => `<circle cx="${x}" cy="78" r="9" fill="#FFDB4D" ${st()}/><circle cx="${x}" cy="78" r="3" fill="${O}"/>`).join('') +
    face(36, 58, 0.75);
  A['toys-8'] = () => shadow(22) +
    `<path d="M50 6 Q72 24 70 62 L30 62 Q28 24 50 6Z" fill="#F5F0FF" ${st()}/>` +
    `<path d="M50 6 Q62 14 66 26 L34 26 Q38 14 50 6Z" fill="#FF8FB1" ${st(2.5)}/>` +
    `<path d="M30 48 L16 70 L30 66Z M70 48 L84 70 L70 66Z" fill="#8FD3FF" ${st()}/>` +
    `<path d="M38 64 Q40 82 50 92 Q60 82 62 64Z" fill="#FFB547" ${st(2.5)}/><path d="M44 64 Q46 76 50 82 Q54 76 56 64Z" fill="#FFE27A"/>` +
    `<circle cx="50" cy="40" r="9" fill="#9EDBFF" ${st(2.5)}/>` + face(50, 52, 0.7) + shine(42, 20, 3, 6, 10);

  /* ---------- Comfort ---------- */
  A['comfort-1'] = () => shadow(24) +
    `<rect x="28" y="14" width="44" height="10" rx="4" fill="#E3B98A" ${st()}/><rect x="28" y="76" width="44" height="10" rx="4" fill="#E3B98A" ${st()}/>` +
    `<rect x="32" y="24" width="36" height="52" fill="#B79CF2" ${st()}/>` +
    `<path d="M32 34 L68 30 M32 44 L68 40 M32 54 L68 50 M32 64 L68 60" stroke="#9A7EE0" stroke-width="2.5"/>` +
    `<path d="M68 56 Q86 60 82 78 Q80 88 70 90" fill="none" stroke="#B79CF2" stroke-width="3" stroke-linecap="round"/>` + face(50, 50, 0.8);
  A['comfort-2'] = () => shadow(30) +
    `<circle cx="50" cy="52" r="32" fill="#FF9EC1" ${st()}/>` +
    `<path d="M24 38 Q50 30 70 68 M30 72 Q40 40 78 42 M40 22 Q30 56 52 84" fill="none" stroke="#E9709B" stroke-width="2.5" stroke-linecap="round"/>` +
    `<path d="M80 60 Q94 70 86 84 Q80 92 90 96" fill="none" ${st(3)}/>` + shine(34, 34, 6, 3) + face(50, 56, 0.85);
  A['comfort-3'] = () => shadow(30) +
    `<path d="M30 12 L56 12 L56 54 Q76 56 80 70 Q82 86 64 86 L36 86 Q26 86 28 74Z" fill="#8FD3FF" ${st()}/>` +
    `<rect x="28" y="12" width="30" height="12" fill="#FFFFFF" ${st(2.5)}/>` +
    `<path d="M29 36 L56 36 M29 48 L56 48" stroke="#FF8FB1" stroke-width="5"/><path d="M62 86 Q68 74 80 74" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>` +
    face(43, 64, 0.8);
  A['comfort-4'] = () => shadow(30) +
    `<path d="M30 56 L22 88 L36 90 L42 60Z M42 58 L44 90 L58 88 L52 58Z" fill="#FF8FA3" ${st()}/>` +
    `<path d="M28 76 L39 78 M43 78 L56 76" stroke="#FFFFFF" stroke-width="3.5"/>` +
    `<path d="M22 88 l-1 6 M27 89 l-1 6 M32 90 l-1 6 M46 90 l0 6 M51 89 l1 6 M56 88 l1 6" ${st(2)}/>` +
    `<path d="M20 26 Q50 70 80 26" fill="none" stroke="${O}" stroke-width="22" stroke-linecap="round"/>` +
    `<path d="M20 26 Q50 70 80 26" fill="none" stroke="#FF8FA3" stroke-width="16" stroke-linecap="round"/>` +
    `<path d="M26 32 Q50 62 74 32" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round" opacity=".9"/>` +
    face(62, 40, 0.65);
  A['comfort-5'] = () => shadow(32) +
    `<path d="M34 18 Q50 26 66 18 L86 30 L80 48 L70 44 L70 84 L30 84 L30 44 L20 48 L14 30Z" fill="#B9E7C8" ${st()}/>` +
    `<path d="M34 18 Q50 30 66 18" fill="none" ${st(2.5)}/><path d="M30 76 L70 76" stroke="#8FD0A6" stroke-width="4"/>` +
    `<path d="M50 62 q-10 -8 -6 -13 q4 -4 6 1 q2 -5 6 -1 q4 5 -6 13Z" fill="#FF8FB1" ${st(2)}/>` + face(50, 40, 0.75);
  A['comfort-6'] = () => shadow(30) +
    `<path d="M50 10 Q74 10 74 34 L82 82 Q50 90 18 82 L26 34 Q26 10 50 10Z" fill="#FFD84D" ${st()}/>` +
    `<path d="M34 34 Q34 22 50 22 Q66 22 66 34 Q66 46 50 46 Q34 46 34 34Z" fill="#FFF3C4" ${st(2.5)}/>` +
    `<path d="M50 46 L50 86" ${st(2.5)}/>` + [56, 68, 80].map((y) => `<circle cx="56" cy="${y}" r="2.8" fill="#8FD3FF" ${st(1.5)}/>`).join('') +
    face(50, 35, 0.6) + shine(32, 56, 3, 9, 10);
  A['comfort-7'] = () => shadow(38) +
    `<rect x="18" y="30" width="64" height="34" rx="14" fill="#B79CF2" ${st()}/>` +
    `<rect x="8" y="46" width="20" height="30" rx="10" fill="#C9B4F7" ${st()}/><rect x="72" y="46" width="20" height="30" rx="10" fill="#C9B4F7" ${st()}/>` +
    `<rect x="22" y="56" width="56" height="22" rx="10" fill="#D8C9FA" ${st()}/><path d="M50 58 L50 76" stroke="#B79CF2" stroke-width="2.5"/>` +
    `<path d="M20 78 L20 86 M80 78 L80 86" ${st(4)}/><rect x="56" y="36" width="18" height="16" rx="7" fill="#FFB3CF" ${st(2.5)}/>` +
    face(42, 44, 0.8);
  A['comfort-8'] = () => shadow(34) +
    `<path d="M16 76 L12 32 L32 50 L50 22 L68 50 L88 32 L84 76Z" fill="#FFD84D" ${st()}/>` +
    `<rect x="16" y="70" width="68" height="14" rx="6" fill="#FFC23D" ${st()}/>` +
    `<circle cx="12" cy="30" r="5" fill="#FF8FB1" ${st(2)}/><circle cx="50" cy="19" r="5.5" fill="#8FD3FF" ${st(2)}/><circle cx="88" cy="30" r="5" fill="#B9E7C8" ${st(2)}/>` +
    `<circle cx="34" cy="77" r="3" fill="#FF8FB1"/><circle cx="50" cy="77" r="3" fill="#8FD3FF"/><circle cx="66" cy="77" r="3" fill="#B79CF2"/>` +
    face(50, 56, 0.85) + sparkle(86, 12, 0.7);

  /* ---------- Garden ---------- */
  A['garden-1'] = () => shadow(20) +
    `<path d="M50 20 Q74 34 70 62 Q66 84 50 84 Q34 84 30 62 Q26 34 50 20Z" fill="#C98A5A" ${st()}/>` +
    `<path d="M50 22 Q46 30 50 38" fill="none" stroke="#9C6239" stroke-width="2.5" stroke-linecap="round"/>` + shine(40, 44, 4, 8, 15) + face(50, 62, 0.85);
  A['garden-2'] = () => shadow(26) +
    `<path d="M20 86 Q22 66 50 66 Q78 66 80 86Z" fill="#B98763" ${st()}/>` +
    `<path d="M50 68 Q48 52 50 40" fill="none" stroke="#5FAE6E" stroke-width="5" stroke-linecap="round"/><path d="M50 68 Q48 52 50 40" fill="none" ${st(1.5)} opacity=".6"/>` +
    `<path d="M50 42 Q30 46 22 30 Q38 20 50 40Z" fill="#8EDB8F" ${st()}/><path d="M50 40 Q66 20 82 26 Q76 46 50 42Z" fill="#8EDB8F" ${st()}/>` +
    face(50, 78, 0.75);
  A['garden-3'] = () => shadow(20) +
    `<path d="M50 60 Q48 78 50 92" fill="none" stroke="#5FAE6E" stroke-width="5" stroke-linecap="round"/>` +
    [...Array(8)].map((_, k) => { const a = k * 45; return `<ellipse cx="50" cy="22" rx="9" ry="15" transform="rotate(${a} 50 40)" fill="#FFFFFF" ${st(2.5)}/>`; }).join('') +
    `<circle cx="50" cy="40" r="14" fill="#FFD84D" ${st()}/>` + face(50, 40, 0.7);
  A['garden-4'] = () => shadow(18) +
    `<path d="M50 54 L50 92" stroke="#5FAE6E" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M50 84 Q30 82 26 60 Q44 64 50 80Z M50 78 Q70 74 74 56 Q56 60 50 74Z" fill="#8EDB8F" ${st(2.5)}/>` +
    `<path d="M28 22 L38 32 L50 14 L62 32 L72 22 Q76 58 50 58 Q24 58 28 22Z" fill="#FF8FB1" ${st()}/>` +
    shine(38, 36, 3, 7, 10) + face(50, 42, 0.8);
  A['garden-5'] = () => shadow(26) +
    `<path d="M32 50 L68 50 L56 92 L44 92Z" fill="#FFE6B8" ${st()}/><path d="M38 66 L62 66" stroke="#FF8FB1" stroke-width="5"/>` +
    `<path d="M50 50 L50 40 M50 50 L32 32 M50 50 L68 32" stroke="#5FAE6E" stroke-width="3.5" stroke-linecap="round"/>` +
    `<circle cx="30" cy="30" r="12" fill="#FF9EC1" ${st()}/><circle cx="70" cy="30" r="12" fill="#B79CF2" ${st()}/><circle cx="50" cy="24" r="14" fill="#FFD84D" ${st()}/>` +
    `<circle cx="30" cy="30" r="4" fill="#FFE27A"/><circle cx="70" cy="30" r="4" fill="#FFE27A"/>` + face(50, 24, 0.7) +
    `<path d="M50 66 l-6 -4 0 8Z M50 66 l6 -4 0 8Z" fill="#FF8FB1" ${st(1.8)}/>`;
  A['garden-6'] = () => shadow(26) +
    `<path d="M50 54 Q34 30 18 34 Q24 54 50 56Z M50 54 Q66 30 82 34 Q76 54 50 56Z M50 52 Q40 22 50 10 Q60 22 50 52Z" fill="#8EDB8F" ${st()}/>` +
    `<path d="M26 54 L74 54 L68 88 L32 88Z" fill="#E78F63" ${st()}/><rect x="22" y="50" width="56" height="12" rx="5" fill="#F0A57E" ${st()}/>` +
    face(50, 74, 0.8);
  A['garden-7'] = () => shadow(30) +
    `<path d="M44 60 L42 88 L58 88 L56 60Z" fill="#B98763" ${st()}/>` +
    `<path d="M50 10 Q70 8 74 24 Q90 28 86 46 Q90 64 70 66 Q60 74 50 68 Q40 74 30 66 Q10 64 14 46 Q10 28 26 24 Q30 8 50 10Z" fill="#7FCB8A" ${st()}/>` +
    `<circle cx="32" cy="34" r="3.5" fill="#FF8FB1"/><circle cx="70" cy="30" r="3.5" fill="#FF8FB1"/><circle cx="74" cy="54" r="3.5" fill="#FF8FB1"/>` +
    shine(34, 22, 7, 3.5) + face(50, 44, 0.9);
  A['garden-8'] = () => shadow(38) +
    `<path d="M10 72 Q10 88 50 88 Q90 88 90 72Z" fill="#DCD6EA" ${st()}/><ellipse cx="50" cy="72" rx="40" ry="9" fill="#9EDBFF" ${st()}/>` +
    `<rect x="44" y="40" width="12" height="32" fill="#DCD6EA" ${st()}/>` +
    `<path d="M28 42 Q28 52 50 52 Q72 52 72 42Z" fill="#DCD6EA" ${st()}/><ellipse cx="50" cy="42" rx="22" ry="5" fill="#9EDBFF" ${st(2.5)}/>` +
    `<path d="M50 38 Q50 18 50 12 M50 22 Q34 16 26 40 M50 22 Q66 16 74 40 M30 46 Q18 50 16 68 M70 46 Q82 50 84 68" fill="none" stroke="#9EDBFF" stroke-width="4" stroke-linecap="round"/>` +
    `<circle cx="50" cy="12" r="4" fill="#9EDBFF" ${st(1.8)}/>` + face(50, 80, 0.8) + sparkle(82, 16, 0.7, '#E9F6FF');

  /* ---------- Treat boxes (generators) ---------- */
  A['gen-bakery'] = () => shadow(32) +
    `<path d="M24 30 L76 30 Q86 34 84 56 L82 80 Q80 90 50 90 Q20 90 18 80 L16 56 Q14 34 24 30Z" fill="#E9F6FF" ${st()}/>` +
    `<circle cx="36" cy="72" r="10" fill="#E9AE6E" ${st(2.5)}/><circle cx="60" cy="70" r="11" fill="#E9AE6E" ${st(2.5)}/><circle cx="48" cy="54" r="10" fill="#E9AE6E" ${st(2.5)}/>` +
    pawPrint(60, 71, 0.7, '#8A5638') + pawPrint(36, 73, 0.6, '#8A5638') +
    `<rect x="20" y="18" width="60" height="14" rx="7" fill="#FF8FB1" ${st()}/><rect x="40" y="8" width="20" height="12" rx="6" fill="#FFB3CF" ${st()}/>` +
    shine(26, 44, 3.5, 9, 10);
  A['gen-drinks'] = () => shadow(36) +
    `<path d="M78 46 Q94 36 92 26" fill="none" ${st(8)}/><path d="M78 46 Q94 36 92 26" fill="none" stroke="#8FD3FF" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M22 46 Q4 46 10 62 Q14 70 22 66" fill="none" ${st(7)}/>` +
    `<ellipse cx="50" cy="60" rx="32" ry="28" fill="#8FD3FF" ${st()}/>` +
    `<path d="M30 36 Q50 22 70 36Z" fill="#B3E2FF" ${st()}/><circle cx="50" cy="24" r="6" fill="#FF8FB1" ${st(2.5)}/>` +
    `<path d="M22 62 Q50 70 78 62" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>` +
    shine(34, 48, 6, 3) + face(50, 70, 0.95);
  A['gen-toys'] = () => shadow(36) +
    `<circle cx="38" cy="38" r="14" fill="#DDF26B" ${st()}/><path d="M28 30 Q38 38 28 48" fill="none" stroke="#fff" stroke-width="3"/>` +
    `<path d="M56 46 L66 16 L76 46" fill="#FF8FB1" ${st()}/>` +
    `<path d="M18 46 L82 46 L76 86 Q50 92 24 86Z" fill="#E3B57E" ${st()}/>` +
    `<path d="M22 58 L78 58 M24 70 L76 70" stroke="#C9965C" stroke-width="3"/><path d="M36 48 L34 86 M50 48 L50 88 M64 48 L66 86" stroke="#C9965C" stroke-width="3"/>` +
    `<path d="M24 46 Q50 14 76 46" fill="none" ${st(4)}/>`;
  A['gen-comfort'] = () => shadow(36) +
    `<path d="M14 26 L86 26 L80 8 L20 8Z" fill="#FFB3CF" ${st()}/>` +
    `<rect x="14" y="40" width="72" height="46" rx="10" fill="#FF8FB1" ${st()}/>` +
    `<circle cx="34" cy="38" r="10" fill="#B79CF2" ${st(2.5)}/><circle cx="58" cy="38" r="9" fill="#8FD3FF" ${st(2.5)}/>` +
    `<path d="M68 22 L80 46" ${st(3)}/><circle cx="68" cy="22" r="3" fill="none" ${st(2)}/>` +
    `<rect x="40" y="58" width="20" height="8" rx="4" fill="#FFE27A" ${st(2)}/>`;
  A['gen-garden'] = () => shadow(30) +
    `<path d="M50 50 L50 26" stroke="#5FAE6E" stroke-width="4"/><path d="M50 40 Q36 38 32 26 Q46 26 50 38Z" fill="#8EDB8F" ${st(2)}/>` +
    `<circle cx="56" cy="16" r="9" fill="#FFD84D" ${st()}/>` +
    `<path d="M22 50 L78 50 L70 88 L30 88Z" fill="#E78F63" ${st()}/><rect x="18" y="44" width="64" height="12" rx="5" fill="#F0A57E" ${st()}/>` +
    `<path d="M36 64 Q50 72 64 64" fill="none" stroke="#C9714A" stroke-width="3" stroke-linecap="round"/>`;

  /* ---------- Helpers & specials ---------- */
  A['paw'] = () => shadow(28) + pawPrint(50, 58, 4, '#FFC2D1').replace(/fill="#FFC2D1"/g, `fill="#FFC2D1" ${st()}`) + face(50, 66, 0.8) + shine(36, 58, 4, 2.5);
  A['paw-2'] = () => A['paw']() + sparkle(82, 22, 0.8);
  A['paw-3'] = () => A['paw']() + sparkle(82, 22, 0.8) + sparkle(18, 26, 0.6);
  A['paw-4'] = () => A['paw']().replace(/#FFC2D1/g, '#FFD84D') + sparkle(82, 22, 0.9) + sparkle(18, 26, 0.7) + sparkle(80, 80, 0.5);
  A['coin'] = () => shadow(26) +
    `<circle cx="50" cy="52" r="32" fill="#FFC93D" ${st()}/><circle cx="50" cy="52" r="24" fill="#FFDB6E" stroke="#E9A92A" stroke-width="2.5"/>` +
    pawPrint(50, 54, 1.7, '#E9A92A') + shine(34, 34, 6, 3);
  A['coin-2'] = () => A['coin']() + sparkle(82, 20, 0.8);
  A['coin-3'] = () => shadow(30) +
    `<path d="M36 30 Q20 46 20 66 Q20 88 50 88 Q80 88 80 66 Q80 46 64 30Z" fill="#E3B57E" ${st()}/>` +
    `<path d="M34 30 L66 30 L72 18 Q60 22 50 14 Q40 22 28 18Z" fill="#E3B57E" ${st()}/><rect x="32" y="26" width="36" height="8" rx="4" fill="#FF8FB1" ${st(2.5)}/>` +
    `<circle cx="50" cy="64" r="11" fill="#FFC93D" ${st(2.5)}/>` + pawPrint(50, 65, 0.8, '#E9A92A');
  A['coin-4'] = () => A['coin-3']() + sparkle(82, 20, 0.9) + sparkle(16, 34, 0.7);
  A['gift'] = () => shadow(32) +
    `<rect x="18" y="42" width="64" height="44" rx="8" fill="#FF9EC1" ${st()}/><rect x="14" y="32" width="72" height="16" rx="7" fill="#FFB8D2" ${st()}/>` +
    `<rect x="44" y="32" width="12" height="54" fill="#FFE27A" ${st(2.5)}/>` +
    `<path d="M50 32 Q34 12 28 22 Q26 32 50 32Z M50 32 Q66 12 72 22 Q74 32 50 32Z" fill="#FFE27A" ${st(2.5)}/>` +
    face(32, 66, 0.7) + sparkle(84, 18, 0.7);
  A['pillow'] = () =>
    `<path d="M14 30 Q14 18 26 20 Q50 26 74 20 Q86 18 86 30 Q82 50 86 70 Q86 82 74 80 Q50 74 26 80 Q14 82 14 70 Q18 50 14 30Z" fill="#E7E0F5" stroke="#B9AECF" stroke-width="3" stroke-linejoin="round"/>` +
    face(50, 52, 0.9, 'sleep').replace(/#5E4650/g, '#9A8DB5') +
    `<text x="68" y="34" font-size="14" font-weight="800" font-family="sans-serif" fill="#A99BC8">z</text><text x="77" y="24" font-size="10" font-weight="800" font-family="sans-serif" fill="#A99BC8">z</text>`;
  A['star'] = () =>
    `<path d="M50 8 L61 34 L89 36 L67 54 L74 82 L50 67 L26 82 L33 54 L11 36 L39 34Z" fill="#FFD84D" ${st()}/>` + face(50, 48, 0.85) + shine(40, 30, 4, 2.5);
  A['house'] = () =>
    `<path d="M14 48 L50 16 L86 48" fill="none" ${st(5)}/><path d="M22 44 L22 84 L78 84 L78 44 L50 20Z" fill="#FFC9A8" ${st()}/>` +
    `<path d="M42 84 L42 64 Q50 56 58 64 L58 84" fill="#FF8FB1" ${st(2.5)}/>` + face(50, 44, 0.8);
  A['book'] = () =>
    `<path d="M50 24 Q34 14 12 20 L12 80 Q34 74 50 84 Q66 74 88 80 L88 20 Q66 14 50 24Z" fill="#FFB3CF" ${st()}/>` +
    `<path d="M50 24 Q36 18 18 24 L18 74 Q36 70 50 78Z M50 24 Q64 18 82 24 L82 74 Q64 70 50 78Z" fill="#FFF6EC" ${st(2.5)}/>` +
    pawPrint(33, 50, 0.8, '#E9AE6E') + pawPrint(67, 50, 0.8, '#E9AE6E');
  A['gear'] = () =>
    [...Array(8)].map((_, k) => `<rect x="44" y="8" width="12" height="18" rx="4" transform="rotate(${k * 45} 50 50)" fill="#C9B4F7" ${st(2.5)}/>`).join('') +
    `<circle cx="50" cy="50" r="28" fill="#C9B4F7" ${st()}/>` + face(50, 50, 0.85);
  A['cupcake-nav'] = A['bakery-6'];

  // Build one hidden <svg> sprite so every tile can reuse a drawing with <use>.
  function sprite() {
    return `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0" aria-hidden="true">` +
      `<defs><radialGradient id="plushShade" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#5E4650" stop-opacity=".16"/></radialGradient></defs>` +
      Object.keys(A).map((k) => `<symbol id="p-${k}" viewBox="0 0 100 100" overflow="visible">${A[k]()}</symbol>`).join('') + `</svg>`;
  }
  const use = (key, cls = 'plush') => `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><use href="#p-${key}"/></svg>`;
  return { sprite, use, keys: () => Object.keys(A) };
})();
