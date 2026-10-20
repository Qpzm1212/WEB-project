"use strict";

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
    const fields = [nameInput, phoneInput, guestsInput, dateInput, timeInput].filter(Boolean);
    const hallOptions = form.querySelectorAll('input[name="hall"]');

    const todayStr = window.meatPoint
        ? window.meatPoint.getLocalDateString(new Date())
        : new Date().toISOString().slice(0, 10);

    if (dateInput) {
        dateInput.min = todayStr;
    }

    // Reusable Function 1: Get max capacity based on selected hall
    function getHallMaxCapacity(hallValue) {
        if (hallValue === "vip") {
            return 15;
        }
        return 80;
    }

    // Reusable Function 2: Calculate required deposit per guest based on hall and group size
    function calculateDepositPerGuest(hallValue, guestCount) {
        const count = Number(guestCount) || 0;
        if (hallValue === "vip") {
            return 5000;
        }
        if (count >= 10) {
            return 3500;
        }
        return 0;
    }

    // Reusable Function 3: Calculate complete booking estimate (calls getHallMaxCapacity & calculateDepositPerGuest)
    function calculateBookingQuote(hallValue, guestCount) {
        const cleanGuests = Math.max(0, Math.floor(Number(guestCount) || 0));
        const maxCapacity = getHallMaxCapacity(hallValue);
        const depositPerPerson = calculateDepositPerGuest(hallValue, cleanGuests);
        const rawDeposit = cleanGuests * depositPerPerson;
        const baseDeposit = hallValue === "vip" && cleanGuests > 0 ? Math.max(25000, rawDeposit) : rawDeposit;
        const serviceFee = baseDeposit > 0 ? Math.round(baseDeposit * 0.1) : 0;
        const totalPrepayment = baseDeposit + serviceFee;
        const tablesNeeded = hallValue === "vip" ? (cleanGuests > 0 ? 1 : 0) : Math.ceil(cleanGuests / 4);

        return {
            hallValue: hallValue,
            hallName: hallValue === "vip" ? "VIP Hall" : "Main Hall",
            guests: cleanGuests,
            maxCapacity: maxCapacity,
            tablesNeeded: tablesNeeded,
            depositPerPerson: depositPerPerson,
            baseDeposit: baseDeposit,
            serviceFee: serviceFee,
            totalPrepayment: totalPrepayment
        };
    }

    // Reusable Function 4: Ensure error element exists and display/clear field error using classList
    function showError(input, message) {
        if (!input) {
            return;
        }
        const hasError = message !== "";
        input.classList.toggle("is-invalid", hasError);
        input.classList.toggle("is-valid", !hasError && input.value.trim() !== "");
        input.setAttribute("aria-invalid", hasError ? "true" : "false");

        let errorElement = document.getElementById(`${input.id}-error`);
        if (!errorElement) {
            errorElement = document.createElement("div");
            errorElement.className = "invalid-feedback";
            errorElement.id = `${input.id}-error`;
            input.after(errorElement);
        }
        errorElement.textContent = message;
    }

    // Reusable Function 5: Validate an individual booking input field (calls getHallMaxCapacity & showError)
    function validateInput(input) {
        if (!input) {
            return true;
        }

        let message = "";
        const rawValue = input.value.trim();
        const checkedHall = form.querySelector('input[name="hall"]:checked');
        const hallValue = checkedHall ? checkedHall.value : "main";

        switch (input.id) {
            case "client-name":
                if (rawValue.length < 2 || rawValue.length > 50) {
                    message = "Please enter your full name (between 2 and 50 characters).";
                } else if (!/^[A-Za-zА-Яа-яЁёӘәІіҢңҒғҮүҰұҚқӨөҺһ\s'-]+$/.test(rawValue)) {
                    message = "Name may contain only letters, spaces, and hyphens.";
                }
                break;

            case "client-phone":
                if (rawValue === "") {
                    message = "Please enter your contact phone number.";
                } else if (window.meatPoint && !window.meatPoint.isValidPhone(rawValue)) {
                    message = "Enter a valid phone number with 10 to 15 digits (e.g. +7 778 422 11 00).";
                }
                break;

            case "guest-count": {
                const maxGuests = getHallMaxCapacity(hallValue);
                const guestCount = Number(rawValue);
                if (rawValue === "") {
                    message = "Please enter the number of guests.";
                } else if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > maxGuests) {
                    message = `For ${hallValue === "vip" ? "VIP Hall" : "Main Hall"}, enter a whole number from 1 to ${maxGuests} guests.`;
                }
                break;
            }

            case "booking-date":
                if (rawValue === "") {
                    message = "Please choose a visit date.";
                } else if (rawValue < todayStr) {
                    message = "Past dates are not allowed. Please choose today or a future date.";
                }
                break;

            case "booking-time":
                if (rawValue === "") {
                    message = "Please choose a visit time.";
                } else if (dateInput && dateInput.value === todayStr) {
                    const now = new Date();
                    const parts = rawValue.split(":");
                    const hours = Number(parts[0]);
                    const minutes = Number(parts[1]);
                    const chosenMinutes = hours * 60 + minutes;
                    const currentMinutes = now.getHours() * 60 + now.getMinutes();

                    if (chosenMinutes <= currentMinutes) {
                        message = "For today's date, please select a future visit time.";
                    }
                }
                break;

            default:
                break;
        }

        showError(input, message);
        return message === "";
    }

    // Reusable Function 6: Validate all booking fields using a for loop
    function validateAllBookingFields() {
        let allValid = true;
        for (let i = 0; i < fields.length; i += 1) {
            const isFieldValid = validateInput(fields[i]);
            if (!isFieldValid) {
                allValid = false;
            }
        }
        return allValid;
    }

    function updateHallCapacityHelp() {
        const checkedHall = form.querySelector('input[name="hall"]:checked');
        const hallValue = checkedHall ? checkedHall.value : "main";
        const maxGuests = getHallMaxCapacity(hallValue);

        if (guestsInput) {
            guestsInput.max = String(maxGuests);
        }

        const helpEl = document.getElementById("guest-count-help");
        if (helpEl) {
            helpEl.textContent = hallValue === "vip"
                ? `VIP Hall accommodates up to ${maxGuests} guests (advance deposit required).`
                : `Main Hall accommodates up to ${maxGuests} guests (deposit required only for 10+ guests).`;
        }

        if (guestsInput && (guestsInput.value !== "" || guestsInput.classList.contains("is-invalid"))) {
            validateInput(guestsInput);
        }
    }

    for (let i = 0; i < fields.length; i += 1) {
        const field = fields[i];
        field.addEventListener("input", function () {
            validateInput(field);
            if (field === dateInput && timeInput && timeInput.value !== "") {
                validateInput(timeInput);
            }
        });
        field.addEventListener("change", function () {
            validateInput(field);
            if (field === dateInput && timeInput && timeInput.value !== "") {
                validateInput(timeInput);
            }
        });
    }

    for (let i = 0; i < hallOptions.length; i += 1) {
        hallOptions[i].addEventListener("change", updateHallCapacityHelp);
    }

    form.addEventListener("reset", function () {
        window.setTimeout(function () {
            for (let i = 0; i < fields.length; i += 1) {
                fields[i].classList.remove("is-invalid", "is-valid");
                showError(fields[i], "");
            }
            updateHallCapacityHelp();
        }, 0);
    });

    window.meatPointBooking = Object.freeze({
        getHallMaxCapacity: getHallMaxCapacity,
        calculateDepositPerGuest: calculateDepositPerGuest,
        calculateBookingQuote: calculateBookingQuote,
        validateInput: validateInput,
        validateAllBookingFields: validateAllBookingFields,
        updateHallCapacityHelp: updateHallCapacityHelp
    });

    updateHallCapacityHelp();
}());
