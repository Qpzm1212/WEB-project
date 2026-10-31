(function () {
    "use strict";

    const menuSection = document.getElementById("menu-table");
    if (!menuSection) {
        return;
    }

    const dishes = [
        { id: "adana-kebab", name: "Adana Kebab", category: "Kebabs", description: "Spicy minced meat grilled on a skewer, served with bulgur.", price: 4500, dietary: "Halal" },
        { id: "chicken-shish", name: "Chicken Shish", category: "Kebabs", description: "Tender marinated chicken breast cubes, grilled to perfection.", price: 3800, dietary: "Halal" },
        { id: "kasarli-pide", name: "Kasarli Pide", category: "Pide", description: "Traditional boat-shaped flatbread baked with melted cheese.", price: 3200, dietary: "Vegetarian" },
        { id: "beef-ribeye", name: "Beef Ribeye", category: "Steaks", description: "Premium local beef, aged for 21 days and fire-grilled.", price: 8500, dietary: "Halal" },
        { id: "lentil-soup", name: "Lentil Soup", category: "Starters", description: "Traditional red lentil soup with herbs and lemon.", price: 1800, dietary: "Vegetarian" },
        { id: "turkish-tea", name: "Turkish Tea", category: "Drinks", description: "Freshly brewed traditional black tea.", price: 700, dietary: "Vegetarian" }
    ];
    const table = menuSection.querySelector("table");
    const tableBody = table.querySelector("tbody");
    const tableHead = table.querySelector("thead tr");
    const cart = new Map();
    const controls = window.meatPoint.createElement("form", "row g-2 align-items-end mb-3");
    const searchGroup = window.meatPoint.createElement("div", "col-12 col-md-5");
    const categoryGroup = window.meatPoint.createElement("div", "col-12 col-md-3");
    const sortGroup = window.meatPoint.createElement("div", "col-12 col-md-2");
    const resetGroup = window.meatPoint.createElement("div", "col-12 col-md-2");
    const searchLabel = window.meatPoint.createElement("label", "form-label", "Search dishes");
    const searchInput = window.meatPoint.createElement("input", "form-control");
    const categoryLabel = window.meatPoint.createElement("label", "form-label", "Category");
    const categorySelect = window.meatPoint.createElement("select", "form-select");
    const sortLabel = window.meatPoint.createElement("label", "form-label", "Sort by");
    const sortSelect = window.meatPoint.createElement("select", "form-select");
    const resetButton = window.meatPoint.createElement("button", "btn btn-outline-secondary w-100", "Reset filters");
    const resultCount = window.meatPoint.createElement("p", "small mb-2");
    const cartPanel = window.meatPoint.createElement("section", "mt-4 p-3 bg-light border rounded");
    const cartTitle = window.meatPoint.createElement("h3", "h4", "Demo cart");
    const cartList = window.meatPoint.createElement("ul", "list-group mb-3");
    const cartSummary = window.meatPoint.createElement("p", "fw-semibold mb-2");
    const cartMessage = window.meatPoint.createElement("p", "small text-muted mb-2");
    const cartActions = window.meatPoint.createElement("div", "d-flex flex-wrap gap-2");
    const clearButton = window.meatPoint.createElement("button", "btn btn-outline-secondary", "Clear cart");
    const checkoutButton = window.meatPoint.createElement("button", "btn btn-danger", "Review demo order");
    const checkoutMessage = window.meatPoint.createElement("p", "alert alert-success mt-3 mb-0");

    function addOption(select, value, label) {
        const option = window.meatPoint.createElement("option", "", label);
        option.value = value;
        select.append(option);
    }

    function renderDishRow(dish) {
        const row = document.createElement("tr");
        [dish.category, dish.name, `${dish.description} (${dish.dietary})`, window.meatPoint.formatMoney(dish.price)]
            .forEach(function (value) {
                row.append(window.meatPoint.createElement("td", "", value));
            });
        const actionCell = document.createElement("td");
        const addButton = window.meatPoint.createElement("button", "btn btn-outline-danger btn-sm", "Add to cart");
        addButton.type = "button";
        addButton.dataset.cartAction = "add";
        addButton.dataset.dishId = dish.id;
        addButton.setAttribute("aria-label", `Add ${dish.name} to demo cart`);
        actionCell.append(addButton);
        row.append(actionCell);
        return row;
    }

    function renderMenu() {
        const query = searchInput.value.trim().toLocaleLowerCase();
        const matchingDishes = dishes.filter(function (dish) {
            const matchesQuery = `${dish.name} ${dish.category} ${dish.description} ${dish.dietary}`
                .toLocaleLowerCase().includes(query);
            const matchesCategory = categorySelect.value === "all" || dish.category === categorySelect.value;
            return matchesQuery && matchesCategory;
        });

        if (sortSelect.value === "price-asc") {
            matchingDishes.sort(function (first, second) { return first.price - second.price; });
        } else if (sortSelect.value === "price-desc") {
            matchingDishes.sort(function (first, second) { return second.price - first.price; });
        } else {
            matchingDishes.sort(function (first, second) { return first.name.localeCompare(second.name); });
        }

        tableBody.replaceChildren();
        matchingDishes.forEach(function (dish) {
            tableBody.append(renderDishRow(dish));
        });
        resultCount.textContent = matchingDishes.length === 0
            ? "No dishes match. Change the search or category, or reset the filters."
            : `${matchingDishes.length} ${matchingDishes.length === 1 ? "dish" : "dishes"} found.`;
    }

    function createCartAction(label, action, dishId, disabled) {
        const button = window.meatPoint.createElement("button", "btn btn-sm btn-outline-secondary", label);
        button.type = "button";
        button.dataset.cartAction = action;
        button.dataset.dishId = dishId;
        button.disabled = Boolean(disabled);
        if (action === "increase" || action === "decrease") {
            const dish = dishes.find(function (item) { return item.id === dishId; });
            button.setAttribute("aria-label", `${action === "increase" ? "Increase" : "Decrease"} ${dish.name} quantity`);
        }
        return button;
    }

    function renderCartLine(dish, quantity) {
        const item = window.meatPoint.createElement("li", "list-group-item d-flex flex-wrap justify-content-between align-items-center gap-2");
        const details = window.meatPoint.createElement(
            "span",
            "",
            `${dish.name} — ${quantity} × ${window.meatPoint.formatMoney(dish.price)} = ${window.meatPoint.formatMoney(dish.price * quantity)}`
        );
        const actions = window.meatPoint.createElement("span", "d-flex flex-wrap gap-1");
        actions.append(
            createCartAction("−", "decrease", dish.id, quantity === 1),
            createCartAction("+", "increase", dish.id, false),
            createCartAction("Remove", "remove", dish.id, false)
        );
        item.append(details, actions);
        return item;
    }

    function renderCart() {
        cartList.replaceChildren();
        let totalQuantity = 0;
        let totalPrice = 0;

        cart.forEach(function (quantity, dishId) {
            const dish = dishes.find(function (item) { return item.id === dishId; });
            if (!dish) {
                return;
            }
            totalQuantity += quantity;
            totalPrice += dish.price * quantity;
            cartList.append(renderCartLine(dish, quantity));
        });

        if (totalQuantity === 0) {
            cartList.append(window.meatPoint.createElement("li", "list-group-item", "Your demo cart is empty."));
        }
        cartSummary.textContent = `${totalQuantity} item(s) · Total: ${window.meatPoint.formatMoney(totalPrice)}`;
        cartMessage.textContent = totalQuantity === 0
            ? "Add a dish to review quantities and totals."
            : "Prices are the menu prices shown above. This demo does not place or send an order.";
        checkoutButton.disabled = totalQuantity === 0;
        checkoutMessage.hidden = true;
        resultCount.setAttribute("aria-live", "polite");
        cartSummary.setAttribute("aria-live", "polite");
    }

    function updateCart(action, dishId) {
        const currentQuantity = cart.get(dishId) || 0;
        if (action === "add" || action === "increase") {
            cart.set(dishId, currentQuantity + 1);
        } else if (action === "decrease" && currentQuantity > 1) {
            cart.set(dishId, currentQuantity - 1);
        } else if (action === "remove" || (action === "decrease" && currentQuantity === 1)) {
            cart.delete(dishId);
        }
        renderCart();
    }

    searchInput.type = "search";
    searchInput.id = "menu-search";
    searchLabel.htmlFor = searchInput.id;
    searchInput.placeholder = "Dish, category or dietary";
    categorySelect.id = "menu-category";
    categoryLabel.htmlFor = categorySelect.id;
    addOption(categorySelect, "all", "All categories");
    [...new Set(dishes.map(function (dish) { return dish.category; }))].forEach(function (category) {
        addOption(categorySelect, category, category);
    });
    sortSelect.id = "menu-sort";
    sortLabel.htmlFor = sortSelect.id;
    addOption(sortSelect, "name", "Name");
    addOption(sortSelect, "price-asc", "Price: low");
    addOption(sortSelect, "price-desc", "Price: high");
    resetButton.type = "reset";
    clearButton.type = "button";
    checkoutButton.type = "button";
    checkoutMessage.hidden = true;
    tableHead.append(window.meatPoint.createElement("th", "", "Action"));
    searchGroup.append(searchLabel, searchInput);
    categoryGroup.append(categoryLabel, categorySelect);
    sortGroup.append(sortLabel, sortSelect);
    resetGroup.append(resetButton);
    controls.append(searchGroup, categoryGroup, sortGroup, resetGroup);
    menuSection.querySelector(".table-responsive").before(controls, resultCount);
    cartActions.append(clearButton, checkoutButton);
    cartPanel.append(cartTitle, cartList, cartSummary, cartMessage, cartActions, checkoutMessage);
    menuSection.after(cartPanel);

    [searchInput, categorySelect, sortSelect].forEach(function (control) {
        control.addEventListener(control === searchInput ? "input" : "change", renderMenu);
    });
    controls.addEventListener("submit", function (event) {
        event.preventDefault();
    });
    controls.addEventListener("reset", function () {
        window.setTimeout(function () {
            searchInput.value = "";
            categorySelect.value = "all";
            sortSelect.value = "name";
            renderMenu();
        });
    });
    menuSection.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-cart-action]");
        if (button) {
            updateCart(button.dataset.cartAction, button.dataset.dishId);
        }
    });
    cartPanel.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-cart-action]");
        if (button) {
            updateCart(button.dataset.cartAction, button.dataset.dishId);
        }
    });
    clearButton.addEventListener("click", function () {
        cart.clear();
        renderCart();
    });
    checkoutButton.addEventListener("click", function () {
        const quantity = Array.from(cart.values()).reduce(function (total, value) { return total + value; }, 0);
        if (quantity === 0) {
            return;
        }
        checkoutMessage.textContent =
            `Demo order ${window.meatPoint.createDemoReference("MP-ORDER")} reviewed: ` +
            `${cartSummary.textContent}. No data was sent and no real order was created.`;
        checkoutMessage.hidden = false;
    });

    renderMenu();
    renderCart();
}());
