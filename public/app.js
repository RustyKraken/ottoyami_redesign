const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
const mobile = matchMedia('(max-width: 1100px)');
const motion = matchMedia('(prefers-reduced-motion: reduce)');

// Hero clip on phones only: desktop keeps the photo and never downloads the video. It plays while the
// hero is on screen and stays off for reduced motion or data saver.
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  const phone = matchMedia('(max-width: 767px)');
  let heroVisible = true;
  const update = () => {
    const wanted = phone.matches && !motion.matches && !navigator.connection?.saveData;
    if (wanted && !heroVideo.src) heroVideo.src = heroVideo.dataset.src;
    if (wanted && heroVisible) heroVideo.play().catch(() => {}); else if (heroVideo.src) heroVideo.pause();
  };
  heroVideo.addEventListener('playing', () => heroVideo.classList.add('is-playing'), { once: true });
  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; update(); }).observe(heroVideo);
  phone.addEventListener('change', update);
  motion.addEventListener('change', update);
}
let menuOpen = false;
function setMenu(open, restoreFocus = false) {
  menuOpen = open;
  header.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  document.body.classList.toggle('menu-is-open', open);
  document.querySelector('main').inert = open;
  document.querySelector('footer').inert = open;
  if (open) navigation.querySelector('a').focus();
  else if (restoreFocus) toggle.focus();
}
toggle.addEventListener('click', () => setMenu(!menuOpen));
navigation.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
mobile.addEventListener('change', () => setMenu(false));
document.addEventListener('keydown', e => {
  if (!menuOpen) return;
  if (e.key === 'Escape') setMenu(false, true);
  if (e.key === 'Tab') {
    const links = [...navigation.querySelectorAll('a'), toggle];
    const first = links[0], last = links.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
let scrollScheduled = false;
function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 48);
  scrollScheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateHeader); }
}, { passive: true });
updateHeader();

// All content is visible without JavaScript. Only animate elements below the fold.
const reveals = document.querySelectorAll('.reveal, .wave-art');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('awaiting-reveal');
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
if (!motion.matches) reveals.forEach(el => {
  if (el.getBoundingClientRect().top > innerHeight) el.classList.add('awaiting-reveal');
  revealObserver.observe(el);
});
motion.addEventListener('change', e => { if (e.matches) reveals.forEach(el => el.classList.remove('awaiting-reveal')); });

const dialog = document.querySelector('.lightbox');
const gallery = [...document.querySelectorAll('.gallery-open')];
let currentImage = 0;
let galleryOpener;
function showImage(index) {
  currentImage = (index + gallery.length) % gallery.length;
  const item = gallery[currentImage];
  const image = dialog.querySelector('img');
  image.src = item.dataset.image;
  image.alt = item.dataset.alt;
  dialog.querySelector('figcaption').textContent = item.dataset.alt;
  dialog.querySelector('.lightbox-count').textContent = `${currentImage + 1} / ${gallery.length}`;
}
gallery.forEach((item,index) => item.addEventListener('click', () => {
  galleryOpener = item;
  showImage(index);
  dialog.showModal();
  document.body.classList.add('lightbox-is-open');
  dialog.querySelector('.lightbox-close').focus();
}));
dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog.querySelector('.lightbox-prev').addEventListener('click', () => showImage(currentImage - 1));
dialog.querySelector('.lightbox-next').addEventListener('click', () => showImage(currentImage + 1));
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
dialog.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { e.preventDefault(); showImage(currentImage + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); showImage(currentImage - 1); }
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('lightbox-is-open');
  galleryOpener?.focus({ preventScroll: true });
});

