(() => {
  document.querySelectorAll('.faq-page-group').forEach(group => {
    group.querySelectorAll('details').forEach(item => {
      item.querySelector('summary').addEventListener('click', () => {
        if (item.open) return;
        group.querySelectorAll('details[open]').forEach(other => {
          if (other !== item) other.open = false;
        });
      });
    });
  });
})();
