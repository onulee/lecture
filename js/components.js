/* ============================================================
   components.js — Shared Nav & Footer Injection
   NEXCORE Company Website
   ============================================================ */
'use strict';

(function () {
  const isPages = window.location.pathname.includes('/pages/');
  const root    = isPages ? '../' : '';
  const pagesDir = isPages ? '' : 'pages/';

  /* ── Nav HTML ─────────────────────────────────────────────── */
  function buildNav() {
    const links = [
      { href: `${root}${pagesDir}about.html`, label: '소개',      page: 'about'  },
      { href: `${root}${pagesDir}tech.html`,  label: '기술과서비스', page: 'tech'   },
      { href: `${root}${pagesDir}esg.html`,   label: '약속과책임',  page: 'esg'    },
      { href: `${root}${pagesDir}news.html`,  label: '소식',       page: 'news'   },
      { href: `${root}${pagesDir}ir.html`,    label: '투자정보',   page: 'ir'     },
    ];
    const currentFile = window.location.pathname.split('/').pop();
    const linkHtml = links.map(l =>
      `<li><a href="${l.href}" class="nav__link${currentFile.includes(l.page) ? ' active' : ''}">${l.label}</a></li>`
    ).join('');

    return `
<nav class="nav" id="mainNav">
  <div class="nav__inner">
    <a href="${root}index.html" class="nav__logo">
      <div class="nav__logo-mark">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
          <rect x="0" y="0" width="8" height="8" rx="1.5"/>
          <rect x="10" y="0" width="8" height="8" rx="1.5" opacity=".6"/>
          <rect x="0" y="10" width="8" height="8" rx="1.5" opacity=".6"/>
          <rect x="10" y="10" width="8" height="8" rx="1.5" opacity=".25"/>
        </svg>
      </div>
      <span class="nav__logo-text">NEXCORE</span>
    </a>
    <ul class="nav__links">${linkHtml}</ul>
    <a href="${root}${pagesDir}news.html" class="nav__cta">문의하기</a>
    <button class="nav__burger" id="navBurger" aria-label="메뉴">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="nav__mobile" id="navMobile">
  ${links.map(l => `<a href="${l.href}" class="nav__link">${l.label}</a>`).join('')}
  <a href="${root}${pagesDir}news.html" class="btn btn--primary" style="margin-top:.5rem">문의하기</a>
</div>`;
  }

  /* ── Footer HTML ──────────────────────────────────────────── */
  function buildFooter() {
    return `
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-grid">
      <div>
        <div class="footer-logo">
          <div class="footer-logo-mark">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="white">
              <rect x="0" y="0" width="8" height="8" rx="1.5"/>
              <rect x="10" y="0" width="8" height="8" rx="1.5" opacity=".6"/>
              <rect x="0" y="10" width="8" height="8" rx="1.5" opacity=".6"/>
              <rect x="10" y="10" width="8" height="8" rx="1.5" opacity=".25"/>
            </svg>
          </div>
          <span class="footer-logo-name">NEXCORE</span>
        </div>
        <p class="footer-brand-desc">기술과 신뢰를 바탕으로 더 나은 세상을 만들어가는 기업입니다. 1999년 설립 이후 23년간 혁신을 선도합니다.</p>
        <div class="footer-socials">
          <a href="#" class="footer-social">in</a>
          <a href="#" class="footer-social">fb</a>
          <a href="#" class="footer-social">yt</a>
        </div>
      </div>
      <div>
        <div class="footer-col-title">회사</div>
        <ul class="footer-links">
          <li><a href="${root}${pagesDir}about.html">소개</a></li>
          <li><a href="${root}${pagesDir}about.html">연혁</a></li>
          <li><a href="${root}${pagesDir}about.html">경영진</a></li>
          <li><a href="${root}${pagesDir}esg.html">약속과책임</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">서비스</div>
        <ul class="footer-links">
          <li><a href="${root}${pagesDir}tech.html">기술과서비스</a></li>
          <li><a href="${root}${pagesDir}tech.html">AI 솔루션</a></li>
          <li><a href="${root}${pagesDir}tech.html">클라우드</a></li>
          <li><a href="${root}${pagesDir}news.html">소식</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">투자 / 연락처</div>
        <ul class="footer-links">
          <li><a href="${root}${pagesDir}ir.html">투자정보</a></li>
          <li><a href="mailto:ir@nexcore.co.kr">ir@nexcore.co.kr</a></li>
          <li><a href="mailto:info@nexcore.co.kr">info@nexcore.co.kr</a></li>
          <li><a href="tel:0212345678">02-1234-5678</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2025 NEXCORE Corporation. All rights reserved.</span>
      <div class="footer-bottom-links">
        <a href="#">개인정보처리방침</a>
        <a href="#">이용약관</a>
        <a href="#">사이트맵</a>
      </div>
    </div>
  </div>
</footer>`;
  }

  /* ── Inject ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    const navSlot    = document.getElementById('nav-slot');
    const footerSlot = document.getElementById('footer-slot');
    if (navSlot)    navSlot.outerHTML    = buildNav();
    if (footerSlot) footerSlot.outerHTML = buildFooter();

    /* Init burger after injection */
    const burger = document.getElementById('navBurger');
    const mobile = document.getElementById('navMobile');
    if (burger && mobile) {
      burger.addEventListener('click', function () {
        burger.classList.toggle('open');
        mobile.classList.toggle('open');
        document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
      });
      mobile.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          burger.classList.remove('open');
          mobile.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  });
})();