// Sakura branch: petals drift down on their own; hovering lets a light breeze move the branch.
// Motion runs in one rAF loop so the breeze eases in and out instead of jumping between CSS animations.
const branch = document.querySelector('.sakura-branch');
if (branch) {
  const art = branch.querySelector('.sakura-art');
  const layer = branch.querySelector('.sakura-petals');
  const flowers = [...branch.querySelectorAll('.sb-flower')];
  const parts = [...branch.querySelectorAll('.sb-flower, .sb-bud')];
  const calm = .35, breeze = 1;
  let visible = false, hovering = false, running = false, wind = calm, target = calm, last = 0;
  const spawnPetal = () => {
    if (motion.matches || layer.childElementCount > 14) return;
    const box = branch.getBoundingClientRect();
    const flower = flowers[Math.floor(Math.random() * flowers.length)].getBoundingClientRect();
    const petal = document.createElement('span');
    petal.className = 'falling-petal';
    const s = petal.style;
    s.setProperty('--x', `${flower.left - box.left + flower.width * (.2 + Math.random() * .6)}px`);
    s.setProperty('--y', `${flower.top - box.top + flower.height * (.2 + Math.random() * .6)}px`);
    s.setProperty('--size', `${12 + Math.random() * 6}px`);
    s.setProperty('--drift', `${30 + Math.random() * 40}px`);
    s.setProperty('--fall', `${box.height * .6 + Math.random() * 220}px`);
    s.setProperty('--dur', `${7 + Math.random() * 3}s`);
    petal.addEventListener('animationend', () => petal.remove());
    layer.append(petal);
  };
  const frame = now => {
    const t = now / 1000;
    wind += (target - wind) * .02;
    // Overlapping slow sine waves read as gusts rather than a metronome.
    const gust = Math.sin(t * .8) * .6 + Math.sin(t * 1.53 + 1.3) * .28 + Math.sin(t * .31) * .4;
    art.style.transform = `rotate(${(gust * wind).toFixed(3)}deg)`;
    parts.forEach((el, i) => {
      const r = (Math.sin(t * 1.2 + i * 1.31) * .7 + Math.sin(t * 2.1 + i * .9) * .3) * wind * 2.4;
      el.style.transform = `rotate(${r.toFixed(2)}deg)`;
    });
    if (hovering && now - last > 900) { last = now; spawnPetal(); }
    if (visible && !motion.matches) requestAnimationFrame(frame); else running = false;
  };
  const start = () => { if (!running && visible && !motion.matches) { running = true; requestAnimationFrame(frame); } };
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); }).observe(branch);
  (function idle() {
    if (visible && !document.hidden) spawnPetal();
    setTimeout(idle, 2200 + Math.random() * 2600);
  })();
  branch.addEventListener('pointerenter', () => { hovering = true; target = breeze; });
  branch.addEventListener('pointerleave', () => { hovering = false; target = calm; });
  branch.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse') return;
    target = breeze; spawnPetal();
    setTimeout(() => { if (!hovering) target = calm; }, 2500);
  });
}

// Theme switch: dark by default; the choice is remembered per browser when storage is available.
const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');
function applyTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Hellen Modus aktivieren' : 'Dunklen Modus aktivieren');
  themeColor.content = theme === 'dark' ? '#15120F' : '#F5EBDD';
}
applyTheme(root.dataset.theme === 'light' ? 'light' : 'dark');
themeToggle.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  try { localStorage.setItem('ottoyami-theme', theme); } catch {}
});

