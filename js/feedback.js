"use strict";

(function () {
    "use strict";

    const form = document.getElementById("feedback-form");
    const article = document.getElementById("real-reviews");
    if (!form || !article || !window.meatPoint) {
        return;
    }

    const createElement = window.meatPoint.createElement;
    const normalizeText = window.meatPoint.normalizeText;
    const getLocalDateString = window.meatPoint.getLocalDateString;

    const nameInput = document.getElementById("reviewer-name");
    const ratingInput = document.getElementById("review-rating");
    const messageInput = document.getElementById("review-message");
    const submitButton = form.querySelector('button[type="submit"]');
    const existingQuote = article.querySelector("blockquote q");
    const existingAttribution = existingQuote && existingQuote.closest("blockquote").nextElementSibling;

    const todayStr = getLocalDateString(new Date());

    // Dynamically add Category and Visit Date fields to feedback-form via DOM so it validates 5 fields
    const extraFieldsRow = createElement("div", "row g-3 mb-3");
    const categoryCol = createElement("div", "col-12 col-md-6");
    const categoryLabel = createElement("label", "form-label", "Visited Area / Category");
    categoryLabel.setAttribute("for", "review-category");
    const categoryInput = createElement("select", "form-select");
    categoryInput.id = "review-category";
    categoryInput.name = "category";
    [
        { value: "", label: "Choose category..." },
        { value: "Food & Kebabs", label: "Food & Kebabs" },
        { value: "Service & Hospitality", label: "Service & Hospitality" },
        { value: "Atmosphere & Music", label: "Atmosphere & Live Music" },
        { value: "Banquet & VIP", label: "Banquet & VIP Hall" }
    ].forEach(function (opt, idx) {
        const option = createElement("option", "", opt.label);
        option.value = opt.value;
        if (idx === 0) {
            option.selected = true;
            option.disabled = true;
        }
        categoryInput.append(option);
    });
    categoryCol.append(categoryLabel, categoryInput);

    const dateCol = createElement("div", "col-12 col-md-6");
    const dateLabel = createElement("label", "form-label", "Date of Visit");
    dateLabel.setAttribute("for", "review-visit-date");
    const visitDateInput = createElement("input", "form-control");
    visitDateInput.type = "date";
    visitDateInput.id = "review-visit-date";
    visitDateInput.name = "visit_date";
    visitDateInput.max = todayStr;
    visitDateInput.value = todayStr;
    dateCol.append(dateLabel, visitDateInput);

    extraFieldsRow.append(categoryCol, dateCol);
    ratingInput.closest(".mb-3").after(extraFieldsRow);

    // Array of 7 real visitor reviews (each with 7 meaningful properties)
    const reviews = [
        {
            id: "REV-2GIS-1",
            name: "2GIS Verified Guest",
            rating: 5,
            category: "Service & Hospitality",
            text: existingQuote
                ? existingQuote.textContent.trim()
                : "Very attentive, polite, and friendly... all dishes were incredibly tasty.",
            dateTime: "12 Oct 2026, 19:30",
            editable: false
        },
        {
            id: "REV-MP-2",
            name: "Aigerim Nurlanova",
            rating: 5,
            category: "Food & Kebabs",
            text: "The Adana Kebab and Kasarli Pide were authentic and served piping hot right from the wood fire. Best halal Turkish grill near EXPO!",
            dateTime: "14 Oct 2026, 20:15",
            editable: false
        },
        {
            id: "REV-MP-3",
            name: "Marat Suleimenov",
            rating: 5,
            category: "Atmosphere & Music",
            text: "Visited on Saturday night with our family. The live Turkish acoustic instruments created a warm atmosphere and the complimentary tea was wonderful.",
            dateTime: "15 Oct 2026, 22:05",
            editable: false
        },
        {
            id: "REV-MP-4",
            name: "Dana Kassymova",
            rating: 4,
            category: "Food & Kebabs",
            text: "Great weekday business lunch value between 12:00 and 15:00. Portions are generous and the lentil soup is very comforting on cold Astana days.",
            dateTime: "16 Oct 2026, 13:40",
            editable: false
        },
        {
            id: "REV-MP-5",
            name: "Timur Bekzhanov",
            rating: 5,
            category: "Banquet & VIP",
            text: "Booked the VIP Hall for 12 guests for my father's birthday. Dedicated service, spotless room, and the mixed grill platter impressed everyone.",
            dateTime: "18 Oct 2026, 21:10",
            editable: false
        },
        {
            id: "REV-MP-6",
            name: "Zarina Ospanova",
            rating: 4,
            category: "Service & Hospitality",
            text: "We came at 2:00 AM after a late flight and were amazed that the full grill menu was still available 24/7. Waiters were very welcoming.",
            dateTime: "19 Oct 2026, 02:35",
            editable: false
        },
        {
            id: "REV-MP-7",
            name: "Yerlan Mukhamedzhan",
            rating: 3,
            category: "Atmosphere & Music",
            text: "The Beef Ribeye was cooked well, though Friday evening was very busy so we waited 15 minutes without a reservation. Definitely book ahead!",
            dateTime: "20 Oct 2026, 20:50",
            editable: false
        }
    ];

    if (existingQuote) {
        existingQuote.closest("blockquote").remove();
        if (existingAttribution) {
            existingAttribution.remove();
        }
    }

    let editingReviewId = "";
    let highlightedReviewId = "";

    // Build Filter, Search, Sort & Analytics Bar via DOM
    const controlsPanel = createElement("section", "p-4 bg-white border rounded shadow-sm my-4");
    const statsBar = createElement("div", "d-flex flex-wrap justify-content-between align-items-center gap-2 pb-3 mb-3 border-bottom");
    const statsSummary = createElement("div", "fw-bold text-danger fs-5");
    const randomReviewBtn = createElement("button", "btn btn-sm btn-outline-danger", "Spotlight Random 5★ Review");
    randomReviewBtn.type = "button";
    statsBar.append(statsSummary, randomReviewBtn);

    const filterRow = createElement("div", "row g-2 align-items-center");
    const searchCol = createElement("div", "col-12 col-md-4");
    const searchInput = createElement("input", "form-control");
    searchInput.type = "search";
    searchInput.placeholder = "Search reviews by name or dish...";
    searchInput.setAttribute("aria-label", "Search reviews");
    searchCol.append(searchInput);

    const ratingCol = createElement("div", "col-6 col-md-3");
    const ratingFilter = createElement("select", "form-select");
    ratingFilter.setAttribute("aria-label", "Filter reviews by rating");
    [
        { value: "all", label: "All Ratings" },
        { value: "5", label: "5 Stars Only" },
        { value: "4plus", label: "4 Stars & Above" },
        { value: "3below", label: "3 Stars & Below" }
    ].forEach(function (opt) {
        const option = createElement("option", "", opt.label);
        option.value = opt.value;
        ratingFilter.append(option);
    });
    ratingCol.append(ratingFilter);

    const catCol = createElement("div", "col-6 col-md-2");
    const categoryFilter = createElement("select", "form-select");
    categoryFilter.setAttribute("aria-label", "Filter reviews by category");
    [
        "all",
        "Food & Kebabs",
        "Service & Hospitality",
        "Atmosphere & Music",
        "Banquet & VIP"
    ].forEach(function (cat) {
        const option = createElement("option", "", cat === "all" ? "All Categories" : cat);
        option.value = cat;
        categoryFilter.append(option);
    });
    catCol.append(categoryFilter);

    const sortCol = createElement("div", "col-6 col-md-2");
    const sortFilter = createElement("select", "form-select");
    sortFilter.setAttribute("aria-label", "Sort reviews");
    [
        { value: "newest", label: "Newest First" },
        { value: "rating-high", label: "Highest Rating" },
        { value: "rating-low", label: "Lowest Rating" }
    ].forEach(function (opt) {
        const option = createElement("option", "", opt.label);
        option.value = opt.value;
        sortFilter.append(option);
    });
    sortCol.append(sortFilter);

    const resetCol = createElement("div", "col-6 col-md-1 d-grid");
    const resetFilterBtn = createElement("button", "btn btn-outline-secondary", "Reset");
    resetFilterBtn.type = "button";
    resetCol.append(resetFilterBtn);

    filterRow.append(searchCol, ratingCol, catCol, sortCol, resetCol);
    const status = createElement("p", "small text-muted mt-3 mb-0");
    status.setAttribute("aria-live", "polite");
    controlsPanel.append(statsBar, filterRow, status);

    const reviewList = createElement("div", "row g-3 my-3");
    reviewList.id = "visitor-review-list";
    reviewList.setAttribute("aria-live", "polite");

    const counter = createElement("p", "form-text mb-1");
    counter.id = "review-character-count";
    counter.setAttribute("aria-live", "polite");

    const submissionBanner = createElement("div", "alert alert-success mt-3 d-none");
    submissionBanner.setAttribute("role", "status");

    form.noValidate = true;
    article.append(controlsPanel, reviewList);
    messageInput.after(counter);
    form.after(submissionBanner);
    messageInput.setAttribute("aria-describedby", "review-character-count");

    // Reusable Function 1: Calculate average rating and positive percentage using a for loop
    function calculateReviewMetrics(list) {
        if (list.length === 0) {
            return { average: "0.0", positivePercent: 0, total: 0 };
        }
        let sum = 0;
        let positiveCount = 0;
        for (let i = 0; i < list.length; i += 1) {
            const r = Number(list[i].rating) || 0;
            sum += r;
            if (r >= 4) {
                positiveCount += 1;
            }
        }
        const avg = (sum / list.length).toFixed(1);
        const pct = Math.round((positiveCount / list.length) * 100);
        return {
            average: avg,
            positivePercent: pct,
            total: list.length
        };
    }

    // Reusable Function 2: Filter and sort reviews using explicit for loop
    function getFilteredReviews() {
        const query = normalizeText(searchInput.value);
        const rFilter = ratingFilter.value;
        const cFilter = categoryFilter.value;
        const sFilter = sortFilter.value;
        const matched = [];

        for (let i = 0; i < reviews.length; i += 1) {
            const item = reviews[i];
            const searchable = normalizeText(`${item.name} ${item.category} ${item.text}`);
            const matchesQuery = query === "" || searchable.includes(query);
            const matchesCategory = cFilter === "all" || item.category === cFilter;

            let matchesRating = true;
            if (rFilter === "5") {
                matchesRating = item.rating === 5;
            } else if (rFilter === "4plus") {
                matchesRating = item.rating >= 4;
            } else if (rFilter === "3below") {
                matchesRating = item.rating <= 3;
            }

            if (matchesQuery && matchesCategory && matchesRating) {
                matched.push(item);
            }
        }

        if (sFilter === "rating-high") {
            matched.sort(function (a, b) {
                return b.rating - a.rating;
            });
        } else if (sFilter === "rating-low") {
            matched.sort(function (a, b) {
                return a.rating - b.rating;
            });
        } else {
            matched.reverse();
        }

        return matched;
    }

    function getErrorElement(input) {
        let error = document.getElementById(`${input.id}-dynamic-error`);
        if (!error) {
            error = createElement("div", "invalid-feedback");
            error.id = `${input.id}-dynamic-error`;
            input.after(error);
            const currentDescription = input.getAttribute("aria-describedby");
            input.setAttribute(
                "aria-describedby",
                currentDescription ? `${currentDescription} ${error.id}` : error.id
            );
        }
        return error;
    }

    function showError(input, message) {
        const hasError = Boolean(message);
        input.classList.toggle("is-invalid", hasError);
        input.classList.toggle("is-valid", !hasError && input.value.trim() !== "");
        input.setAttribute("aria-invalid", hasError ? "true" : "false");
        getErrorElement(input).textContent = message;
    }

    // Reusable Function 3: Validate each field of the review form (5 fields + combined rating/length rule)
    function validateField(input) {
        let message = "";
        const value = input.value.trim();
        const ratingNum = Number(ratingInput.value) || 0;

        if (input === nameInput) {
            if (value.length < 2 || value.length > 50) {
                message = "Please enter your name (between 2 and 50 characters).";
            }
        } else if (input === ratingInput) {
            if (!["1", "2", "3", "4", "5"].includes(value)) {
                message = "Please choose a rating from 1 to 5 stars.";
            }
        } else if (input === categoryInput) {
            if (value === "") {
                message = "Please select the category of your visit.";
            }
        } else if (input === visitDateInput) {
            if (value === "") {
                message = "Please enter the date of your visit.";
            } else if (value > todayStr) {
                message = "Visit date cannot be in the future.";
            }
        } else if (input === messageInput) {
            const minRequired = ratingNum > 0 && ratingNum <= 2 ? 35 : 20;
            if (value.length < minRequired || value.length > 500) {
                message = ratingNum > 0 && ratingNum <= 2
                    ? "For 1–2 star ratings, please write at least 35 characters (up to 500) so our manager can resolve the issue."
                    : "Please write between 20 and 500 characters.";
            }
        }

        showError(input, message);
        return message === "";
    }

    // Reusable Function 4: Render a single review card via DOM
    function renderReview(review) {
        const column = createElement("article", "col-12 col-md-6 col-lg-4");
        const isHighlighted = review.id === highlightedReviewId;
        const card = createElement(
            "div",
            `card h-100 shadow-sm ${isHighlighted ? "border-danger border-2" : ""}`
        );
        const body = createElement("div", "card-body d-flex flex-column");

        const topRow = createElement("div", "d-flex justify-content-between align-items-start gap-2 mb-2");
        const heading = createElement("h3", "h5 card-title mb-0", review.name);
        const badgeClass = review.rating >= 4
            ? "badge text-bg-success"
            : review.rating === 3
                ? "badge text-bg-warning"
                : "badge text-bg-danger";
        const ratingBadge = createElement("span", badgeClass, `${review.rating}/5 ★`);
        topRow.append(heading, ratingBadge);

        const categoryTag = createElement("p", "small text-danger fw-semibold mb-2", review.category);
        const text = createElement("p", "card-text flex-grow-1", review.text);
        const date = createElement("p", "small text-muted mb-0 mt-2", review.dateTime);
        body.append(topRow, categoryTag, text, date);

        if (review.editable) {
            const actions = createElement("div", "card-footer bg-transparent d-flex gap-2");
            const editButton = createElement("button", "btn btn-sm btn-outline-secondary", "Edit");
            const removeButton = createElement("button", "btn btn-sm btn-outline-danger", "Remove");
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
        const overallMetrics = calculateReviewMetrics(reviews);
        statsSummary.textContent =
            `Average Rating: ${overallMetrics.average} / 5.0 ★ · ${overallMetrics.positivePercent}% positive (${overallMetrics.total} total reviews)`;

        const filtered = getFilteredReviews();
        reviewList.replaceChildren();

        status.textContent = `Showing ${filtered.length} of ${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}.`;

        if (filtered.length === 0) {
            const emptyCol = createElement("div", "col-12");
            const emptyBox = createElement(
                "div",
                "alert alert-warning mb-0",
                "No reviews match your current search or filter. Click Reset to view all visitor reviews."
            );
            emptyCol.append(emptyBox);
            reviewList.append(emptyCol);
            return;
        }

        for (let i = 0; i < filtered.length; i += 1) {
            reviewList.append(renderReview(filtered[i]));
        }
    }

    function updateCounter() {
        const currentLength = messageInput.value.trim().length;
        const ratingNum = Number(ratingInput.value) || 0;
        const minChars = ratingNum > 0 && ratingNum <= 2 ? 35 : 20;
        counter.textContent = `${currentLength}/500 characters (minimum ${minChars} required).`;
        counter.classList.toggle("text-danger", currentLength > 0 && currentLength < minChars);
        counter.classList.toggle("text-success", currentLength >= minChars && currentLength <= 500);
    }

    function resetEditor() {
        editingReviewId = "";
        nameInput.value = "";
        ratingInput.value = "";
        categoryInput.value = "";
        visitDateInput.value = todayStr;
        messageInput.value = "";
        submitButton.textContent = "Send Feedback";
        const cancelButton = form.querySelector("[data-cancel-edit]");
        if (cancelButton) {
            cancelButton.hidden = true;
        }
        [nameInput, ratingInput, categoryInput, visitDateInput, messageInput].forEach(function (input) {
            input.classList.remove("is-invalid", "is-valid");
            showError(input, "");
        });
        updateCounter();
    }

    if (!form.querySelector("[data-cancel-edit]")) {
        const cancelButton = createElement("button", "btn btn-outline-secondary ms-2", "Cancel edit");
        cancelButton.type = "button";
        cancelButton.dataset.cancelEdit = "true";
        cancelButton.hidden = true;
        submitButton.after(cancelButton);
        cancelButton.addEventListener("click", function () {
            resetEditor();
            status.textContent = "Review editing canceled. No changes were saved.";
        });
    }

    // Filter events
    searchInput.addEventListener("input", renderReviews);
    ratingFilter.addEventListener("change", renderReviews);
    categoryFilter.addEventListener("change", renderReviews);
    sortFilter.addEventListener("change", renderReviews);

    resetFilterBtn.addEventListener("click", function () {
        searchInput.value = "";
        ratingFilter.value = "all";
        categoryFilter.value = "all";
        sortFilter.value = "newest";
        highlightedReviewId = "";
        renderReviews();
    });

    randomReviewBtn.addEventListener("click", function () {
        const fiveStarReviews = [];
        for (let i = 0; i < reviews.length; i += 1) {
            if (reviews[i].rating === 5) {
                fiveStarReviews.push(reviews[i]);
            }
        }
        if (fiveStarReviews.length === 0) {
            return;
        }
        const randomIndex = Math.floor(Math.random() * fiveStarReviews.length);
        highlightedReviewId = fiveStarReviews[randomIndex].id;
        searchInput.value = "";
        ratingFilter.value = "all";
        categoryFilter.value = "all";
        renderReviews();
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const fields = [nameInput, ratingInput, categoryInput, visitDateInput, messageInput];
        const invalidFields = [];

        for (let i = 0; i < fields.length; i += 1) {
            if (!validateField(fields[i])) {
                invalidFields.push(fields[i]);
            }
        }

        if (invalidFields.length > 0) {
            invalidFields[0].focus();
            submissionBanner.classList.add("d-none");
            return;
        }

        const now = new Date();
        const refId = editingReviewId || window.meatPoint.createDemoReference("REV");
        const review = {
            id: refId,
            name: nameInput.value.trim(),
            rating: Number(ratingInput.value),
            category: categoryInput.value,
            text: messageInput.value.trim(),
            dateTime: `Visited ${visitDateInput.value} · Posted ${now.toLocaleString("en-GB", {
                timeZone: "Asia/Almaty",
                dateStyle: "medium",
                timeStyle: "short"
            })}`,
            editable: true
        };

        if (editingReviewId) {
            const index = reviews.findIndex(function (item) {
                return item.id === editingReviewId;
            });
            if (index !== -1) {
                reviews[index] = review;
            }
            submissionBanner.textContent =
                `Demonstration update (${refId}): Your review by ${review.name} (${review.rating}/5 ★ in ${review.category}) was updated on this page. ` +
                "This is a front-end demonstration; no data was sent to a server.";
        } else {
            reviews.push(review);
            submissionBanner.textContent =
                `Demonstration submission (${refId}): Thank you, ${review.name}! Your ${review.rating}/5 ★ review for ${review.category} is now displayed. ` +
                "This is a front-end demonstration and no data is sent to a server.";
        }

        highlightedReviewId = refId;
        submissionBanner.classList.remove("d-none");
        renderReviews();
        resetEditor();
    });

    [nameInput, ratingInput, categoryInput, visitDateInput, messageInput].forEach(function (input) {
        const evtType = input.tagName === "SELECT" ? "change" : "input";
        input.addEventListener(evtType, function () {
            validateField(input);
            if (input === ratingInput && messageInput.value.trim() !== "") {
                validateField(messageInput);
            }
            if (input === messageInput || input === ratingInput) {
                updateCounter();
            }
        });
    });

    reviewList.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-review-action]");
        if (!button) {
            return;
        }
        const review = reviews.find(function (item) {
            return item.id === button.dataset.reviewId;
        });
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
            submissionBanner.textContent =
                `Review ${review.id} was removed from this page preview. (Front-end demo only.)`;
            submissionBanner.classList.remove("d-none");
        } else if (button.dataset.reviewAction === "edit") {
            editingReviewId = review.id;
            nameInput.value = review.name;
            ratingInput.value = String(review.rating);
            categoryInput.value = review.category;
            messageInput.value = review.text;
            submitButton.textContent = "Update Review";
            form.querySelector("[data-cancel-edit]").hidden = false;
            updateCounter();
            form.scrollIntoView({ behavior: "smooth", block: "center" });
            nameInput.focus();
            status.textContent = "Editing your review — make changes below and click Update Review.";
        }
    });

    updateCounter();
    renderReviews();
}());
