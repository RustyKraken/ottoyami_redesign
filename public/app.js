const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
const mobile = matchMedia('(max-width: 1100px)');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
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

// Koi pond: each fish wanders with a gentle random heading, turns back toward the centre near the edge
// and beats its tail. Ripples appear where petals land on the water and now and then on their own.
const pond = document.querySelector('.koi-pond');
if (pond) {
  const W = 400, H = 250;
  const fish = [...pond.querySelectorAll('.koi')].map((el, i) => {
    const [, x, y, a, s] = el.getAttribute('transform').match(/translate\(([-\d.]+) ([-\d.]+)\) rotate\(([-\d.]+)\) scale\(([-\d.]+)\)/).map(Number);
    return { el, tail: el.querySelector('.koi-tail'), fins: [...el.querySelectorAll('.koi-fin, .koi-fin-rays')], x, y, a: a * Math.PI / 180, s, speed: 11 + i * 2.5, phase: i * 1.7 };
  });
  const host = pond.parentElement;
  const ripple = (x, y) => {
    const r = document.createElement('span');
    r.className = 'pond-ripple';
    r.style.setProperty('--x', `${x}px`);
    r.style.setProperty('--y', `${y}px`);
    r.addEventListener('animationend', () => r.remove());
    host.append(r);
  };
  const inPond = (x, y) => {
    const nx = (x - pond.offsetLeft) / pond.offsetWidth - .5, ny = (y - pond.offsetTop) / pond.offsetHeight - .5;
    return nx * nx + ny * ny < .16;
  };
  // Petals from the branch: ripple where a petal finishes over the water.
  host.addEventListener('animationend', e => {
    if (!e.target.classList.contains('falling-petal')) return;
    const st = getComputedStyle(e.target);
    const x = parseFloat(st.getPropertyValue('--x')) + parseFloat(st.getPropertyValue('--drift')) * .2;
    const y = parseFloat(st.getPropertyValue('--y')) + parseFloat(st.getPropertyValue('--fall'));
    if (inPond(x, y)) ripple(x, y);
  }, true);
  let pondVisible = false, swimming = false, prev = 0, nextRipple = 0;
  const swim = now => {
    const dt = Math.min(.05, (now - (prev || now)) / 1000); prev = now;
    const t = now / 1000;
    fish.forEach(f => {
      const dx = (f.x - W / 2) / (W * .38), dy = (f.y - H / 2) / (H * .34);
      if (dx * dx + dy * dy > .7) {
        let diff = Math.atan2(H / 2 - f.y, W / 2 - f.x) - f.a;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        f.a += diff * dt * .9;
      }
      // Keep a little distance from the other koi so they don't bunch up.
      fish.forEach(o => {
        if (o === f) return;
        const ox = f.x - o.x, oy = f.y - o.y, d = Math.hypot(ox, oy);
        if (d < 70 && d > 0) {
          let away = Math.atan2(oy, ox) - f.a;
          away = Math.atan2(Math.sin(away), Math.cos(away));
          f.a += away * dt * (70 - d) / 70 * 1.2;
        }
      });
      f.a += Math.sin(t * .35 + f.phase) * .35 * dt;
      f.x += Math.cos(f.a) * f.speed * dt;
      f.y += Math.sin(f.a) * f.speed * dt;
      f.el.setAttribute('transform', `translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${(f.a * 180 / Math.PI).toFixed(1)}) scale(${f.s})`);
      const beat = Math.sin(t * 3.2 + f.phase);
      f.tail.setAttribute('transform', `rotate(${(beat * 13).toFixed(1)} -46 0)`);
      f.fins.forEach((fin, k) => fin.setAttribute('transform', `scale(1 ${k > 1 ? -1 : 1}) rotate(${(Math.sin(t * 2.2 + f.phase) * 9).toFixed(1)} 26 -15)`));
    });
    if (now > nextRipple) {
      nextRipple = now + 3500 + Math.random() * 4000;
      ripple(pond.offsetLeft + pond.offsetWidth * (.25 + Math.random() * .5), pond.offsetTop + pond.offsetHeight * (.3 + Math.random() * .4));
    }
    if (pondVisible && !motion.matches) requestAnimationFrame(swim); else { swimming = false; prev = 0; }
  };
  new IntersectionObserver(([entry]) => {
    pondVisible = entry.isIntersecting;
    if (pondVisible && !swimming && !motion.matches) { swimming = true; requestAnimationFrame(swim); }
  }).observe(pond);
}
