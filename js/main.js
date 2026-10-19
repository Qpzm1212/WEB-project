"use strict";

(function () {
    "use strict";

    // Array of 8 objects, each with 6 meaningful properties representing real site pages
    const sitePages = [
        {
            id: "page-home",
            title: "Home",
            url: "index.html",
            category: "Information",
            keywords: "welcome restaurant location meat point astana 24/7 business lunch grill",
            summary: "Restaurant overview, 24/7 operating status, and quick links."
        },
        {
            id: "page-about",
            title: "About Us",
            url: "about.html",
            category: "Information",
            keywords: "story history values team milestones halal quality hospitality",
            summary: "Learn about Meat Point history since 2024, milestones, and core values."
        },
        {
            id: "page-contacts",
            title: "Contact",
            url: "contacts.html",
            category: "Reservations",
            keywords: "contact phone email address hours map banquet vip club inquiry",
            summary: "Check schedule, transport routes, banquet calculator, and contact form."
        },
        {
            id: "page-colophon",
            title: "About site",
            url: "colophon.html",
            category: "Information",
            keywords: "colophon technical stack html css bootstrap validation git team",
            summary: "Technical documentation, semantic architecture, and development milestones."
        },
        {
            id: "page-menu",
            title: "Menu",
            url: "menu.html",
            category: "Dining",
            keywords: "food dishes kebab adana chicken shish pide steaks ribeye prices cart halal vegetarian",
            summary: "Browse Turkish halal dishes, filter by category/diet, and use the order cart."
        },
        {
            id: "page-events",
            title: "Events",
            url: "events.html",
            category: "Dining",
            keywords: "music live friday jazz saturday turkish tunes registration stage",
            summary: "Explore weekend live music nights, seat calculator, and event registration."
        },
        {
            id: "page-booking",
            title: "Booking",
            url: "booking.html",
            category: "Reservations",
            keywords: "table booking reservation date time guests main hall vip room deposit",
            summary: "Filter restaurant tables, calculate deposit, and book a table online."
        },
        {
            id: "page-feedback",
            title: "Reviews",
            url: "feedback.html",
            category: "Community",
            keywords: "reviews feedback rating comments 2gis faq tea hospitality",
            summary: "Read visitor impressions, filter ratings, and submit your own review."
        }
    ];

    const dailyPromoOffers = [
        { code: "LUNCH20", discountPercent: 20, label: "20% off Weekday Business Lunch (12:00-15:00)" },
        { code: "TEA4FREE", discountPercent: 10, label: "Complimentary Turkish Tea Pot + 10% off Pide" },
        { code: "GRILL15", discountPercent: 15, label: "15% off Signature Adana Kebab & Ribeye sets" },
        { code: "FAMILY12", discountPercent: 12, label: "12% off Family Table Bookings for 6+ guests" }
    ];

    // Reusable Function 1: Create DOM element safely using textContent
    function createElement(tagName, classNames, text) {
        const element = document.createElement(tagName);

        if (classNames) {
            element.className = classNames;
        }
        if (text !== undefined && text !== null) {
            element.textContent = String(text);
        }

        return element;
    }

    // Reusable Function 2: Normalize text for search/comparison
    function normalizeText(value) {
        if (typeof value !== "string") {
            return "";
        }
        return value.trim().toLocaleLowerCase();
    }

    // Reusable Function 3: Format numeric amount into Tenge currency string
    function formatMoney(amount) {
        const numericAmount = Number(amount);
        const safeAmount = Number.isFinite(numericAmount) ? Math.round(numericAmount) : 0;
        return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(safeAmount)} ₸`;
    }

    // Reusable Function 4: Calculate service charge (calls Math.round)
    function calculateServiceFee(subtotal, ratePercent) {
        const safeSubtotal = Number(subtotal) > 0 ? Number(subtotal) : 0;
        const safeRate = Number(ratePercent) >= 0 ? Number(ratePercent) : 10;
        return Math.round((safeSubtotal * safeRate) / 100);
    }

    // Reusable Function 5: Calculate full order breakdown (calls calculateServiceFee and formatMoney)
    function calculateOrderBreakdown(subtotal, discountAmount, serviceRatePercent) {
        const cleanSubtotal = Math.max(0, Number(subtotal) || 0);
        const cleanDiscount = Math.min(cleanSubtotal, Math.max(0, Number(discountAmount) || 0));
        const discountedSubtotal = cleanSubtotal - cleanDiscount;
        const serviceFee = calculateServiceFee(discountedSubtotal, serviceRatePercent);
        const finalTotal = discountedSubtotal + serviceFee;

        return {
            subtotal: cleanSubtotal,
            discount: cleanDiscount,
            serviceFee: serviceFee,
            total: finalTotal,
            formattedTotal: formatMoney(finalTotal)
        };
    }

    // Reusable Function 6: Generate random digits using Math.random() and a for loop
    function createRandomDigits(length) {
        const count = Number.isInteger(length) && length > 0 ? length : 6;
        let digits = "";
        for (let i = 0; i < count; i += 1) {
            const randomDigit = Math.floor(Math.random() * 10);
            digits += String(randomDigit === 0 && i === 0 ? 1 : randomDigit);
        }
        return digits;
    }

    // Reusable Function 7: Generate demo reference code (calls createRandomDigits)
    function createDemoReference(prefix) {
        const cleanPrefix = prefix ? String(prefix).trim().toUpperCase() : "MP";
        return `${cleanPrefix}-${createRandomDigits(6)}`;
    }

    // Reusable Function 8: Get local YYYY-MM-DD date string
    function getLocalDateString(dateValue) {
        const localDate = dateValue instanceof Date ? dateValue : new Date();
        const offsetDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().slice(0, 10);
    }

    // Reusable Function 9: Validate phone number (10 to 15 digits)
    function isValidPhone(value) {
        const trimmedValue = String(value || "").trim();
        const digitCount = trimmedValue.replace(/\D/g, "").length;
        return /^\+?[0-9\s()-]+$/.test(trimmedValue) && digitCount >= 10 && digitCount <= 15;
    }

    // Reusable Function 10: Validate email address
    function isValidEmail(value) {
        const trimmedValue = String(value || "").trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedValue);
    }

    // Reusable Function 11: Validate strong password (8+ chars, upper, lower, digit, special char)
    function isStrongPassword(value) {
        const rawValue = String(value || "");
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/.test(rawValue);
    }

    // Reusable Function 12: Filter sitePages using explicit for loop, normalizeText, if/else, === and &&
    function searchPages(query, category) {
        const normalizedQuery = normalizeText(query);
        const selectedCategory = category || "all";
        const matchedPages = [];

        if (normalizedQuery === "" && selectedCategory === "all") {
            return matchedPages;
        }

        for (let i = 0; i < sitePages.length; i += 1) {
            const page = sitePages[i];
            const searchableText = normalizeText(`${page.title} ${page.category} ${page.keywords} ${page.summary}`);
            const matchesQuery = normalizedQuery === "" || searchableText.includes(normalizedQuery);
            const matchesCategory = selectedCategory === "all" || page.category === selectedCategory;

            if (matchesQuery && matchesCategory) {
                matchedPages.push(page);
            }
        }

        return matchedPages;
    }
}());
