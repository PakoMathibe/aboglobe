/* =========================================================
   ABOGLOBE — Vendor Management System page
   Module tab filtering. Nothing else needed — accordion
   uses native <details>, counters/reveal come from main.js.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const tabs = document.querySelectorAll('.vms-module-tab');
  const cards = document.querySelectorAll('.vms-module-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter cards
      const filter = tab.dataset.filter;
      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });

});