(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const stories = [...document.querySelectorAll('#journal .journal-story')];

  stories.forEach(story => {
    const deck = story.querySelector('.journal-deck');
    const panels = [...story.querySelectorAll('.journal-panel')];
    const button = story.querySelector('.journal-swap');
    const title = story.querySelector('h3').textContent;
    const photoLink = story.querySelector('.journal-photo .brex-article-link');

    function select(front) {
      if (story.dataset.front === front) return;
      const previous = story.dataset.front;
      const starts = panels.map(panel => getComputedStyle(panel).transform);
      panels.forEach(panel => panel.getAnimations().forEach(animation => animation.cancel()));
      story.dataset.front = front;
      const photoShown = front === 'image';
      button.setAttribute('aria-pressed', String(photoShown));
      button.setAttribute('aria-label', `${photoShown ? 'Show article text' : 'Show photo'} for ${title}`);

      if (!motion.matches) panels.forEach((panel, index) => {
        const target = getComputedStyle(panel).transform;
        const wasFront = panel.dataset.panel === previous;
        const oldLayer = wasFront ? 2 : 1;
        const newLayer = wasFront ? 1 : 2;
        const direction = Number(getComputedStyle(deck).getPropertyValue('--journal-direction')) || 1;
        const distance = Math.min(32, panel.offsetWidth * .09) * (wasFront ? -1 : 1) * direction;
        const aside = `translateX(${distance}px) ${starts[index]}`;
        panel.animate([
          { transform: starts[index], zIndex: oldLayer, offset: 0 },
          { transform: aside, zIndex: oldLayer, offset: .42 },
          { transform: aside, zIndex: newLayer, offset: .5 },
          { transform: target, zIndex: newLayer, offset: 1 }
        ], { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' });
      });
    }

    function toggle() { select(story.dataset.front === 'image' ? 'text' : 'image'); }
    button.addEventListener('click', toggle);
    deck.addEventListener('click', event => { if (!event.target.closest('a, button')) toggle(); });
    // Tabbing to Read article brings its photo sheet to the front.
    photoLink.addEventListener('focus', () => select('image'));
    button.hidden = false;
    story.classList.add('is-interactive');
  });

  motion.addEventListener('change', () => {
    if (motion.matches) stories.forEach(story => story.querySelectorAll('.journal-panel').forEach(panel => panel.getAnimations().forEach(animation => animation.cancel())));
  });
})();
