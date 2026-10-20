"use strict";

(function () {
    "use strict";

    const registrationSection = document.getElementById("registration");
    const form = registrationSection ? registrationSection.querySelector("form") : null;
    if (!form || !window.meatPoint) {
        return;
    }

    const createElement = window.meatPoint.createElement;
    const formatMoney = window.meatPoint.formatMoney;
    const normalizeText = window.meatPoint.normalizeText;
    const getLocalDateString = window.meatPoint.getLocalDateString;

    // Array of 6 real weekend live music events at Meat Point, each with 8 meaningful properties
    const musicEvents = [
        {
            id: "EVT-FRI-1",
            title: "Smooth Jazz & Saxophone Quartet",
            eventType: "friday",
            dayLabel: "Friday",
            genre: "Smooth Jazz",
            timeWindow: "20:00 – 23:00",
            coverCharge: 3000,
            seatsLeft: 18,
            description: "Live acoustic saxophone and piano quartet paired with aged steaks."
        },
        {
            id: "EVT-FRI-2",
            title: "Acoustic Pop & Soul Unplugged",
            eventType: "friday",
            dayLabel: "Friday",
            genre: "Acoustic Pop",
            timeWindow: "20:30 – 23:30",
            coverCharge: 2500,
            seatsLeft: 14,
            description: "Warm vocal harmonies and acoustic guitar melodies for a relaxing Friday dinner."
        },
        {
            id: "EVT-FRI-3",
            title: "Bosphorus Evening Lounge Jazz",
            eventType: "friday",
            dayLabel: "Friday",
            genre: "Smooth Jazz",
            timeWindow: "21:00 – 23:45",
            coverCharge: 3500,
            seatsLeft: 10,
            description: "Modern jazz standards blended with East-West instrumental improvisations."
        },
        {
            id: "EVT-SAT-1",
            title: "Traditional Turkish Oud & Kanun Night",
            eventType: "saturday",
            dayLabel: "Saturday",
            genre: "Turkish Tunes",
            timeWindow: "20:00 – 23:00",
            coverCharge: 4000,
            seatsLeft: 16,
            description: "Authentic classical and folk melodies from Istanbul performed on traditional instruments."
        },
        {
            id: "EVT-SAT-2",
            title: "Anatolian Folk & Fire Grill Show",
            eventType: "saturday",
            dayLabel: "Saturday",
            genre: "Turkish Tunes",
            timeWindow: "19:30 – 22:30",
            coverCharge: 4500,
            seatsLeft: 12,
            description: "Vibrant Anatolian rhythms accompanied by the head chef's signature kebab presentation."
        },
        {
            id: "EVT-SAT-3",
            title: "Golden Istanbul Acoustic Strings",
            eventType: "saturday",
            dayLabel: "Saturday",
            genre: "Turkish Tunes",
            timeWindow: "20:30 – 23:30",
            coverCharge: 3500,
            seatsLeft: 20,
            description: "Romantic Turkish string ensemble ideal for anniversaries and family celebrations."
        }
    ];

    const nameInput = document.getElementById("event-name");
    const emailInput = document.getElementById("event-email");
    const phoneInput = document.getElementById("event-phone");
    const guestsInput = document.getElementById("event-guests");
    const dateInput = document.getElementById("event-book-date");
    const eventSelect = document.getElementById("event-select");
    const requestsInput = document.getElementById("event-requests");
    const termsCheckbox = document.getElementById("event-terms");
    const seatingRadios = Array.from(form.querySelectorAll('input[name="seating"]'));

    const todayStr = getLocalDateString(new Date());
    if (dateInput) {
        dateInput.min = todayStr;
    }

    let selectedEventCardId = musicEvents[0].id;
}());
