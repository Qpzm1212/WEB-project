"use strict";

(function () {
    "use strict";

    // Array of 8 objects, each with 6 meaningful properties representing real site pages
    const sitePages = [
        {
            id: "page-home",
            title: "Home",
            url: "index.html",
            category: "Information",
            keywords: "welcome restaurant location meat point astana 24/7 business lunch grill",
            summary: "Restaurant overview, 24/7 operating status, and quick links."
        },
        {
            id: "page-about",
            title: "About Us",
            url: "about.html",
            category: "Information",
            keywords: "story history values team milestones halal quality hospitality",
            summary: "Learn about Meat Point history since 2024, milestones, and core values."
        },
        {
            id: "page-contacts",
            title: "Contact",
            url: "contacts.html",
            category: "Reservations",
            keywords: "contact phone email address hours map banquet vip club inquiry",
            summary: "Check schedule, transport routes, banquet calculator, and contact form."
        },
        {
            id: "page-colophon",
            title: "About site",
            url: "colophon.html",
            category: "Information",
            keywords: "colophon technical stack html css bootstrap validation git team",
            summary: "Technical documentation, semantic architecture, and development milestones."
        },
        {
            id: "page-menu",
            title: "Menu",
            url: "menu.html",
            category: "Dining",
            keywords: "food dishes kebab adana chicken shish pide steaks ribeye prices cart halal vegetarian",
            summary: "Browse Turkish halal dishes, filter by category/diet, and use the order cart."
        },
        {
            id: "page-events",
            title: "Events",
            url: "events.html",
            category: "Dining",
            keywords: "music live friday jazz saturday turkish tunes registration stage",
            summary: "Explore weekend live music nights, seat calculator, and event registration."
        },
        {
            id: "page-booking",
            title: "Booking",
            url: "booking.html",
            category: "Reservations",
            keywords: "table booking reservation date time guests main hall vip room deposit",
            summary: "Filter restaurant tables, calculate deposit, and book a table online."
        },
        {
            id: "page-feedback",
            title: "Reviews",
            url: "feedback.html",
            category: "Community",
            keywords: "reviews feedback rating comments 2gis faq tea hospitality",
            summary: "Read visitor impressions, filter ratings, and submit your own review."
        }
    ];

    const dailyPromoOffers = [
        { code: "LUNCH20", discountPercent: 20, label: "20% off Weekday Business Lunch (12:00-15:00)" },
        { code: "TEA4FREE", discountPercent: 10, label: "Complimentary Turkish Tea Pot + 10% off Pide" },
        { code: "GRILL15", discountPercent: 15, label: "15% off Signature Adana Kebab & Ribeye sets" },
        { code: "FAMILY12", discountPercent: 12, label: "12% off Family Table Bookings for 6+ guests" }
    ];

    // Reusable Function 1: Create DOM element safely using textContent
    function createElement(tagName, classNames, text) {
        const element = document.createElement(tagName);

        if (classNames) {
            element.className = classNames;
        }
        if (text !== undefined && text !== null) {
            element.textContent = String(text);
        }

        return element;
    }

    // Reusable Function 2: Normalize text for search/comparison
    function normalizeText(value) {
        if (typeof value !== "string") {
            return "";
        }
        return value.trim().toLocaleLowerCase();
    }

    // Reusable Function 3: Format numeric amount into Tenge currency string
    function formatMoney(amount) {
        const numericAmount = Number(amount);
        const safeAmount = Number.isFinite(numericAmount) ? Math.round(numericAmount) : 0;
        return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(safeAmount)} ₸`;
    }

    // Reusable Function 4: Calculate service charge (calls Math.round)
    function calculateServiceFee(subtotal, ratePercent) {
        const safeSubtotal = Number(subtotal) > 0 ? Number(subtotal) : 0;
        const safeRate = Number(ratePercent) >= 0 ? Number(ratePercent) : 10;
        return Math.round((safeSubtotal * safeRate) / 100);
    }

    // Reusable Function 5: Calculate full order breakdown (calls calculateServiceFee and formatMoney)
    function calculateOrderBreakdown(subtotal, discountAmount, serviceRatePercent) {
        const cleanSubtotal = Math.max(0, Number(subtotal) || 0);
        const cleanDiscount = Math.min(cleanSubtotal, Math.max(0, Number(discountAmount) || 0));
        const discountedSubtotal = cleanSubtotal - cleanDiscount;
        const serviceFee = calculateServiceFee(discountedSubtotal, serviceRatePercent);
        const finalTotal = discountedSubtotal + serviceFee;

        return {
            subtotal: cleanSubtotal,
            discount: cleanDiscount,
            serviceFee: serviceFee,
            total: finalTotal,
            formattedTotal: formatMoney(finalTotal)
        };
    }

    // Reusable Function 6: Generate random digits using Math.random() and a for loop
    function createRandomDigits(length) {
        const count = Number.isInteger(length) && length > 0 ? length : 6;
        let digits = "";
        for (let i = 0; i < count; i += 1) {
            const randomDigit = Math.floor(Math.random() * 10);
            digits += String(randomDigit === 0 && i === 0 ? 1 : randomDigit);
        }
        return digits;
    }

    // Reusable Function 7: Generate demo reference code (calls createRandomDigits)
    function createDemoReference(prefix) {
        const cleanPrefix = prefix ? String(prefix).trim().toUpperCase() : "MP";
        return `${cleanPrefix}-${createRandomDigits(6)}`;
    }

    // Reusable Function 8: Get local YYYY-MM-DD date string
    function getLocalDateString(dateValue) {
        const localDate = dateValue instanceof Date ? dateValue : new Date();
        const offsetDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().slice(0, 10);
    }

    // Reusable Function 9: Validate phone number (10 to 15 digits)
    function isValidPhone(value) {
        const trimmedValue = String(value || "").trim();
        const digitCount = trimmedValue.replace(/\D/g, "").length;
        return /^\+?[0-9\s()-]+$/.test(trimmedValue) && digitCount >= 10 && digitCount <= 15;
    }

    // Reusable Function 10: Validate email address
    function isValidEmail(value) {
        const trimmedValue = String(value || "").trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedValue);
    }

    // Reusable Function 11: Validate strong password (8+ chars, upper, lower, digit, special char)
    function isStrongPassword(value) {
        const rawValue = String(value || "");
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/.test(rawValue);
    }

    // Reusable Function 12: Filter sitePages using explicit for loop, normalizeText, if/else, === and &&
    function searchPages(query, category) {
        const normalizedQuery = normalizeText(query);
        const selectedCategory = category || "all";
        const matchedPages = [];

        if (normalizedQuery === "" && selectedCategory === "all") {
            return matchedPages;
        }

        for (let i = 0; i < sitePages.length; i += 1) {
            const page = sitePages[i];
            const searchableText = normalizeText(`${page.title} ${page.category} ${page.keywords} ${page.summary}`);
            const matchesQuery = normalizedQuery === "" || searchableText.includes(normalizedQuery);
            const matchesCategory = selectedCategory === "all" || page.category === selectedCategory;

            if (matchesQuery && matchesCategory) {
                matchedPages.push(page);
            }
        }

        return matchedPages;
    }

    // Reusable DOM card/row renderer for a single site search result
    function createSearchResultItem(page) {
        const item = createElement("li", "list-group-item d-flex justify-content-between align-items-start gap-2");
        const textWrap = createElement("div", "me-auto");
        const link = createElement("a", "fw-semibold text-danger text-decoration-none", page.title);
        link.href = page.url;
        const summary = createElement("p", "mb-0 small text-muted", page.summary);
        const badge = createElement("span", "badge text-bg-secondary rounded-pill", page.category);

        textWrap.append(link, summary);
        item.append(textWrap, badge);
        return item;
    }

    function renderSearchResults(query, category, status, resultList) {
        const trimmedQuery = query.trim();
        resultList.replaceChildren();

        if (trimmedQuery === "" && category === "all") {
            status.textContent = "Type a keyword or select a category to search all 8 pages.";
            resultList.classList.add("d-none");
            return;
        }

        const results = searchPages(trimmedQuery, category);
        resultList.classList.remove("d-none");
        status.textContent = `${results.length} of ${sitePages.length} ${results.length === 1 ? "page" : "pages"} found.`;

        if (results.length === 0) {
            const emptyItem = createElement(
                "li",
                "list-group-item text-muted small",
                "No matching pages found. Try another keyword or press Clear to reset."
            );
            resultList.append(emptyItem);
            return;
        }

        for (const page of results) {
            resultList.append(createSearchResultItem(page));
        }
    }

    // Ensure all 8 pages are linked in the navbar across all student templates via DOM
    function ensureCompleteNavbarLinks() {
        const navList = document.querySelector(".navbar .navbar-nav");
        if (!navList) {
            return;
        }

        const existingLinks = navList.querySelectorAll("a.nav-link");
        const existingUrls = [];
        for (let i = 0; i < existingLinks.length; i += 1) {
            const href = existingLinks[i].getAttribute("href");
            if (href) {
                existingUrls.push(href.trim());
            }
        }

        const currentFile = window.location.pathname.split("/").pop() || "index.html";

        for (let i = 0; i < sitePages.length; i += 1) {
            const page = sitePages[i];
            if (!existingUrls.includes(page.url)) {
                const li = createElement("li", "nav-item");
                const link = createElement("a", "nav-link", page.title);
                link.href = page.url;
                if (currentFile === page.url) {
                    link.classList.add("active");
                    link.setAttribute("aria-current", "page");
                }
                li.append(link);
                navList.append(li);
            }
        }
    }

    // Pure vanilla JS collapse handler for mobile navbar & FAQ accordion (using classList)
    function initCollapsibleComponents() {
        const toggleButtons = document.querySelectorAll('[data-bs-toggle="collapse"]');
        for (let i = 0; i < toggleButtons.length; i += 1) {
            const button = toggleButtons[i];
            button.addEventListener("click", function () {
                const targetSelector = button.getAttribute("data-bs-target");
                if (!targetSelector) {
                    return;
                }
                const target = document.querySelector(targetSelector);
                if (!target) {
                    return;
                }
                const isShown = target.classList.toggle("show");
                button.classList.toggle("collapsed", !isShown);
                button.setAttribute("aria-expanded", isShown ? "true" : "false");
            });
        }
    }

    // Global Site Search & Filter in Navbar
    function addSiteSearch() {
        const navbarContent = document.querySelector(".navbar .navbar-collapse, .navbar .css-collapse");
        if (!navbarContent || navbarContent.querySelector("[data-site-search-form]")) {
            return;
        }

        const form = createElement("form", "mt-3 mt-lg-0 ms-lg-3 position-relative");
        form.setAttribute("role", "search");
        form.dataset.siteSearchForm = "true";

        const controls = createElement("div", "input-group input-group-sm");
        const categorySelect = createElement("select", "form-select");
        categorySelect.setAttribute("aria-label", "Filter pages by category");

        const categories = ["all", "Information", "Dining", "Reservations", "Community"];
        for (let i = 0; i < categories.length; i += 1) {
            const cat = categories[i];
            const label = cat === "all" ? "All Sections" : cat;
            const option = createElement("option", "", label);
            option.value = cat;
            categorySelect.append(option);
        }

        const input = createElement("input", "form-control");
        input.type = "search";
        input.placeholder = "Search site...";
        input.setAttribute("aria-label", "Search website pages");

        const searchButton = createElement("button", "btn btn-danger", "Search");
        searchButton.type = "submit";

        const resetButton = createElement("button", "btn btn-outline-light", "Clear");
        resetButton.type = "button";

        const status = createElement("p", "small text-white-50 mb-1 mt-1");
        status.setAttribute("aria-live", "polite");

        const resultList = createElement("ul", "list-group mb-2 shadow d-none");
        resultList.setAttribute("aria-label", "Website search results");

        controls.append(categorySelect, input, searchButton, resetButton);
        form.append(controls, status, resultList);
        navbarContent.append(form);

        renderSearchResults("", "all", status, resultList);

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            renderSearchResults(input.value, categorySelect.value, status, resultList);
        });

        input.addEventListener("input", function () {
            renderSearchResults(input.value, categorySelect.value, status, resultList);
        });

        categorySelect.addEventListener("change", function () {
            renderSearchResults(input.value, categorySelect.value, status, resultList);
        });

        input.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                input.value = "";
                categorySelect.value = "all";
                renderSearchResults("", "all", status, resultList);
            }
        });

        resetButton.addEventListener("click", function () {
            input.value = "";
            categorySelect.value = "all";
            renderSearchResults("", "all", status, resultList);
            input.focus();
        });
    }

    // Calculate Business Lunch window & live operating status
    function calculateBusinessLunchStatus(nowDate) {
        const current = nowDate instanceof Date ? nowDate : new Date();
        const day = current.getDay();
        const hours = current.getHours();
        const minutes = current.getMinutes();
        const currentMinutes = hours * 60 + minutes;
        const lunchStart = 12 * 60;
        const lunchEnd = 15 * 60;
        const isWeekday = day >= 1 && day <= 5;

        let statusType = "regular";
        let message = "";

        if (isWeekday && currentMinutes >= lunchStart && currentMinutes < lunchEnd) {
            const remainingMinutes = lunchEnd - currentMinutes;
            statusType = "lunch-active";
            message = `Open 24/7 · Business Lunch is ACTIVE now (${remainingMinutes} min remaining until 15:00).`;
        } else if (isWeekday && currentMinutes < lunchStart) {
            const waitMinutes = lunchStart - currentMinutes;
            const waitHours = Math.floor(waitMinutes / 60);
            const remMins = waitMinutes % 60;
            statusType = "lunch-soon";
            message = `Open 24/7 · Weekday Business Lunch starts in ${waitHours}h ${remMins}m (12:00–15:00).`;
        } else if (day === 5 || day === 6) {
            statusType = "weekend-music";
            message = "Open 24/7 · Weekend Live Music Evening (20:00–23:00). Table pre-booking recommended!";
        } else {
            statusType = "regular";
            message = "Open 24/7 · Main Grill & Halal Kitchen operating round the clock in Astana.";
        }

        return {
            statusType: statusType,
            message: message
        };
    }

    // Add interactive live status bar & random promo generator to every page
    function addLiveRestaurantBar() {
        const mainElement = document.querySelector("main");
        if (!mainElement || document.getElementById("mp-live-status-bar")) {
            return;
        }

        const statusInfo = calculateBusinessLunchStatus(new Date());
        const wrapper = createElement(
            "div",
            "alert alert-secondary d-flex flex-wrap justify-content-between align-items-center gap-2 py-2 px-3 mb-4 shadow-sm"
        );
        wrapper.id = "mp-live-status-bar";

        const leftBox = createElement("div", "d-flex align-items-center gap-2 flex-wrap");
        const badge = createElement("span", "badge text-bg-success", "LIVE 24/7");
        const statusText = createElement("span", "small fw-semibold", statusInfo.message);

        switch (statusInfo.statusType) {
            case "lunch-active":
                badge.classList.replace("text-bg-success", "text-bg-danger");
                badge.textContent = "BUSINESS LUNCH";
                break;
            case "weekend-music":
                badge.classList.replace("text-bg-success", "text-bg-warning");
                badge.textContent = "LIVE MUSIC TODAY";
                break;
            default:
                break;
        }

        const rightBox = createElement("div", "d-flex align-items-center gap-2 flex-wrap");
        const promoOutput = createElement("span", "small text-danger fw-bold", "");
        const promoButton = createElement("button", "btn btn-sm btn-outline-danger", "Get Daily Promo Code");
        promoButton.type = "button";

        promoButton.addEventListener("click", function () {
            const randomIndex = Math.floor(Math.random() * dailyPromoOffers.length);
            const chosenOffer = dailyPromoOffers[randomIndex];
            const demoTicket = createDemoReference(chosenOffer.code);
            promoOutput.textContent = `Promo ${demoTicket}: ${chosenOffer.label}`;
            promoButton.textContent = "Try Another Code";
        });

        leftBox.append(badge, statusText);
        rightBox.append(promoOutput, promoButton);
        wrapper.append(leftBox, rightBox);
        mainElement.prepend(wrapper);
    }

    window.meatPoint = Object.freeze({
        sitePages: sitePages,
        createElement: createElement,
        normalizeText: normalizeText,
        formatMoney: formatMoney,
        calculateServiceFee: calculateServiceFee,
        calculateOrderBreakdown: calculateOrderBreakdown,
        createRandomDigits: createRandomDigits,
        createDemoReference: createDemoReference,
        getLocalDateString: getLocalDateString,
        isValidPhone: isValidPhone,
        isValidEmail: isValidEmail,
        isStrongPassword: isStrongPassword,
        searchPages: searchPages
    });

    ensureCompleteNavbarLinks();
    initCollapsibleComponents();
    addSiteSearch();
    addLiveRestaurantBar();
}());
