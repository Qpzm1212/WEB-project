/**
 * Meat Point Astana: Core Application Controller
 * Project by Astana IT University, Group SE-2532:
 * - Kamza Asset
 * - Tangzharyk
 * Anti-Vibe-Coding: Zero Emojis, Strict Architecture
 */

(function (window, document) {
  'use strict';

  function initGlobalApp() {
    setupMobileNav();
    highlightActivePage();
    setupTeamCreditsModal();
    setupGlobalShortcuts();
  }

  function setupMobileNav() {
    const toggler = document.querySelector('.navbar-toggler, #nav-toggle-btn');
    const collapse = document.querySelector('.navbar-collapse, #mainNav');

    if (toggler && collapse) {
      toggler.addEventListener('click', function () {
        collapse.classList.toggle('show');
      });

      collapse.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          collapse.classList.remove('show');
        });
      });
    }
  }

  function highlightActivePage() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  function setupTeamCreditsModal() {
    document.querySelectorAll('.open-team-modal-btn, [data-team-credits]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openTeamModal();
      });
    });
  }

  function openTeamModal() {
    let modal = document.getElementById('team-credits-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'team-credits-modal';
      modal.className = 'mp-modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="mp-modal-dialog">
        <div class="mp-modal-header">
          <div>
            <h3 class="mp-modal-title">Команда проекта Meat Point Astana</h3>
            <p class="mp-modal-subtitle">Astana IT University &bull; Группа SE-2532</p>
          </div>
          <button type="button" class="mp-modal-close" aria-label="Закрыть">&times;</button>
        </div>
        <div class="mp-modal-body">
          <div class="p-3 bg-card border-warm mb-3">
            <div class="small text-uppercase letter-spacing-1 fw-bold text-muted mb-2">Авторы проекта:</div>
            <ul class="list-unstyled mb-0 small">
              <li class="py-2 border-bottom border-warm d-flex justify-content-between align-items-baseline">
                <strong>Kamza Asset</strong>
                <span class="text-muted">Lead Frontend Architect & UI</span>
              </li>
              <li class="py-2 d-flex justify-content-between align-items-baseline">
                <strong>Tangzharyk</strong>
                <span class="text-muted">Product Engineer & DeepSeek AI</span>
              </li>
            </ul>
          </div>
          <div class="p-3 bg-card border-warm small">
            <div class="small text-uppercase letter-spacing-1 fw-bold text-muted mb-1">Стек технологий:</div>
            <p class="text-muted mb-0">
              HTML5 Semantic Markup, CSS3 Custom Properties (Editorial Warm Stone & Linen design system, hairline geometry), Vanilla JavaScript ES6+, DeepSeek Chat Completions API интеграция со скелетными загрузками и контекстом корзины, localStorage для сохранения заказов и бронирований.
            </p>
          </div>
        </div>
        <div class="mp-modal-footer">
          <button type="button" class="btn btn-editorial-primary w-100" id="team-modal-ok">Закрыть</button>
        </div>
      </div>
    `;

    modal.classList.add('open');
    const closeBtn = modal.querySelector('.mp-modal-close');
    const okBtn = modal.querySelector('#team-modal-ok');
    function closeModal() { modal.classList.remove('open'); }
    closeBtn.onclick = closeModal;
    okBtn.onclick = closeModal;
  }

  function setupGlobalShortcuts() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (window.MeatPointCart) window.MeatPointCart.closeDrawer();
        document.querySelectorAll('.mp-modal-backdrop.open').forEach(function (m) {
          m.classList.remove('open');
        });
        const chat = document.getElementById('mp-ai-chat-window');
        if (chat) chat.classList.remove('open');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initGlobalApp);

  window.MeatPointApp = {
    openTeamModal: openTeamModal
  };

})(window, document);
