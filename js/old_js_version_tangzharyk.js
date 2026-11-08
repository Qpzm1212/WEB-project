/*booking.js
(function () {
    "use strict";

    const form = document.getElementById("restaurant-booking-form");
    if (!form) {
        return;
    }

    const nameInput = document.getElementById("client-name");
    const phoneInput = document.getElementById("client-phone");
    const guestsInput = document.getElementById("guest-count");
    const dateInput = document.getElementById("booking-date");
    const timeInput = document.getElementById("booking-time");
    const hallInputs = Array.from(form.querySelectorAll('input[name="hall"]'));
    const summary = window.meatPoint.createElement("section", "mt-4 p-3 bg-white border rounded");
    const summaryTitle = window.meatPoint.createElement("h3", "h5", "Booking summary");
    const summaryText = window.meatPoint.createElement("p", "mb-0", "Choose a date, time and guest count to see your request summary.");
    const confirmation = window.meatPoint.createElement("div", "alert alert-success mt-3");

    summary.setAttribute("aria-live", "polite");
    confirmation.hidden = true;
    summary.append(summaryTitle, summaryText, confirmation);
    form.after(summary);

    function updateSummary() {
        const selectedHall = form.querySelector('input[name="hall"]:checked');
        const hallLabel = selectedHall
            ? form.querySelector(`label[for="${selectedHall.id}"]`).textContent.trim()
            : "No hall selected";
        const bookingDate = dateInput.value || "Date not selected";
        const bookingTime = timeInput.value || "Time not selected";
        const guestCount = guestsInput.value || "Not selected";
        summaryText.textContent =
            `${hallLabel} · ${guestCount} guest(s) · ${bookingDate} at ${bookingTime}. ` +
            "This is a request preview; no price is calculated for table reservations.";
    }

    [nameInput, phoneInput, guestsInput, dateInput, timeInput].forEach(function (input) {
        ["input", "change"].forEach(function (eventName) {
            input.addEventListener(eventName, function () {
                confirmation.hidden = true;
                updateSummary();
            });
        });
    });

    hallInputs.forEach(function (input) {
        input.addEventListener("change", function () {
            confirmation.hidden = true;
            updateSummary();
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const firstInvalidField = form.querySelector(".is-invalid");
        if (firstInvalidField) {
            firstInvalidField.focus();
            confirmation.hidden = true;
            return;
        }

        const selectedHall = form.querySelector('input[name="hall"]:checked');
        const hallLabel = form.querySelector(`label[for="${selectedHall.id}"]`).textContent.trim();
        confirmation.textContent =
            `Demonstration request ${window.meatPoint.createDemoReference("MP")} prepared for ` +
            `${nameInput.value.trim()}: ${hallLabel}, ${guestsInput.value} guest(s), ` +
            `${dateInput.value} at ${timeInput.value}. No data was sent to a server and no real booking was created.`;
        confirmation.hidden = false;
    });

    form.addEventListener("reset", function () {
        window.setTimeout(function () {
            confirmation.hidden = true;
            updateSummary();
        });
    });

    updateSummary();
}());

*/

/*main.js

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

*/

/* tako.js
"use strict";

const form = document.getElementById("restaurant-booking-form");

if (form) {
    const guests = document.getElementById("guest-count");
    const date = document.getElementById("booking-date");
    const time = document.getElementById("booking-time");
    const fields = form.querySelectorAll("#client-name, #client-phone, #guest-count, #booking-date, #booking-time");
    const hallOptions = form.querySelectorAll('input[name="hall"]');
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    date.min = today.toISOString().slice(0, 10);

    function showError(input, message) {
        input.classList.toggle("is-invalid", Boolean(message));
        input.setAttribute("aria-invalid", message ? "true" : "false");
        document.getElementById(`${input.id}-error`).textContent = message;
    }

    function validateInput(input) {
        let message = "";

        if (input.id === "client-name" && input.value.trim().length < 2) {
            message = "Please enter your name (at least 2 characters).";
        } else if (input.id === "client-phone" && !input.value.trim()) {
            message = "Please enter your phone number.";
        } else if (input.id === "client-phone") {
            const phone = input.value.trim();
            const digitCount = phone.replace(/\D/g, "").length;

            if (!/^\+?[0-9\s()-]+$/.test(phone) || digitCount < 10 || digitCount > 15) {
                message = "Enter a valid phone number with 10–15 digits.";
            }
        } else if (input.id === "guest-count") {
            const max = form.querySelector('input[name="hall"]:checked').value === "vip" ? 15 : 80;
            const guestCount = Number(input.value);

            if (!input.value) {
                message = "Please enter the number of guests.";
            } else if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > max) {
                message = `Enter a whole guest count from 1 to ${max}.`;
            }
        } else if (input.id === "booking-date") {
            if (!input.value) {
                message = "Please choose a visit date.";
            } else if (input.value < input.min) {
                message = "Please choose today or a future date.";
            }
        } else if (input.id === "booking-time") {
            if (!input.value) {
                message = "Please choose a visit time.";
            } else if (date.value === date.min) {
                const now = new Date();
                const [hours, minutes] = input.value.split(":").map(Number);

                if (hours * 60 + minutes <= now.getHours() * 60 + now.getMinutes()) {
                    message = "Please choose a future time.";
                }
            }
        }

        showError(input, message);
        return message === "";
    }

    function updateHall() {
        const isVip = form.querySelector('input[name="hall"]:checked').value === "vip";
        const max = isVip ? 15 : 80;
        guests.max = max;
        document.getElementById("guest-count-help").textContent =
            `${isVip ? "VIP Hall" : "Main Hall"} accommodates up to ${max} guests.`;

        if (guests.value || guests.classList.contains("is-invalid")) {
            validateInput(guests);
        }
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        fields.forEach(validateInput);

        if (form.querySelector(".is-invalid")) {
            form.querySelector(".is-invalid").focus();
        }
    });

    fields.forEach(function (input) {
        input.addEventListener("input", function () {
            validateInput(input);

            if (input === date) {
                validateInput(time);
            }
        });
    });
    hallOptions.forEach(function (hall) {
        hall.addEventListener("change", updateHall);
    });

    form.addEventListener("reset", function () {
        setTimeout(function () {
            form.querySelectorAll(".is-invalid").forEach(function (input) {
                showError(input, "");
            });
            updateHall();
        });
    });
}

*/

