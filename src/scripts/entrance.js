// Entrance: a charcoal curtain, a hexagon window that rises and opens, then the mark turns and the hero settles.
import { gsap } from 'gsap';
import { HEX } from '../lib/mark.js';

const root = document.documentElement;
const hero = document.querySelector('.hero');
const stage = hero.querySelector('[data-mark]');
// False under reduced motion (the inline head script never adds the class) or if its safety timer already fired.
// On a slow connection this script arrives late. Past 2.5s the visitor has waited enough: show the page at once.
const late = performance.now() > 2500;
if (late) {
  root.classList.remove('has-intro');
  document.dispatchEvent(new Event('intro:done'));
}
const playing = root.classList.contains('has-intro');

// One driver for the mark. turn: 0 = the flat logo seen head on, 1 = the resting three-quarter view.
// light: how far the glow in the cut is switched on.
const pose = { turn: playing ? 0 : 1, light: playing ? 0 : 1 };

// 3D is an upgrade: skipped for reduced motion and data saver, and the flat mark stays if WebGL is missing.
const mark3d = !navigator.connection?.saveData && !matchMedia('(prefers-reduced-motion: reduce)').matches
  ? import('./mark3d.js').then((m) => m.mount(stage, pose)).catch(() => {})
  : Promise.resolve();

if (playing) {
  try {
    play();
  } catch {
    // The entrance could not be set up: never leave the page hidden behind it.
    document.querySelector('div.intro')?.remove();
    root.classList.remove('has-intro', 'intro-run');
    gsap.set([hero, stage, document.querySelector('.nav__bar'), ...hero.querySelectorAll('.word__in, [data-rise]')], { clearProps: 'all' });
    pose.turn = pose.light = 1;
    document.dispatchEvent(new Event('intro:done'));
  }
}

function play() {
  root.classList.add('intro-run');
  const intro = document.querySelector('div.intro');
  const hex = intro.querySelector('[data-intro-hex]');
  const count = intro.querySelector('[data-intro-count]');
  const words = hero.querySelectorAll('.word__in');
  const rise = [...hero.querySelectorAll('[data-rise]'), document.querySelector('.nav__bar')];

  const vw = innerWidth, vh = innerHeight;
  const half = HEX.h / 2, shoulder = half - HEX.shoulder;
  const f0 = hex.getBoundingClientRect().height / HEX.h; // px per logo unit while the window holds
  // Smallest scale at which the hexagon swallows the viewport corners.
  const fFull = Math.max(vw / 2 / HEX.w, (vh / 2 + (vw / 2) * (HEX.shoulder / HEX.w)) / half) * 1.03;

  // The window is the hero itself, clipped to the mark's hexagon.
  const win = { cy: vh + half * f0, f: f0 };
  const clip = () => {
    const p = (x, y) => `${vw / 2 + x * win.f}px ${win.cy + y * win.f}px`;
    hero.style.clipPath = `polygon(${p(0, -half)},${p(HEX.w, -shoulder)},${p(HEX.w, shoulder)},${p(0, half)},${p(-HEX.w, shoulder)},${p(-HEX.w, -shoulder)})`;
  };

  // Park the mark in the middle of the window, scaled down so the canvas stays sharp when it grows back.
  const box = stage.getBoundingClientRect();
  const fill = parseFloat(getComputedStyle(stage).getPropertyValue('--mark-fill'));
  gsap.set(stage, {
    x: vw / 2 - (box.left + box.width / 2),
    y: vh / 2 - (box.top + box.height / 2),
    scale: (0.56 * HEX.h * f0) / (box.height * fill),
  });
  gsap.set(words, { yPercent: 108 });
  gsap.set(rise, { autoAlpha: 0, y: 14 });
  clip();
  hero.style.visibility = 'visible';

  const reveal = gsap.timeline({ paused: true })
    .to(win, { cy: vh / 2, duration: 0.75, ease: 'expo.out', onUpdate: clip })
    .to([count, intro.querySelector('.intro__name')], { autoAlpha: 0, duration: 0.25, ease: 'none' }, 0)
    .addLabel('open', '+=0.1')
    .to(win, { f: fFull, duration: 0.85, ease: 'expo.inOut', onUpdate: clip }, 'open')
    .to(hex, { scale: fFull / f0, autoAlpha: 0, duration: 0.85, ease: 'expo.inOut' }, 'open')
    .to(stage, { x: 0, y: 0, scale: 1, duration: 1.2, ease: 'expo.inOut', clearProps: 'transform' }, 'open')
    .to(pose, { turn: 1, duration: 1.5, ease: 'expo.inOut' }, 'open')
    .to(pose, { light: 1, duration: 0.9, ease: 'power2.out' }, 'open+=0.7')
    .to(words, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07 }, 'open+=0.4')
    .to(rise, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06 }, 'open+=0.55')
    .add(() => {
      hero.style.clipPath = '';
      hero.style.visibility = '';
      intro.remove();
      root.classList.remove('has-intro', 'intro-run');
      document.dispatchEvent(new Event('intro:done')); // scroll.js starts smooth scrolling now
    }, 'open+=0.85');

  // The counter is the wait for the font and the 3D mark, capped so a slow connection is never held hostage.
  const n = { v: 0 };
  const show = () => (count.textContent = String(Math.round(n.v)).padStart(3, '0'));
  const loaded = Promise.race([Promise.all([document.fonts.ready, mark3d]), new Promise((done) => setTimeout(done, 1200))]);
  gsap.to(hex.querySelector('polygon'), { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' });
  const counting = gsap.to(n, { v: 82, duration: 0.7, ease: 'power1.out', onUpdate: show });
  Promise.all([loaded, counting]).then(() =>
    gsap.to(n, { v: 100, duration: 0.2, ease: 'none', onUpdate: show, onComplete: () => reveal.play() }),
  );
}
