(() => {
  const page = document.querySelector('[data-page="/faqs"]');
  if (!page) return;
  page.querySelectorAll('.faq-item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      item.closest('.content-container > div')?.querySelectorAll('.faq-item[open]').forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
})();
(() => {
  const page = document.querySelector('[data-page="/faqs"]');
  const content = page?.querySelector('.source-page>.content-section:nth-child(2)>.content-container');
  if (!content || content.querySelector('.faq-category-nav')) return;
  const groups = [...content.children];
  const nav = document.createElement('nav');
  nav.className = 'faq-category-nav';
  nav.setAttribute('aria-label', 'FAQ categories');
  groups.forEach((group, index) => {
    const title = group.querySelector('h2');
    if (!title) return;
    const id = `faq-category-${index + 1}`;
    group.id = id;
    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = title.textContent.replace(/\s+/g, ' ').trim();
    nav.append(link);
  });
  content.prepend(nav);
})();
