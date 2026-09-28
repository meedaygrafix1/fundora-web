import { useEffect } from 'react';

// Keep scroll work outside React renders; only transform/brightness change per frame.
export function usePageMotion() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      if (preference.matches) return;
      const elements = [...document.querySelectorAll('.overview h2, .overview-card, .features-title, .section-intro, .step, .testimonial-heading, .faq h2, .faq-intro, .faq-grid article, .cta, .footer-signoff, .footer-bottom')];
      const observer = new IntersectionObserver(entries => entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { target.classList.add('is-visible'); observer.unobserve(target); }
      }), { threshold: 0.08 });
      elements.forEach((element, index) => {
        element.classList.add('reveal');
        element.style.setProperty('--reveal-delay', `${index % 3 * 65}ms`);
        observer.observe(element);
      });
      const cards = [...document.querySelectorAll('.feature')];
      const list = document.querySelector('.feature-list');
      list.classList.add('is-stacking');
      let frame = 0;
      let tops = [];
      const measure = () => {
        tops = cards.map((card, index) => Math.min(32, innerHeight - card.offsetHeight - 48) + index * 12);
        cards.forEach((card, index) => card.style.setProperty('--stack-top', `${tops[index]}px`));
        schedule();
      };
      const update = () => {
        frame = 0;
        const positions = cards.map(card => card.getBoundingClientRect().top);
        cards.forEach((card, index) => {
          const progress = index === cards.length - 1 ? 0 : Math.max(0, Math.min(1, 1 - (positions[index + 1] - tops[index]) / card.offsetHeight));
          card.style.setProperty('--stack-scale', 1 - progress * 0.045);
          card.style.setProperty('--stack-brightness', 1 - progress * 0.075);
        });
      };
      function schedule() { if (!frame) frame = requestAnimationFrame(update); }
      const resize = new ResizeObserver(measure);
      cards.forEach(card => resize.observe(card));
      addEventListener('scroll', schedule, { passive: true });
      addEventListener('resize', measure);
      measure();
      cleanup = () => {
        observer.disconnect(); resize.disconnect(); cancelAnimationFrame(frame);
        removeEventListener('scroll', schedule); removeEventListener('resize', measure);
        elements.forEach(element => { element.classList.remove('reveal', 'is-visible'); element.style.removeProperty('--reveal-delay'); });
        list.classList.remove('is-stacking');
        cards.forEach(card => ['--stack-top', '--stack-scale', '--stack-brightness'].forEach(name => card.style.removeProperty(name)));
      };
    };
    setup();
    preference.addEventListener('change', setup);
    return () => { cleanup(); preference.removeEventListener('change', setup); };
  }, []);
}
