// Page transitions in the manner of the Pasqua reference: a charcoal panel rises over the page, the view changes
// underneath, then the panel lifts away while the new view slides up into place.
// Links to another page go through a full load (no router), so every page's scripts run as normal.
// In-page links (#services, #contact) jump behind the panel instead of scrolling.
// Under reduced motion nothing here runs: links behave natively.
import { gsap } from 'gsap';
import { lenis } from './scroll.js';

const root = document.documentElement;
const panel = document.querySelector('.wipe');
const mark = panel.querySelector('.wipe__mark');
const [cPart, pPart, seam] = ['.wipe__c', '.wipe__p', '.wipe__seam'].map((s) => panel.querySelector(s));
const main = document.querySelector('main');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const path = (p) => p.replace(/\/$/, '') || '/'; // "/about/" and "/about" are the same page
let busy = false;

// Closing: the panel rises; the C slides in from the left and the P from the right until they lock;
// then the light runs down the cut between them. Offsets are in logo units (the mark is 572 wide).
const cover = () =>
  new Promise((done) => {
    gsap.timeline({ onComplete: done })
      .set(panel, { visibility: 'visible' })
      .fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: 'expo.inOut' }, 0)
      .fromTo(cPart, { x: -190, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' }, 0.2)
      .fromTo(pPart, { x: 190, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' }, 0.2)
      .fromTo(seam, { scaleY: 0, transformOrigin: '50% 0%' }, { scaleY: 1, duration: 0.35, ease: 'power2.inOut' }, 0.5);
  });

// Opening: the light runs out at the bottom, the panel lifts away and the mark trails it a little.
const uncover = () => {
  gsap.fromTo(main, { y: '12vh' }, { y: 0, duration: 0.9, ease: 'expo.out', delay: 0.15, clearProps: 'transform' });
  gsap.timeline({
    onComplete: () => {
      gsap.set(panel, { yPercent: 100, visibility: 'hidden' });
      gsap.set(mark, { y: 0 });
      root.classList.remove('wipe-in');
      busy = false;
    },
  })
    .to(seam, { scaleY: 0, transformOrigin: '50% 100%', duration: 0.3, ease: 'power2.in' }, 0)
    .fromTo(panel, { yPercent: 0 }, { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, 0.1)
    .fromTo(mark, { y: 0 }, { y: () => innerHeight * 0.3, duration: 0.8, ease: 'expo.inOut' }, 0.1);
};

const jump = (target) => {
  // Clear the floating nav bar: sections that need room say so with scroll-margin-top.
  const offset = -parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  if (lenis) lenis.scrollTo(target, { immediate: true, force: true, offset });
  else target.scrollIntoView();
  target.setAttribute('tabindex', '-1'); // move keyboard focus with the view, as a native anchor jump does
  target.focus({ preventScroll: true });
};

if (!reduce) {
  // GSAP takes over the panel's transform from the stylesheet: y stays 0 and every move is in yPercent.
  // (Left alone, GSAP reads the CSS translateY as y and adds yPercent on top, parking the panel a screen too low.)
  const arriving = root.classList.contains('wipe-in');
  gsap.set(panel, { y: 0, yPercent: arriving ? 0 : 100 });

  // Arrived through a transition from another page: the panel is already closed (set in the head), so lift it.
  if (arriving) {
    try { sessionStorage.removeItem('wipe'); } catch {}
    busy = true;
    requestAnimationFrame(uncover);
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || busy || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download') || a.classList.contains('skip')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return; // other sites, mailto: and tel: links leave normally
    const samePage = path(url.pathname) === path(location.pathname);
    // Same page: a #section, or the top for a plain link to this page (the logo on the home page).
    const target = samePage ? (url.hash ? document.querySelector(url.hash) : document.querySelector('main')) : null;
    if (samePage && !target) return;

    e.preventDefault();
    busy = true;
    cover().then(() => {
      document.dispatchEvent(new Event('wipe:covered'));
      if (target) {
        jump(target);
        history.pushState(null, '', url.hash || url.pathname);
        uncover();
      } else {
        try { sessionStorage.setItem('wipe', '1'); } catch {}
        location.href = url.href;
      }
    });
  });

  // Coming back with the Back button can restore this page with the panel still closed: reset it.
  addEventListener('pageshow', (e) => {
    if (e.persisted) {
      gsap.set(panel, { yPercent: 100, visibility: 'hidden' });
      gsap.set(mark, { y: 0 });
      busy = false;
    }
  });
}
