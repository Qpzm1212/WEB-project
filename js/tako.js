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
}());
