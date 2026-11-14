/**
 * Meat Point Astana: Table Reservation System
 * Architectural Geometry, Hairline Borders, Zero Emojis
 */

(function (window, document) {
  'use strict';

  const STORAGE_KEY = 'meatpoint_user_bookings_v2';

  const HALL_ZONES = [
    {
      id: 'zone-grill',
      name: 'Основной зал у открытого мангала',
      capacity: 'до 80 гостей',
      badge: 'Открытый мангал',
      description: 'Вид на открытую кухню и жаровню на березовых углях. Живая музыка по пятницам и субботам.',
      image: 'images/meatpointhall.png',
      requiresDeposit: false
    },
    {
      id: 'zone-family',
      name: 'Уютная семейная зона',
      capacity: 'до 30 гостей',
      badge: 'Семейная зона',
      description: 'Мягкие диваны, приглушенный теплый свет, детские кресла и умеренная фоновая музыка.',
      image: 'images/interior.png',
      requiresDeposit: false
    },
    {
      id: 'zone-vip',
      name: 'VIP-кабинка',
      capacity: 'до 15 гостей',
      badge: 'Приватная зона',
      description: 'Изолированное пространство с отдельным обслуживанием, персональной аудиосистемой и климат-контролем.',
      image: 'images/meatpointout.png',
      requiresDeposit: true,
      depositAmount: 50000
    },
    {
      id: 'zone-window',
      name: 'Панорамные столы у окна',
      capacity: 'до 20 гостей',
      badge: 'Панорамный вид',
      description: 'Столы вдоль широких окон с видом на вечерний проспект Ұлы Дала и архитектурный ансамбль EXPO.',
      image: 'images/meatloc.png',
      requiresDeposit: false
    }
  ];

  function getBookings() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Failed to parse bookings from storage', e);
      return [];
    }
  }

  function saveBookings(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save bookings', e);
    }
    renderActiveBookingsWidget();
  }

  function addBooking(bookingData) {
    const list = getBookings();
    list.unshift(bookingData);
    saveBookings(list);
  }

  function cancelBooking(bookingId) {
    if (!confirm('Отменить бронирование столика?')) return;
    const list = getBookings().filter(function (b) { return b.id !== bookingId; });
    saveBookings(list);
    if (window.MeatPointCart) {
      window.MeatPointCart.showToast('Бронирование отменено', 'warning');
    }
  }

  function initBookingForm() {
    const formContainer = document.getElementById('interactive-booking-app');
    if (!formContainer) return;

    renderBookingApp(formContainer);
    renderActiveBookingsWidget();
  }

  function renderBookingApp(container) {
    const today = new Date().toISOString().slice(0, 10);
    const zonesHtml = HALL_ZONES.map(function (z, idx) {
      const isChecked = idx === 0 ? 'checked' : '';
      return `
        <label class="mp-zone-card ${isChecked ? 'active' : ''}" data-zone-id="${z.id}">
          <input type="radio" name="selected_zone" value="${z.id}" ${isChecked} class="d-none">
          <div class="mp-zone-thumb" style="background-image: url('${z.image}')">
            <span class="mp-zone-badge">${z.badge}</span>
          </div>
          <div class="mp-zone-content">
            <h5 class="mp-zone-title">${z.name}</h5>
            <div class="small text-muted mb-1">${z.capacity} ${z.requiresDeposit ? '&bull; Депозит 50 000 ₸' : '&bull; Без депозита'}</div>
            <p class="small text-muted mb-0">${z.description}</p>
          </div>
        </label>
      `;
    }).join('');

    const timeSlots = [];
    for (let h = 0; h < 24; h++) {
      const hourStr = (h < 10 ? '0' : '') + h;
      timeSlots.push(`${hourStr}:00`);
      timeSlots.push(`${hourStr}:30`);
    }

    const timeOptionsHtml = timeSlots.map(function (t) {
      const isSelected = t === '19:00' ? 'selected' : '';
      return `<option value="${t}" ${isSelected}>${t} (Круглосуточно 24/7)</option>`;
    }).join('');

    const guestCounts = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, '20+'];
    const guestChipsHtml = guestCounts.map(function (g, idx) {
      const isChecked = idx === 1 ? 'active' : '';
      return `
        <button type="button" class="mp-chip-btn ${isChecked}" data-guests="${g}">
          ${g} ${g === 1 ? 'персона' : 'персон'}
        </button>
      `;
    }).join('');

    container.innerHTML = `
      <form id="mp-interactive-booking-form" class="p-4 p-md-5 bg-card border-warm" novalidate>
        <div class="mb-4">
          <div class="small text-uppercase letter-spacing-1 fw-bold text-muted mb-3">01. Выбор зоны зала Meat Point:</div>
          <div class="mp-zones-grid">
            ${zonesHtml}
          </div>
        </div>

        <div class="mb-4">
          <div class="small text-uppercase letter-spacing-1 fw-bold text-muted mb-3">02. Дата, время визита и число гостей:</div>
          <div class="row g-3">
            <div class="col-12 col-md-4">
              <label class="form-label text-muted small text-uppercase">Дата визита:</label>
              <input type="date" id="booking-input-date" class="form-control mp-input" min="${today}" value="${today}" required>
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label text-muted small text-uppercase">Время (Круглосуточно 24/7):</label>
              <select id="booking-input-time" class="form-select mp-input" required>
                ${timeOptionsHtml}
              </select>
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label text-muted small text-uppercase">Число гостей:</label>
              <div class="d-flex flex-wrap gap-1">
                ${guestChipsHtml}
              </div>
              <input type="hidden" id="booking-input-guests" value="2">
            </div>
          </div>
        </div>

        <div class="mb-4">
          <div class="small text-uppercase letter-spacing-1 fw-bold text-muted mb-3">03. Контактные данные:</div>
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label class="form-label text-muted small text-uppercase">Имя гостя:</label>
              <input type="text" id="booking-input-name" class="form-control mp-input" placeholder="Имя" required>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label text-muted small text-uppercase">Телефон (WhatsApp):</label>
              <input type="tel" id="booking-input-phone" class="form-control mp-input" placeholder="+7 778 000 00 00" required>
            </div>
            <div class="col-12">
              <label class="form-label text-muted small text-uppercase">Комментарий или повод визита:</label>
              <input type="text" id="booking-input-notes" class="form-control mp-input" placeholder="День рождения, деловой обед, детское кресло">
            </div>
          </div>
        </div>

        <div class="p-3 bg-elevated border-warm mb-4" id="booking-preorder-box">
          <div class="form-check form-switch d-flex align-items-center gap-3">
            <input class="form-check-input" type="checkbox" id="attach-cart-checkbox">
            <label class="form-check-label" for="attach-cart-checkbox">
              <strong>Прикрепить предзаказ блюд из корзины</strong>
              <div class="small text-muted" id="preorder-cart-status">Стол будет сервирован горячими блюдами к указанному времени</div>
            </label>
          </div>
        </div>

        <div class="text-center pt-2">
          <button type="submit" class="btn btn-editorial-primary px-5 py-3">
            Забронировать стол
          </button>
          <div class="small text-muted mt-2">
            Удержание бронирования 15 минут &bull; Бесплатная отмена &bull; пр. Ұлы Дала, 45
          </div>
        </div>
      </form>
    `;

    container.querySelectorAll('.mp-zone-card').forEach(function (card) {
      card.addEventListener('click', function () {
        container.querySelectorAll('.mp-zone-card').forEach(function (c) {
          c.classList.remove('active');
          c.querySelector('input').checked = false;
        });
        card.classList.add('active');
        card.querySelector('input').checked = true;
      });
    });

    container.querySelectorAll('.mp-chip-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        container.querySelectorAll('.mp-chip-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const count = btn.getAttribute('data-guests');
        const input = document.getElementById('booking-input-guests');
        if (input) input.value = count;
      });
    });

    function updateCartIndicator() {
      const checkbox = document.getElementById('attach-cart-checkbox');
      const statusEl = document.getElementById('preorder-cart-status');
      if (!checkbox || !statusEl) return;

      if (window.MeatPointCart) {
        const totals = window.MeatPointCart.getTotals();
        if (totals.count > 0) {
          statusEl.innerHTML = `В корзине <strong>${totals.count}</strong> поз. на сумму <strong>${window.MeatPointMenu.formatPrice(totals.total)}</strong>`;
          checkbox.checked = true;
        } else {
          statusEl.textContent = 'В корзине пока нет блюд. Вы можете выбрать позиции в меню.';
          checkbox.checked = false;
        }
      }
    }
    updateCartIndicator();
    window.addEventListener('meatpoint:cart-updated', updateCartIndicator);

    const form = document.getElementById('mp-interactive-booking-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('booking-input-name').value.trim();
      const phone = document.getElementById('booking-input-phone').value.trim();
      const date = document.getElementById('booking-input-date').value;
      const time = document.getElementById('booking-input-time').value;
      const guests = document.getElementById('booking-input-guests').value;
      const notes = document.getElementById('booking-input-notes').value.trim();
      const selectedZoneEl = container.querySelector('input[name="selected_zone"]:checked');
      const zoneId = selectedZoneEl ? selectedZoneEl.value : 'zone-grill';
      const zoneObj = HALL_ZONES.find(function (z) { return z.id === zoneId; }) || HALL_ZONES[0];

      if (!name) {
        if (window.MeatPointCart) window.MeatPointCart.showToast('Укажите имя для бронирования', 'warning');
        document.getElementById('booking-input-name').focus();
        return;
      }
      if (!phone || phone.length < 6) {
        if (window.MeatPointCart) window.MeatPointCart.showToast('Укажите номер телефона', 'warning');
        document.getElementById('booking-input-phone').focus();
        return;
      }

      const attachCart = document.getElementById('attach-cart-checkbox').checked;
      let preorderedItems = [];
      let preorderTotal = 0;

      if (attachCart && window.MeatPointCart) {
        const cartState = window.MeatPointCart.getState();
        preorderedItems = [].concat(cartState.items);
        preorderTotal = window.MeatPointCart.getTotals().total;
      }

      const bookingId = 'BK-' + Math.floor(10000 + Math.random() * 90000);
      const newBooking = {
        id: bookingId,
        createdAt: new Date().toISOString(),
        guestName: name,
        guestPhone: phone,
        date: date,
        time: time,
        guests: guests,
        zoneId: zoneId,
        zoneName: zoneObj.name,
        notes: notes,
        hasPreorder: preorderedItems.length > 0,
        preorderedItems: preorderedItems,
        preorderTotal: preorderTotal,
        status: 'confirmed'
      };

      addBooking(newBooking);

      if (window.MeatPointCart) {
        window.MeatPointCart.showToast(`Столик забронирован: ${bookingId}`);
      }

      openBookingSuccessModal(newBooking);
    });
  }

  function renderActiveBookingsWidget() {
    const container = document.getElementById('my-bookings-container');
    if (!container) return;

    const list = getBookings();
    if (list.length === 0) {
      container.innerHTML = `
        <div class="p-4 bg-card border-warm text-center">
          <h5 class="h6 text-muted mb-1 text-uppercase letter-spacing-1">Активные бронирования</h5>
          <p class="small text-muted mb-0">У вас пока нет оформленных броней. Заполните форму ниже для резерва стола.</p>
        </div>
      `;
      return;
    }

    const cardsHtml = list.map(function (b) {
      const formattedDate = new Date(b.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
      return `
        <div class="p-3 p-md-4 mb-3 bg-card border-warm" data-booking-id="${b.id}">
          <div class="d-flex flex-wrap justify-content-between align-items-baseline gap-2 mb-2 pb-2 border-bottom border-warm">
            <div>
              <span class="text-terracotta fw-bold me-2">БРОНЬ #${b.id}</span>
              <span class="text-muted small">${b.zoneName}</span>
            </div>
            <div class="small text-uppercase text-muted">Подтверждено</div>
          </div>

          <div class="row g-2 my-2 small">
            <div class="col-6 col-md-3">
              <div class="text-muted text-uppercase" style="font-size: 0.7rem;">Дата:</div>
              <div class="fw-bold">${formattedDate}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-muted text-uppercase" style="font-size: 0.7rem;">Время:</div>
              <div class="fw-bold">${b.time} (24/7)</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-muted text-uppercase" style="font-size: 0.7rem;">Гостей:</div>
              <div class="fw-bold">${b.guests} чел.</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-muted text-uppercase" style="font-size: 0.7rem;">Гость:</div>
              <div class="fw-bold">${b.guestName}</div>
            </div>
          </div>

          ${b.hasPreorder ? `
            <div class="p-2 bg-elevated border-warm small my-2">
              Предзаказ: ${b.preorderedItems.length} позиций на сумму ${window.MeatPointMenu.formatPrice(b.preorderTotal)}. Стол сервируют к приходу.
            </div>
          ` : ''}

          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3 pt-2 border-top border-warm">
            <div class="small text-muted">
              Адрес: пр. Ұлы Дала, 45
            </div>
            <div class="d-flex gap-2">
              <a href="https://wa.me/77784221100?text=${encodeURIComponent(`Здравствуйте! Я по поводу брони столика #${b.id} на имя ${b.guestName} (${b.date} в ${b.time}).`)}" target="_blank" class="btn btn-sm btn-editorial-outline">
                WhatsApp
              </a>
              <button type="button" class="btn btn-sm btn-editorial-outline mp-cancel-booking-btn" data-id="${b.id}">
                Отменить
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="mb-4">
        <h3 class="h5 text-uppercase letter-spacing-1 text-muted mb-3">Мои бронирования (${list.length})</h3>
        ${cardsHtml}
      </div>
    `;

    container.querySelectorAll('.mp-cancel-booking-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        cancelBooking(this.getAttribute('data-id'));
      });
    });
  }

  function openBookingSuccessModal(booking) {
    let modal = document.getElementById('booking-success-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'booking-success-modal';
      modal.className = 'mp-modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="mp-modal-dialog">
        <div class="mp-modal-header">
          <div>
            <h3 class="mp-modal-title">Столик забронирован</h3>
            <p class="mp-modal-subtitle">Номер бронирования: ${booking.id}</p>
          </div>
          <button type="button" class="mp-modal-close" aria-label="Закрыть">&times;</button>
        </div>
        <div class="mp-modal-body">
          <div class="p-3 bg-elevated border-warm small">
            <p class="mb-1"><strong>Гость:</strong> ${booking.guestName} (${booking.guestPhone})</p>
            <p class="mb-1"><strong>Зона зала:</strong> ${booking.zoneName}</p>
            <p class="mb-1"><strong>Дата и время:</strong> ${booking.date} в ${booking.time}</p>
            <p class="mb-1"><strong>Число персон:</strong> ${booking.guests}</p>
            ${booking.hasPreorder ? `<p class="mb-1 text-terracotta"><strong>Предзаказ:</strong> ${booking.preorderedItems.length} блюд на сумму ${window.MeatPointMenu.formatPrice(booking.preorderTotal)}</p>` : ''}
            <div class="border-top border-warm my-2 pt-2 text-muted">
              Адрес: г. Астана, проспект Ұлы Дала, 45. Бронь сохраняется 15 минут от указанного времени.
            </div>
          </div>
        </div>
        <div class="mp-modal-footer">
          <a href="https://wa.me/77784221100?text=${encodeURIComponent(`Здравствуйте! Я оформил бронь столика #${booking.id} в Meat Point на ${booking.date} в ${booking.time} (${booking.guests} чел.). Имя: ${booking.guestName}`)}" target="_blank" class="btn btn-whatsapp w-100 mb-2">
            Сохранить в WhatsApp
          </a>
          <button type="button" class="btn btn-editorial-primary w-100" id="booking-modal-ok">Закрыть</button>
        </div>
      </div>
    `;

    modal.classList.add('open');
    const closeBtn = modal.querySelector('.mp-modal-close');
    const okBtn = modal.querySelector('#booking-modal-ok');
    function closeModal() { modal.classList.remove('open'); }
    closeBtn.onclick = closeModal;
    okBtn.onclick = closeModal;
  }

  document.addEventListener('DOMContentLoaded', initBookingForm);

  window.MeatPointBooking = {
    getBookings: getBookings,
    cancelBooking: cancelBooking,
    refreshWidget: renderActiveBookingsWidget
  };

})(window, document);