/*feedback.js

(function () {
    "use strict";

    const form = document.getElementById("feedback-form");
    const article = document.getElementById("real-reviews");
    if (!form || !article) {
        return;
    }

    const nameInput = document.getElementById("reviewer-name");
    const ratingInput = document.getElementById("review-rating");
    const messageInput = document.getElementById("review-message");
    const submitButton = form.querySelector('button[type="submit"]');
    const existingQuote = article.querySelector("blockquote q");
    const existingAttribution = existingQuote && existingQuote.closest("blockquote").nextElementSibling;
    const reviewList = window.meatPoint.createElement("div", "row g-3 my-3");
    const status = window.meatPoint.createElement("p", "small mb-3");
    const counter = window.meatPoint.createElement("p", "form-text");
    const reviews = [];
    let editingReviewId = "";

    form.noValidate = true;
    reviewList.id = "visitor-review-list";
    reviewList.setAttribute("aria-live", "polite");
    status.setAttribute("aria-live", "polite");
    if (existingQuote) {
        reviews.push({
            id: "2gis-source-review",
            name: "2GIS visitor",
            text: existingQuote.textContent.trim(),
            rating: 5,
            dateTime: "Source: 2GIS (date not supplied)",
            editable: false
        });
        existingQuote.closest("blockquote").remove();
        if (existingAttribution) {
            existingAttribution.remove();
        }
    }
    form.after(status, reviewList);
    messageInput.after(counter);
    counter.id = "review-character-count";
    counter.setAttribute("aria-live", "polite");
    messageInput.setAttribute("aria-describedby", "review-character-count");

    function getErrorElement(input) {
        let error = document.getElementById(`${input.id}-dynamic-error`);
        if (!error) {
            error = window.meatPoint.createElement("div", "invalid-feedback");
            error.id = `${input.id}-dynamic-error`;
            input.after(error);
            const currentDescription = input.getAttribute("aria-describedby");
            input.setAttribute("aria-describedby", currentDescription
                ? `${currentDescription} ${error.id}`
                : error.id);
        }
        return error;
    }

    function showError(input, message) {
        input.classList.toggle("is-invalid", Boolean(message));
        input.setAttribute("aria-invalid", message ? "true" : "false");
        getErrorElement(input).textContent = message;
    }

    function validateField(input) {
        let message = "";
        const value = input.value.trim();
        if (input === nameInput && (value.length < 2 || value.length > 50)) {
            message = "Enter a name between 2 and 50 characters.";
        } else if (input === ratingInput && !["1", "2", "3", "4", "5"].includes(value)) {
            message = "Please choose a rating from 1 to 5.";
        } else if (input === messageInput && (value.length < 20 || value.length > 500)) {
            message = "Write between 20 and 500 characters.";
        }
        showError(input, message);
        return message === "";
    }

    function renderReview(review) {
        const column = window.meatPoint.createElement("article", "col-12 col-md-6 col-lg-4");
        const card = window.meatPoint.createElement("div", "card h-100 shadow-sm");
        const body = window.meatPoint.createElement("div", "card-body");
        const heading = window.meatPoint.createElement("h3", "h5 card-title", review.name);
        const rating = window.meatPoint.createElement("p", "badge text-bg-warning", `${review.rating}/5`);
        const text = window.meatPoint.createElement("p", "card-text", review.text);
        const date = window.meatPoint.createElement("p", "small text-muted mb-2", review.dateTime);
        body.append(heading, rating, text, date);

        if (review.editable) {
            const actions = window.meatPoint.createElement("div", "card-footer d-flex gap-2");
            const editButton = window.meatPoint.createElement("button", "btn btn-sm btn-outline-secondary", "Edit");
            const removeButton = window.meatPoint.createElement("button", "btn btn-sm btn-outline-danger", "Remove");
            editButton.type = "button";
            editButton.dataset.reviewAction = "edit";
            removeButton.type = "button";
            removeButton.dataset.reviewAction = "remove";
            editButton.dataset.reviewId = review.id;
            removeButton.dataset.reviewId = review.id;
            actions.append(editButton, removeButton);
            card.append(body, actions);
        } else {
            card.append(body);
        }
        column.append(card);
        return column;
    }

    function renderReviews() {
        reviewList.replaceChildren();
        if (reviews.length === 0) {
            reviewList.append(window.meatPoint.createElement("p", "col-12 text-muted", "No reviews yet. Share the first review below."));
            status.textContent = "0 reviews displayed.";
            return;
        }
        reviews.forEach(function (review) {
            reviewList.append(renderReview(review));
        });
        status.textContent = `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"} displayed.`;
    }

    function updateCounter() {
        counter.textContent = `${messageInput.value.length}/500 characters (minimum 20).`;
    }

    function resetEditor() {
        editingReviewId = "";
        nameInput.value = "";
        ratingInput.value = "";
        messageInput.value = "";
        submitButton.textContent = "Send Feedback";
        const cancelButton = form.querySelector("[data-cancel-edit]");
        if (cancelButton) {
            cancelButton.hidden = true;
        }
        [nameInput, ratingInput, messageInput].forEach(function (input) {
            showError(input, "");
        });
        updateCounter();
    }

    if (!form.querySelector("[data-cancel-edit]")) {
        const cancelButton = window.meatPoint.createElement("button", "btn btn-outline-secondary ms-2", "Cancel edit");
        cancelButton.type = "button";
        cancelButton.dataset.cancelEdit = "true";
        cancelButton.hidden = true;
        submitButton.after(cancelButton);
        cancelButton.addEventListener("click", function () {
            resetEditor();
            status.textContent = "Review editing canceled. No changes were saved.";
        });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const fields = [nameInput, ratingInput, messageInput];
        const invalidFields = fields.filter(function (input) {
            return !validateField(input);
        });
        if (invalidFields.length > 0) {
            invalidFields[0].focus();
            return;
        }

        const now = new Date();
        const review = {
            id: editingReviewId || window.meatPoint.createDemoReference("REVIEW"),
            name: nameInput.value.trim(),
            text: messageInput.value.trim(),
            rating: Number(ratingInput.value),
            dateTime: now.toLocaleString("en-GB", {
                timeZone: "Asia/Almaty",
                dateStyle: "medium",
                timeStyle: "short"
            }),
            editable: true
        };
        if (editingReviewId) {
            const index = reviews.findIndex(function (item) { return item.id === editingReviewId; });
            if (index !== -1) {
                reviews[index] = review;
            }
            status.textContent = "Your review was updated in this page preview.";
        } else {
            reviews.push(review);
            status.textContent = "Your review was added to this page preview.";
        }
        renderReviews();
        status.textContent += " It is stored only until this page is reloaded; nothing was sent to a server.";
        resetEditor();
    });

    [nameInput, ratingInput, messageInput].forEach(function (input) {
        input.addEventListener(input === ratingInput ? "change" : "input", function () {
            validateField(input);
            if (input === messageInput) {
                updateCounter();
            }
        });
    });

    reviewList.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-review-action]");
        if (!button) {
            return;
        }
        const review = reviews.find(function (item) { return item.id === button.dataset.reviewId; });
        if (!review || !review.editable) {
            return;
        }
        if (button.dataset.reviewAction === "remove") {
            const index = reviews.indexOf(review);
            reviews.splice(index, 1);
            if (editingReviewId === review.id) {
                resetEditor();
            }
            renderReviews();
            status.textContent =
                "Your review was removed from this page preview. This change is temporary and will be lost when the page is reloaded.";
        } else if (button.dataset.reviewAction === "edit") {
            editingReviewId = review.id;
            nameInput.value = review.name;
            ratingInput.value = String(review.rating);
            messageInput.value = review.text;
            submitButton.textContent = "Update Review";
            form.querySelector("[data-cancel-edit]").hidden = false;
            updateCounter();
            form.scrollIntoView({ behavior: "smooth", block: "center" });
            nameInput.focus();
            status.textContent = "Edit your review, then choose Update Review.";
        }
    });

    updateCounter();
    renderReviews();
}());
*/

