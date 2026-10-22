(() => {
  const section = document.querySelector('#faqs.faq-topics');
  if (!section) return;
  const list = section.querySelector('.faq-topic-list');
  const tabs = [...list.querySelectorAll('.faq-topic-tab')];
  const panels = [...section.querySelectorAll('.faq-topic-panel')];
  if (!tabs.length || tabs.length !== panels.length) return;

  function select(index) {
    tabs.forEach((tab, position) => {
      const selected = position === index;
      tab.classList.toggle('is-selected', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[position].hidden = !selected;
    });
  }

  panels.forEach((panel, index) => {
    // Native disclosures remain usable when JavaScript is unavailable.
    panel.open = true;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabs[index].id);
    panel.tabIndex = 0;
    panel.querySelector('summary').hidden = true;
    panel.querySelectorAll('[data-faq-enhanced]').forEach(element => { element.hidden = false; });
  });
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(next);
      tabs[next].focus();
    });
  });
  select(0);
  section.classList.add('has-faq-topics');
  list.hidden = false;
})();
