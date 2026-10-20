"use strict";

(function () {
    "use strict";

    if (!window.meatPoint) {
        return;
    }

    const createElement = window.meatPoint.createElement;
    const formatMoney = window.meatPoint.formatMoney;
    const normalizeText = window.meatPoint.normalizeText;
    const getLocalDateString = window.meatPoint.getLocalDateString;

    // Array of 8 real restaurant highlights, signature sets & milestones (each with 7 meaningful properties)
    const restaurantHighlights = [
        {
            id: "HL-01",
            title: "Weekday Business Lunch Set",
            category: "Specials",
            year: 2026,
            pricePerGuest: 3500,
            metric: "12:00 – 15:00 Mon-Fri",
            description: "Includes red lentil soup, choice of Chicken Shish or Pide, shepherd salad, and unlimited Turkish tea."
        },
        {
            id: "HL-02",
            title: "Signature Meat Point Grill Platter",
            category: "Specials",
            year: 2025,
            pricePerGuest: 6500,
            metric: "400g Mixed Grill / Guest",
            description: "Chef's assortment of Adana Kebab, lamb chops, chicken wings, grilled vegetables, and warm lavash."
        },
        {
            id: "HL-03",
            title: "Sultan Royal Banquet Menu",
            category: "Specials",
            year: 2026,
            pricePerGuest: 9800,
            metric: "Full 4-Course Feast",
            description: "Aged Beef Ribeye, mezze platter, hot cheese Kunefe dessert, and dedicated table service."
        },
        {
            id: "HL-04",
            title: "Summer Terrace Opening",
            category: "Milestones",
            year: 2026,
            pricePerGuest: 0,
            metric: "Up to 25 Outdoor Seats",
            description: "Opened our landscaped open-air terrace near the Botanical Garden and EXPO boulevard."
        },
        {
            id: "HL-05",
            title: "10,000th Guest Celebration",
            category: "Milestones",
            year: 2025,
            pricePerGuest: 0,
            metric: "4.9★ Guest Satisfaction",
            description: "Welcomed our ten thousandth visitor and expanded our 24/7 delivery fleet across Astana."
        },
        {
            id: "HL-06",
            title: "Restaurant Foundation & Halal Audit",
            category: "Milestones",
            year: 2024,
            pricePerGuest: 0,
            metric: "400 m² Dining Hall",
            description: "Founded Meat Point on Uly Dala 45 with 100% certified Halal local beef and imported Turkish spices."
        },
        {
            id: "HL-07",
            title: "Double-Filtered H2O Tea Standard",
            category: "Quality",
            year: 2024,
            pricePerGuest: 1200,
            metric: "100% Pure Water",
            description: "Every pot of traditional Rize black tea and cold beverage is prepared with double-filtered H2O."
        },
        {
            id: "HL-08",
            title: "24/7 Round-the-Clock Grill Kitchen",
            category: "Quality",
            year: 2025,
            pricePerGuest: 4500,
            metric: "Open 365 Days 24/7",
            description: "Full charcoal grill and breakfast menu available day and night without kitchen breaks."
        }
    ];

    // Reusable Function 1: Filter highlights by query and category using a for loop
    function filterHighlights(query, category, sortBy) {
        const cleanQuery = normalizeText(query);
        const cleanCat = category || "all";
        const matched = [];

        for (let i = 0; i < restaurantHighlights.length; i += 1) {
            const item = restaurantHighlights[i];
            const searchable = normalizeText(`${item.title} ${item.category} ${item.metric} ${item.description} ${item.year}`);
            const matchesQuery = cleanQuery === "" || searchable.includes(cleanQuery);
            const matchesCat = cleanCat === "all" || item.category === cleanCat;

            if (matchesQuery && matchesCat) {
                matched.push(item);
            }
        }

        if (sortBy === "year-desc") {
            matched.sort(function (a, b) {
                return b.year - a.year;
            });
        } else if (sortBy === "year-asc") {
            matched.sort(function (a, b) {
                return a.year - b.year;
            });
        }

        return matched;
    }

    // Reusable Function 2: Calculate group meal or business lunch package cost
    function calculateGroupMealQuote(packagePrice, guests, isWeekdayLunch) {
        const cleanGuests = Math.max(1, Math.min(50, Math.floor(Number(guests) || 1)));
        const rawTotal = cleanGuests * packagePrice;
        const lunchDiscount = isWeekdayLunch ? Math.round(rawTotal * 0.2) : 0;
        const discounted = rawTotal - lunchDiscount;
        const serviceFee = window.meatPoint.calculateServiceFee(discounted, 10);
        const finalCost = discounted + serviceFee;
        const complimentaryTeaPots = Math.ceil(cleanGuests / 3);

        return {
            guests: cleanGuests,
            rawTotal: rawTotal,
            lunchDiscount: lunchDiscount,
            serviceFee: serviceFee,
            finalCost: finalCost,
            complimentaryTeaPots: complimentaryTeaPots
        };
    }

    // Reusable Function 3: Render a single highlight card via DOM
    function createHighlightCard(item, spotlightId) {
        const col = createElement("div", "col-12 col-md-6 col-lg-3");
        const isSpotlight = item.id === spotlightId;
        const card = createElement(
            "div",
            `card h-100 shadow-sm ${isSpotlight ? "border-danger border-2" : ""}`
        );
        const body = createElement("div", "card-body d-flex flex-column");

        const topRow = createElement("div", "d-flex justify-content-between align-items-center mb-2");
        const catBadge = createElement("span", "badge text-bg-danger", item.category);
        const yearBadge = createElement("span", "badge text-bg-dark", String(item.year));
        topRow.append(catBadge, yearBadge);

        const title = createElement("h3", "h6 card-title fw-bold", item.title);
        const metric = createElement("p", "small text-danger fw-semibold mb-2", item.metric);
        const desc = createElement("p", "card-text small text-muted flex-grow-1", item.description);
        const priceLine = createElement(
            "p",
            "small fw-bold mb-0 mt-2",
            item.pricePerGuest > 0 ? `Set price: ${formatMoney(item.pricePerGuest)} / guest` : "Included in Restaurant Experience"
        );

        body.append(topRow, title, metric, desc, priceLine);
        card.append(body);
        col.append(card);
        return col;
    }

    // Feature 1: Initialize Interactive Explorer & Group Meal Calculator on index.html and about.html
    function initHomeAndAboutInteractive() {
        const targetAnchor = document.getElementById("atmosphere") || document.getElementById("values");
        if (!targetAnchor) {
            return;
        }

        let currentSpotlightId = "";

        const section = createElement("section", "mb-5 p-4 bg-white border rounded shadow-sm");
        section.id = "kamza-interactive-explorer";

        const headerRow = createElement("div", "d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3");
        const title = createElement("h2", "h3 text-danger mb-0", "Explore Meat Point Specials, Quality & Milestones");
        const randomBtn = createElement("button", "btn btn-sm btn-outline-danger", "Random Chef Fact / Offer");
        randomBtn.type = "button";
        headerRow.append(title, randomBtn);

        const filterRow = createElement("div", "row g-2 mb-3");
        const searchCol = createElement("div", "col-12 col-md-5");
        const searchInput = createElement("input", "form-control");
        searchInput.type = "search";
        searchInput.placeholder = "Search specials, milestones, or standards...";
        searchInput.setAttribute("aria-label", "Search restaurant highlights");
        searchCol.append(searchInput);

        const catCol = createElement("div", "col-6 col-md-3");
        const catSelect = createElement("select", "form-select");
        catSelect.setAttribute("aria-label", "Filter by category");
        ["all", "Specials", "Milestones", "Quality"].forEach(function (c) {
            const opt = createElement("option", "", c === "all" ? "All Categories" : c);
            opt.value = c;
            catSelect.append(opt);
        });
        catCol.append(catSelect);

        const sortCol = createElement("div", "col-6 col-md-3");
        const sortSelect = createElement("select", "form-select");
        sortSelect.setAttribute("aria-label", "Sort by year");
        [
            { value: "default", label: "Default Order" },
            { value: "year-desc", label: "Newest First (2026 → 2024)" },
            { value: "year-asc", label: "Chronological (2024 → 2026)" }
        ].forEach(function (o) {
            const opt = createElement("option", "", o.label);
            opt.value = o.value;
            sortSelect.append(opt);
        });
        sortCol.append(sortSelect);

        const resetCol = createElement("div", "col-12 col-md-1 d-grid");
        const resetBtn = createElement("button", "btn btn-outline-secondary", "Reset");
        resetBtn.type = "button";
        resetCol.append(resetBtn);

        filterRow.append(searchCol, catCol, sortCol, resetCol);

        const statusText = createElement("p", "small text-muted mb-3");
        statusText.setAttribute("aria-live", "polite");
        const cardsGrid = createElement("div", "row g-3 mb-4");

        // Interactive Business Lunch & Group Dining Calculator
        const calcBox = createElement("div", "p-3 bg-light border rounded");
        const calcTitle = createElement("h3", "h5 text-danger mb-3", "Business Lunch & Group Dining Calculator");
        const calcControls = createElement("div", "row g-3 align-items-end");

        const pkgCol = createElement("div", "col-12 col-md-5");
        const pkgLabel = createElement("label", "form-label small fw-semibold", "Select Set Menu");
        pkgLabel.setAttribute("for", "mp-calc-package");
        const pkgSelect = createElement("select", "form-select");
        pkgSelect.id = "mp-calc-package";
        [
            { value: "3500", label: "Weekday Business Lunch Set (3,500 ₸ / guest)" },
            { value: "6500", label: "Signature Mixed Grill Platter (6,500 ₸ / guest)" },
            { value: "9800", label: "Sultan Royal 4-Course Feast (9,800 ₸ / guest)" }
        ].forEach(function (p) {
            const opt = createElement("option", "", p.label);
            opt.value = p.value;
            pkgSelect.append(opt);
        });
        pkgCol.append(pkgLabel, pkgSelect);

        const guestCol = createElement("div", "col-6 col-md-3");
        const guestLabel = createElement("label", "form-label small fw-semibold", "Number of Guests (1–50)");
        guestLabel.setAttribute("for", "mp-calc-guests");
        const guestInput = createElement("input", "form-control");
        guestInput.type = "number";
        guestInput.id = "mp-calc-guests";
        guestInput.min = "1";
        guestInput.max = "50";
        guestInput.value = "4";
        guestCol.append(guestLabel, guestInput);

        const timeCol = createElement("div", "col-6 col-md-4");
        const timeCheckWrap = createElement("div", "form-check mb-2");
        const lunchCheck = createElement("input", "form-check-input");
        lunchCheck.type = "checkbox";
        lunchCheck.id = "mp-calc-lunch-time";
        lunchCheck.checked = true;
        const lunchLabel = createElement(
            "label",
            "form-check-label small",
            "Visiting Weekdays 12:00–15:00 (−20% Lunch Promo)"
        );
        lunchLabel.setAttribute("for", "mp-calc-lunch-time");
        timeCheckWrap.append(lunchCheck, lunchLabel);
        timeCol.append(timeCheckWrap);

        calcControls.append(pkgCol, guestCol, timeCol);
        const calcOutput = createElement("p", "mt-3 mb-0 fw-semibold text-dark");
        calcOutput.setAttribute("aria-live", "polite");
        calcBox.append(calcTitle, calcControls, calcOutput);

        section.append(headerRow, filterRow, statusText, cardsGrid, calcBox);
        targetAnchor.after(section);

        function renderExplorer() {
            const filtered = filterHighlights(searchInput.value, catSelect.value, sortSelect.value);
            cardsGrid.replaceChildren();

            statusText.textContent = `Showing ${filtered.length} of ${restaurantHighlights.length} restaurant highlights.`;

            if (filtered.length === 0) {
                const emptyCol = createElement("div", "col-12");
                emptyCol.append(
                    createElement(
                        "div",
                        "alert alert-warning mb-0",
                        "No items match your search. Click Reset to view all highlights and milestones."
                    )
                );
                cardsGrid.append(emptyCol);
                return;
            }

            for (let i = 0; i < filtered.length; i += 1) {
                cardsGrid.append(createHighlightCard(filtered[i], currentSpotlightId));
            }
        }

        function updateCalc() {
            const quote = calculateGroupMealQuote(Number(pkgSelect.value), guestInput.value, lunchCheck.checked);
            calcOutput.textContent =
                `For ${quote.guests} guest(s): Base ${formatMoney(quote.rawTotal)} ` +
                `| Weekday Lunch Savings: −${formatMoney(quote.lunchDiscount)} ` +
                `| 10% Service: ${formatMoney(quote.serviceFee)} ` +
                `| Total Estimate: ${formatMoney(quote.finalCost)} ` +
                `(Includes ${quote.complimentaryTeaPots} complimentary Turkish tea pot(s)!).`;
        }

        searchInput.addEventListener("input", renderExplorer);
        catSelect.addEventListener("change", renderExplorer);
        sortSelect.addEventListener("change", renderExplorer);

        resetBtn.addEventListener("click", function () {
            searchInput.value = "";
            catSelect.value = "all";
            sortSelect.value = "default";
            currentSpotlightId = "";
            renderExplorer();
        });

        randomBtn.addEventListener("click", function () {
            const idx = Math.floor(Math.random() * restaurantHighlights.length);
            const chosen = restaurantHighlights[idx];
            currentSpotlightId = chosen.id;
            searchInput.value = "";
            catSelect.value = "all";
            renderExplorer();
            statusText.textContent = `Chef Spotlight: ${chosen.title} (${chosen.metric}) — ${chosen.description}`;
        });

        pkgSelect.addEventListener("change", updateCalc);
        guestInput.addEventListener("input", updateCalc);
        lunchCheck.addEventListener("change", updateCalc);

        renderExplorer();
        updateCalc();
    }

    // Feature 2: Contacts Reservation & Banquet Form Validation + VIP Club Registration + Reset Button Fix
    function initContactsForm() {
        const reservationSection = document.getElementById("reservation");
        const form = reservationSection ? reservationSection.querySelector("form") : null;
        if (!form) {
            return;
        }

        const nameInput = document.getElementById("client_name");
        const emailInput = document.getElementById("client_email");
        const phoneInput = document.getElementById("client_phone");
        const guestsInput = document.getElementById("guest_count");
        const dateInput = document.getElementById("visit_date");
        const reasonSelect = document.getElementById("visit_reason");
        const messageInput = document.getElementById("client_message");
        const newsletterCheck = document.getElementById("newsletter");
        const resetBtn = form.querySelector('button[type="reset"]');
        const seatingRadios = Array.from(form.querySelectorAll('input[name="seating"]'));

        const todayStr = getLocalDateString(new Date());
        if (dateInput) {
            dateInput.min = todayStr;
        }

        // Enable the disabled Reset button so there are zero dead buttons on contacts.html
        if (resetBtn) {
            resetBtn.classList.remove("disabled");
            resetBtn.removeAttribute("aria-disabled");
            resetBtn.disabled = false;
        }

        form.noValidate = true;

        // Dynamically inject VIP Club Password & Confirm Password + Show/Hide button when registering for discounts
        const vipBox = createElement("div", "p-3 mb-4 bg-white border rounded d-none");
        vipBox.id = "vip-club-password-box";
        const vipTitle = createElement("h3", "h6 text-danger mb-2", "VIP Club Member Password Setup");
        const vipDesc = createElement(
            "p",
            "small text-muted mb-2",
            "Create a password for your monthly discount account (min 8 chars, uppercase, lowercase, digit, special character)."
        );
        const vipRow = createElement("div", "row g-2 align-items-start");

        const passCol = createElement("div", "col-12 col-md-5");
        const passLabel = createElement("label", "form-label small", "Create Password");
        passLabel.setAttribute("for", "vip_password");
        const passInput = createElement("input", "form-control");
        passInput.type = "password";
        passInput.id = "vip_password";
        passInput.placeholder = "e.g. Astana#2026";
        passCol.append(passLabel, passInput);

        const confCol = createElement("div", "col-12 col-md-5");
        const confLabel = createElement("label", "form-label small", "Confirm Password");
        confLabel.setAttribute("for", "vip_password_confirm");
        const confInput = createElement("input", "form-control");
        confInput.type = "password";
        confInput.id = "vip_password_confirm";
        confInput.placeholder = "Repeat password";
        confCol.append(confLabel, confInput);

        const btnCol = createElement("div", "col-12 col-md-2 d-grid");
        const btnSpacer = createElement("span", "form-label small d-none d-md-block", "Visibility");
        const showHideBtn = createElement("button", "btn btn-outline-secondary", "Show Password");
        showHideBtn.type = "button";
        btnCol.append(btnSpacer, showHideBtn);

        vipRow.append(passCol, confCol, btnCol);
        vipBox.append(vipTitle, vipDesc, vipRow);

        if (newsletterCheck) {
            newsletterCheck.closest(".form-check").after(vipBox);
            newsletterCheck.addEventListener("change", function () {
                vipBox.classList.toggle("d-none", !newsletterCheck.checked);
            });
        }

        showHideBtn.addEventListener("click", function () {
            const isHidden = passInput.type === "password";
            passInput.type = isHidden ? "text" : "password";
            confInput.type = isHidden ? "text" : "password";
            showHideBtn.textContent = isHidden ? "Hide Password" : "Show Password";
        });

        // Live Banquet & Visit Budget Estimator Panel
        const quotePanel = createElement("div", "mt-4 p-3 bg-light border rounded");
        const quoteTitle = createElement("h3", "h5 text-danger mb-2", "Live Visit & Banquet Budget Estimator");
        const quoteText = createElement("p", "mb-0 small", "");
        const resultBanner = createElement("div", "alert alert-success mt-3 mb-0 d-none");
        resultBanner.setAttribute("aria-live", "polite");
        quotePanel.append(quoteTitle, quoteText, resultBanner);
        form.after(quotePanel);

        function calculateBanquetQuote() {
            const guests = Math.max(0, Math.floor(Number(guestsInput.value) || 0));
            const reason = reasonSelect.value;
            const checkedSeat = form.querySelector('input[name="seating"]:checked');
            const seating = checkedSeat ? checkedSeat.value : "indoor";

            let ratePerGuest = 5500;
            if (reason === "birthday") {
                ratePerGuest = 7500;
            } else if (reason === "business") {
                ratePerGuest = 6800;
            } else if (reason === "date") {
                ratePerGuest = 8200;
            }

            const subtotal = guests * ratePerGuest;
            const discount = newsletterCheck.checked ? Math.round(subtotal * 0.1) : 0;
            const breakdown = window.meatPoint.calculateOrderBreakdown(subtotal, discount, 10);

            quoteText.textContent =
                `Occasion: ${reason.toUpperCase()} · Zone: ${seating === "terrace" ? "Summer Terrace (max 25 guests)" : "Indoor Hall (max 50 guests)"} · ` +
                `Guests: ${guests} × ${formatMoney(ratePerGuest)} | Newsletter 10% Discount: −${formatMoney(discount)} | ` +
                `10% Service: ${formatMoney(breakdown.serviceFee)} | Estimated Total: ${formatMoney(breakdown.total)}.`;

            return breakdown;
        }

        function setFieldError(input, message) {
            const hasError = message !== "";
            input.classList.toggle("is-invalid", hasError);
            input.classList.toggle("is-valid", !hasError && input.value.trim() !== "");
            input.setAttribute("aria-invalid", hasError ? "true" : "false");

            const errId = `${input.id}-error`;
            let errEl = document.getElementById(errId);
            if (!errEl) {
                errEl = createElement("div", "invalid-feedback d-block");
                errEl.id = errId;
                input.after(errEl);
            }
            errEl.textContent = message;
            errEl.classList.toggle("d-none", !hasError);
        }

        function validateContactField(input) {
            let msg = "";
            const val = input.value.trim();
            const checkedSeat = form.querySelector('input[name="seating"]:checked');
            const isTerrace = checkedSeat && checkedSeat.value === "terrace";
            const guests = Number(guestsInput.value) || 0;

            if (input === nameInput) {
                if (val.length < 2 || val.length > 50) {
                    msg = "Please enter your full name (2 to 50 characters).";
                }
            } else if (input === emailInput) {
                if (!window.meatPoint.isValidEmail(val)) {
                    msg = "Please enter a valid email address (e.g. name@example.com).";
                }
            } else if (input === phoneInput) {
                if (!window.meatPoint.isValidPhone(val)) {
                    msg = "Please enter a valid phone number (10–15 digits).";
                }
            } else if (input === guestsInput) {
                const maxAllowed = isTerrace ? 25 : 50;
                if (val === "" || !Number.isInteger(Number(val)) || guests < 1 || guests > maxAllowed) {
                    msg = isTerrace
                        ? "Summer Terrace accommodates 1 to 25 guests. For 26–50 guests, select Indoor Hall."
                        : "Please enter a whole number of guests between 1 and 50.";
                }
            } else if (input === dateInput) {
                if (val === "") {
                    msg = "Please choose a visit date.";
                } else if (val < todayStr) {
                    msg = "Past dates are not accepted. Please select today or a future date.";
                }
            } else if (input === messageInput) {
                // Combined rule: Birthday or Business banquets for 10+ guests require special request details
                const requiresDetails = (reasonSelect.value === "birthday" || reasonSelect.value === "business") && guests >= 10;
                if (requiresDetails && val.length < 15) {
                    msg = "For Birthday or Business banquets of 10+ guests, please describe your menu/seating requests (at least 15 characters).";
                }
            } else if (input === passInput) {
                if (newsletterCheck.checked && !window.meatPoint.isStrongPassword(passInput.value)) {
                    msg = "Password requires 8+ chars with uppercase, lowercase, digit, and special character.";
                }
            } else if (input === confInput) {
                if (newsletterCheck.checked && (confInput.value === "" || confInput.value !== passInput.value)) {
                    msg = "Password confirmation does not match.";
                }
            }

            setFieldError(input, msg);
            return msg === "";
        }

        const fields = [nameInput, emailInput, phoneInput, guestsInput, dateInput, messageInput, passInput, confInput];

        fields.forEach(function (field) {
            if (!field) {
                return;
            }
            ["input", "change"].forEach(function (evt) {
                field.addEventListener(evt, function () {
                    validateContactField(field);
                    if (field === guestsInput && messageInput.value !== "") {
                        validateContactField(messageInput);
                    }
                    resultBanner.classList.add("d-none");
                    calculateBanquetQuote();
                });
            });
        });

        reasonSelect.addEventListener("change", function () {
            if (messageInput.value !== "" || messageInput.classList.contains("is-invalid")) {
                validateContactField(messageInput);
            }
            calculateBanquetQuote();
        });

        seatingRadios.forEach(function (radio) {
            radio.addEventListener("change", function () {
                if (guestsInput.value !== "" || guestsInput.classList.contains("is-invalid")) {
                    validateContactField(guestsInput);
                }
                calculateBanquetQuote();
            });
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const invalid = [];

            for (let i = 0; i < fields.length; i += 1) {
                if (fields[i] && !validateContactField(fields[i])) {
                    invalid.push(fields[i]);
                }
            }

            if (invalid.length > 0) {
                invalid[0].focus();
                resultBanner.classList.add("d-none");
                return;
            }

            const quote = calculateBanquetQuote();
            const ref = window.meatPoint.createDemoReference("CNT");
            const checkedSeat = form.querySelector('input[name="seating"]:checked');
            const seatLabel = checkedSeat && checkedSeat.value === "terrace" ? "Summer Terrace" : "Indoor Hall";

            resultBanner.textContent =
                `Demonstration Inquiry ${ref} prepared for ${nameInput.value.trim()} (${emailInput.value.trim()}, ${phoneInput.value.trim()}): ` +
                `${guestsInput.value} guest(s) on ${dateInput.value} (${reasonSelect.value}, ${seatLabel}). ` +
                `Estimated budget: ${formatMoney(quote.total)}. ` +
                "Note: This is a front-end demonstration and no real data was sent to submit_handler.php or any server.";
            resultBanner.classList.remove("d-none");
        });

        form.addEventListener("reset", function () {
            window.setTimeout(function () {
                for (let i = 0; i < fields.length; i += 1) {
                    if (fields[i]) {
                        fields[i].classList.remove("is-invalid", "is-valid");
                        setFieldError(fields[i], "");
                    }
                }
                vipBox.classList.add("d-none");
                resultBanner.classList.add("d-none");
                calculateBanquetQuote();
            }, 0);
        });

        calculateBanquetQuote();
    }

    // Smooth scroll-to-top enhancement on colophon.html
    function initColophonFeatures() {
        const scrollTopBtn = document.querySelector(".scroll-to-top");
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener("click", function (event) {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
    }

    initHomeAndAboutInteractive();
    initContactsForm();
    initColophonFeatures();
}());
