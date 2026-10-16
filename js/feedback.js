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
