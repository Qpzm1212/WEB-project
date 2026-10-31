(function () {
    "use strict";

    const form = document.querySelector("#reservation form");
    if (!form) {
        return;
    }

    const nameInput = document.getElementById("client_name");
    const emailInput = document.getElementById("client_email");
    const phoneInput = document.getElementById("client_phone");
    const guestsInput = document.getElementById("guest_count");
    const dateInput = document.getElementById("visit_date");
    const seatingInputs = Array.from(form.querySelectorAll('input[name="seating"]'));
    const occasionInput = document.getElementById("visit_reason");
    const messageInput = document.getElementById("client_message");
    const newsletterInput = document.getElementById("newsletter");
    const dateToday = window.meatPoint.getLocalDateString();
    const fields = [nameInput, emailInput, phoneInput, guestsInput, dateInput, seatingInputs[0], occasionInput];
    const summary = window.meatPoint.createElement("section", "mt-3 p-3 bg-white border rounded");
    const summaryTitle = window.meatPoint.createElement("h3", "h5", "Contact request summary");
    const summaryText = window.meatPoint.createElement("p", "mb-0");
    const confirmation = window.meatPoint.createElement("div", "alert alert-success mt-3 mb-0");
    const messageCounter = window.meatPoint.createElement("p", "form-text");

    form.noValidate = true;
    dateInput.min = dateToday;
    summary.setAttribute("aria-live", "polite");
    confirmation.hidden = true;
    messageCounter.textContent = "0/300 characters.";
    messageCounter.id = "contact-message-counter";
    messageInput.maxLength = 300;
    messageInput.after(messageCounter);
    messageInput.setAttribute("aria-describedby", messageCounter.id);
    summary.append(summaryTitle, summaryText, confirmation);
    form.after(summary);

    function getError(input) {
        const id = `${input.id}-contact-error`;
        let error = document.getElementById(id);
        if (!error) {
            error = window.meatPoint.createElement("div", "invalid-feedback");
            error.id = id;
            const group = input.closest(".col-12, .col-md-6, .col-6");
            (group || input.parentElement).append(error);
            const describedBy = input.getAttribute("aria-describedby");
            input.setAttribute("aria-describedby", describedBy ? `${describedBy} ${id}` : id);
        }
        return error;
    }

    function setError(input, message) {
        input.classList.toggle("is-invalid", Boolean(message));
        input.setAttribute("aria-invalid", message ? "true" : "false");
        getError(input).textContent = message;
        getError(input).classList.toggle("d-block", Boolean(message));
    }

    function validateField(input) {
        let message = "";
        const guestCount = Number(guestsInput.value);
        const selectedSeat = seatingInputs.some(function (item) { return item.checked; });
        if (input === nameInput && nameInput.value.trim().length < 2) {
            message = "Enter your name (at least 2 characters).";
        } else if (input === emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            message = "Enter a valid email address.";
        } else if (input === phoneInput && !window.meatPoint.isValidPhone(phoneInput.value)) {
            message = "Enter a valid phone number with 10–15 digits.";
        } else if (input === guestsInput && (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 50)) {
            message = "Enter a whole guest count from 1 to 50.";
        } else if (input === dateInput && (!dateInput.value || dateInput.value < dateToday)) {
            message = "Choose today or a future visit date.";
        } else if (input === seatingInputs[0] && !selectedSeat) {
            message = "Choose a seating preference.";
        }
        setError(input, message);
        return message === "";
    }

    function updateSummary() {
        const seating = seatingInputs.find(function (item) { return item.checked; });
        const seatingLabel = seating
            ? form.querySelector(`label[for="${seating.id}"]`).textContent.trim()
            : "Seating not selected";
        const occasion = occasionInput.options[occasionInput.selectedIndex].textContent;
        const guests = guestsInput.value || "Not selected";
        const deposit = Number(guestsInput.value) >= 10
            ? " Advance deposit is required for 10+ guests."
            : "";
        summaryText.textContent =
            `${guests} guest(s) · ${dateInput.value || "Date not selected"} · ${seatingLabel} · ${occasion} · ` +
            `Newsletter requested: ${newsletterInput.checked ? "yes" : "no"}.` + deposit;
    }

    fields.forEach(function (input) {
        ["input", "change"].forEach(function (eventName) {
            input.addEventListener(eventName, function () {
                validateField(input);
                confirmation.hidden = true;
                updateSummary();
            });
        });
    });
    seatingInputs.forEach(function (input) {
        input.addEventListener("change", function () {
            validateField(seatingInputs[0]);
            updateSummary();
            confirmation.hidden = true;
        });
        newsletterInput.addEventListener("change", function () {
            updateSummary();
            confirmation.hidden = true;
        });
    });
    messageInput.addEventListener("input", function () {
        messageCounter.textContent = `${messageInput.value.length}/300 characters.`;
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const invalidFields = fields.filter(function (input) {
            return !validateField(input);
        });
        if (invalidFields.length > 0) {
            invalidFields[0].focus();
            confirmation.hidden = true;
            return;
        }
        confirmation.textContent =
            `Demonstration request ${window.meatPoint.createDemoReference("CONTACT")} prepared for ` +
            `${nameInput.value.trim()}: ${summaryText.textContent} ` +
            "No data was sent to a server and no real reservation was created.";
        confirmation.hidden = false;
    });

    form.addEventListener("reset", function () {
        window.setTimeout(function () {
            fields.forEach(function (input) { setError(input, ""); });
            messageCounter.textContent = "0/300 characters.";
            confirmation.hidden = true;
            updateSummary();
        });
    });

    updateSummary();
}());
