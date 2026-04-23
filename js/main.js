/* ============================================================
   main.js — Global JavaScript Utilities
   NEXCORE Company Website
   ============================================================ */
'use strict';

/* ── Nav Scroll Effect ────────────────────────────────────── */
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Scroll Fade-in ───────────────────────────────────────── */
function initScrollFade() {
  const els = document.querySelectorAll('.fi');
  if (!els.length) return;
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(function (el) { io.observe(el); });
}

/* ── Counter Animation ────────────────────────────────────── */
function animCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1800;
  const start    = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const e = 1 - Math.pow(1 - p, 4);
    el.innerHTML = Math.round(e * target).toLocaleString() + '<span>' + suffix + '</span>';
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  const els = document.querySelectorAll('[data-target]');
  if (!els.length) return;
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animCounter(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  els.forEach(function (el) { io.observe(el); });
}

/* ── Tab Component ────────────────────────────────────────── */
function initTabs(containerSel) {
  var containers = document.querySelectorAll(containerSel || '.tabs-wrap');
  containers.forEach(function (wrap) {
    var btns   = wrap.querySelectorAll('.tab-btn');
    var panels = wrap.querySelectorAll('.tab-panel');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.tab;
        btns.forEach(function (b) { b.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        var panel = wrap.querySelector('[data-panel="' + id + '"]');
        if (panel) panel.classList.add('active');
      });
    });
    if (btns[0]) btns[0].click();
  });
}

/* ── Accordion ────────────────────────────────────────────── */
function initAccordion(containerSel) {
  var items = document.querySelectorAll((containerSel || '.accordion') + ' .accordion-item');
  items.forEach(function (item) {
    var header  = item.querySelector('.accordion-header');
    var content = item.querySelector('.accordion-content');
    if (!header || !content) return;
    header.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      items.forEach(function (i) {
        i.classList.remove('open');
        var c = i.querySelector('.accordion-content');
        if (c) c.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ── Progress Bars ────────────────────────────────────────── */
function initProgressBars() {
  var fills = document.querySelectorAll('.progress-fill[data-width]');
  if (!fills.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(function (f) { io.observe(f); });
}

/* ── Smooth Anchor Scroll ─────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 72,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ── Active Nav Link (scroll-spy) ─────────────────────────── */
function initScrollSpy(sectionIds) {
  if (!sectionIds || !sectionIds.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav__links .nav__link').forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { threshold: 0.35 });
  sectionIds.forEach(function (id) {
    var s = document.getElementById(id);
    if (s) io.observe(s);
  });
}

/* ── Auto-init on DOMContentLoaded ───────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initNavScroll();
  initScrollFade();
  initCounters();
  initProgressBars();
  initSmoothScroll();
});

/* ── Public API ───────────────────────────────────────────── */
window.App = { initTabs, initAccordion, initScrollSpy, animCounter };
