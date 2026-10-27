/* =========================================================
   ABOGLOBE — Main JavaScript
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- 1. PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    if (document.readyState === 'complete') {
      setTimeout(() => preloader.classList.add('done'), 300);
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('done'), 400);
      });
    }
    setTimeout(() => preloader.classList.add('done'), 4000);
  }

  /* ---------- 2. SCROLL PROGRESS ---------- */
  const progressBar = document.getElementById('scroll-progress');
  const updateProgress = () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  /* ---------- 3. CURSOR GLOW ---------- */
  const glow = document.getElementById('cursor-glow');
  if (glow && canHover && !prefersReducedMotion) {
    let gx = window.innerWidth / 2;
    let gy = window.innerHeight / 2;
    let cx = gx;
    let cy = gy;
    window.addEventListener('mousemove', (e) => { gx = e.clientX; gy = e.clientY; }, { passive: true });
    const animateGlow = () => {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.left = cx + 'px';
      glow.style.top = cy + 'px';
      requestAnimationFrame(animateGlow);
    };
    animateGlow();
  } else if (glow) {
    glow.style.display = 'none';
  }

  /* ---------- 4. NAV SCROLL STATE ---------- */
  const nav = document.querySelector('.glass-nav');
  if (nav) {
    const updateNav = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ---------- 5. MOBILE MENU ---------- */
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      const icon = mobileBtn.querySelector('i');
      if (icon) icon.className = isHidden ? 'lni lni-close' : 'lni lni-menu';
    });
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileBtn.querySelector('i');
        if (icon) icon.className = 'lni lni-menu';
      });
    });
  }

  /* ---------- 6. ACTIVE NAV LINK ---------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('text-brand-gold', 'font-semibold');
    }
  });

  /* ---------- 7. FOOTER YEAR ---------- */
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ---------- 8. SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (revealEls.length) {
    if (prefersReducedMotion) {
      revealEls.forEach((el) => el.classList.add('active'));
    } else {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            obs.unobserve(entry.target);
          }
        });
      }, { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 });
      revealEls.forEach((el) => observer.observe(el));
    }
  }

  /* ---------- 9. ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.target) || 0;
      const suffix = el.dataset.suffix || '';
      if (prefersReducedMotion) {
        el.textContent = Math.round(target) + suffix;
        return;
      }
      const duration = 2000;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => counterObserver.observe(c));
  }

  /* ---------- 10. FINTECH CARD SPOTLIGHT ---------- */
  if (canHover && !prefersReducedMotion) {
    document.querySelectorAll('.fintech-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      }, { passive: true });
    });
  }

  /* ---------- 11. MAGNETIC BUTTONS ---------- */
  if (canHover && !prefersReducedMotion) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ---------- 12. TESTIMONIAL CAROUSEL ---------- */
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (track && dots.length) {
    let idx = 0;
    const total = dots.length;
    const go = (i) => {
      idx = i;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, k) => d.classList.toggle('active', k === idx));
    };
    dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
    if (!prefersReducedMotion) {
      setInterval(() => go((idx + 1) % total), 6000);
    }
  }

  /* ---------- 13. CASE STUDY TAB FILTER ---------- */
  const caseTabs = document.querySelectorAll('.case-tab');
  const caseCards = document.querySelectorAll('.case-card');
  if (caseTabs.length && caseCards.length) {
    caseTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        caseTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        caseCards.forEach((card) => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('hidden', !show);
        });
      });
    });
  }

  /* ---------- 14. FAQ ACCORDION ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {
    faqItems.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          faqItems.forEach((other) => {
            if (other !== item) other.open = false;
          });
        }
      });
    });
  }

  /* ---------- 15. UNIFIED FAB (Scroll + Chat) ---------- */
  const fabContainer = document.getElementById('fab-container');
  const fabMain = document.getElementById('fab-main');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const scrollAction = document.getElementById('fab-scroll-action');
  const chatAction = document.getElementById('fab-chat-action');
  const fabBadge = document.getElementById('fab-badge');

  let fabOpen = false;

  const openChat = () => {
    chatWindow?.classList.add('open');
    fabBadge?.classList.remove('show');
    setTimeout(() => document.getElementById('chat-input')?.focus(), 300);
    const msgs = document.getElementById('chat-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  };
  const closeChat = () => chatWindow?.classList.remove('open');

  const collapseFab = () => {
    fabOpen = false;
    fabContainer?.classList.remove('expanded');
  };

  if (fabMain && fabContainer) {
    fabMain.addEventListener('click', (e) => {
      e.stopPropagation();
      fabOpen = !fabOpen;
      fabContainer.classList.toggle('expanded', fabOpen);
    });
  }

  scrollAction?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    collapseFab();
  });

  chatAction?.addEventListener('click', () => {
    openChat();
    collapseFab();
  });

  chatClose?.addEventListener('click', closeChat);

  document.addEventListener('click', (e) => {
    if (fabContainer && !fabContainer.contains(e.target)) {
      collapseFab();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeChat();
      collapseFab();
    }
  });

  if (fabBadge && chatWindow) {
    setTimeout(() => {
      if (!chatWindow.classList.contains('open')) {
        fabBadge.classList.add('show');
      }
    }, 6000);
  }

  /* ---------- 16. SCROLL ACTION VISIBILITY ---------- */
  const scrollActionEl = document.getElementById('fab-scroll-action');
  if (scrollActionEl) {
    const updateScrollAction = () => {
      const visible = window.scrollY > 400;
      scrollActionEl.style.opacity = visible ? '1' : '0';
      scrollActionEl.style.pointerEvents = visible ? 'auto' : 'none';
    };
    window.addEventListener('scroll', updateScrollAction, { passive: true });
    updateScrollAction();
  }

  /* ---------- 17. HERO CAROUSEL ---------- */
  const carouselRoot = document.getElementById('hero-carousel');
  if (carouselRoot) {
    const slides = Array.from(carouselRoot.querySelectorAll('.hero-slide'));
    const carouselDots = Array.from(carouselRoot.querySelectorAll('.hero-carousel-dot'));
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    const progressFill = document.getElementById('hero-progress-fill');

    if (slides.length) {
      const AUTOPLAY_MS = 6000;
      let current = 0;
      let timer = null;
      let isPaused = false;

      const restartProgress = () => {
        if (!progressFill) return;
        progressFill.style.transition = 'none';
        progressFill.style.width = '0%';
        void progressFill.offsetWidth;
        progressFill.style.transition = `width ${AUTOPLAY_MS}ms linear`;
        progressFill.style.width = '100%';
      };

      const pauseProgress = () => {
        if (!progressFill) return;
        const computed = window.getComputedStyle(progressFill).width;
        progressFill.style.transition = 'none';
        progressFill.style.width = computed;
      };

      const setActive = (index) => {
        current = ((index % slides.length) + slides.length) % slides.length;
        slides.forEach((slide, i) => {
          const active = i === current;
          slide.classList.toggle('is-active', active);
          slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        });
        carouselDots.forEach((dot, i) => {
          const active = i === current;
          dot.classList.toggle('is-active', active);
          dot.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        restartProgress();
      };

      const next = () => setActive(current + 1);
      const prev = () => setActive(current - 1);

      const stopAutoplay = () => {
        if (timer) clearTimeout(timer);
        timer = null;
      };

      const startAutoplay = () => {
        if (prefersReducedMotion) return;
        stopAutoplay();
        timer = setTimeout(() => {
          next();
          startAutoplay();
        }, AUTOPLAY_MS);
      };

      if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
      if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });

      carouselDots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const target = parseInt(dot.dataset.goto, 10);
          if (!isNaN(target)) {
            setActive(target);
            startAutoplay();
          }
        });
      });

      carouselRoot.addEventListener('mouseenter', () => { stopAutoplay(); pauseProgress(); });
      carouselRoot.addEventListener('mouseleave', () => {
        if (!document.hidden) { startAutoplay(); restartProgress(); }
      });
      carouselRoot.addEventListener('focusin', () => { stopAutoplay(); pauseProgress(); });
      carouselRoot.addEventListener('focusout', () => {
        if (!document.hidden) { startAutoplay(); restartProgress(); }
      });

      carouselRoot.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
        if (e.key === 'ArrowRight') { next(); startAutoplay(); }
      });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          stopAutoplay();
          pauseProgress();
          isPaused = true;
        } else if (isPaused) {
          isPaused = false;
          startAutoplay();
          restartProgress();
        }
      });

      let touchStartX = 0;
      let touchStartY = 0;
      carouselRoot.addEventListener('touchstart', (e) => {
        if (!e.touches || !e.touches[0]) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });
      carouselRoot.addEventListener('touchend', (e) => {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
        if (dx > 0) prev(); else next();
        startAutoplay();
      }, { passive: true });

      setActive(0);
      startAutoplay();
    }
  }

});