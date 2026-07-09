/* ============================================================
   ARTUR AIRAPETYAN — PORTFOLIO 2026
   ============================================================ */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = 'cubic-bezier(0.16,1,0.3,1)';

  /* ---------- Header: hide/show + white-on-scroll ---------- */
  const header = document.getElementById('siteHeader');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    if (!header) { ticking = false; return; }
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 80);
    if (y > lastScrollY && y > 200) {
      header.classList.add('hide');
    } else {
      header.classList.remove('hide');
    }
    lastScrollY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
  }, { passive: true });

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('progressBar');
  function updateProgress() {
    if (!progressBar) return;
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = Math.min(pct, 100) + '%';
  }
  window.addEventListener('scroll', () => requestAnimationFrame(updateProgress), { passive: true });
  updateProgress();

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Открыть меню');
      });
    });
  }

  /* ---------- Custom cursor ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsHover && cursorDot) {
    window.addEventListener('mousemove', e => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top  = e.clientY + 'px';
    }, { passive: true });

    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button, .case-figure, .project-card, .about-photo'))
        cursorDot.classList.add('expand');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest('a, button, .case-figure, .project-card, .about-photo'))
        cursorDot.classList.remove('expand');
    });
  }

  /* ---------- Scroll-triggered reveals ---------- */
  const revealTargets = document.querySelectorAll(
    '.about-photo, .about-content, .experience-row, .case-meta, .case-title, .case-desc, .case-figure, .case-stats, .case-results, .project-card, .stat-item, .contact-title, .contact-links'
  );
  revealTargets.forEach(el => el.classList.add('fade-in-up'));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* Stagger groups */
  function staggerGroup(selector, step) {
    document.querySelectorAll(selector).forEach(group => {
      Array.from(group.children).forEach((item, i) => {
        item.style.transitionDelay = prefersReducedMotion ? '0ms' : `${i * step}ms`;
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
    if (!target || prefersReducedMotion) { el.textContent = target.toLocaleString('ru-RU'); return; }
    const duration = 1400;
    const startTime = performance.now();
    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('ru-RU');
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('ru-RU');
    }
    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => animateCount(entry.target), i * 150);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statNumbers.forEach(el => statsObserver.observe(el));

  /* ---------- Smooth anchor scroll ---------- */
  const headerOffset = 0; // header прозрачный, не занимает места над hero
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (id === '#top' ? 0 : 80);
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Project Modal ---------- */
  const modal       = document.getElementById('projectModal');
  const modalOverlay= document.getElementById('modalOverlay');
  const modalClose  = document.getElementById('modalClose');
  const modalImage  = document.getElementById('modalImage');
  const modalEyebrow= document.getElementById('modalEyebrow');
  const modalTitle  = document.getElementById('modalTitle');
  const modalDesc   = document.getElementById('modalDescription');
  const modalTags   = document.getElementById('modalTags');

    const projectsData = {
    1: {
      eyebrow: '01 / Showrun Production',
      title: 'Showrun Production',
      description: 'Создание POS-материалов для музыкального тура исполнителя Элджей. Разработка креативов для социальных сетей, наружной рекламы и оформление сайта компании.',
      tags: ['Тур Элджей', 'Наружная реклама', 'Сайт'],
      images: ['assets/case_13.png']
    },
    2: {
      eyebrow: '02 / Olimpbet Fighting',
      title: 'Olimpbet Fighting',
      description: 'Полная упаковка бренда. Создание афиш, постеров, инфографики для социальных сетей и рекламных агрегаторов. Разработка обложек для видео и motion-графики для историй в социальных сетях.',
      tags: ['Брендинг', '1500+ креативов', 'Motion'],
      images: ['assets/case_16_1.png', 'assets/case_16_2.png']
    },
    3: {
      eyebrow: '03 / ACA',
      title: 'ACA',
      description: 'Создание афиш, постеров, инфографики для социальных сетей и рекламных агрегаторов. Работа над 4 стадионными турнирами и 15+ обложками за 3 месяца.',
      tags: ['Absolute Championship Akhmat', '4 турнира', '15+ обложек'],
      images: ['assets/case_18.png']
    },
    4: {
      eyebrow: '04 / Force Fighting',
      title: 'Force Fighting Championship',
      description: 'Создание логотипа, подбор фирменных цветов. Разработка афиш, постеров, инфографики для социальных сетей. Создание спортивной формы и POS-материалов для стадионных ивентов. 50+ креативов, 2 стадионных турнира.',
      tags: ['Логотип', 'Форма', 'Постеры', '50+ креативов'],
      images: ['assets/case_14_1.png', 'assets/case_14_2.png']
    },
    5: {
      eyebrow: '05 / Armat Fight Show',
      title: 'Armat Fight Show',
      description: 'Полная упаковка бренда первого профессионального MMA-промоушена в Армении. Создание афиш, постеров, фирменного мерча, POS-материалов для стадионных ивентов и motion-графики для прямых эфиров в социальных сетях.',
      tags: ['Первый MMA-промоушен в Армении', 'Брендинг', 'Motion'],
      images: ['assets/case_19.png']
    },
    6: {
      eyebrow: '06 / Другие работы',
      title: 'Другие работы',
      description: 'Разработка визуальной идентичности для бренда Lit Energy. Создание креативов для Чемпионата мира WPF × WRPF. Оформление и визуальный стиль для СМИ «Сечка».',
      tags: ['Lit Energy', 'WPF × WRPF', 'Сечка'],
      images: ['assets/case_20.png']
    }
  };

  function openModal(id) {
    const data = projectsData[id];
    if (!data || !modal) return;
    currentImages = data.images || [data.image];
    currentImageIndex = 0;
    modalImage.alt = data.title;
    modalEyebrow.textContent = data.eyebrow;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;
    modalTags.innerHTML = data.tags.map(t => `<span>${t}</span>`).join('');
    updateGallery();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (modalClose) modalClose.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function() {
      openModal(this.dataset.project);
    });
    // Keyboard support
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(this.dataset.project);
      }
    });
  });

  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if (modalClose)   modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ---------- Галерея в модальном окне ---------- */
  let currentImageIndex = 0;
  let currentImages = [];

  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');
  const modalCounter = document.getElementById('modalCounter');

  function updateGallery() {
    if (currentImages.length <= 1) {
      modalPrev.style.display = 'none';
      modalNext.style.display = 'none';
      modalCounter.style.display = 'none';
    } else {
      modalPrev.style.display = 'flex';
      modalNext.style.display = 'flex';
      modalCounter.style.display = 'block';
      modalCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
    }
    modalImage.src = currentImages[currentImageIndex];
  }

  function nextImage() {
    if (currentImages.length <= 1) return;
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateGallery();
  }

  function prevImage() {
    if (currentImages.length <= 1) return;
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    updateGallery();
  }

  if (modalPrev) modalPrev.addEventListener('click', function(e) {
    e.stopPropagation();
    prevImage();
  });

  if (modalNext) modalNext.addEventListener('click', function(e) {
    e.stopPropagation();
    nextImage();
  });

  // Клавиши ← → для навигации
  document.addEventListener('keydown', function(e) {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

})();
