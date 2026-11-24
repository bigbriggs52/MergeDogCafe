// Pup Café: original squishy dog art, drawn as SVG
'use strict';

const BREEDS = {
  shiba:      { body: '#EFA65E', belly: '#FFF4E0', ear: 'pointy', earIn: '#FFF4E0', mask: 'shiba', tail: 'curl', brows: '#FFF4E0', label: 'Shiba Inu' },
  pug:        { body: '#EED3AA', belly: '#F8E6C8', ear: 'fold', earColor: '#4B3A34', mask: 'pug', label: 'Pug' },
  corgi:      { body: '#F3A35B', belly: '#FFF6EA', ear: 'big', earIn: '#FFD9C0', mask: 'blaze', label: 'Corgi' },
  golden:     { body: '#F5C878', belly: '#FBE3B5', ear: 'floppy', earColor: '#E3A94F', label: 'Golden Retriever' },
  dachshund:  { body: '#A86241', belly: '#C98A63', ear: 'longfloppy', earColor: '#7E4529', wide: true, label: 'Dachshund' },
  pomeranian: { body: '#F7B76D', belly: '#FFE2BA', ear: 'pointy', earIn: '#FFE2BA', fluff: true, label: 'Pomeranian' },
  beagle:     { body: '#FFF8EE', belly: '#FFFFFF', ear: 'floppy', earColor: '#A8673C', saddle: '#C27B45', label: 'Beagle' },
  frenchie:   { body: '#DCD4CB', belly: '#F1ECE6', ear: 'bat', earIn: '#F4C9C9', label: 'French Bulldog' },
  husky:      { body: '#8E9BAE', belly: '#FFFFFF', ear: 'pointy', earIn: '#FFFFFF', mask: 'husky', label: 'Husky' },
  poodle:     { body: '#F6E4EA', belly: '#FFF5F8', ear: 'curly', earColor: '#EBCAD6', topknot: '#EBCAD6', label: 'Poodle' },
  dalmatian:  { body: '#FFFFFF', belly: '#FFFFFF', ear: 'floppy', earColor: '#3B3B44', spots: '#3B3B44', label: 'Dalmatian' },
  shihtzu:    { body: '#F5E4C8', belly: '#FFF6E6', ear: 'longfloppy', earColor: '#B98A5E', bow: '#FF8FB8', label: 'Shih Tzu' },
  collie:     { body: '#3E3A45', belly: '#FFFFFF', ear: 'fold', earColor: '#3E3A45', mask: 'blaze', label: 'Border Collie' },
  samoyed:    { body: '#FFFFFF', belly: '#FFFFFF', ear: 'pointy', earIn: '#FFE3EA', fluff: true, label: 'Samoyed' },
  bernese:    { body: '#38343C', belly: '#FFFFFF', ear: 'floppy', earColor: '#38343C', mask: 'blaze', cheeks: '#C8743F', label: 'Bernese Mountain Dog' },
  chihuahua:  { body: '#EBC79A', belly: '#FBE7CB', ear: 'huge', earIn: '#F8C9C0', label: 'Chihuahua' },
  greyhound:  { body: '#BDB7CE', belly: '#E6E2F0', ear: 'fold', earColor: '#A39CBA', tall: true, label: 'Greyhound' },
  bulldog:    { body: '#E7C9A4', belly: '#FFFFFF', ear: 'fold', earColor: '#C89F78', mask: 'jowls', label: 'Bulldog' },
  labrador:   { body: '#9A6444', belly: '#B98262', ear: 'floppy', earColor: '#7E4E33', label: 'Labrador' },
  cavalier:   { body: '#FFF8EE', belly: '#FFFFFF', ear: 'longfloppy', earColor: '#C9733F', saddle: '#D98A52', label: 'Cavalier King Charles' },
  westie:     { body: '#FFFDF5', belly: '#FFFFFF', ear: 'pointy', earIn: '#FFC9D6', label: 'Westie' },
  cockapoo:   { body: '#F2C79A', belly: '#FBE3C8', ear: 'curly', earColor: '#E3AE7A', topknot: '#E3AE7A', label: 'Cockapoo' },
  aussie:     { body: '#C9CED8', belly: '#FFFFFF', ear: 'fold', earColor: '#7B8094', spots: '#7B8094', mask: 'blaze', label: 'Australian Shepherd' },
  basset:     { body: '#FFF8EE', belly: '#FFFFFF', ear: 'longfloppy', earColor: '#8A5A3A', saddle: '#C27B45', wide: true, label: 'Basset Hound' },
  maltese:    { body: '#FFFDF8', belly: '#FFFFFF', ear: 'longfloppy', earColor: '#F1EBE2', bow: '#B79CF2', label: 'Maltese' },
  boxer:      { body: '#D98E52', belly: '#FFF6EA', ear: 'fold', earColor: '#B8703C', mask: 'blaze', label: 'Boxer' },
  mystery:    { body: '#CFE8E0', belly: '#FFF2FA', ear: 'pointy', earIn: '#F7C8E0', spots: '#F4B6D2', sparkle: true, label: 'Mystery Pup' },
};

