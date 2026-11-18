/**
 * Meat Point Astana: AI Meat Sommelier (DeepSeek API)
 * Architectural Geometry, Hairline Borders, Zero Emojis, Skeleton Loader
 */

(function (window, document) {
  'use strict';

  const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
  const API_KEY_STORAGE = 'MEAT_POINT_DEEPSEEK_KEY';

  const QUICK_PROMPTS = [
    'Сет на двоих до 15 000 ₸',
    'Сравнение стейков и выбор прожарки',
    'График 24/7 и расположение',
    'Блюда к турецкому чаю',
    'Бизнес-ланч за 4 290 ₸'
  ];

  let chatHistory = [];
  let isSending = false;

  function getApiKey() {
    return localStorage.getItem(API_KEY_STORAGE) || '';
  }

  function setApiKey(key) {
    localStorage.setItem(API_KEY_STORAGE, (key || '').trim());
  }

  function getSystemPrompt() {
    const info = window.MeatPointMenu ? window.MeatPointMenu.info : {};
    const menuCatalog = window.MeatPointMenu ? window.MeatPointMenu.items.map(function (it) {
      return {
        id: it.id,
        name: it.name,
        category: it.category,
        price: it.price,
        weight: it.weight,
        isSteak: it.isSteak,
        description: it.description
      };
    }) : [];

    let cartContext = 'Корзина гостя пуста.';
    if (window.MeatPointCart) {
      const state = window.MeatPointCart.getState();
      const totals = window.MeatPointCart.getTotals();
      if (state.items && state.items.length > 0) {
        const itemSummaries = state.items.map(function (it) {
          return `${it.name} x${it.qty}${it.doneness ? ` (${it.doneness})` : ''}`;
        }).join(', ');
        cartContext = `В корзине гостя (${totals.count} поз.): ${itemSummaries}. Итого: ${totals.total} ₸.`;
      }
    }

    return `Ты сомелье и консультант мясного ресторана «Meat Point Astana».
Отвечай профессионально, сдержанно, фактологически точно. Никаких шаблонных фраз вроде «восточная сказка» или «не просто стейк, а философия». Говори как шеф-повар: сухая выдержка, порода, березовые угли, температура прожарки. Не используй эмодзи и длинные тире.

РЕСТОРАН MEAT POINT ASTANA:
- Статус: 100% Halal Certified.
- Адрес: Казахстан, г. Астана, проспект Ұлы Дала, 45 (район EXPO и Ботанического сада).
- Режим работы: Круглосуточно (24/7, без выходных).
- Телефоны: +7 (778) 422-11-00, +7 (775) 038-00-02.
- Рейтинг: 4.4 / 5 в 2ГИС (780+ отзывов), средний чек 7 000 ₸.
- Бизнес-ланч: 4 290 ₸ (будни 12:00-15:00).
- Доставка 24/7: бесплатно от 10 000 ₸. Самовывоз: скидка 10%.

КОРЗИНА ГОСТЯ:
${cartContext}

КАТАЛОГ МЕНЮ:
${JSON.stringify(menuCatalog, null, 2)}

ПРАВИЛА ОТВЕТА:
1. При рекомендации блюда ставь тег [ADD_DISH:dish-id], чтобы пользователь мог добавить его в 1 клик.
2. Не используй эмодзи.
3. Отвечай кратко и по делу.`;
  }

  function getFallbackResponse(userText) {
    const text = (userText || '').toLowerCase();

    if (text.includes('15 000') || text.includes('на двоих') || text.includes('15000') || text.includes('сет')) {
      return `Рекомендуемый сет на две персоны до 15 000 ₸:

1. Рибай стейк (350 г): 9 800 ₸. Рекомендуемая прожарка: Medium Rare.
[ADD_DISH:steak-ribeye]

2. Салат «Чобан» с брынзой (280 г): 2 400 ₸.
[ADD_DISH:salad-choban]

3. Лепешка Пуф-экмек из печи: 900 ₸.
[ADD_DISH:bread-puf]

4. Турецкий чай в армудах (чайник 800 мл): 1 600 ₸.
[ADD_DISH:drink-turkish-tea]

Сумма сета: 14 700 ₸. Блюда можно добавить в заказ нажатием кнопок ниже.`;
    }

    if (text.includes('прожарк') || text.includes('мягкий') || text.includes('стейк') || text.includes('рибай') || text.includes('тибон')) {
      return `Характеристики стейков Meat Point:

Филе-миньон (8 900 ₸, 280 г): центральная часть вырезки без жировых прожилок. Самый мягкий отруб меню. Оптимальная прожарка: Medium Rare (54–57°C). Подается со сливочно-перечным соусом.
[ADD_DISH:steak-filet-mignon]

Рибай стейк (9 800 ₸, 350 г): мраморная говядина 21 дня сухого созревания. Максимальная сочность за счет жировых прослоек. Рекомендуемая прожарка: Medium или Medium Rare.
[ADD_DISH:steak-ribeye]

Тибон стейк (10 500 ₸, 400 г): Т-образная кость разделяет нежное филе и насыщенный стриплойн.
[ADD_DISH:steak-tbone]`;
    }

    if (text.includes('где') || text.includes('адрес') || text.includes('ночью') || text.includes('время') || text.includes('график') || text.includes('часы')) {
      return `Meat Point Astana работает круглосуточно (24/7, без выходных):

Адрес: г. Астана, проспект Ұлы Дала, 45 (рядом с Ботаническим садом и районом EXPO).
Парковка: бесплатная парковка перед центральным входом.
Кухня и мангал: заказы принимаются круглосуточно.
Телефоны: +7 (778) 422-11-00, +7 (775) 038-00-02.
Доставка: по всей Астане, от 10 000 ₸ бесплатно.`;
    }

    if (text.includes('чай') || text.includes('десерт') || text.includes('кюнефе') || text.includes('пахлава')) {
      return `К турецкому чаю Ризе в армудах (1 600 ₸) рекомендуем:

Горячий Кюнефе с хатайским сыром и фисташками (3 400 ₸): несоленый молодой сыр, кадаифское тесто, сахарный сироп.
[ADD_DISH:dessert-kunefe]

Пахлава фисташковая с мороженым Мараш (3 200 ₸): 40 слоев теста филло, антепские фисташки, козье мороженое dondurma.
[ADD_DISH:dessert-baklava]
[ADD_DISH:drink-turkish-tea]`;
    }

    if (text.includes('бизнес') || text.includes('ланч') || text.includes('обед') || text.includes('4290')) {
      return `Бизнес-ланч дня (4 290 ₸):
Действует по будням с 12:00 до 15:00:
1. Чечевичный крем-суп Мерджимек с лимоном.
2. Кебаб на гриле с турецким рисом шехрие.
3. Салат Чобан из свежих овощей.
4. Горячая выпечка и турецкий чай в армуде.
[ADD_DISH:main-business-lunch]`;
    }

    return `Консультант Meat Point Astana. Основные позиции меню:
Рибай стейк 21 дня выдержки: 9 800 ₸ [ADD_DISH:steak-ribeye]
Адана-кебаб на углях: 4 400 ₸ [ADD_DISH:kebab-adana]
Бейти-кебаб в лаваше с сюзьме-йогуртом: 5 200 ₸ [ADD_DISH:kebab-beyti]
Горячий Кюнефе с сыром: 3 400 ₸ [ADD_DISH:dessert-kunefe]

Задайте вопрос о прожарке, составе сета или графике работы.`;
  }

  function initAiWidget() {
    let container = document.getElementById('meatpoint-ai-widget');
    if (container) return;

    container = document.createElement('div');
    container.id = 'meatpoint-ai-widget';
    container.className = 'mp-ai-widget';
    document.body.appendChild(container);

    container.innerHTML = `
      <button type="button" class="mp-ai-launcher" id="mp-ai-launcher-btn" aria-label="Открыть AI Сомелье">
        <span class="mp-ai-status-dot"></span>
        <span>AI SOMMELIER</span>
      </button>

      <div class="mp-ai-chat-window" id="mp-ai-chat-window">
        <div class="mp-ai-header">
          <div>
            <div class="mp-ai-title">Meat Point AI Sommelier</div>
            <div class="mp-ai-status">DeepSeek &bull; 24/7 Online</div>
          </div>
          <div class="mp-ai-header-actions">
            <button type="button" class="mp-ai-btn-text" id="mp-ai-config-btn">API KEY</button>
            <button type="button" class="mp-ai-btn-text" id="mp-ai-close-btn">&times;</button>
          </div>
        </div>

        <div class="mp-ai-chips-bar" id="mp-ai-chips-bar">
          ${QUICK_PROMPTS.map(function (p) {
            return `<button type="button" class="mp-ai-chip">${p}</button>`;
          }).join('')}
        </div>

        <div class="mp-ai-body" id="mp-ai-messages"></div>

        <div class="mp-ai-footer">
          <form id="mp-ai-form" class="mp-ai-input-form">
            <input type="text" id="mp-ai-input" class="mp-ai-input" placeholder="Вопрос о стейках, прожарке, меню..." autocomplete="off">
            <button type="submit" class="mp-ai-send-btn" id="mp-ai-send-btn">ОТПРАВИТЬ</button>
          </form>
          <div class="small text-muted text-center mt-1" style="font-size: 0.65rem;">
            DeepSeek Chat Completions &bull; Meat Point Astana
          </div>
        </div>
      </div>
    `;

    const launcher = document.getElementById('mp-ai-launcher-btn');
    const chatWindow = document.getElementById('mp-ai-chat-window');
    const closeBtn = document.getElementById('mp-ai-close-btn');
    const configBtn = document.getElementById('mp-ai-config-btn');
    const form = document.getElementById('mp-ai-form');
    const input = document.getElementById('mp-ai-input');

    launcher.onclick = toggleChatWindow;
    closeBtn.onclick = function () { chatWindow.classList.remove('open'); };
    configBtn.onclick = openConfigModal;

    container.querySelectorAll('.mp-ai-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        input.value = this.textContent;
        handleUserMessage(this.textContent);
        input.value = '';
      });
    });

    form.onsubmit = function (e) {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      input.value = '';
      handleUserMessage(val);
    };

    document.querySelectorAll('[data-ai-open], .open-ai-sommelier-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openChatWindow();
      });
    });

    addAssistantMessage(
      `Meat Point AI Sommelier.\n\n` +
      `Консультации по степеням прожарки мяса, составу сетов и позициям меню ресторана.\n` +
      `Задайте вопрос или выберите тему выше.`
    );
  }

  function openChatWindow() {
    const chatWindow = document.getElementById('mp-ai-chat-window');
    if (chatWindow) {
      chatWindow.classList.add('open');
      const input = document.getElementById('mp-ai-input');
      if (input) setTimeout(function () { input.focus(); }, 120);
    }
  }

  function toggleChatWindow() {
    const chatWindow = document.getElementById('mp-ai-chat-window');
    if (chatWindow) {
      chatWindow.classList.toggle('open');
      if (chatWindow.classList.contains('open')) {
        const input = document.getElementById('mp-ai-input');
        if (input) setTimeout(function () { input.focus(); }, 120);
      }
    }
  }

  function addUserMessage(text) {
    const msgs = document.getElementById('mp-ai-messages');
    if (!msgs) return;
    const div = document.createElement('div');
    div.className = 'mp-ai-msg user';
    div.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addAssistantMessage(markdownText) {
    const msgs = document.getElementById('mp-ai-messages');
    if (!msgs) return;

    const div = document.createElement('div');
    div.className = 'mp-ai-msg assistant';

    const rendered = renderMarkdown(markdownText);
    div.innerHTML = `<div class="msg-bubble">${rendered.html}</div>`;

    if (rendered.dishes && rendered.dishes.length > 0) {
      const actionsBox = document.createElement('div');
      actionsBox.className = 'mt-2 d-flex flex-column gap-1';

      rendered.dishes.forEach(function (dish) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-editorial-outline btn-sm text-start d-flex justify-content-between align-items-center py-2 px-3';
        btn.innerHTML = `
          <span>+ Добавить ${dish.name}</span>
          <span class="tabular-nums fw-bold">${window.MeatPointMenu.formatPrice(dish.price)}</span>
        `;
        btn.onclick = function () {
          if (dish.isSteak && window.MeatPointCart) {
            window.MeatPointCart.openSteakModal(dish.id);
          } else if (window.MeatPointCart) {
            window.MeatPointCart.addItem(dish.id);
          }
        };
        actionsBox.appendChild(btn);
      });

      div.querySelector('.msg-bubble').appendChild(actionsBox);
    }

    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  // Skeleton Loader Placeholder in Chat
  function addSkeletonLoader() {
    const msgs = document.getElementById('mp-ai-messages');
    if (!msgs) return null;

    const div = document.createElement('div');
    div.className = 'mp-ai-msg assistant';
    div.id = 'mp-ai-skeleton-loader';
    div.innerHTML = `
      <div class="msg-bubble w-100" style="min-width: 200px;">
        <div class="skeleton-shimmer skeleton-line mb-2" style="width: 80%; height: 10px;"></div>
        <div class="skeleton-shimmer skeleton-line mb-2" style="width: 60%; height: 10px;"></div>
        <div class="skeleton-shimmer skeleton-line" style="width: 40%; height: 10px;"></div>
      </div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function removeSkeletonLoader() {
    const loader = document.getElementById('mp-ai-skeleton-loader');
    if (loader && loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
  }

  function handleUserMessage(userText) {
    if (isSending) return;
    addUserMessage(userText);
    chatHistory.push({ role: 'user', content: userText });

    isSending = true;
    addSkeletonLoader();

    const apiKey = getApiKey();

    if (!apiKey) {
      setTimeout(function () {
        removeSkeletonLoader();
        const fallbackText = getFallbackResponse(userText);
        addAssistantMessage(fallbackText);
        chatHistory.push({ role: 'assistant', content: fallbackText });
        isSending = false;
      }, 500);
      return;
    }

    const messages = [
      { role: 'system', content: getSystemPrompt() }
    ].concat(chatHistory.slice(-8));

    fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.6,
        max_tokens: 1024
      })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        removeSkeletonLoader();
        const reply = data.choices && data.choices[0] && data.choices[0].message
          ? data.choices[0].message.content
          : getFallbackResponse(userText);

        addAssistantMessage(reply);
        chatHistory.push({ role: 'assistant', content: reply });
        isSending = false;
      })
      .catch(function (err) {
        console.warn('DeepSeek API fallback:', err);
        removeSkeletonLoader();
        const fallbackText = getFallbackResponse(userText);
        addAssistantMessage(`[Автономный режим]\n\n` + fallbackText);
        chatHistory.push({ role: 'assistant', content: fallbackText });
        isSending = false;
      });
  }

  function renderMarkdown(raw) {
    let text = raw || '';
    const dishes = [];

    const tagRegex = /\[ADD_DISH:([a-zA-Z0-9_-]+)\]/g;
    let match;
    while ((match = tagRegex.exec(text)) !== null) {
      const dishId = match[1];
      if (window.MeatPointMenu) {
        const d = window.MeatPointMenu.getById(dishId);
        if (d && !dishes.some(function (x) { return x.id === d.id; })) {
          dishes.push(d);
        }
      }
    }
    text = text.replace(tagRegex, '');

    if (dishes.length === 0 && window.MeatPointMenu) {
      window.MeatPointMenu.items.forEach(function (d) {
        if (text.includes(d.name) || text.includes(d.name.split('(')[0].trim())) {
          if (!dishes.some(function (x) { return x.id === d.id; })) {
            dishes.push(d);
          }
        }
      });
    }

    let html = escapeHtml(text);
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/\n\n/g, '<br><br>');
    html = html.replace(/\n• /g, '<br>&bull; ');
    html = html.replace(/\n([0-9]+\.) /g, '<br><strong>$1</strong> ');
    html = html.replace(/\n/g, '<br>');

    return {
      html: html,
      dishes: dishes.slice(0, 4)
    };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function openConfigModal() {
    let modal = document.getElementById('mp-ai-config-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mp-ai-config-modal';
      modal.className = 'mp-modal-backdrop';
      document.body.appendChild(modal);
    }

    const currentKey = getApiKey();

    modal.innerHTML = `
      <div class="mp-modal-dialog">
        <div class="mp-modal-header">
          <div>
            <h3 class="mp-modal-title">Параметры DeepSeek API</h3>
            <p class="mp-modal-subtitle">Конфигурация ключа для онлайн-модели deepseek-chat</p>
          </div>
          <button type="button" class="mp-modal-close" aria-label="Закрыть">&times;</button>
        </div>
        <div class="mp-modal-body">
          <div class="mb-3">
            <label class="form-label small text-muted text-uppercase">DeepSeek API Key (Bearer):</label>
            <input type="password" id="mp-deepseek-key-input" class="form-control mp-input" placeholder="sk-..." value="${currentKey}">
            <div class="small text-muted mt-1">Ключ сохраняется в localStorage браузера. При отсутствии ключа работает локальный движок.</div>
          </div>
        </div>
        <div class="mp-modal-footer">
          <button type="button" class="btn btn-editorial-outline" id="mp-config-clear-btn">Сбросить</button>
          <button type="button" class="btn btn-editorial-primary" id="mp-config-save-btn">Сохранить</button>
        </div>
      </div>
    `;

    modal.classList.add('open');

    const closeBtn = modal.querySelector('.mp-modal-close');
    const saveBtn = modal.querySelector('#mp-config-save-btn');
    const clearBtn = modal.querySelector('#mp-config-clear-btn');
    const keyInput = modal.querySelector('#mp-deepseek-key-input');

    function closeModal() { modal.classList.remove('open'); }
    closeBtn.onclick = closeModal;

    saveBtn.onclick = function () {
      const val = keyInput.value.trim();
      setApiKey(val);
      closeModal();
      if (window.MeatPointCart) {
        window.MeatPointCart.showToast(val ? 'Ключ API сохранен' : 'Автономный режим');
      }
    };

    clearBtn.onclick = function () {
      keyInput.value = '';
      setApiKey('');
      closeModal();
      if (window.MeatPointCart) {
        window.MeatPointCart.showToast('Автономный режим');
      }
    };
  }

  document.addEventListener('DOMContentLoaded', initAiWidget);

  window.MeatPointAI = {
    openChat: openChatWindow,
    toggleChat: toggleChatWindow,
    openConfig: openConfigModal,
    getApiKey: getApiKey,
    setApiKey: setApiKey
  };

})(window, document);
