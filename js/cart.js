/**
 * Meat Point Astana: Cart & Order Builder
 * Architectural Geometry, Hairline Borders, Zero Emojis
 */

(function (window, document) {
  'use strict';

  const STORAGE_KEY = 'meatpoint_cart_v2';
  const ACTIVE_ORDER_KEY = 'meatpoint_active_order_v2';

  const CartState = {
    items: [],
    deliveryType: 'delivery', // 'delivery' | 'pickup' | 'table_preorder'
    tableNumber: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    notes: ''
  };

  function loadCart() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.items)) CartState.items = parsed.items;
        if (parsed.deliveryType) CartState.deliveryType = parsed.deliveryType;
      }
    } catch (e) {
      console.warn('Failed to parse cart storage', e);
      CartState.items = [];
    }
    updateCartBadges();
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        items: CartState.items,
        deliveryType: CartState.deliveryType
      }));
    } catch (e) {
      console.warn('Failed to save cart', e);
    }
    updateCartBadges();
    renderCartDrawer();
    window.dispatchEvent(new CustomEvent('meatpoint:cart-updated', { detail: getTotals() }));
  }

  function getTotals() {
    const subtotal = CartState.items.reduce(function (sum, item) {
      return sum + (item.price * item.qty);
    }, 0);

    let deliveryFee = 0;
    let discount = 0;

    if (CartState.deliveryType === 'delivery') {
      deliveryFee = subtotal >= 10000 || subtotal === 0 ? 0 : 1000;
    } else if (CartState.deliveryType === 'pickup') {
      discount = Math.round(subtotal * 0.10); // 10% discount on pickup
    }

    const total = Math.max(0, subtotal + deliveryFee - discount);
    const count = CartState.items.reduce(function (sum, item) {
      return sum + item.qty;
    }, 0);

    return {
      count: count,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      discount: discount,
      total: total,
      deliveryType: CartState.deliveryType
    };
  }

  function updateCartBadges() {
    const totals = getTotals();
    const countBadges = document.querySelectorAll('.cart-badge-count');
    countBadges.forEach(function (badge) {
      badge.textContent = String(totals.count);
      badge.style.display = totals.count > 0 ? 'inline-block' : 'none';
    });

    const sumBadges = document.querySelectorAll('.cart-badge-total');
    sumBadges.forEach(function (badge) {
      badge.textContent = window.MeatPointMenu ? window.MeatPointMenu.formatPrice(totals.total) : totals.total + ' ₸';
    });
  }

  function addItem(dishId, options) {
    if (!window.MeatPointMenu) return;
    const dish = window.MeatPointMenu.getById(dishId);
    if (!dish) return;

    options = options || {};
    const doneness = options.doneness || (dish.isSteak ? 'Medium' : null);
    const side = options.side || (dish.isSteak ? 'Запеченный картофель с розмарином' : null);
    const notes = options.notes || '';

    const existing = CartState.items.find(function (it) {
      return it.dishId === dish.id && it.doneness === doneness && it.side === side;
    });

    if (existing) {
      existing.qty += 1;
    } else {
      CartState.items.push({
        cartItemId: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        dishId: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        weight: dish.weight,
        isSteak: dish.isSteak,
        doneness: doneness,
        side: side,
        notes: notes,
        qty: 1
      });
    }

    saveCart();
    showToast(`Добавлено: ${dish.name}`);
  }

  function removeItem(cartItemId) {
    CartState.items = CartState.items.filter(function (it) {
      return it.cartItemId !== cartItemId;
    });
    saveCart();
  }

  function updateQty(cartItemId, delta) {
    const item = CartState.items.find(function (it) {
      return it.cartItemId === cartItemId;
    });
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      removeItem(cartItemId);
    } else {
      saveCart();
    }
  }

  function clearCart() {
    CartState.items = [];
    saveCart();
  }

  function showToast(message, type) {
    const container = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'mp-toast ' + (type || 'success');
    toast.innerHTML = `
      <span class="text-brass small fw-bold">[MEAT POINT]</span>
      <span class="mp-toast-msg">${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(function () {
      toast.classList.add('show');
    }, 10);

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, 3000);
  }

  function createToastContainer() {
    const el = document.createElement('div');
    el.id = 'toast-container';
    el.className = 'mp-toast-container';
    document.body.appendChild(el);
    return el;
  }

  // Steak options modal
  function openSteakModal(dishId) {
    const dish = window.MeatPointMenu.getById(dishId);
    if (!dish) return;

    let modal = document.getElementById('steak-options-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'steak-options-modal';
      modal.className = 'mp-modal-backdrop';
      document.body.appendChild(modal);
    }

    const donenessHtml = window.MeatPointMenu.donenessList.map(function (d, idx) {
      const isChecked = idx === 1 ? 'checked' : '';
      return `
        <label class="mp-radio-card ${isChecked ? 'active' : ''}">
          <input type="radio" name="steak-doneness" value="${d.name}" ${isChecked}>
          <div class="mp-radio-title">
            <span>${d.name}</span>
            <span class="mp-temp-badge">${d.temp}</span>
          </div>
          <div class="mp-radio-desc">${d.label}</div>
        </label>
      `;
    }).join('');

    const sideHtml = window.MeatPointMenu.sidesList.map(function (s, idx) {
      const isChecked = idx === 0 ? 'checked' : '';
      return `
        <label class="mp-radio-card ${isChecked ? 'active' : ''}">
          <input type="radio" name="steak-side" value="${s.name}" ${isChecked}>
          <div class="mp-radio-title"><span>${s.name}</span></div>
          <div class="mp-radio-desc">Включено в стоимость</div>
        </label>
      `;
    }).join('');

    modal.innerHTML = `
      <div class="mp-modal-dialog">
        <div class="mp-modal-header">
          <div>
            <h3 class="mp-modal-title">Параметры приготовления стейка</h3>
            <p class="mp-modal-subtitle">${dish.name} &bull; ${window.MeatPointMenu.formatPrice(dish.price)}</p>
          </div>
          <button type="button" class="mp-modal-close" aria-label="Закрыть">&times;</button>
        </div>
        <div class="mp-modal-body">
          <div class="mb-4">
            <div class="small text-uppercase letter-spacing-1 fw-bold text-muted mb-2">01. Степень прожарки:</div>
            <div class="mp-radio-grid">${donenessHtml}</div>
          </div>
          <div>
            <div class="small text-uppercase letter-spacing-1 fw-bold text-muted mb-2">02. Выбор гарнира:</div>
            <div class="mp-radio-grid">${sideHtml}</div>
          </div>
        </div>
        <div class="mp-modal-footer">
          <button type="button" class="btn btn-editorial-outline mp-modal-cancel">Отмена</button>
          <button type="button" class="btn btn-editorial-primary mp-modal-confirm">Добавить в заказ (${window.MeatPointMenu.formatPrice(dish.price)})</button>
        </div>
      </div>
    `;

    modal.classList.add('open');

    modal.querySelectorAll('.mp-radio-card input').forEach(function (input) {
      input.addEventListener('change', function () {
        const group = modal.querySelectorAll(`input[name="${this.name}"]`);
        group.forEach(function (r) {
          r.closest('.mp-radio-card').classList.toggle('active', r.checked);
        });
      });
    });

    const closeBtn = modal.querySelector('.mp-modal-close');
    const cancelBtn = modal.querySelector('.mp-modal-cancel');
    const confirmBtn = modal.querySelector('.mp-modal-confirm');

    function closeModal() { modal.classList.remove('open'); }
    closeBtn.onclick = closeModal;
    cancelBtn.onclick = closeModal;
    modal.onclick = function (e) { if (e.target === modal) closeModal(); };

    confirmBtn.onclick = function () {
      const selectedDoneness = modal.querySelector('input[name="steak-doneness"]:checked')?.value || 'Medium Rare';
      const selectedSide = modal.querySelector('input[name="steak-side"]:checked')?.value || 'Запеченный картофель с розмарином';

      addItem(dishId, { doneness: selectedDoneness, side: selectedSide });
      closeModal();
      openCartDrawer();
    };
  }

  // Cart Drawer
  function createCartDrawerElement() {
    let drawer = document.getElementById('meatpoint-cart-drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'meatpoint-cart-drawer';
      drawer.className = 'mp-cart-drawer';
      document.body.appendChild(drawer);

      let backdrop = document.getElementById('cart-drawer-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'cart-drawer-backdrop';
        backdrop.className = 'mp-drawer-backdrop';
        backdrop.onclick = closeCartDrawer;
        document.body.appendChild(backdrop);
      }
    }
    return drawer;
  }

  function openCartDrawer() {
    const drawer = createCartDrawerElement();
    const backdrop = document.getElementById('cart-drawer-backdrop');
    renderCartDrawer();
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('meatpoint-cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  }

  function renderCartDrawer() {
    const drawer = createCartDrawerElement();
    const totals = getTotals();

    if (CartState.items.length === 0) {
      drawer.innerHTML = `
        <div class="mp-cart-header">
          <div>
            <h3 class="mp-drawer-title">Корзина заказа</h3>
            <span class="mp-drawer-subtitle">Meat Point Astana &bull; 24/7</span>
          </div>
          <button type="button" class="mp-drawer-close" aria-label="Закрыть">&times;</button>
        </div>
        <div class="mp-cart-body text-center py-5">
          <h4 class="h5 text-muted mb-2">Корзина пуста</h4>
          <p class="small text-muted mb-4">Выберите мясные блюда, кебабы или десерты в основном меню.</p>
          <a href="menu.html" class="btn btn-editorial-outline" onclick="window.MeatPointCart.closeDrawer()">Перейти в меню</a>
        </div>
      `;
      drawer.querySelector('.mp-drawer-close').onclick = closeCartDrawer;
      return;
    }

    const itemsHtml = CartState.items.map(function (item) {
      return `
        <div class="mp-cart-item" data-cart-id="${item.cartItemId}">
          <img src="${item.image}" alt="${item.name}" class="mp-cart-thumb" loading="lazy">
          <div class="mp-cart-details">
            <div class="mp-cart-item-name">${item.name}</div>
            ${item.doneness ? `<div class="mp-cart-badge">Прожарка: ${item.doneness}</div>` : ''}
            ${item.side ? `<div class="mp-cart-badge">Гарнир: ${item.side}</div>` : ''}
            <div class="mp-cart-price">${window.MeatPointMenu.formatPrice(item.price)}</div>
          </div>
          <div class="mp-cart-actions">
            <button type="button" class="mp-qty-btn" data-action="minus">&minus;</button>
            <span class="mp-qty-value">${item.qty}</span>
            <button type="button" class="mp-qty-btn" data-action="plus">&plus;</button>
            <button type="button" class="mp-item-remove" data-action="remove" title="Удалить">&times;</button>
          </div>
        </div>
      `;
    }).join('');

    drawer.innerHTML = `
      <div class="mp-cart-header">
        <div>
          <h3 class="mp-drawer-title">Ваш заказ (${totals.count})</h3>
          <span class="mp-drawer-subtitle">пр. Ұлы Дала, 45 &bull; 24/7</span>
        </div>
        <button type="button" class="mp-drawer-close" aria-label="Закрыть">&times;</button>
      </div>

      <div class="mp-cart-body">
        <div class="mp-delivery-switch mb-3">
          <label class="mp-delivery-option ${CartState.deliveryType === 'delivery' ? 'active' : ''}">
            <input type="radio" name="cart-deliv-type" value="delivery" ${CartState.deliveryType === 'delivery' ? 'checked' : ''}>
            <span>Доставка</span>
          </label>
          <label class="mp-delivery-option ${CartState.deliveryType === 'pickup' ? 'active' : ''}">
            <input type="radio" name="cart-deliv-type" value="pickup" ${CartState.deliveryType === 'pickup' ? 'checked' : ''}>
            <span>Самовывоз (-10%)</span>
          </label>
          <label class="mp-delivery-option ${CartState.deliveryType === 'table_preorder' ? 'active' : ''}">
            <input type="radio" name="cart-deliv-type" value="table_preorder" ${CartState.deliveryType === 'table_preorder' ? 'checked' : ''}>
            <span>К столику</span>
          </label>
        </div>

        <div class="mp-cart-items-list mb-3">
          ${itemsHtml}
        </div>

        <div class="mp-order-fields mb-3">
          <div class="mb-2">
            <label class="form-label small text-muted text-uppercase mb-1">Имя гостя:</label>
            <input type="text" id="order-customer-name" class="form-control form-control-sm mp-input" placeholder="Имя" value="${CartState.customerName}">
          </div>
          <div class="mb-2">
            <label class="form-label small text-muted text-uppercase mb-1">Телефон:</label>
            <input type="tel" id="order-customer-phone" class="form-control form-control-sm mp-input" placeholder="+7 778 000 00 00" value="${CartState.customerPhone}">
          </div>
          ${CartState.deliveryType === 'delivery' ? `
            <div class="mb-2">
              <label class="form-label small text-muted text-uppercase mb-1">Адрес доставки в Астане:</label>
              <input type="text" id="order-customer-address" class="form-control form-control-sm mp-input" placeholder="Улица, дом, квартира" value="${CartState.customerAddress}">
            </div>
          ` : ''}
          ${CartState.deliveryType === 'pickup' ? `
            <div class="p-2 bg-elevated border-warm small mb-2 text-muted">
              Самовывоз: г. Астана, пр. Ұлы Дала, 45. Время готовности: 20–30 минут.
            </div>
          ` : ''}
          ${CartState.deliveryType === 'table_preorder' ? `
            <div class="mb-2">
              <label class="form-label small text-muted text-uppercase mb-1">Время прибытия / Номер столика:</label>
              <input type="text" id="order-table-note" class="form-control form-control-sm mp-input" placeholder="Сегодня в 19:30, столик у окна">
            </div>
          ` : ''}
          <div>
            <label class="form-label small text-muted text-uppercase mb-1">Комментарий к заказу:</label>
            <input type="text" id="order-customer-notes" class="form-control form-control-sm mp-input" placeholder="Без лука, приборы на 2 персоны" value="${CartState.notes}">
          </div>
        </div>

        <div class="p-3 bg-elevated border-warm small">
          <div class="d-flex justify-content-between text-muted mb-1">
            <span>Сумма блюд:</span>
            <span class="tabular-nums">${window.MeatPointMenu.formatPrice(totals.subtotal)}</span>
          </div>
          ${totals.deliveryFee > 0 ? `
            <div class="d-flex justify-content-between text-muted mb-1">
              <span>Доставка по городу:</span>
              <span class="tabular-nums">+${window.MeatPointMenu.formatPrice(totals.deliveryFee)}</span>
            </div>
          ` : ''}
          ${totals.discount > 0 ? `
            <div class="d-flex justify-content-between text-terracotta mb-1">
              <span>Скидка за самовывоз (10%):</span>
              <span class="tabular-nums">-${window.MeatPointMenu.formatPrice(totals.discount)}</span>
            </div>
          ` : ''}
          <div class="d-flex justify-content-between fw-bold fs-6 pt-2 border-top border-warm mt-2">
            <span>Итого к оплате:</span>
            <span class="tabular-nums text-terracotta">${window.MeatPointMenu.formatPrice(totals.total)}</span>
          </div>
        </div>
      </div>

      <div class="mp-cart-footer">
        <button type="button" class="btn btn-whatsapp w-100 mb-2 py-2" id="cart-whatsapp-btn">
          Отправить чек заказа в WhatsApp (+7 778 422-11-00)
        </button>
        <button type="button" class="btn btn-editorial-primary w-100 py-2" id="cart-onsite-btn">
          Оформить заказ на сайте
        </button>
        <div class="text-center mt-2">
          <button type="button" class="btn btn-link btn-sm text-muted p-0" id="cart-clear-btn">Очистить корзину</button>
        </div>
      </div>
    `;

    drawer.querySelector('.mp-drawer-close').onclick = closeCartDrawer;

    drawer.querySelectorAll('.mp-delivery-option input').forEach(function (radio) {
      radio.addEventListener('change', function () {
        CartState.deliveryType = this.value;
        saveCart();
      });
    });

    drawer.querySelectorAll('.mp-cart-item').forEach(function (row) {
      const id = row.getAttribute('data-cart-id');
      const minusBtn = row.querySelector('[data-action="minus"]');
      const plusBtn = row.querySelector('[data-action="plus"]');
      const removeBtn = row.querySelector('[data-action="remove"]');

      if (minusBtn) minusBtn.onclick = function () { updateQty(id, -1); };
      if (plusBtn) plusBtn.onclick = function () { updateQty(id, 1); };
      if (removeBtn) removeBtn.onclick = function () { removeItem(id); };
    });

    const clearBtn = drawer.querySelector('#cart-clear-btn');
    if (clearBtn) {
      clearBtn.onclick = function () {
        if (confirm('Очистить корзину?')) clearCart();
      };
    }

    const nameInput = drawer.querySelector('#order-customer-name');
    const phoneInput = drawer.querySelector('#order-customer-phone');
    const addrInput = drawer.querySelector('#order-customer-address');
    const notesInput = drawer.querySelector('#order-customer-notes');

    if (nameInput) nameInput.oninput = function () { CartState.customerName = this.value; };
    if (phoneInput) phoneInput.oninput = function () { CartState.customerPhone = this.value; };
    if (addrInput) addrInput.oninput = function () { CartState.customerAddress = this.value; };
    if (notesInput) notesInput.oninput = function () { CartState.notes = this.value; };

    const whatsappBtn = drawer.querySelector('#cart-whatsapp-btn');
    if (whatsappBtn) {
      whatsappBtn.onclick = handleWhatsAppCheckout;
    }

    const onsiteBtn = drawer.querySelector('#cart-onsite-btn');
    if (onsiteBtn) {
      onsiteBtn.onclick = handleOnsiteCheckout;
    }
  }

  function handleWhatsAppCheckout() {
    const totals = getTotals();
    if (CartState.items.length === 0) return;

    const name = CartState.customerName.trim() || 'Гость ресторана';
    const phone = CartState.customerPhone.trim() || 'Уточняется';
    const delivType = CartState.deliveryType === 'delivery' ? 'Доставка по Астане' : (CartState.deliveryType === 'pickup' ? 'Самовывоз (пр. Ұлы Дала, 45)' : 'Предзаказ к столику');
    const address = CartState.customerAddress.trim() || 'Уточняется';

    let orderList = '';
    CartState.items.forEach(function (it, idx) {
      orderList += `${idx + 1}. ${it.name} x${it.qty}: ${window.MeatPointMenu.formatPrice(it.price * it.qty)}\n`;
      if (it.doneness) orderList += `   Прожарка: ${it.doneness}\n`;
      if (it.side) orderList += `   Гарнир: ${it.side}\n`;
    });

    const message = `ЗАКАЗ MEAT POINT ASTANA\n` +
      `==============================\n` +
      `Гость: ${name}\n` +
      `Телефон: ${phone}\n` +
      `Формат: ${delivType}\n` +
      (CartState.deliveryType === 'delivery' ? `Адрес: ${address}\n` : '') +
      (CartState.notes ? `Пожелания: ${CartState.notes}\n` : '') +
      `==============================\n` +
      `СОСТАВ ЗАКАЗА:\n${orderList}` +
      `==============================\n` +
      (totals.deliveryFee > 0 ? `Доставка: +${window.MeatPointMenu.formatPrice(totals.deliveryFee)}\n` : '') +
      (totals.discount > 0 ? `Скидка самовывоза: -${window.MeatPointMenu.formatPrice(totals.discount)}\n` : '') +
      `ИТОГО К ОПЛАТЕ: ${window.MeatPointMenu.formatPrice(totals.total)}\n` +
      `==============================\n` +
      `meatpoint.astana · пр. Ұлы Дала, 45`;

    window.open(`https://wa.me/77784221100?text=${encodeURIComponent(message)}`, '_blank');
  }

  function handleOnsiteCheckout() {
    const name = CartState.customerName.trim();
    const phone = CartState.customerPhone.trim();

    if (!name) {
      showToast('Укажите имя для заказа', 'warning');
      const input = document.getElementById('order-customer-name');
      if (input) input.focus();
      return;
    }

    if (!phone || phone.length < 6) {
      showToast('Укажите контактный номер телефона', 'warning');
      const input = document.getElementById('order-customer-phone');
      if (input) input.focus();
      return;
    }

    const orderId = 'MP-' + Math.floor(100000 + Math.random() * 900000);
    const totals = getTotals();

    const orderData = {
      orderId: orderId,
      createdAt: new Date().toISOString(),
      customerName: name,
      customerPhone: phone,
      deliveryType: CartState.deliveryType,
      address: CartState.customerAddress,
      notes: CartState.notes,
      items: [].concat(CartState.items),
      totals: totals,
      status: 'accepted',
      estimatedMinutes: 35
    };

    localStorage.setItem(ACTIVE_ORDER_KEY, JSON.stringify(orderData));
    clearCart();
    closeCartDrawer();
    openOrderStatusModal(orderData);
  }

  function openOrderStatusModal(order) {
    let modal = document.getElementById('mp-order-status-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mp-order-status-modal';
      modal.className = 'mp-modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="mp-modal-dialog">
        <div class="mp-modal-header">
          <div>
            <h3 class="mp-modal-title">Заказ ${order.orderId} принят</h3>
            <p class="mp-modal-subtitle">Meat Point Astana &bull; Открытый мангал</p>
          </div>
          <button type="button" class="mp-modal-close" aria-label="Закрыть">&times;</button>
        </div>
        <div class="mp-modal-body">
          <div class="p-3 bg-elevated border-warm mb-3 text-center">
            <div class="small text-muted text-uppercase letter-spacing-1">Ориентировочное время готовности:</div>
            <div class="fs-2 fw-bold text-terracotta tabular-nums my-1" id="order-timer-val">34:59</div>
            <div class="d-flex justify-content-between small text-muted mt-2 border-top border-warm pt-2">
              <span class="text-terracotta fw-bold">01. Принят</span>
              <span class="fw-bold">02. На мангале</span>
              <span>03. В пути</span>
            </div>
          </div>

          <div class="p-3 bg-card border-warm small">
            <div><strong>Гость:</strong> ${order.customerName} (${order.customerPhone})</div>
            <div><strong>Формат:</strong> ${order.deliveryType === 'delivery' ? 'Доставка по Астане' : (order.deliveryType === 'pickup' ? 'Самовывоз (пр. Ұлы Дала, 45)' : 'К столику')}</div>
            <div><strong>Сумма:</strong> ${window.MeatPointMenu.formatPrice(order.totals.total)}</div>
            <div class="mt-2 text-muted">Администратор ресторана на связи 24/7: <a href="tel:+77784221100" class="text-terracotta">+7 (778) 422-11-00</a></div>
          </div>
        </div>
        <div class="mp-modal-footer">
          <button type="button" class="btn btn-editorial-primary w-100" id="order-status-ok-btn">Подтвердить</button>
        </div>
      </div>
    `;

    modal.classList.add('open');

    const closeBtn = modal.querySelector('.mp-modal-close');
    const okBtn = modal.querySelector('#order-status-ok-btn');
    function closeModal() { modal.classList.remove('open'); }
    closeBtn.onclick = closeModal;
    okBtn.onclick = closeModal;

    let seconds = 35 * 60 - 1;
    const timerEl = modal.querySelector('#order-timer-val');
    const interval = setInterval(function () {
      if (!modal.classList.contains('open') || seconds <= 0) {
        clearInterval(interval);
        return;
      }
      seconds -= 1;
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      if (timerEl) {
        timerEl.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
      }
    }, 1000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadCart();

    document.querySelectorAll('.cart-trigger-btn, .cart-nav-btn, [data-cart-open]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openCartDrawer();
      });
    });
  });

  window.MeatPointCart = {
    addItem: addItem,
    openSteakModal: openSteakModal,
    removeItem: removeItem,
    updateQty: updateQty,
    clearCart: clearCart,
    getTotals: getTotals,
    openDrawer: openCartDrawer,
    closeDrawer: closeCartDrawer,
    showToast: showToast,
    getState: function () { return CartState; }
  };

})(window, document);
