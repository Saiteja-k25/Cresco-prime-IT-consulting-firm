// Smooth scroll: Lenis driven by GSAP's ticker, so ScrollTrigger and the 3D mark share one clock.
// Skipped under reduced motion (native scroll). Starts once the entrance has let go of the page.
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export let lenis = null; // transition.js jumps with it; null under reduced motion

function start() {
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  ScrollTrigger.refresh();
}

if (document.documentElement.classList.contains('has-intro')) {
  document.addEventListener('intro:done', start, { once: true });
} else {
  start();
}
