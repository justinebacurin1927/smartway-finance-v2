(() => {
  const disclosure = document.querySelector('.nav-explore');
  if (!disclosure) return;
  const summary = disclosure.querySelector('summary');
  document.addEventListener('click', event => {
    if (disclosure.open && !disclosure.contains(event.target)) disclosure.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !disclosure.open) return;
    const restoreFocus = disclosure.contains(document.activeElement);
    disclosure.open = false;
    if (restoreFocus) summary.focus();
  });
  disclosure.addEventListener('focusout', event => {
    if (!disclosure.contains(event.relatedTarget)) disclosure.open = false;
  });
  disclosure.addEventListener('click', event => {
    if (event.target.closest('a')) disclosure.open = false;
  });
  matchMedia('(max-width: 1000px)').addEventListener('change', event => {
    if (event.matches) disclosure.open = false;
  });
})();
