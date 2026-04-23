const revealElements = document.querySelectorAll('.reveal');
const sparkleLayer = document.querySelector('.sparkle-layer');
const petalLayer = document.querySelector('.petal-layer');
const flowerContainer = document.querySelector('.flowers');
const kissContainer = document.querySelector('.kisses');
const soundToggle = document.getElementById('soundToggle');
const scrollProgressBar = document.getElementById('scrollProgressBar');

/* ── Scroll progress bar ─────────────────────────────────── */
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgressBar) scrollProgressBar.style.width = `${pct}%`;
});

/* ── Web Audio API ambient piano ─────────────────────────── */
function buildAmbientPiano() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;

  const ctx = new Ctx();
  // C-major pentatonic spread across two octaves
  const NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];

  // Soft reverb via convolver
  function makeReverb(duration = 2.4) {
    const rate = ctx.sampleRate;
    const length = rate * duration;
    const buf = ctx.createBuffer(2, length, rate);
    for (let c = 0; c < 2; c++) {
      const ch = buf.getChannelData(c);
      for (let i = 0; i < length; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.55;
  const reverb = makeReverb();
  const dryGain = ctx.createGain();
  dryGain.gain.value = 0.6;
  const wetGain = ctx.createGain();
  wetGain.gain.value = 0.4;

  masterGain.connect(dryGain);  dryGain.connect(ctx.destination);
  masterGain.connect(reverb);   reverb.connect(wetGain); wetGain.connect(ctx.destination);

  function playNote(freq, startTime) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    const filt = ctx.createBiquadFilter();

    filt.type = 'lowpass';
    filt.frequency.value = 1800 + Math.random() * 400;

    osc.type = 'triangle';
    osc.frequency.value = freq;

    // Second harmonic for richness
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    const env2 = ctx.createGain();
    env2.gain.value = 0.18;

    env.gain.setValueAtTime(0, startTime);
    env.gain.linearRampToValueAtTime(0.22, startTime + 0.015);
    env.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.8);

    osc.connect(filt); filt.connect(env); env.connect(masterGain);
    osc2.connect(env2); env2.connect(masterGain);

    osc.start(startTime);  osc.stop(startTime + 3.2);
    osc2.start(startTime); osc2.stop(startTime + 3.2);
  }

  let active = false;
  let timeoutId = null;

  function schedule() {
    if (!active) return;
    const t = ctx.currentTime + 0.05;
    const count = Math.random() < 0.35 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      playNote(NOTES[Math.floor(Math.random() * NOTES.length)], t + i * 0.14);
    }
    const next = (1.1 + Math.random() * 2.2) * 1000;
    timeoutId = setTimeout(schedule, next);
  }

  return {
    start() { ctx.resume(); active = true; schedule(); },
    stop()  { active = false; if (timeoutId) clearTimeout(timeoutId); },
  };
}

const piano = buildAmbientPiano();

/* ── Intersection reveal ─────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

function createSparkles(count = 28) {
  if (!sparkleLayer) return;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i += 1) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${Math.random() * 5}s`;
    sparkle.style.animationDuration = `${3 + Math.random() * 5}s`;
    fragment.appendChild(sparkle);
  }

  sparkleLayer.appendChild(fragment);
}

function createPetals(count = 18) {
  if (!petalLayer) return;
  const petals = ['🌸', '🌹', '❀'];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = petals[i % petals.length];
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.top = `${-20 - Math.random() * 80}px`;
    petal.style.animationDuration = `${14 + Math.random() * 18}s`;
    petal.style.animationDelay = `${-Math.random() * 20}s`;
    petal.style.fontSize = `${14 + Math.random() * 12}px`;
    fragment.appendChild(petal);
  }

  petalLayer.appendChild(fragment);
}

function fillEmojiCloud(container, emoji, amount) {
  if (!container) return;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < amount; i += 1) {
    const item = document.createElement('span');
    item.textContent = emoji[Math.floor(Math.random() * emoji.length)];
    item.style.animationDelay = `${Math.random() * 2.5}s`;
    item.style.transform = `translateY(${Math.random() * 8}px)`;
    fragment.appendChild(item);
  }

  container.appendChild(fragment);
}

fillEmojiCloud(flowerContainer, ['🌹', '🌸', '🌺', '💐', '🌷', '🪷'], 28);
fillEmojiCloud(kissContainer, ['💋', '😘', '💞', '💗', '💌', '💕'], 26);
createSparkles();
createPetals();

/* ── Sound toggle (Web Audio) ────────────────────────────── */
if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    const isActive = soundToggle.classList.contains('active');
    if (isActive) {
      piano && piano.stop();
      soundToggle.classList.remove('active');
      soundToggle.setAttribute('aria-pressed', 'false');
      soundToggle.querySelector('.toggle-text').textContent = 'Piano ambience';
    } else {
      piano && piano.start();
      soundToggle.classList.add('active');
      soundToggle.setAttribute('aria-pressed', 'true');
      soundToggle.querySelector('.toggle-text').textContent = 'Pause ambience';
    }
  });
}

/* ── Parallax mouse ──────────────────────────────────────── */
window.addEventListener('mousemove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 10;
  const y = (event.clientY / window.innerHeight - 0.5) * 10;
  document.documentElement.style.setProperty('--mouse-x', `${x}px`);
  document.documentElement.style.setProperty('--mouse-y', `${y}px`);
});

/* ── Cursor sparkle trail ────────────────────────────────── */
const TRAIL_EMOJIS = ['✦', '✧', '❋', '·', '✿', '⁕'];

window.addEventListener('mousemove', (e) => {
  const dot = document.createElement('span');
  dot.className = 'trail-dot';
  dot.textContent = TRAIL_EMOJIS[Math.floor(Math.random() * TRAIL_EMOJIS.length)];
  dot.style.left = `${e.clientX}px`;
  dot.style.top  = `${e.clientY}px`;
  dot.style.fontSize = `${10 + Math.random() * 10}px`;
  document.body.appendChild(dot);
  setTimeout(() => dot.remove(), 900);
});

/* ── Heart burst on stop-card click ─────────────────────── */
function burstHearts(originX, originY) {
  const HEARTS = ['💗', '💕', '💞', '🌸', '✨', '🌹'];
  for (let i = 0; i < 14; i++) {
    const h = document.createElement('span');
    h.className = 'burst-particle';
    h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist  = 60 + Math.random() * 90;
    h.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    h.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
    h.style.left = `${originX}px`;
    h.style.top  = `${originY}px`;
    h.style.fontSize = `${14 + Math.random() * 14}px`;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 900);
  }
}

document.querySelectorAll('.stop-card').forEach((card) => {
  card.addEventListener('click', (e) => burstHearts(e.clientX, e.clientY));
});

/* ── Confetti burst when final stop reveals ──────────────── */
const finalStop = document.querySelector('.final-stop');
const CONFETTI_COLORS = ['#f2b8c9','#e8c689','#fff7f8','#ff8ebb','#c8f0d8','#b8d8f2'];

function launchConfetti() {
  for (let i = 0; i < 55; i++) {
    const c = document.createElement('span');
    c.className = 'confetti-piece';
    c.style.left = `${Math.random() * 100}vw`;
    c.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    c.style.animationDuration = `${1.2 + Math.random() * 1.4}s`;
    c.style.animationDelay    = `${Math.random() * 0.5}s`;
    c.style.width  = `${6 + Math.random() * 8}px`;
    c.style.height = `${6 + Math.random() * 8}px`;
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 2500);
  }
}

if (finalStop) {
  const confettiObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(launchConfetti, 500);
          confettiObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  confettiObserver.observe(finalStop);
}

