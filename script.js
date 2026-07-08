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
      const eased = 1 - Math.pow(1 - progress, 3);
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

  /* ---------- Project Modal (16:9) ---------- */
  const modal = document.getElementById('projectModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalImage = document.getElementById('modalImage');
  const modalEyebrow = document.getElementById('modalEyebrow');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalTags = document.getElementById('modalTags');

  const projectsData = {
    1: {
      title: 'Showrun Production',
      eyebrow: '01 / Showrun Production',
      description: 'Создание POS-материалов для музыкального тура исполнителя Элджей. Разработка креативов для социальных сетей, наружной рекламы и оформление сайта компании.',
      tags: ['Тур Элджей', 'Наружная реклама', 'Сайт'],
      image: 'assets/case_13.png'
    },
    2: {
      title: 'Olimpbet Fighting',
      eyebrow: '02 / Olimpbet Fighting',
      description: 'Полная упаковка бренда. Создание афиш, постеров, инфографики для социальных сетей и рекламных агрегаторов. Разработка обложек для видео и motion-графики для историй в социальных сетях.',
      tags: ['Брендинг', '1500+ креативов', 'Motion'],
      image: 'assets/case_16.png'
    },
    3: {
      title: 'ACA',
      eyebrow: '03 / ACA',
      description: 'Создание афиш, постеров, инфографики для социальных сетей и рекламных агрегаторов. Работа над 4 стадионными турнирами и 15+ обложками за 3 месяца.',
      tags: ['Absolute Championship Akhmat', '4 турнира', '15+ обложек'],
      image: 'assets/case_18.png'
    },
    4: {
      title: 'Force Fighting Championship',
      eyebrow: '04 / Force Fighting',
      description: 'Создание логотипа, подбор фирменных цветов. Разработка афиш, постеров, инфографики для социальных сетей. Создание спортивной формы и POS-материалов для стадионных ивентов. 50+ креативов, 2 стадионных турнира.',
      tags: ['Логотип', 'Форма', 'Постеры', '50+ креативов'],
      image: 'assets/case_14.png'
    },
    5: {
      title: 'Armat Fight Show',
      eyebrow: '05 / Armat Fight Show',
      description: 'Полная упаковка бренда первого профессионального MMA-промоушена в Армении. Создание афиш, постеров, фирменного мерча, POS-материалов для стадионных ивентов и motion-графики для прямых эфиров в социальных сетях.',
      tags: ['Первый MMA-промоушен в Армении', 'Брендинг', 'Motion'],
      image: 'assets/case_19.png'
    },
    6: {
      title: 'Другие работы',
      eyebrow: '06 / Другие работы',
      description: 'Разработка визуальной идентичности для бренда Lit Energy. Создание креативов для Чемпионата мира WPF × WRPF. Оформление и визуальный стиль для СМИ «Сечка».',
      tags: ['Lit Energy', 'WPF × WRPF', 'Сечка'],
      image: 'assets/case_20.png'
    }
  };

  function openModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    modalImage.src = data.image;
    modalImage.alt = data.title;
    modalEyebrow.textContent = data.eyebrow;
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    
    modalTags.innerHTML = '';
    data.tags.forEach(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      modalTags.appendChild(span);
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const projectId = this.dataset.project;
      if (projectId) {
        e.stopPropagation();
        openModal(projectId);
      }
    });
  });

  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

})();