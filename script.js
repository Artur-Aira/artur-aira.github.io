/* ============================================================
   ARTUR AIRAPETYAN — PORTFOLIO 2026
   Interactions: header state, custom cursor, scroll reveals,
   count-up stats, mobile navigation, scroll progress
   ============================================================ */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: hide on scroll down, show on scroll up ---------- */
  const header = document.getElementById('siteHeader');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const y = window.scrollY;

    header.classList.toggle('scrolled', y > 40);

    if (y > lastScrollY && y > 160) {
      header.classList.add('hide');
    } else {
      header.classList.remove('hide');
    }

    lastScrollY = y;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('progressBar');

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  window.addEventListener('scroll', () => window.requestAnimationFrame(updateProgress), { passive: true });
  updateProgress();

  /* ---------- Mobile navigation toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Открыть меню');
    });
  });

  /* ---------- Custom cursor (desktop pointer only) ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsHover && cursorDot) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    }, { passive: true });

    const interactiveSelectors = 'a, button, .case-figure, .project-card, .about-photo';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursorDot.classList.add('expand');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursorDot.classList.remove('expand');
      }
    });
  }

  /* ---------- Hero load-in animation ---------- */
  const hero = document.querySelector('.hero');
  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      hero.classList.add('is-loaded');
    });
  });

  /* ---------- Scroll-triggered reveals ---------- */
  const revealTargets = document.querySelectorAll(
    '.about-photo, .about-content, .experience-row, .case-meta, .case-title, .case-desc, .case-figure, .case-stats, .case-results, .project-card, .stat-item, .contact-title, .contact-links'
  );

  revealTargets.forEach((el) => el.classList.add('fade-in-up'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));

  /* Stagger children inside grids (experience rows, project cards, case figures) */
  function staggerGroup(selector, delayStep) {
    document.querySelectorAll(selector).forEach((group) => {
      const items = Array.from(group.children);
      items.forEach((item, i) => {
        item.style.transitionDelay = prefersReducedMotion ? '0ms' : `${i * delayStep}ms`;
      });
    });
  }

  staggerGroup('.experience-list', 60);
  staggerGroup('.project-grid', 80);
  staggerGroup('.case-figures', 100);

  /* ---------- Count-up stats ---------- */
  const statNumbers = document.querySelectorAll('.stat-num');

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    if (prefersReducedMotion || !target) {
      el.textContent = target;
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString('ru-RU');

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString('ru-RU');
      }
    }

    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => animateCount(entry.target), i * 150);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  statNumbers.forEach((el) => statsObserver.observe(el));

  /* ---------- Smooth in-page anchor scrolling with header offset ---------- */
  const headerOffset = 96;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const top = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

})();
