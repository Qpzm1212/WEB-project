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
