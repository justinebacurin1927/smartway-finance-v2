(() => {
  const root = document.querySelector('[data-about-page]');
  if (!root) return;
  const header = document.querySelector('body.about-page>header.header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 20);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('pageshow', updateHeader);
  const animate = window.SmartwayHeadingMotion;
  if (animate) {
    const configurations = [
      { title: '#ap-hero-title', section: '.ap-hero', panel: '.ap-hero-stage', field: '.ap-hero-stage', protected: '.ap-section-label, .ap-hero-description, .ap-hero-actions, .ap-location-note, .ap-hero-photo', photos: ['.ap-hero-photo'], anchors: [{x:.02,y:.03},{x:.4,y:.1},{x:.01,y:.53},{x:.35,y:.76},{x:.8,y:.87}] },
      { title: '#ap-mission-title', section: '.ap-mission', panel: '.about-story-cards', field: '.about-intro-stage', protected: '.ap-section-label, .about-card-copy', surfaces: '.about-story-card', compact: true, layoutEvent: 'about:layout', anchors: [{x:.02,y:.08},{x:.75,y:.15},{x:.27,y:.38},{x:.7,y:.5},{x:.03,y:.75},{x:.48,y:.9},{x:.9,y:.85}] },
      { title: '#ap-values-title', section: '.ap-values', panel: '.ap-values-grid', protected: '.ap-section-label, .ap-heading-split>p, .benefit-item', anchors: [{x:.03,y:.07},{x:.7,y:.21},{x:.45,y:.6}] },
      { title: '#ap-team-title', section: '.ap-team', panel: '.ap-profiles', field: '.ap-team-heading', protected: '.ap-section-label, .ap-team-intro', anchors: [{x:.03,y:.05},{x:.7,y:.1},{x:.4,y:.6},{x:.9,y:.8}] },
      { title: '#ap-credentials-title', section: '.ap-credentials', panel: '.ap-credential-grid', field: '.ap-credentials-heading', protected: '.ap-section-label, .ap-credentials-heading>p:last-child', anchors: [{x:.02,y:.1},{x:.45,y:.15},{x:.18,y:.75},{x:.8,y:.9}] }
    ];
    configurations.forEach(config => animate({ ...config, words: '.ap-motion-word', motionClass: 'ap-heading-motion', response: 160, finish: height => Math.max(220, height * .3), packLargestFirst: true }));
  }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!motion.matches) entry.target.animate([{transform:'translateY(16px)'},{transform:'translateY(0)'}],{duration:600,easing:'cubic-bezier(.22,1,.36,1)'});
      observer.unobserve(entry.target);
    }), { threshold: .12 });
    root.querySelectorAll('.ap-hero-photo,.ap-value-card,.ap-profile,.ap-credential').forEach(element => observer.observe(element));
  }
})();
