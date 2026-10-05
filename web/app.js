(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* sticky topbar hairline */
  var topbar = document.querySelector('.topbar');
  function syncTopbar() {
    topbar.classList.toggle('is-stuck', window.scrollY > 8);
  }
  syncTopbar();
  window.addEventListener('scroll', syncTopbar, { passive: true });

  /* reveal on scroll */
  var revealables = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* project filters */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('#project-grid .card'));

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.dataset.filter;
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', String(c === chip));
      });
      cards.forEach(function (card) {
        var show = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* expandable project detail */
  cards.forEach(function (card) {
    var toggle = card.querySelector('.more');
    var panel = card.querySelector('.detail');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      card.classList.toggle('is-open', !open);
      toggle.textContent = open ? '工程细节' : '收起';
      if (open && !reduceMotion) {
        var top = card.getBoundingClientRect().top;
        if (top < 72) window.scrollBy({ top: top - 88, behavior: 'smooth' });
      }
    });
  });

  /* active section in nav */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length) {
    var ticking = false;
    var syncNav = function () {
      ticking = false;
      var mark = window.scrollY + window.innerHeight * 0.32;
      var current = null;
      sections.forEach(function (section) {
        if (section.offsetTop <= mark) current = section.id;
      });
      navLinks.forEach(function (link) {
        var active = current !== null && link.getAttribute('href') === '#' + current;
        link.classList.toggle('is-active', active);
      });
    };
    var requestSync = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(syncNav);
    };
    syncNav();
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync);
  }
})();
