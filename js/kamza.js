"use strict";

(function () {
    "use strict";

    if (!window.meatPoint) {
        return;
    }

    const createElement = window.meatPoint.createElement;
    const formatMoney = window.meatPoint.formatMoney;
    const normalizeText = window.meatPoint.normalizeText;
    const getLocalDateString = window.meatPoint.getLocalDateString;

    // Array of 8 real restaurant highlights, signature sets & milestones (each with 7 meaningful properties)
    const restaurantHighlights = [
        {
            id: "HL-01",
            title: "Weekday Business Lunch Set",
            category: "Specials",
            year: 2026,
            pricePerGuest: 3500,
            metric: "12:00 – 15:00 Mon-Fri",
            description: "Includes red lentil soup, choice of Chicken Shish or Pide, shepherd salad, and unlimited Turkish tea."
        },
        {
            id: "HL-02",
            title: "Signature Meat Point Grill Platter",
            category: "Specials",
            year: 2025,
            pricePerGuest: 6500,
            metric: "400g Mixed Grill / Guest",
            description: "Chef's assortment of Adana Kebab, lamb chops, chicken wings, grilled vegetables, and warm lavash."
        },
        {
            id: "HL-03",
            title: "Sultan Royal Banquet Menu",
            category: "Specials",
            year: 2026,
            pricePerGuest: 9800,
            metric: "Full 4-Course Feast",
            description: "Aged Beef Ribeye, mezze platter, hot cheese Kunefe dessert, and dedicated table service."
        },
        {
            id: "HL-04",
            title: "Summer Terrace Opening",
            category: "Milestones",
            year: 2026,
            pricePerGuest: 0,
            metric: "Up to 25 Outdoor Seats",
            description: "Opened our landscaped open-air terrace near the Botanical Garden and EXPO boulevard."
        },
        {
            id: "HL-05",
            title: "10,000th Guest Celebration",
            category: "Milestones",
            year: 2025,
            pricePerGuest: 0,
            metric: "4.9★ Guest Satisfaction",
            description: "Welcomed our ten thousandth visitor and expanded our 24/7 delivery fleet across Astana."
        },
        {
            id: "HL-06",
            title: "Restaurant Foundation & Halal Audit",
            category: "Milestones",
            year: 2024,
            pricePerGuest: 0,
            metric: "400 m² Dining Hall",
            description: "Founded Meat Point on Uly Dala 45 with 100% certified Halal local beef and imported Turkish spices."
        },
        {
            id: "HL-07",
            title: "Double-Filtered H2O Tea Standard",
            category: "Quality",
            year: 2024,
            pricePerGuest: 1200,
            metric: "100% Pure Water",
            description: "Every pot of traditional Rize black tea and cold beverage is prepared with double-filtered H2O."
        },
        {
            id: "HL-08",
            title: "24/7 Round-the-Clock Grill Kitchen",
            category: "Quality",
            year: 2025,
            pricePerGuest: 4500,
            metric: "Open 365 Days 24/7",
            description: "Full charcoal grill and breakfast menu available day and night without kitchen breaks."
        }
    ];

    // Reusable Function 1: Filter highlights by query and category using a for loop
    function filterHighlights(query, category, sortBy) {
        const cleanQuery = normalizeText(query);
        const cleanCat = category || "all";
        const matched = [];

        for (let i = 0; i < restaurantHighlights.length; i += 1) {
            const item = restaurantHighlights[i];
            const searchable = normalizeText(`${item.title} ${item.category} ${item.metric} ${item.description} ${item.year}`);
            const matchesQuery = cleanQuery === "" || searchable.includes(cleanQuery);
            const matchesCat = cleanCat === "all" || item.category === cleanCat;

            if (matchesQuery && matchesCat) {
                matched.push(item);
            }
        }

        if (sortBy === "year-desc") {
            matched.sort(function (a, b) {
                return b.year - a.year;
            });
        } else if (sortBy === "year-asc") {
            matched.sort(function (a, b) {
                return a.year - b.year;
            });
        }

        return matched;
    }

    // Reusable Function 2: Calculate group meal or business lunch package cost
    function calculateGroupMealQuote(packagePrice, guests, isWeekdayLunch) {
        const cleanGuests = Math.max(1, Math.min(50, Math.floor(Number(guests) || 1)));
        const rawTotal = cleanGuests * packagePrice;
        const lunchDiscount = isWeekdayLunch ? Math.round(rawTotal * 0.2) : 0;
        const discounted = rawTotal - lunchDiscount;
        const serviceFee = window.meatPoint.calculateServiceFee(discounted, 10);
        const finalCost = discounted + serviceFee;
        const complimentaryTeaPots = Math.ceil(cleanGuests / 3);

        return {
            guests: cleanGuests,
            rawTotal: rawTotal,
            lunchDiscount: lunchDiscount,
            serviceFee: serviceFee,
            finalCost: finalCost,
            complimentaryTeaPots: complimentaryTeaPots
        };
    }
}());
