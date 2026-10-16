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
