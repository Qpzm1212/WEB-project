/**
 * Meat Point Astana: UI Effects & Theme Controller
 * Default: Editorial Light Theme (#F6F0E6)
 * Zero Emojis, No Bouncing Animations
 */

(function (window, document) {
  'use strict';

  const THEME_STORAGE_KEY = 'meatpoint_theme_v2';

  // 1. Theme Controller: Default Light Theme
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'theme-light';
    applyTheme(savedTheme);

    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const isDark = document.body.classList.contains('theme-dark');
        const newTheme = isDark ? 'theme-light' : 'theme-dark';
        applyTheme(newTheme);
      });
    });
  }

  function applyTheme(theme) {
    if (theme === 'theme-dark') {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
      localStorage.setItem(THEME_STORAGE_KEY, 'theme-dark');
    } else {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'theme-light');
    }

    const toggleLabels = document.querySelectorAll('.theme-toggle-label');
    toggleLabels.forEach(function (lbl) {
      lbl.textContent = theme === 'theme-dark' ? 'LIGHT THEME' : 'DARK THEME';
    });
  }

  // 2. Animated Number Counters (Editorial Precision)
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter-target]');
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter-target'));
          const isDecimal = String(target).includes('.');
          const duration = 1200;
          const startTime = performance.now();

          function updateCounter(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = target * ease;

            el.textContent = isDecimal ? current.toFixed(1) : Math.round(current);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = isDecimal ? target.toFixed(1) : target;
            }
          }

          requestAnimationFrame(updateCounter);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initCounters();
  });

  window.MeatPointUI = {
    applyTheme: applyTheme
  };

})(window, document);
