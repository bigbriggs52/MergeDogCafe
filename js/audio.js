// Pup Café: soft synthesized sounds and a gentle lo-fi café loop (all generated, no files)
'use strict';

const Sound = (() => {
  let ctx = null, sfxGain, musicGain, musicTimer = null, nextBar = 0, bar = 0;
  let sfxVol = 0.7, musicVol = 0.4, musicOn = true;
  const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
  const hz = (semi, base = 261.63) => base * Math.pow(2, semi / 12);

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    sfxGain = ctx.createGain(); sfxGain.gain.value = sfxVol; sfxGain.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = musicVol * 0.35; musicGain.connect(ctx.destination);
    if (musicOn) startMusic();
  }

  function tone(freq, dur, { type = 'sine', vol = 0.3, attack = 0.005, slide = 0, when = 0, dest = null } = {}) {
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq * slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || sfxGain);
    o.start(t); o.stop(t + dur + 0.05);
  }

  const sfx = {
    tap() { tone(520, 0.08, { vol: 0.12, slide: 1.4 }); },
    pop() { tone(380, 0.12, { vol: 0.18, slide: 1.8 }); },
    merge(level = 1) {
      const base = hz(PENTA[Math.min(level, PENTA.length - 1)], 392);
      tone(base * 0.6, 0.16, { vol: 0.22, slide: 1.9 });
      tone(base, 0.22, { vol: 0.16, when: 0.06, type: 'triangle' });
      tone(base * 1.5, 0.25, { vol: 0.08, when: 0.12 });
    },
    serve() { [0, 4, 7, 12].forEach((s, i) => tone(hz(s, 523.25), 0.28, { vol: 0.13, when: i * 0.08, type: 'triangle' })); },
    coin() { tone(988, 0.08, { vol: 0.1 }); tone(1319, 0.18, { vol: 0.1, when: 0.07 }); },
    boop() { tone(300, 0.14, { vol: 0.2, slide: 0.6, type: 'triangle' }); },
    snort() { tone(160, 0.1, { vol: 0.18, type: 'sawtooth', slide: 0.7 }); tone(140, 0.1, { vol: 0.14, type: 'sawtooth', slide: 0.7, when: 0.12 }); },
    nope() { tone(220, 0.14, { vol: 0.1, slide: 0.8 }); },
    nap() { [12, 7, 4, 0].forEach((s, i) => tone(hz(s, 392), 0.5, { vol: 0.08, when: i * 0.25, attack: 0.05 })); },
    tada() { [0, 4, 7, 12, 16].forEach((s, i) => tone(hz(s, 523.25), 0.4, { vol: 0.12, when: i * 0.1, type: 'triangle' })); },
  };

  // Gentle lo-fi loop: soft pad chords and sparse plucks at 68 bpm
  const CHORDS = [[5, 9, 12, 16], [4, 7, 11, 14], [2, 5, 9, 12], [0, 4, 7, 11]]; // Fmaj7 Em7 Dm7 Cmaj7
  const BAR = 60 / 68 * 4;
  function scheduleBar(t) {
    const ch = CHORDS[bar % CHORDS.length];
    ch.forEach((s) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'triangle'; o.frequency.value = hz(s - 12);
      f.type = 'lowpass'; f.frequency.value = 900;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.09, t + 0.6);
      g.gain.linearRampToValueAtTime(0.0001, t + BAR + 0.3);
      o.connect(f); f.connect(g); g.connect(musicGain);
      o.start(t); o.stop(t + BAR + 0.4);
    });
    // bass
    tone(hz(ch[0] - 24), BAR * 0.9, { vol: 0.12, attack: 0.08, when: t - ctx.currentTime, dest: musicGain });
    // plucks
    for (let i = 0; i < 8; i++) {
      if (Math.random() < 0.45) {
        const note = PENTA[Math.floor(Math.random() * 7)] + 12;
        tone(hz(note), 0.6, { vol: 0.05 + Math.random() * 0.03, when: t - ctx.currentTime + i * BAR / 8, dest: musicGain });
      }
    }
    bar++;
  }
  function startMusic() {
    if (!ctx || musicTimer) return;
    nextBar = ctx.currentTime + 0.2;
    musicTimer = setInterval(() => {
      while (nextBar < ctx.currentTime + 1.5) { scheduleBar(nextBar); nextBar += BAR; }
    }, 400);
  }
  function stopMusic() { clearInterval(musicTimer); musicTimer = null; }

  return {
    init,
    play(name, arg) { try { init(); sfx[name] && sfx[name](arg); } catch (e) { /* sound is optional */ } },
    setSfx(v) { sfxVol = v; if (sfxGain) sfxGain.gain.value = v; },
    setMusic(v) {
      musicVol = v; musicOn = v > 0;
      if (musicGain) musicGain.gain.value = v * 0.35;
      if (ctx) { if (musicOn) startMusic(); else stopMusic(); }
    },
    pause() { if (ctx && ctx.state === 'running') ctx.suspend(); },
    resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); },
  };
})();