function dogSVG(breedId, opts = {}) {
  const b = BREEDS[breedId] || BREEDS.shiba;
  const sil = opts.silhouette;
  const C = (c) => (sil ? '#C9BFD6' : c);
  const line = sil ? '#B3A8C4' : '#5B4A52';
  const rx = b.wide ? 44 : b.tall ? 33 : 39;
  const ry = b.tall ? 40 : b.wide ? 32 : 35;
  const cy = 60;
  let back = '', front = '', face = '';

  // Tail
  if (b.tail === 'curl') back += `<path d="M84 62 q14 -6 8 -20 q-6 -8 -12 2" fill="none" stroke="${C(b.body)}" stroke-width="9" stroke-linecap="round"/>`;

  // Ears behind body
  const tri = (pts, fill, inner, innerPts) =>
    `<path d="M${pts}Z" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>` +
    (inner && !sil ? `<path d="M${innerPts}Z" fill="${inner}"/>` : '');
  if (b.ear === 'pointy') {
    back += tri('20 44 L24 12 L46 30', C(b.body), b.earIn, '26 38 L27 20 L40 31');
    back += tri('80 44 L76 12 L54 30', C(b.body), b.earIn, '74 38 L73 20 L60 31');
  } else if (b.ear === 'big') {
    back += tri('16 44 L18 6 L46 28', C(b.body), b.earIn, '23 38 L23 15 L39 29');
    back += tri('84 44 L82 6 L54 28', C(b.body), b.earIn, '77 38 L77 15 L61 29');
  } else if (b.ear === 'bat') {
    back += `<path d="M18 42 Q10 8 26 10 Q40 14 44 30Z" fill="${C(b.body)}" stroke="${line}" stroke-width="2"/>`;
    back += `<path d="M82 42 Q90 8 74 10 Q60 14 56 30Z" fill="${C(b.body)}" stroke="${line}" stroke-width="2"/>`;
    if (!sil) back += `<path d="M24 36 Q20 16 28 16 Q36 19 38 30Z" fill="${b.earIn}"/><path d="M76 36 Q80 16 72 16 Q64 19 62 30Z" fill="${b.earIn}"/>`;
  } else if (b.ear === 'huge') {
    back += tri('22 46 L2 4 L46 26', C(b.body), b.earIn, '24 40 L10 13 L38 28');
    back += tri('78 46 L98 4 L54 26', C(b.body), b.earIn, '76 40 L90 13 L62 28');
  }

  // Fluff ring
  if (b.fluff) {
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      back += `<circle cx="${50 + Math.cos(a) * (rx - 2)}" cy="${cy + Math.sin(a) * (ry - 2)}" r="9" fill="${C(b.body)}" stroke="${line}" stroke-width="2"/>`;
    }
  }

  // Feet
  back += `<ellipse cx="36" cy="${cy + ry - 2}" rx="9" ry="6" fill="${C(b.body)}" stroke="${line}" stroke-width="2"/>`;
  back += `<ellipse cx="64" cy="${cy + ry - 2}" rx="9" ry="6" fill="${C(b.body)}" stroke="${line}" stroke-width="2"/>`;

  // Little side paws (behind the body, so just the tips peek out)
  const armY = cy + ry * 0.38;
  back += `<ellipse cx="${50 - rx + 1}" cy="${armY}" rx="8" ry="6.5" transform="rotate(-25 ${50 - rx + 1} ${armY})" fill="${C(b.body)}" stroke="${line}" stroke-width="2"/>`;
  back += `<ellipse cx="${50 + rx - 1}" cy="${armY}" rx="8" ry="6.5" transform="rotate(25 ${50 + rx - 1} ${armY})" fill="${C(b.body)}" stroke="${line}" stroke-width="2"/>`;

  // Body
  let body = `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C(b.body)}" stroke="${line}" stroke-width="2.2"/>`;
  if (b.fluff) body = `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C(b.body)}"/>`;

  if (!sil) {
    // Belly patch
    body += `<ellipse cx="50" cy="${cy + ry * 0.45}" rx="${rx * 0.55}" ry="${ry * 0.38}" fill="${b.belly}" opacity="0.95"/>`;
    if (b.saddle) body += `<path d="M${50 - rx + 6} ${cy - 4} Q50 ${cy - ry - 4} ${50 + rx - 6} ${cy - 4} Q${50 + rx - 14} ${cy - ry + 14} 50 ${cy - ry + 10} Q${50 - rx + 14} ${cy - ry + 14} ${50 - rx + 6} ${cy - 4}Z" fill="${b.saddle}" opacity="0.9"/>`;
    if (b.mask === 'shiba') body += `<path d="M24 62 Q26 48 38 50 Q50 54 62 50 Q74 48 76 62 Q72 82 50 84 Q28 82 24 62Z" fill="${b.belly}"/>`;
    if (b.mask === 'husky') body += `<path d="M22 64 Q24 46 38 46 L50 34 L62 46 Q76 46 78 64 Q72 86 50 86 Q28 86 22 64Z" fill="${b.belly}"/>`;
    if (b.mask === 'blaze') body += `<path d="M45 ${cy - ry + 4} Q50 ${cy - ry} 55 ${cy - ry + 4} L57 56 Q66 62 64 72 Q50 82 36 72 Q34 62 43 56Z" fill="${b.belly}"/>`;
    if (b.cheeks) body += `<circle cx="28" cy="66" r="6" fill="${b.cheeks}"/><circle cx="72" cy="66" r="6" fill="${b.cheeks}"/><circle cx="36" cy="42" r="3" fill="${b.cheeks}"/><circle cx="64" cy="42" r="3" fill="${b.cheeks}"/>`;
    if (b.mask === 'pug') body += `<ellipse cx="50" cy="64" rx="17" ry="13" fill="#5A463F"/><path d="M42 38 q8 -4 16 0" fill="none" stroke="#C9A47A" stroke-width="2" stroke-linecap="round"/>`;
    if (b.mask === 'jowls') body += `<ellipse cx="41" cy="68" rx="11" ry="9" fill="${b.belly}"/><ellipse cx="59" cy="68" rx="11" ry="9" fill="${b.belly}"/>`;
    if (b.spots) {
      const sp = [[28, 40, 4], [70, 36, 3.5], [78, 70, 4], [22, 76, 3], [62, 88, 3.5], [40, 32, 2.5]];
      sp.forEach(([x, y, r]) => { body += `<circle cx="${x}" cy="${y}" r="${r}" fill="${b.spots}"/>`; });
    }
    if (b.brows) body += `<ellipse cx="38" cy="45" rx="3" ry="2" fill="${b.brows}"/><ellipse cx="62" cy="45" rx="3" ry="2" fill="${b.brows}"/>`;
  }

  // Plush shading and little front paws
  if (!sil) {
    body += `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#plushShade)"/>`;
    body += `<ellipse cx="${50 - rx * 0.42}" cy="${cy - ry * 0.5}" rx="${rx * 0.22}" ry="${ry * 0.12}" transform="rotate(-25 ${50 - rx * 0.42} ${cy - ry * 0.5})" fill="#fff" opacity=".55"/>`;
  }
  // Ears in front of body
  if (b.ear === 'floppy') {
    front += `<ellipse cx="17" cy="50" rx="9" ry="17" transform="rotate(18 17 50)" fill="${C(b.earColor)}" stroke="${line}" stroke-width="2"/>`;
    front += `<ellipse cx="83" cy="50" rx="9" ry="17" transform="rotate(-18 83 50)" fill="${C(b.earColor)}" stroke="${line}" stroke-width="2"/>`;
  } else if (b.ear === 'longfloppy') {
    front += `<ellipse cx="16" cy="56" rx="9" ry="22" transform="rotate(12 16 56)" fill="${C(b.earColor)}" stroke="${line}" stroke-width="2"/>`;
    front += `<ellipse cx="84" cy="56" rx="9" ry="22" transform="rotate(-12 84 56)" fill="${C(b.earColor)}" stroke="${line}" stroke-width="2"/>`;
  } else if (b.ear === 'fold') {
    front += `<path d="M20 36 Q22 26 40 28 Q34 40 24 46Z" fill="${C(b.earColor)}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>`;
    front += `<path d="M80 36 Q78 26 60 28 Q66 40 76 46Z" fill="${C(b.earColor)}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>`;
  } else if (b.ear === 'curly') {
    [[16, 46], [14, 58], [18, 68], [84, 46], [86, 58], [82, 68]].forEach(([x, y]) => {
      front += `<circle cx="${x}" cy="${y}" r="8" fill="${C(b.earColor)}" stroke="${line}" stroke-width="2"/>`;
    });
  }
  if (b.topknot) {
    [[40, 28], [50, 24], [60, 28], [45, 20], [55, 20]].forEach(([x, y]) => {
      front += `<circle cx="${x}" cy="${y}" r="7" fill="${C(b.topknot)}" stroke="${line}" stroke-width="2"/>`;
    });
  }
  if (b.bow && !sil) front += `<path d="M50 28 L40 22 L40 34Z M50 28 L60 22 L60 34Z" fill="${b.bow}" stroke="${line}" stroke-width="1.6" stroke-linejoin="round"/><circle cx="50" cy="28" r="3" fill="${b.bow}" stroke="${line}" stroke-width="1.5"/>`;

  // Face
  if (!sil) {
    const ey = 54;
    const happy = opts.mood === 'happy';
    const sleepy = opts.mood === 'sleepy';
    if (happy || sleepy) {
      const d = sleepy ? 'q5 3 10 0' : 'q5 -5 10 0';
      face += `<path d="M32 ${ey} ${d}" fill="none" stroke="#2E2228" stroke-width="2.6" stroke-linecap="round"/>`;
      face += `<path d="M58 ${ey} ${d}" fill="none" stroke="#2E2228" stroke-width="2.6" stroke-linecap="round"/>`;
    } else {
      face += `<ellipse cx="37" cy="${ey}" rx="5.2" ry="6" fill="#2E2228"/><ellipse cx="63" cy="${ey}" rx="5.2" ry="6" fill="#2E2228"/>`;
      face += `<circle cx="38.8" cy="${ey - 2.2}" r="2" fill="#fff"/><circle cx="64.8" cy="${ey - 2.2}" r="2" fill="#fff"/>`;
      face += `<circle cx="35.5" cy="${ey + 2}" r="0.9" fill="#fff"/><circle cx="61.5" cy="${ey + 2}" r="0.9" fill="#fff"/>`;
    }
    face += `<ellipse cx="26" cy="66" rx="6" ry="3.6" fill="#FF9DB4" opacity="0.55"/><ellipse cx="74" cy="66" rx="6" ry="3.6" fill="#FF9DB4" opacity="0.55"/>`;
    face += `<path d="M46 61 Q50 58.5 54 61 Q52 65 50 65 Q48 65 46 61Z" fill="#2E2228"/>`;
    const mouth = happy ? `<path d="M44 67 Q50 75 56 67 Q50 70 44 67Z" fill="#E86A87" stroke="#2E2228" stroke-width="1.6" stroke-linejoin="round"/>`
      : `<path d="M44 66.5 q3 3 6 0 q3 3 6 0" fill="none" stroke="#2E2228" stroke-width="1.8" stroke-linecap="round"/>`;
    face += mouth;
    if (b.sparkle) face += `<path d="M84 22 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#FFD66B"/>`;
    if (sleepy) face += `<text x="80" y="24" font-size="13" font-family="sans-serif" font-weight="700" fill="#8C7BB8">z</text><text x="88" y="14" font-size="10" font-family="sans-serif" font-weight="700" fill="#8C7BB8">z</text>`;
  } else {
    face += `<text x="50" y="70" font-size="26" text-anchor="middle" font-family="sans-serif" font-weight="800" fill="#fff">?</text>`;
  }

  return `<svg viewBox="-4 -2 108 104" class="dog-svg" aria-hidden="true">${back}${body}${front}${face}</svg>`;
}
