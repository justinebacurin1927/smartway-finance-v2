(() => {
  function disableImageDrag(root) {
    if (root instanceof HTMLImageElement) root.draggable = false;
    root.querySelectorAll?.('img').forEach(image => { image.draggable = false; });
  }

  disableImageDrag(document);

  // Also cover images added by the photo orbit and other page interactions.
  new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(disableImageDrag));
  }).observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener('dragstart', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('img, picture') || target?.closest('a')?.querySelector('img, picture')) {
      event.preventDefault();
    }
  }, true);

  document.addEventListener('contextmenu', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('img, picture')) event.preventDefault();
  }, true);
})();
