(function () {
    "use strict";

    const sitePages = [
        { title: "Home", url: "index.html", keywords: "welcome restaurant location meat point", summary: "Restaurant overview and quick links." },
        { title: "About", url: "about.html", keywords: "story history values team", summary: "Learn about the restaurant and its values." },
        { title: "Contact", url: "contacts.html", keywords: "contact phone email address hours", summary: "Find contact details and send a request." },
        { title: "Menu", url: "menu.html", keywords: "food dishes kebab pide steaks prices", summary: "Browse dishes, prices and the demo cart." },
        { title: "Events", url: "events.html", keywords: "music friday saturday registration", summary: "View weekend music and request a place." },
        { title: "Booking", url: "booking.html", keywords: "table booking date time guests hall", summary: "Create a front-end table booking request." },
        { title: "Reviews", url: "feedback.html", keywords: "reviews feedback rating comments", summary: "Read and submit visitor feedback." }
    ];

    function createElement(tagName, classNames, text) {
        const element = document.createElement(tagName);

        if (classNames) {
            element.className = classNames;
        }
        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    function normalizeText(value) {
        return value.trim().toLocaleLowerCase();
    }

    function searchPages(query) {
        const normalizedQuery = normalizeText(query);
        if (normalizedQuery === "") {
            return [];
        }

        return sitePages.filter(function (page) {
            return normalizeText(`${page.title} ${page.keywords} ${page.summary}`).includes(normalizedQuery);
        });
    }

    function formatMoney(amount) {
        return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount)} ₸`;
    }

    function createRandomDigits() {
        return String(Math.floor(Math.random() * 900000) + 100000);
    }

    function createDemoReference(prefix) {
        return `${prefix}-${createRandomDigits()}`;
    }

    function getLocalDateString(dateValue) {
        const localDate = dateValue || new Date();
        const offsetDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().slice(0, 10);
    }

    function isValidPhone(value) {
        const trimmedValue = value.trim();
        const digitCount = trimmedValue.replace(/\D/g, "").length;
        return /^\+?[0-9\s()-]+$/.test(trimmedValue) && digitCount >= 10 && digitCount <= 15;
    }

    function renderSearchResults(query, status, resultList) {
        const results = searchPages(query);
        resultList.replaceChildren();

        if (query.trim() === "") {
            status.textContent = "Type a page or topic to search the website.";
            return;
        }

        status.textContent = `${results.length} ${results.length === 1 ? "page" : "pages"} found.`;

        if (results.length === 0) {
            resultList.append(createElement("li", "list-group-item", "No matching pages. Try another search term."));
            return;
        }

        results.forEach(function (page) {
            const item = createElement("li", "list-group-item");
            const link = createElement("a", "fw-semibold", page.title);
            link.href = page.url;
            const summary = createElement("p", "mb-0 small text-muted", page.summary);
            item.append(link, summary);
            resultList.append(item);
        });
    }

    function addSiteSearch() {
        const navbarContent = document.querySelector(".navbar .navbar-collapse");
        if (!navbarContent) {
            return;
        }

        const form = createElement("form", "mt-3 mt-lg-0 ms-lg-3");
        form.setAttribute("role", "search");
        const controls = createElement("div", "input-group");
        const input = createElement("input", "form-control");
        input.type = "search";
        input.placeholder = "Search the site";
        input.setAttribute("aria-label", "Search website pages");
        const searchButton = createElement("button", "btn btn-outline-light", "Search");
        searchButton.type = "submit";
        const resetButton = createElement("button", "btn btn-outline-light", "Clear");
        resetButton.type = "button";
        const status = createElement("p", "small text-white mb-1 mt-2");
        status.setAttribute("aria-live", "polite");
        const resultList = createElement("ul", "list-group mb-2");

        controls.append(input, searchButton, resetButton);
        form.append(controls, status, resultList);
        navbarContent.append(form);
        resultList.setAttribute("aria-label", "Website search results");
        renderSearchResults("", status, resultList);

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            renderSearchResults(input.value, status, resultList);
        });
        input.addEventListener("input", function () {
            renderSearchResults(input.value, status, resultList);
        });
        resetButton.addEventListener("click", function () {
            input.value = "";
            renderSearchResults("", status, resultList);
            input.focus();
        });
    }

    window.meatPoint = Object.freeze({
        createElement: createElement,
        createDemoReference: createDemoReference,
        formatMoney: formatMoney,
        getLocalDateString: getLocalDateString,
        isValidPhone: isValidPhone
    });

    addSiteSearch();
}());
