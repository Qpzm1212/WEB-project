"use strict";

(function () {
    "use strict";

    const form = document.getElementById("restaurant-booking-form");
    if (!form || !window.meatPoint) {
        return;
    }

    const createElement = window.meatPoint.createElement;
    const formatMoney = window.meatPoint.formatMoney;
    const normalizeText = window.meatPoint.normalizeText;

    // Array of 8 real table/zone objects in Meat Point, each with 7 meaningful properties
    const restaurantTables = [
        {
            id: "TBL-M1",
            name: "Window Panorama Booth",
            hall: "main",
            hallLabel: "Main Hall",
            capacity: 4,
            minGuests: 1,
            depositPerGuest: 0,
            feature: "View of Uly Dala Avenue, cozy velvet seating"
        },
        {
            id: "TBL-M2",
            name: "Open Fire Grill Table",
            hall: "main",
            hallLabel: "Main Hall",
            capacity: 6,
            minGuests: 2,
            depositPerGuest: 0,
            feature: "Direct view of the Turkish mangal & chef station"
        },
        {
            id: "TBL-M3",
            name: "Family Ottoman Sofa",
            hall: "main",
            hallLabel: "Main Hall",
            capacity: 8,
            minGuests: 4,
            depositPerGuest: 0,
            feature: "Spacious corner sofa ideal for family dinners"
        },
        {
            id: "TBL-M4",
            name: "Quiet Tea Alcove",
            hall: "main",
            hallLabel: "Main Hall",
            capacity: 2,
            minGuests: 1,
            depositPerGuest: 0,
            feature: "Intimate table for two near the Turkish tea samovar"
        },
        {
            id: "TBL-M5",
            name: "Grand Banquet Row",
            hall: "main",
            hallLabel: "Main Hall",
            capacity: 24,
            minGuests: 10,
            depositPerGuest: 3500,
            feature: "Long celebratory table for 10–24 guests in Main Hall"
        },
        {
            id: "TBL-M6",
            name: "Acoustic Stage Lounge",
            hall: "main",
            hallLabel: "Main Hall",
            capacity: 12,
            minGuests: 6,
            depositPerGuest: 3500,
            feature: "Best acoustics for Friday & Saturday live music"
        },
        {
            id: "TBL-V1",
            name: "VIP Bosphorus Suite",
            hall: "vip",
            hallLabel: "VIP Room",
            capacity: 10,
            minGuests: 4,
            depositPerGuest: 5000,
            feature: "Private soundproof room, dedicated waiter, smart screen"
        },
        {
            id: "TBL-V2",
            name: "VIP Sultan Royal Hall",
            hall: "vip",
            hallLabel: "VIP Room",
            capacity: 15,
            minGuests: 6,
            depositPerGuest: 5000,
            feature: "Premium 15-seat private hall with custom banquet menu"
        }
    ];

    const nameInput = document.getElementById("client-name");
    const phoneInput = document.getElementById("client-phone");
    const guestsInput = document.getElementById("guest-count");
    const dateInput = document.getElementById("booking-date");
    const timeInput = document.getElementById("booking-time");
    const hallInputs = Array.from(form.querySelectorAll('input[name="hall"]'));

    let selectedTableId = "";

    // Reusable Function 1: Filter tables by search query, hall type, and minimum guest capacity using a for loop
    function filterTables(query, hallFilter, minCapacity) {
        const cleanQuery = normalizeText(query);
        const cleanHall = hallFilter || "all";
        const requiredSeats = Number(minCapacity) > 0 ? Number(minCapacity) : 0;
        const results = [];

        for (let i = 0; i < restaurantTables.length; i += 1) {
            const table = restaurantTables[i];
            const searchable = normalizeText(`${table.name} ${table.hallLabel} ${table.feature}`);
            const matchesQuery = cleanQuery === "" || searchable.includes(cleanQuery);
            const matchesHall = cleanHall === "all" || table.hall === cleanHall;
            const matchesCapacity = requiredSeats === 0 || table.capacity >= requiredSeats;

            if (matchesQuery && matchesHall && matchesCapacity) {
                results.push(table);
            }
        }

        return results;
    }

    // Reusable Function 2: Sort filtered tables
    function sortTables(tablesList, sortBy) {
        const copy = tablesList.slice();
        copy.sort(function (a, b) {
            if (sortBy === "capacity-asc") {
                return a.capacity - b.capacity;
            }
            if (sortBy === "capacity-desc") {
                return b.capacity - a.capacity;
            }
            if (sortBy === "deposit-asc") {
                return a.depositPerGuest - b.depositPerGuest;
            }
            return a.id.localeCompare(b.id);
        });
        return copy;
    }
}());
