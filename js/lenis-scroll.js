/**
 * MOSQUITO Smooth Scroll Architecture
 * SSR-safe, client-side smooth-scroll provider using Lenis
 */

(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  class LenisScrollProvider {
    constructor() {
      this.lenis = null;
      this.rafId = null;
      this.isMounted = false;
      this.init();
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.mount());
      } else {
        this.mount();
      }
    }

    mount() {
      if (this.isMounted) return;
      this.isMounted = true;

      // If Lenis library is already loaded on window (via CDN script)
      if (typeof window.Lenis !== 'undefined') {
        this.initLenis(window.Lenis);
      } else {
        // Dynamically load Lenis from unpkg/jsdelivr with local fallback
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/lenis@1.1.18/dist/lenis.min.js';
        script.async = true;
        script.onload = () => {
          if (typeof window.Lenis !== 'undefined') {
            this.initLenis(window.Lenis);
          }
        };
        script.onerror = () => {
          console.warn('[MOSQUITO] Lenis CDN failed, falling back to standard smooth scroll.');
          document.documentElement.classList.add('scroll-smooth');
        };
        document.head.appendChild(script);
      }
    }

    initLenis(LenisClass) {
      try {
        this.lenis = new LenisClass({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.5,
          infinite: false,
        });

        window.lenis = this.lenis;

        const raf = (time) => {
          if (this.lenis) {
            this.lenis.raf(time);
            this.rafId = requestAnimationFrame(raf);
          }
        };

        this.rafId = requestAnimationFrame(raf);

        // Synchronize anchor clicks
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
          anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href && href.length > 1) {
              const target = document.querySelector(href);
              if (target && this.lenis) {
                e.preventDefault();
                this.lenis.scrollTo(target, { offset: -80 });
              }
            }
          });
        });

        // Add class to html
        document.documentElement.classList.add('lenis', 'lenis-smooth');
      } catch (err) {
        console.error('[MOSQUITO] Error initializing Lenis:', err);
      }
    }

    stop() {
      if (this.lenis) this.lenis.stop();
    }

    start() {
      if (this.lenis) this.lenis.start();
    }

    scrollTo(target, options = {}) {
      if (this.lenis) {
        this.lenis.scrollTo(target, options);
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    destroy() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      if (this.lenis) {
        this.lenis.destroy();
        this.lenis = null;
      }
      this.isMounted = false;
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    }
  }

  window.lenisScroll = new LenisScrollProvider();
})();