// Koi behind the prices swim one after another along a wide figure of eight, in a shared rhythm:
// two strong tail beats, then a long glide. Each fish starts its strokes a third of a cycle after the
// one ahead, so the beat runs through the group like a canon. The body bends in a travelling wave
// (mid body, rear body, tail), leans into the curve and straightens while gliding.
const koiBackdrop = document.querySelector('.koi-backdrop');
if (koiBackdrop) {
  const NS = 'http://www.w3.org/2000/svg';
  const CYCLE = 3.6, STROKE = 1.4, LAG = .62;
  const svg = koiBackdrop.querySelector('svg'), rippleLayer = svg.querySelector('.kb-ripples');
  const path = u => [600 + 470 * Math.sin(u), 350 + 215 * Math.sin(2 * u)];
  const tangent = u => [470 * Math.cos(u), 430 * Math.cos(2 * u)];
  const fish = [...svg.querySelectorAll('.koi')].map((el, i) => {
    const s = +el.getAttribute('transform').match(/scale\(([-\d.]+)\)/)[1];
    const parts = sel => [...el.querySelectorAll(sel)];
    return { el, s, i, mid: el.querySelector('.kb-mid'), rear: el.querySelector('.kb-rear'), tail: el.querySelector('.kb-tail'),
      pectoral: parts('.kb-pectoral'), pelvic: parts('.kb-pelvic'),
      u: -i * LAG, side: [0, 38, -38][i] || 0, speed: 26, beat: i * 2, a: null, stroking: false };
  });
  const ripple = (x, y, r) => {
    const ring = document.createElementNS(NS, 'ellipse');
    ring.setAttribute('cx', x.toFixed(0)); ring.setAttribute('cy', y.toFixed(0));
    ring.setAttribute('rx', r); ring.setAttribute('ry', (r * .55).toFixed(0));
    ring.setAttribute('class', 'kb-ripple');
    ring.addEventListener('animationend', () => ring.remove());
    rippleLayer.append(ring);
  };
  const place = (f, t, dt) => {
    // Where this fish is in the shared rhythm.
    const tau = ((t - f.i * CYCLE / 3) % CYCLE + CYCLE) % CYCLE;
    const stroke = tau < STROKE ? Math.sin(Math.PI * tau / STROKE) : 0;
    if (stroke && !f.stroking && f.i === 0 && Math.random() < .5) {
      const [hx, hy] = path(f.u);
      ripple(hx + Math.cos(f.a || 0) * 95 * f.s, hy + Math.sin(f.a || 0) * 95 * f.s, 40);
    }
    f.stroking = stroke > 0;
    f.speed += (24 + 56 * stroke - f.speed) * Math.min(1, dt * 1.6);
    f.beat += dt * 2 * Math.PI * (stroke ? 2 / STROKE : .45);
    const [tx, ty] = tangent(f.u);
    f.u += f.speed * dt / Math.hypot(tx, ty);
    const [px, py] = path(f.u), [nx, ny] = tangent(f.u), len = Math.hypot(nx, ny);
    const x = px - ny / len * f.side, y = py + nx / len * f.side;
    const a = Math.atan2(ny, nx);
    const turn = f.a === null || !dt ? 0 : Math.atan2(Math.sin(a - f.a), Math.cos(a - f.a)) / dt;
    f.a = a;
    f.turn = (f.turn || 0) + (turn - (f.turn || 0)) * Math.min(1, dt * 3);
    const amp = .3 + 1.1 * stroke, lean = Math.max(-1, Math.min(1, f.turn)) * -12;
    const b = k => Math.sin(f.beat - k);
    f.el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(a * 180 / Math.PI + b(-.4) * 1.6 * amp).toFixed(1)}) scale(${f.s})`);
    f.mid.setAttribute('transform', `rotate(${(b(0) * 4 * amp + lean * .5).toFixed(1)} 20 0)`);
    f.rear.setAttribute('transform', `rotate(${(b(1) * 7 * amp + lean * .7).toFixed(1)} -30 0)`);
    f.tail.setAttribute('transform', `rotate(${(b(2) * 14 * amp + lean).toFixed(1)} -80 0) scale(1 ${(1 - Math.abs(b(2)) * .1 * amp).toFixed(2)})`);
    // Pectoral fins fold back during the strokes and fan out to steer while gliding.
    const spread = 1 - stroke;
    f.pectoral.forEach((fin, k) => fin.setAttribute('transform', `rotate(${((k ? -1 : 1) * (spread * 10 - stroke * 14 + Math.sin(t * 2.2 + f.i + k * Math.PI) * 6 * spread)).toFixed(1)} 50 ${k ? 28 : -28})`));
    f.pelvic.forEach((fin, k) => fin.setAttribute('transform', `rotate(${((k ? -1 : 1) * (spread * 6 + Math.sin(t * 2.2 + f.i + 1) * 4)).toFixed(1)} -20 ${k ? 22 : -22})`));
  };
  fish.forEach(f => place(f, 0, 0));
  let visible = false, running = false, prev = 0;
  const swim = now => {
    const dt = Math.min(.05, (now - (prev || now)) / 1000); prev = now;
    fish.forEach(f => place(f, now / 1000, dt));
    if (visible && !motion.matches) requestAnimationFrame(swim); else { running = false; prev = 0; }
  };
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !running && !motion.matches) { running = true; requestAnimationFrame(swim); }
  }).observe(koiBackdrop);
}

// Temporary dragon sky: the line drawing follows the scroll position, drawn in as the section passes
// through the viewport and undrawn again when scrolling back up. While it scrolls, a wave runs through
// the dragon from head to tail, so it winds along its path with the page.
const sky = document.querySelector('.dragon-sky');
if (sky) {
  const section = sky.parentElement;
  let skyScheduled = false;
  const drawSky = () => {
    const box = section.getBoundingClientRect();
    const progress = (innerHeight * .85 - box.top) / (box.height * .75);
    sky.style.setProperty('--draw', Math.min(1, Math.max(0, progress)).toFixed(3));
    if (shapeDragon && box.top < innerHeight && box.bottom > 0) shapeDragon(-box.top * .008);
    skyScheduled = false;
  };
  let shapeDragon = null;
  if (!motion.matches) import('./dragon.js').then(({ dragonGeometry, SKY_DRAGON }) => {
    const parts = [...sky.querySelectorAll('[data-part]')], places = [...sky.querySelectorAll('[data-place]')];
    shapeDragon = phase => {
      const { paths, places: at } = dragonGeometry(SKY_DRAGON, phase);
      parts.forEach(el => el.setAttribute('d', paths[el.dataset.part]));
      places.forEach(el => el.setAttribute('transform', at[el.dataset.place]));
    };
    drawSky();
  }).catch(() => {});
  if (motion.matches) sky.style.setProperty('--draw', 1);
  else {
    addEventListener('scroll', () => { if (!skyScheduled) { skyScheduled = true; requestAnimationFrame(drawSky); } }, { passive: true });
    addEventListener('resize', drawSky);
    drawSky();
  }
}
