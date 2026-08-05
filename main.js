/* ════════════════════════════════════════════════════════════════════
   Dr. Wilmer Palacios Torrealba — Otorrinolaringología y Rinología
   Base: plantilla dental de la skill creador-de-webs (misma lógica que
   la web de la Dra. Elsa Sánchez). Sin WhatsApp: el Dr. no tiene número
   público, así que el booking es solo una demo (ver initBookingCalendar).
   ════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  const safe = (fn, name) => {
    try { fn(); } catch (e) { console.error('[ERROR] ' + name + ':', e); }
  };

  const raf = (cb) => requestAnimationFrame(cb);
  const query = (sel) => document.querySelector(sel);
  const queryAll = (sel) => document.querySelectorAll(sel);

  // ─── HERO READY STATE ───────────────────────────────────────────────
  const initHeroReady = () => {
    const hero = query('.hero');
    if (!hero) return;
    raf(() => { hero.classList.add('is-ready'); });
  };

  // ─── NAV SOLIDIFY ───────────────────────────────────────────────────
  const initNavSolidify = () => {
    const nav = query('.nav');
    if (!nav) return;
    const updateNav = () => {
      if (window.scrollY > 50) {
        nav.classList.add('is-solid');
      } else {
        nav.classList.remove('is-solid');
      }
    };
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  };

  // ─── MOBILE MENU ────────────────────────────────────────────────────
  const initMobileMenu = () => {
    const hamburger = query('.nav__hamburger');
    const nav = query('.nav');
    if (!hamburger) return;
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('is-mobile-open');
      hamburger.setAttribute('aria-expanded', nav.classList.contains('is-mobile-open'));
    });
    queryAll('.nav__links a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-mobile-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  };

  // ─── REVEAL ELEMENTS ────────────────────────────────────────────────
  const initReveals = () => {
    const reveals = queryAll('.reveal');
    const options = { threshold: 0.05 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, options);
    reveals.forEach(el => observer.observe(el));
    // Safety timeout
    setTimeout(() => {
      reveals.forEach(el => {
        if (!el.classList.contains('is-visible')) {
          el.classList.add('is-visible');
        }
      });
    }, 6000);
  };

  // ─── BEFORE / AFTER SLIDERS ────────────────────────────────────────
  const initBeforeAfterSliders = () => {
    queryAll('.ba-slider').forEach(slider => {
      const handle = slider.querySelector('.ba-slider__handle');
      const after = slider.querySelector('.ba-slider__after');
      if (!handle || !after) return;

      let isDown = false;

      const updatePosition = (clientX) => {
        const rect = slider.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        handle.style.left = percent + '%';
        // After is on the RIGHT: clip from the left
        after.style.clipPath = 'inset(0 0 0 ' + percent + '%)';
      };

      // Mouse events — listen on the SLIDER, not the handle
      slider.addEventListener('mousedown', (e) => {
        isDown = true;
        updatePosition(e.clientX);
      });
      document.addEventListener('mouseup', () => { isDown = false; });
      document.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        updatePosition(e.clientX);
      });

      // Touch events
      slider.addEventListener('touchstart', (e) => {
        isDown = true;
        updatePosition(e.touches[0].clientX);
      });
      document.addEventListener('touchend', () => { isDown = false; });
      document.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        updatePosition(e.touches[0].clientX);
      });
    });
  };

  // ─── BOOKING CALENDAR ──────────────────────────────────────────────
  const initBookingCalendar = () => {
    const daysContainer = query('#booking-days');
    const monthLabel = query('#booking-month-label');
    const prevBtn = query('#booking-prev');
    const nextBtn = query('#booking-next');
    const slotsWrap = query('#booking-slots');
    const formWrap = query('#booking-form-wrap');
    const form = query('#booking-form');
    const successWrap = query('#booking-success');

    if (!daysContainer || !monthLabel) return;

    const now = new Date();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();
    let selectedDay = null;

    const monthNames = [
      'Enero','Febrero','Marzo','Abril','Mayo','Junio',
      'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
    ];

    const renderCalendar = () => {
      daysContainer.innerHTML = '';
      monthLabel.textContent = monthNames[currentMonth] + ' ' + currentYear;

      // Disable prev if current month
      prevBtn.disabled = (currentMonth === now.getMonth() && currentYear === now.getFullYear());

      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const startOffset = (firstDay === 0 ? 6 : firstDay - 1); // Monday = 0

      // Empty cells
      for (let i = 0; i < startOffset; i++) {
        const empty = document.createElement('button');
        empty.className = 'booking-day booking-day--empty';
        empty.disabled = true;
        daysContainer.appendChild(empty);
      }

      // Day cells
      for (let d = 1; d <= daysInMonth; d++) {
        const btn = document.createElement('button');
        btn.className = 'booking-day';
        btn.textContent = d;

        const date = new Date(currentYear, currentMonth, d);
        const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat
        const isPast = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const isToday = (d === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear());

        if (isPast || dayOfWeek === 0) {
          btn.classList.add('booking-day--off');
          btn.disabled = true;
        } else {
          btn.classList.add('booking-day--avail');
          btn.addEventListener('click', () => {
            // Deselect previous
            const prev = daysContainer.querySelector('.booking-day--selected');
            if (prev) prev.classList.remove('booking-day--selected');
            btn.classList.add('booking-day--selected');
            selectedDay = d;

            // Show slots
            if (slotsWrap) slotsWrap.hidden = false;
          });
        }

        if (isToday) btn.classList.add('booking-day--today');
        daysContainer.appendChild(btn);
      }
    };

    prevBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      selectedDay = null;
      if (slotsWrap) slotsWrap.hidden = true;
      if (formWrap) formWrap.hidden = true;
      renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      selectedDay = null;
      if (slotsWrap) slotsWrap.hidden = true;
      if (formWrap) formWrap.hidden = true;
      renderCalendar();
    });

    // Slot selection
    queryAll('.slot:not(.slot--busy)').forEach(slot => {
      slot.addEventListener('click', () => {
        queryAll('.slot').forEach(s => s.classList.remove('slot--selected'));
        slot.classList.add('slot--selected');
        if (formWrap) formWrap.hidden = false;
      });
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show success state — esto es solo una demo, no envía nada real.
        if (successWrap) {
          form.parentElement.hidden = true;
          if (slotsWrap) slotsWrap.hidden = true;
          successWrap.hidden = false;
        }
      });
    }

    renderCalendar();
  };

  // ─── SMOOTH SCROLL ANCHORS ─────────────────────────────────────────
  const initSmoothScroll = () => {
    queryAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = query(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  };

  // ─── COUNT UP NUMBERS ──────────────────────────────────────────────
  const initCountUp = () => {
    queryAll('[data-count-to]').forEach(el => {
      const targetStr = el.getAttribute('data-count-to');
      const suffix = el.getAttribute('data-suffix') || '';
      const target = parseInt(targetStr, 10);

      const options = { threshold: 0.5 };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let current = 0;
            const increment = Math.ceil(target / 60);
            const interval = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(interval);
              }
              el.textContent = current + suffix;
            }, 30);
            observer.unobserve(el);
          }
        });
      }, options);
      observer.observe(el);
    });
  };

  // ─── INIT ALL ───────────────────────────────────────────────────────
  const init = () => {
    safe(initHeroReady, 'Hero Ready');
    safe(initNavSolidify, 'Nav Solidify');
    safe(initMobileMenu, 'Mobile Menu');
    safe(initReveals, 'Reveals');
    safe(initBeforeAfterSliders, 'Before/After');
    safe(initBookingCalendar, 'Booking Calendar');
    safe(initSmoothScroll, 'Smooth Scroll');
    safe(initCountUp, 'Count Up');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
