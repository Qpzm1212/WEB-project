/**
 * Meat Point Astana: Menu Catalog Controller
 * Skeleton Shimmer Loaders (250ms), Clean Filters, Zero Emojis
 */

(function (window, document) {
  'use strict';

  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'default';

  function initMenuPage() {
    const catalogContainer = document.getElementById('menu-dishes-grid');
    if (!catalogContainer) return;

    renderCategoryTabs();
    setupSearchAndSort();
    renderDishesWithSkeleton();
  }

  function renderCategoryTabs() {
    const tabsContainer = document.getElementById('menu-category-tabs');
    if (!tabsContainer || !window.MeatPointMenu) return;

    tabsContainer.innerHTML = window.MeatPointMenu.categories.map(function (cat) {
      const isActive = cat.id === currentCategory ? 'active' : '';
      return `
        <button type="button" class="mp-cat-btn ${isActive}" data-cat-id="${cat.id}">
          ${cat.name}
        </button>
      `;
    }).join('');

    tabsContainer.querySelectorAll('.mp-cat-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabsContainer.querySelectorAll('.mp-cat-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-cat-id');
        renderDishesWithSkeleton();
      });
    });
  }

  function setupSearchAndSort() {
    const searchInput = document.getElementById('menu-search-input');
    const sortSelect = document.getElementById('menu-sort-select');

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchQuery = this.value.trim().toLowerCase();
        renderDishesWithSkeleton();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        currentSort = this.value;
        renderDishesWithSkeleton();
      });
    }
  }

  function getFilteredDishes() {
    if (!window.MeatPointMenu) return [];

    let list = window.MeatPointMenu.items;

    if (currentCategory !== 'all') {
      list = list.filter(function (it) {
        return it.category === currentCategory;
      });
    }

    if (searchQuery) {
      list = list.filter(function (it) {
        const fullText = (it.name + ' ' + it.description + ' ' + (it.tagLabels ? it.tagLabels.join(' ') : '')).toLowerCase();
        return fullText.includes(searchQuery);
      });
    }

    if (currentSort === 'price-asc') {
      list = [].concat(list).sort(function (a, b) { return a.price - b.price; });
    } else if (currentSort === 'price-desc') {
      list = [].concat(list).sort(function (a, b) { return b.price - a.price; });
    }

    return list;
  }

  function renderSkeleton(grid) {
    let skeletons = '';
    for (let i = 0; i < 6; i++) {
      skeletons += `
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="skeleton-card">
            <div class="skeleton-shimmer skeleton-img"></div>
            <div class="skeleton-content">
              <div class="skeleton-shimmer skeleton-line title"></div>
              <div class="skeleton-shimmer skeleton-line desc"></div>
              <div class="skeleton-shimmer skeleton-line short mt-auto"></div>
            </div>
          </div>
        </div>
      `;
    }
    grid.innerHTML = skeletons;
  }

  function renderDishesWithSkeleton() {
    const grid = document.getElementById('menu-dishes-grid');
    const countDisplay = document.getElementById('menu-items-count');
    if (!grid) return;

    renderSkeleton(grid);

    setTimeout(function () {
      const dishes = getFilteredDishes();

      if (countDisplay) {
        countDisplay.textContent = `Позиций: ${dishes.length}`;
      }

      if (dishes.length === 0) {
        grid.innerHTML = `
          <div class="col-12 text-center py-5">
            <h4 class="h5 text-muted mb-2">Блюда не найдены</h4>
            <p class="small text-muted mb-3">Измените параметры поиска или выберите другую категорию меню.</p>
            <button type="button" class="btn btn-editorial-outline" id="reset-search-btn">Сбросить фильтры</button>
          </div>
        `;
        const resetBtn = grid.querySelector('#reset-search-btn');
        if (resetBtn) {
          resetBtn.onclick = function () {
            currentCategory = 'all';
            searchQuery = '';
            currentSort = 'default';
            const input = document.getElementById('menu-search-input');
            if (input) input.value = '';
            renderCategoryTabs();
            renderDishesWithSkeleton();
          };
        }
        return;
      }

      populateGrid(grid, dishes);
    }, 250);
  }

  function populateGrid(grid, dishes) {
    grid.innerHTML = dishes.map(function (dish) {
      const badgesHtml = (dish.tagLabels || []).map(function (tag) {
        return `<span class="mp-dish-badge">${tag}</span>`;
      }).join('');

      return `
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <article class="mp-dish-card" data-dish-id="${dish.id}">
            <div class="mp-dish-thumb-wrap">
              <img src="${dish.image}" alt="${dish.name}" class="mp-dish-img" loading="lazy">
              <div class="mp-dish-badges">${badgesHtml}</div>
              <span class="mp-dish-weight">${dish.weight}</span>
            </div>
            <div class="mp-dish-body">
              <h3 class="mp-dish-title">${dish.name}</h3>
              <p class="mp-dish-desc">${dish.description}</p>
              <div class="mp-dish-footer">
                <span class="mp-dish-price tabular-nums">${window.MeatPointMenu.formatPrice(dish.price)}</span>
                <button type="button" class="btn btn-editorial-primary btn-sm px-3 add-to-cart-action-btn" data-id="${dish.id}" data-is-steak="${dish.isSteak}">
                  ${dish.isSteak ? 'Выбрать прожарку' : 'В корзину'}
                </button>
              </div>
            </div>
          </article>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.add-to-cart-action-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        const isSteak = this.getAttribute('data-is-steak') === 'true';

        if (isSteak && window.MeatPointCart) {
          window.MeatPointCart.openSteakModal(id);
        } else if (window.MeatPointCart) {
          window.MeatPointCart.addItem(id);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initMenuPage);

  window.MeatPointMenuPage = {
    renderDishes: renderDishesWithSkeleton
  };

})(window, document);
