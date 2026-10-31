(function () {
    "use strict";

    const form = document.querySelector("#registration form");
    if (!form) {
        return;
    }

    const events = [
        { id: "friday", title: "Smooth Jazz Friday", day: 5, dayName: "Friday" },
        { id: "saturday", title: "Turkish Tunes Saturday", day: 6, dayName: "Saturday" }
    ];
    const nameInput = document.getElementById("event-name");
    const emailInput = document.getElementById("event-email");
    const phoneInput = document.getElementById("event-phone");
    const guestsInput = document.getElementById("event-guests");
    const dateInput = document.getElementById("event-book-date");
    const typeInput = document.getElementById("event-select");
    const seatingInputs = Array.from(form.querySelectorAll('input[name="seating"]'));
    const termsInput = document.getElementById("event-terms");
    const dateToday = window.meatPoint.getLocalDateString();
    const fields = [nameInput, emailInput, phoneInput, guestsInput, dateInput, typeInput, seatingInputs[0], termsInput];
    const summary = window.meatPoint.createElement("section", "mt-3 p-3 bg-white border rounded");
    const summaryHeading = window.meatPoint.createElement("h3", "h5", "Event request summary");
    const summaryText = window.meatPoint.createElement("p", "mb-0");
    const confirmation = window.meatPoint.createElement("div", "alert alert-success mt-3 mb-0");

    form.noValidate = true;
    dateInput.min = dateToday;
    summary.setAttribute("aria-live", "polite");
    confirmation.hidden = true;
    summary.append(summaryHeading, summaryText, confirmation);
    form.after(summary);

    function feedbackFor(input) {
        const errorId = `${input.id}-validation-error`;
        let error = document.getElementById(errorId);
        if (!error) {
            error = window.meatPoint.createElement("div", "invalid-feedback");
            error.id = errorId;
            const group = input.closest(".col-12, .col-md-6, .col-6");
            (group || input.parentElement).append(error);
        }
        input.setAttribute("aria-describedby", errorId);
        return error;
    }

    function setError(input, message) {
        input.classList.toggle("is-invalid", Boolean(message));
        input.setAttribute("aria-invalid", message ? "true" : "false");
        feedbackFor(input).textContent = message;
        feedbackFor(input).classList.toggle("d-block", Boolean(message));
    }

    function validateField(input) {
        let message = "";
        const guestCount = Number(guestsInput.value);
        const chosenEvent = events.find(function (item) { return item.id === typeInput.value; });
        if (input === nameInput && nameInput.value.trim().length < 2) {
            message = "Enter your name (at least 2 characters).";
        } else if (input === emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            message = "Enter a valid email address.";
        } else if (input === phoneInput && !window.meatPoint.isValidPhone(phoneInput.value)) {
            message = "Enter a valid phone number with 10–15 digits.";
        } else if (input === guestsInput && (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 20)) {
            message = "Enter a whole guest count from 1 to 20.";
        } else if (input === dateInput) {
            if (!dateInput.value || dateInput.value < dateToday) {
                message = "Choose today or a future event date.";
            } else if (chosenEvent && new Date(`${dateInput.value}T12:00:00`).getDay() !== chosenEvent.day) {
                message = `The selected event takes place on ${chosenEvent.dayName}. Choose a matching date.`;
            }
        } else if (input === typeInput && !chosenEvent) {
            message = "Choose an event type.";
        } else if (input === seatingInputs[0] && !seatingInputs.some(function (item) { return item.checked; })) {
            message = "Choose a seating preference.";
        } else if (input === termsInput && !termsInput.checked) {
            message = "Please accept the reservation rules to continue.";
        }

        setError(input, message);
        return message === "";
    }

    function updateSummary() {
        const eventChoice = events.find(function (item) { return item.id === typeInput.value; });
        const seatingChoice = seatingInputs.find(function (item) { return item.checked; });
        const seatingLabel = seatingChoice
            ? form.querySelector(`label[for="${seatingChoice.id}"]`).textContent.trim()
            : "Seating not selected";
        summaryText.textContent =
            `${eventChoice ? eventChoice.title : "Event not selected"} · ` +
            `${dateInput.value || "Date not selected"} · ${guestsInput.value || "Guest count not selected"} guest(s) · ` +
            `${seatingLabel}. No event fee is specified on this page.`;
    }

    fields.forEach(function (input) {
        ["input", "change"].forEach(function (eventName) {
            input.addEventListener(eventName, function () {
                validateField(input);
                if (input === typeInput || input === dateInput) {
                    validateField(input === typeInput ? dateInput : typeInput);
                }
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
        const eventChoice = events.find(function (item) { return item.id === typeInput.value; });
        const seatingChoice = seatingInputs.find(function (item) { return item.checked; });
        confirmation.textContent =
            `Demonstration request ${window.meatPoint.createDemoReference("EVENT")} prepared for ` +
            `${eventChoice.title} on ${dateInput.value}, ${guestsInput.value} guest(s), ` +
            `${form.querySelector(`label[for="${seatingChoice.id}"]`).textContent.trim()}. ` +
            "No data was sent to a server and no real event registration was created.";
        confirmation.hidden = false;
    });

    form.addEventListener("reset", function () {
        window.setTimeout(function () {
            fields.forEach(function (input) { setError(input, ""); });
            confirmation.hidden = true;
            updateSummary();
        });
    });

    updateSummary();
}());
