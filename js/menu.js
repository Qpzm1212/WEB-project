"use strict";

(function () {
    "use strict";

    const menuTableSection = document.getElementById("menu-table");
    if (!menuTableSection || !window.meatPoint) {
        return;
    }

    const createElement = window.meatPoint.createElement;
    const formatMoney = window.meatPoint.formatMoney;
    const normalizeText = window.meatPoint.normalizeText;

    // Array of 10 real Turkish Halal dishes at Meat Point, each with 8 meaningful properties
    const menuDishes = [
        {
            id: "DISH-01",
            name: "Adana Kebab",
            category: "Kebabs",
            price: 4500,
            weightGrams: 340,
            prepMinutes: 20,
            isVegetarian: false,
            spicyLevel: "Spicy",
            description: "Spicy minced lamb and beef grilled on a wide iron skewer, served with bulgur and flatbread."
        },
        {
            id: "DISH-02",
            name: "Chicken Shish",
            category: "Kebabs",
            price: 3800,
            weightGrams: 320,
            prepMinutes: 18,
            isVegetarian: false,
            spicyLevel: "Mild",
            description: "Tender marinated halal chicken breast cubes grilled over charcoal, served with grilled tomatoes."
        },
        {
            id: "DISH-03",
            name: "Kasarli Pide",
            category: "Pide (Turkish Pizza)",
            price: 3200,
            weightGrams: 400,
            prepMinutes: 15,
            isVegetarian: true,
            spicyLevel: "Mild",
            description: "Traditional boat-shaped stone-oven flatbread baked with golden melted Kasar cheese."
        },
        {
            id: "DISH-04",
            name: "Beef Ribeye",
            category: "Steaks",
            price: 8500,
            weightGrams: 380,
            prepMinutes: 25,
            isVegetarian: false,
            spicyLevel: "Medium",
            description: "Premium local halal beef aged for 21 days and fire-grilled to your preferred doneness."
        },
        {
            id: "DISH-05",
            name: "Iskender Kebab",
            category: "Kebabs",
            price: 5200,
            weightGrams: 420,
            prepMinutes: 20,
            isVegetarian: false,
            spicyLevel: "Medium",
            description: "Thinly sliced doner meat over warm pita cubes with rich tomato sauce, browned butter, and yogurt."
        },
        {
            id: "DISH-06",
            name: "Kusbasili Beef Pide",
            category: "Pide (Turkish Pizza)",
            price: 4100,
            weightGrams: 430,
            prepMinutes: 18,
            isVegetarian: false,
            spicyLevel: "Medium",
            description: "Crisp Turkish flatbread topped with diced tender beef, sweet peppers, and herbs."
        },
        {
            id: "DISH-07",
            name: "Lamb T-Bone Steak",
            category: "Steaks",
            price: 7400,
            weightGrams: 360,
            prepMinutes: 22,
            isVegetarian: false,
            spicyLevel: "Mild",
            description: "Charcoal-seared tender lamb loin chops seasoned with Anatolian mountain oregano."
        },
        {
            id: "DISH-08",
            name: "Mercimek Lentil Soup",
            category: "Soups & Salads",
            price: 1800,
            weightGrams: 300,
            prepMinutes: 10,
            isVegetarian: true,
            spicyLevel: "Mild",
            description: "Velvety red lentil soup served with fresh lemon wedges and warm crusty Turkish bread."
        },
        {
            id: "DISH-09",
            name: "Choban Shepherd Salad",
            category: "Soups & Salads",
            price: 2200,
            weightGrams: 280,
            prepMinutes: 8,
            isVegetarian: true,
            spicyLevel: "Mild",
            description: "Crisp cucumbers, ripe tomatoes, red onions, parsley, and olive oil dressing."
        },
        {
            id: "DISH-10",
            name: "Kunefe & Turkish Tea Set",
            category: "Desserts & Tea",
            price: 2900,
            weightGrams: 260,
            prepMinutes: 14,
            isVegetarian: true,
            spicyLevel: "Mild",
            description: "Hot crispy shredded phyllo pastry with melted cheese, pistachios, and double-filtered H2O black tea."
        }
    ];

    const cartItems = [];
    let spotlightDishId = "";

    // Reusable Function 1: Filter dishes by search query, category, and dietary preference using a for loop
    function filterDishes(query, category, dietary) {
        const cleanQuery = normalizeText(query);
        const cleanCategory = category || "all";
        const cleanDietary = dietary || "all";
        const matched = [];

        for (let i = 0; i < menuDishes.length; i += 1) {
            const dish = menuDishes[i];
            const searchable = normalizeText(`${dish.name} ${dish.category} ${dish.description} ${dish.spicyLevel}`);
            const matchesQuery = cleanQuery === "" || searchable.includes(cleanQuery);
            const matchesCategory = cleanCategory === "all" || dish.category === cleanCategory;

            let matchesDiet = true;
            if (cleanDietary === "vegetarian") {
                matchesDiet = dish.isVegetarian === true;
            } else if (cleanDietary === "meat") {
                matchesDiet = dish.isVegetarian === false;
            }

            if (matchesQuery && matchesCategory && matchesDiet) {
                matched.push(dish);
            }
        }

        return matched;
    }

    // Reusable Function 2: Sort dishes by selected criterion
    function sortDishes(list, sortKey) {
        const sorted = list.slice();
        sorted.sort(function (a, b) {
            switch (sortKey) {
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "prep-asc":
                    return a.prepMinutes - b.prepMinutes;
                case "name-asc":
                    return a.name.localeCompare(b.name);
                default:
                    return a.id.localeCompare(b.id);
            }
        });
        return sorted;
    }

    // Reusable Function 3: Calculate cart totals (calls window.meatPoint.calculateOrderBreakdown)
    function calculateCartSummary(items, serviceMode) {
        let itemCount = 0;
        let totalGrams = 0;
        let maxPrepMinutes = 0;
        let rawSubtotal = 0;

        for (let i = 0; i < items.length; i += 1) {
            const entry = items[i];
            itemCount += entry.quantity;
            totalGrams += entry.dish.weightGrams * entry.quantity;
            rawSubtotal += entry.dish.price * entry.quantity;
            if (entry.dish.prepMinutes > maxPrepMinutes) {
                maxPrepMinutes = entry.dish.prepMinutes;
            }
        }

        const discountAmount = rawSubtotal >= 15000 ? Math.round(rawSubtotal * 0.15) : 0;
        const serviceRate = serviceMode === "dine-in" ? 10 : 0;
        const breakdown = window.meatPoint.calculateOrderBreakdown(rawSubtotal, discountAmount, serviceRate);
        const deliveryFee = serviceMode === "delivery" && rawSubtotal > 0 && rawSubtotal < 12000 ? 1500 : 0;
        const grandTotal = breakdown.total + deliveryFee;

        return {
            itemCount: itemCount,
            totalGrams: totalGrams,
            estimatedMinutes: itemCount > 0 ? maxPrepMinutes + Math.min(15, itemCount * 2) : 0,
            subtotal: breakdown.subtotal,
            discount: breakdown.discount,
            serviceFee: breakdown.serviceFee,
            deliveryFee: deliveryFee,
            grandTotal: grandTotal
        };
    }

    // Reusable Function 4: Create a single Dish Card via DOM
    function createDishCard(dish) {
        const col = createElement("div", "col-12 col-md-6 col-lg-4");
        const isSpotlight = dish.id === spotlightDishId;
        const card = createElement(
            "div",
            `card h-100 shadow-sm ${isSpotlight ? "border-danger border-2" : ""}`
        );
        const body = createElement("div", "card-body d-flex flex-column");

        const topRow = createElement("div", "d-flex justify-content-between align-items-start gap-2 mb-2");
        const title = createElement("h3", "h5 card-title mb-0", dish.name);
        const priceBadge = createElement("span", "badge text-bg-danger fs-6", formatMoney(dish.price));
        topRow.append(title, priceBadge);

        const tagsRow = createElement("div", "d-flex flex-wrap gap-1 mb-2");
        tagsRow.append(createElement("span", "badge text-bg-dark", dish.category));
        tagsRow.append(
            createElement(
                "span",
                dish.isVegetarian ? "badge text-bg-success" : "badge text-bg-secondary",
                dish.isVegetarian ? "Vegetarian (Leaf)" : "100% Halal Meat"
            )
        );
        tagsRow.append(createElement("span", "badge text-bg-light border text-dark", `${dish.prepMinutes} min · ${dish.weightGrams}g`));
        if (isSpotlight) {
            tagsRow.append(createElement("span", "badge text-bg-warning", "Chef's Spotlight"));
        }

        const desc = createElement("p", "card-text small text-muted flex-grow-1", dish.description);

        const addButton = createElement("button", "btn btn-outline-danger w-100 mt-2", "Add to Order Cart");
        addButton.type = "button";
        addButton.dataset.addDishId = dish.id;

        body.append(topRow, tagsRow, desc, addButton);
        card.append(body);
        col.append(card);
        return col;
    }

    // Reusable Function 5: Create a single table row for #menu-table tbody
    function createDishTableRow(dish) {
        const tr = createElement("tr", dish.id === spotlightDishId ? "table-warning" : "");
        const th = createElement("th", "", dish.category);
        th.scope = "row";
        const tdName = createElement("td", "fw-semibold", `${dish.name}${dish.isVegetarian ? " (Veg)" : ""}`);
        const tdDesc = createElement("td", "", `${dish.description} (${dish.weightGrams}g, ~${dish.prepMinutes} min)`);
        const tdPrice = createElement("td", "text-nowrap fw-bold", formatMoney(dish.price));
        tr.append(th, tdName, tdDesc, tdPrice);
        return tr;
    }

    // Build Interactive Catalog Controls & Grid Section via DOM
    const catalogSection = createElement("section", "mb-5 p-4 bg-light border rounded shadow-sm");
    catalogSection.id = "interactive-menu-catalog";

    const headerBar = createElement("div", "d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3");
    const catalogHeading = createElement("h2", "h3 text-danger mb-0", "Interactive Dish Catalog");
    const randomPickBtn = createElement("button", "btn btn-sm btn-danger", "Chef's Random Recommendation");
    randomPickBtn.type = "button";
    headerBar.append(catalogHeading, randomPickBtn);

    const controlsRow = createElement("div", "row g-2 mb-3");
    const searchCol = createElement("div", "col-12 col-md-4");
    const searchInput = createElement("input", "form-control");
    searchInput.type = "search";
    searchInput.placeholder = "Search dishes or ingredients...";
    searchInput.setAttribute("aria-label", "Search menu dishes");
    searchCol.append(searchInput);

    const catCol = createElement("div", "col-6 col-md-3");
    const categorySelect = createElement("select", "form-select");
    categorySelect.setAttribute("aria-label", "Filter by dish category");
    [
        "all",
        "Kebabs",
        "Pide (Turkish Pizza)",
        "Steaks",
        "Soups & Salads",
        "Desserts & Tea"
    ].forEach(function (cat) {
        const option = createElement("option", "", cat === "all" ? "All Categories" : cat);
        option.value = cat;
        categorySelect.append(option);
    });
    catCol.append(categorySelect);

    const dietCol = createElement("div", "col-6 col-md-2");
    const dietSelect = createElement("select", "form-select");
    dietSelect.setAttribute("aria-label", "Filter by dietary preference");
    [
        { value: "all", label: "All Diets (Halal)" },
        { value: "vegetarian", label: "Vegetarian Only" },
        { value: "meat", label: "Meat Dishes Only" }
    ].forEach(function (opt) {
        const option = createElement("option", "", opt.label);
        option.value = opt.value;
        dietSelect.append(option);
    });
    dietCol.append(dietSelect);

    const sortCol = createElement("div", "col-6 col-md-2");
    const sortSelect = createElement("select", "form-select");
    sortSelect.setAttribute("aria-label", "Sort dishes");
    [
        { value: "default", label: "Default Order" },
        { value: "price-asc", label: "Price: Low to High" },
        { value: "price-desc", label: "Price: High to Low" },
        { value: "prep-asc", label: "Fastest Prep Time" },
        { value: "name-asc", label: "Name: A to Z" }
    ].forEach(function (opt) {
        const option = createElement("option", "", opt.label);
        option.value = opt.value;
        sortSelect.append(option);
    });
    sortCol.append(sortSelect);

    const resetCol = createElement("div", "col-6 col-md-1 d-grid");
    const resetCatalogBtn = createElement("button", "btn btn-outline-secondary", "Reset");
    resetCatalogBtn.type = "button";
    resetCol.append(resetCatalogBtn);

    controlsRow.append(searchCol, catCol, dietCol, sortCol, resetCol);

    const catalogStatus = createElement("p", "small text-muted mb-3");
    catalogStatus.setAttribute("aria-live", "polite");
    const dishGrid = createElement("div", "row g-3");

    catalogSection.append(headerBar, controlsRow, catalogStatus, dishGrid);
    menuTableSection.before(catalogSection);

    // Build Interactive Shopping Cart & Pre-Order Checkout Form Section via DOM
    const cartSection = createElement("section", "mb-5 p-4 bg-white border rounded shadow-sm");
    cartSection.id = "demo-order-cart";

    const cartHeader = createElement("div", "d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3");
    const cartTitle = createElement("h2", "h3 text-danger mb-0", "Your Order Cart & Cost Calculator");
    const clearCartBtn = createElement("button", "btn btn-sm btn-outline-secondary", "Clear Cart");
    clearCartBtn.type = "button";
    cartHeader.append(cartTitle, clearCartBtn);

    const cartStatus = createElement("p", "small text-muted mb-2");
    cartStatus.setAttribute("aria-live", "polite");
    const cartList = createElement("ul", "list-group mb-3");
    const cartTotalsBox = createElement("div", "p-3 bg-light border rounded mb-4");

    // Pre-order checkout form with 4 validated fields + combined rule
    const checkoutForm = createElement("form", "p-3 bg-light border rounded");
    checkoutForm.id = "menu-preorder-form";
    checkoutForm.noValidate = true;
    const checkoutHeading = createElement("h3", "h5 mb-3", "Complete Pre-Order / Delivery Request");

    const formRow = createElement("div", "row g-3");

    const cNameCol = createElement("div", "col-12 col-md-6");
    const cNameLabel = createElement("label", "form-label", "Your Name");
    cNameLabel.setAttribute("for", "order-client-name");
    const cNameInput = createElement("input", "form-control");
    cNameInput.type = "text";
    cNameInput.id = "order-client-name";
    cNameInput.placeholder = "e.g. Madiyar Akylbek";
    const cNameErr = createElement("div", "invalid-feedback");
    cNameErr.id = "order-client-name-error";
    cNameCol.append(cNameLabel, cNameInput, cNameErr);

    const cPhoneCol = createElement("div", "col-12 col-md-6");
    const cPhoneLabel = createElement("label", "form-label", "Phone Number");
    cPhoneLabel.setAttribute("for", "order-client-phone");
    const cPhoneInput = createElement("input", "form-control");
    cPhoneInput.type = "tel";
    cPhoneInput.id = "order-client-phone";
    cPhoneInput.placeholder = "+7 778 422 11 00";
    const cPhoneErr = createElement("div", "invalid-feedback");
    cPhoneErr.id = "order-client-phone-error";
    cPhoneCol.append(cPhoneLabel, cPhoneInput, cPhoneErr);

    const cModeCol = createElement("div", "col-12 col-md-6");
    const cModeLabel = createElement("label", "form-label", "Order Type");
    cModeLabel.setAttribute("for", "order-service-mode");
    const cModeSelect = createElement("select", "form-select");
    cModeSelect.id = "order-service-mode";
    [
        { value: "dine-in", label: "Dine-In Pre-Order (10% service)" },
        { value: "delivery", label: "24/7 Astana Delivery (Min order 5,000 ₸)" },
        { value: "takeout", label: "Self-Pickup / Takeout (0% service)" }
    ].forEach(function (opt) {
        const option = createElement("option", "", opt.label);
        option.value = opt.value;
        cModeSelect.append(option);
    });
    const cModeErr = createElement("div", "invalid-feedback");
    cModeErr.id = "order-service-mode-error";
    cModeCol.append(cModeLabel, cModeSelect, cModeErr);

    const cCutleryCol = createElement("div", "col-12 col-md-6");
    const cCutleryLabel = createElement("label", "form-label", "Number of Diners / Cutlery Sets");
    cCutleryLabel.setAttribute("for", "order-cutlery-count");
    const cCutleryInput = createElement("input", "form-control");
    cCutleryInput.type = "number";
    cCutleryInput.id = "order-cutlery-count";
    cCutleryInput.min = "1";
    cCutleryInput.max = "30";
    cCutleryInput.value = "2";
    const cCutleryErr = createElement("div", "invalid-feedback");
    cCutleryErr.id = "order-cutlery-count-error";
    cCutleryCol.append(cCutleryLabel, cCutleryInput, cCutleryErr);

    const submitCol = createElement("div", "col-12 d-flex flex-wrap gap-2 mt-3");
    const placeOrderBtn = createElement("button", "btn btn-danger", "Place Demo Pre-Order");
    placeOrderBtn.type = "submit";
    submitCol.append(placeOrderBtn);

    formRow.append(cNameCol, cPhoneCol, cModeCol, cCutleryCol, submitCol);
    checkoutForm.append(checkoutHeading, formRow);

    const orderConfirmation = createElement("div", "alert alert-success mt-3 mb-0 d-none");
    orderConfirmation.setAttribute("aria-live", "polite");

    cartSection.append(cartHeader, cartStatus, cartList, cartTotalsBox, checkoutForm, orderConfirmation);
    menuTableSection.after(cartSection);

    function renderCatalogAndTable() {
        const filtered = filterDishes(searchInput.value, categorySelect.value, dietSelect.value);
        const sorted = sortDishes(filtered, sortSelect.value);

        dishGrid.replaceChildren();
        const tableBody = menuTableSection.querySelector("tbody");
        if (tableBody) {
            tableBody.replaceChildren();
        }

        let totalPriceSum = 0;
        for (let i = 0; i < sorted.length; i += 1) {
            totalPriceSum += sorted[i].price;
        }
        const avgPrice = sorted.length > 0 ? Math.round(totalPriceSum / sorted.length) : 0;

        catalogStatus.textContent = sorted.length > 0
            ? `Showing ${sorted.length} of ${menuDishes.length} dishes · Average dish price: ${formatMoney(avgPrice)}.`
            : `0 of ${menuDishes.length} dishes found.`;

        if (sorted.length === 0) {
            const emptyCol = createElement("div", "col-12");
            const emptyBox = createElement(
                "div",
                "alert alert-warning mb-0",
                "No dishes match your search or filters. Click Reset to display the full menu."
            );
            emptyCol.append(emptyBox);
            dishGrid.append(emptyCol);
            if (tableBody) {
                const emptyTr = createElement("tr");
                const emptyTd = createElement("td", "text-center text-muted py-3", "No dishes match current filter.");
                emptyTd.colSpan = 4;
                emptyTr.append(emptyTd);
                tableBody.append(emptyTr);
            }
            return;
        }

        for (let i = 0; i < sorted.length; i += 1) {
            dishGrid.append(createDishCard(sorted[i]));
            if (tableBody) {
                tableBody.append(createDishTableRow(sorted[i]));
            }
        }
    }

    function createCartItemRow(entry) {
        const li = createElement(
            "li",
            "list-group-item d-flex flex-wrap justify-content-between align-items-center gap-2"
        );
        const infoDiv = createElement("div");
        const title = createElement("span", "fw-bold", entry.dish.name);
        const details = createElement(
            "p",
            "mb-0 small text-muted",
            `${formatMoney(entry.dish.price)} each × ${entry.quantity} = ${formatMoney(entry.dish.price * entry.quantity)}`
        );
        infoDiv.append(title, details);

        const controls = createElement("div", "btn-group btn-group-sm");
        const decBtn = createElement("button", "btn btn-outline-secondary", "−");
        decBtn.type = "button";
        decBtn.dataset.cartAction = "dec";
        decBtn.dataset.dishId = entry.dish.id;

        const qtySpan = createElement("span", "btn btn-light disabled fw-bold text-dark", String(entry.quantity));

        const incBtn = createElement("button", "btn btn-outline-secondary", "+");
        incBtn.type = "button";
        incBtn.dataset.cartAction = "inc";
        incBtn.dataset.dishId = entry.dish.id;

        const removeBtn = createElement("button", "btn btn-outline-danger", "Remove");
        removeBtn.type = "button";
        removeBtn.dataset.cartAction = "remove";
        removeBtn.dataset.dishId = entry.dish.id;

        controls.append(decBtn, qtySpan, incBtn, removeBtn);
        li.append(infoDiv, controls);
        return li;
    }

    function renderCart() {
        cartList.replaceChildren();
        cartTotalsBox.replaceChildren();

        const summary = calculateCartSummary(cartItems, cModeSelect.value);

        if (cartItems.length === 0) {
            cartStatus.textContent = "Your cart is currently empty. Add dishes from the catalog above.";
            cartList.append(
                createElement(
                    "li",
                    "list-group-item text-muted small",
                    "No dishes selected yet. Click 'Add to Order Cart' on any dish card to start calculating your meal."
                )
            );
            cartTotalsBox.append(
                createElement("p", "mb-0 small text-muted", "Subtotal: 0 ₸ · Total payable: 0 ₸")
            );
            return;
        }

        cartStatus.textContent =
            `${summary.itemCount} portion(s) in cart · Total weight: ${summary.totalGrams}g · Est. prep time: ~${summary.estimatedMinutes} min.`;

        for (let i = 0; i < cartItems.length; i += 1) {
            cartList.append(createCartItemRow(cartItems[i]));
        }

        const lines = [
            `Subtotal (${summary.itemCount} items): ${formatMoney(summary.subtotal)}`,
            `Volume Discount (15% on orders ≥ 15,000 ₸): −${formatMoney(summary.discount)}`,
            `Dine-In Service Charge (10%): ${formatMoney(summary.serviceFee)}`,
            `Delivery Fee (Free over 12,000 ₸): ${formatMoney(summary.deliveryFee)}`,
            `Grand Total: ${formatMoney(summary.grandTotal)}`
        ];

        for (let i = 0; i < lines.length; i += 1) {
            const p = createElement(
                "p",
                i === lines.length - 1 ? "mb-0 fw-bold text-danger fs-5 mt-2" : "mb-1 small",
                lines[i]
            );
            cartTotalsBox.append(p);
        }
    }

    function setFieldError(input, errorEl, message) {
        const hasError = message !== "";
        input.classList.toggle("is-invalid", hasError);
        input.classList.toggle("is-valid", !hasError && input.value.trim() !== "");
        errorEl.textContent = message;
    }

    function validatePreorderField(input) {
        const summary = calculateCartSummary(cartItems, cModeSelect.value);
        let msg = "";

        if (input === cNameInput) {
            if (cNameInput.value.trim().length < 2) {
                msg = "Please enter your name (at least 2 characters).";
            }
            setFieldError(cNameInput, cNameErr, msg);
        } else if (input === cPhoneInput) {
            if (!window.meatPoint.isValidPhone(cPhoneInput.value)) {
                msg = "Enter a valid phone number (10–15 digits).";
            }
            setFieldError(cPhoneInput, cPhoneErr, msg);
        } else if (input === cCutleryInput) {
            const count = Number(cCutleryInput.value);
            if (!Number.isInteger(count) || count < 1 || count > 30) {
                msg = "Enter a whole number of cutlery sets between 1 and 30.";
            }
            setFieldError(cCutleryInput, cCutleryErr, msg);
        } else if (input === cModeSelect) {
            // Combined rule comparing order mode and cart subtotal
            if (cartItems.length === 0) {
                msg = "Please add at least one dish to your cart before placing an order.";
            } else if (cModeSelect.value === "delivery" && summary.subtotal < 5000) {
                msg = `Delivery requires a minimum food subtotal of 5,000 ₸ (current subtotal: ${formatMoney(summary.subtotal)}).`;
            }
            setFieldError(cModeSelect, cModeErr, msg);
        }

        return msg === "";
    }

    // Event Listeners
    searchInput.addEventListener("input", renderCatalogAndTable);
    categorySelect.addEventListener("change", renderCatalogAndTable);
    dietSelect.addEventListener("change", renderCatalogAndTable);
    sortSelect.addEventListener("change", renderCatalogAndTable);

    resetCatalogBtn.addEventListener("click", function () {
        searchInput.value = "";
        categorySelect.value = "all";
        dietSelect.value = "all";
        sortSelect.value = "default";
        spotlightDishId = "";
        renderCatalogAndTable();
    });

    randomPickBtn.addEventListener("click", function () {
        const randomIndex = Math.floor(Math.random() * menuDishes.length);
        const picked = menuDishes[randomIndex];
        spotlightDishId = picked.id;
        searchInput.value = "";
        categorySelect.value = "all";
        dietSelect.value = "all";
        renderCatalogAndTable();
        catalogStatus.textContent = `Chef's Spotlight: ${picked.name} (${formatMoney(picked.price)}) — ${picked.description}`;
    });

    dishGrid.addEventListener("click", function (event) {
        const btn = event.target.closest("button[data-add-dish-id]");
        if (!btn) {
            return;
        }
        const dishId = btn.dataset.addDishId;
        const dish = menuDishes.find(function (d) {
            return d.id === dishId;
        });
        if (!dish) {
            return;
        }

        const existing = cartItems.find(function (entry) {
            return entry.dish.id === dishId;
        });
        if (existing) {
            existing.quantity += 1;
        } else {
            cartItems.push({ dish: dish, quantity: 1 });
        }

        orderConfirmation.classList.add("d-none");
        renderCart();
        if (cModeSelect.classList.contains("is-invalid")) {
            validatePreorderField(cModeSelect);
        }
    });

    cartList.addEventListener("click", function (event) {
        const btn = event.target.closest("button[data-cart-action]");
        if (!btn) {
            return;
        }
        const dishId = btn.dataset.dishId;
        const action = btn.dataset.cartAction;
        const idx = cartItems.findIndex(function (entry) {
            return entry.dish.id === dishId;
        });
        if (idx === -1) {
            return;
        }

        if (action === "inc") {
            cartItems[idx].quantity += 1;
        } else if (action === "dec") {
            cartItems[idx].quantity -= 1;
            if (cartItems[idx].quantity <= 0) {
                cartItems.splice(idx, 1);
            }
        } else if (action === "remove") {
            cartItems.splice(idx, 1);
        }

        orderConfirmation.classList.add("d-none");
        renderCart();
    });

    clearCartBtn.addEventListener("click", function () {
        cartItems.length = 0;
        orderConfirmation.classList.add("d-none");
        renderCart();
    });

    [cNameInput, cPhoneInput, cModeSelect, cCutleryInput].forEach(function (field) {
        const evt = field.tagName === "SELECT" ? "change" : "input";
        field.addEventListener(evt, function () {
            validatePreorderField(field);
            if (field === cModeSelect) {
                renderCart();
            }
        });
    });

    checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const fields = [cNameInput, cPhoneInput, cModeSelect, cCutleryInput];
        const invalid = [];

        for (let i = 0; i < fields.length; i += 1) {
            if (!validatePreorderField(fields[i])) {
                invalid.push(fields[i]);
            }
        }

        if (invalid.length > 0) {
            invalid[0].focus();
            orderConfirmation.classList.add("d-none");
            return;
        }

        const summary = calculateCartSummary(cartItems, cModeSelect.value);
        const ref = window.meatPoint.createDemoReference("ORD");
        orderConfirmation.textContent =
            `Demonstration Pre-Order ${ref} prepared for ${cNameInput.value.trim()} (${cPhoneInput.value.trim()}): ` +
            `${summary.itemCount} dish(es), ${cCutleryInput.value} cutlery set(s), mode: ${cModeSelect.value}, ` +
            `Grand Total: ${formatMoney(summary.grandTotal)}. ` +
            "This is a front-end demonstration; no real order or payment was sent to a server.";
        orderConfirmation.classList.remove("d-none");
    });

    // Seed 2 signature dishes into initial cart so visitors immediately see live calculations
    cartItems.push({ dish: menuDishes[0], quantity: 1 });
    cartItems.push({ dish: menuDishes[2], quantity: 1 });

    renderCatalogAndTable();
    renderCart();
}());
