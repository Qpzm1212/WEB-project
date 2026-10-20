"use strict";

(function () {
    "use strict";

    const reviews = [
        {
            id: "REV-2GIS-1",
            name: "2GIS Verified Guest",
            rating: 5,
            category: "Service & Hospitality",
            text: "Very attentive, polite, and friendly... all dishes were incredibly tasty.",
            dateTime: "12 Oct 2026, 19:30",
            editable: false
        },
        {
            id: "REV-MP-2",
            name: "Aigerim Nurlanova",
            rating: 5,
            category: "Food & Kebabs",
            text: "The Adana Kebab and Kasarli Pide were authentic and served piping hot right from the wood fire. Best halal Turkish grill near EXPO!",
            dateTime: "14 Oct 2026, 20:15",
            editable: false
        },
        {
            id: "REV-MP-3",
            name: "Marat Suleimenov",
            rating: 5,
            category: "Atmosphere & Music",
            text: "Visited on Saturday night with our family. The live Turkish acoustic instruments created a warm atmosphere and the complimentary tea was wonderful.",
            dateTime: "15 Oct 2026, 22:05",
            editable: false
        },
        {
            id: "REV-MP-4",
            name: "Dana Kassymova",
            rating: 4,
            category: "Food & Kebabs",
            text: "Great weekday business lunch value between 12:00 and 15:00. Portions are generous and the lentil soup is very comforting on cold Astana days.",
            dateTime: "16 Oct 2026, 13:40",
            editable: false
        },
        {
            id: "REV-MP-5",
            name: "Timur Bekzhanov",
            rating: 5,
            category: "Banquet & VIP",
            text: "Booked the VIP Hall for 12 guests for my father's birthday. Dedicated service, spotless room, and the mixed grill platter impressed everyone.",
            dateTime: "18 Oct 2026, 21:10",
            editable: false
        },
        {
            id: "REV-MP-6",
            name: "Zarina Ospanova",
            rating: 4,
            category: "Service & Hospitality",
            text: "We came at 2:00 AM after a late flight and were amazed that the full grill menu was still available 24/7. Waiters were very welcoming.",
            dateTime: "19 Oct 2026, 02:35",
            editable: false
        },
        {
            id: "REV-MP-7",
            name: "Yerlan Mukhamedzhan",
            rating: 3,
            category: "Atmosphere & Music",
            text: "The Beef Ribeye was cooked well, though Friday evening was very busy so we waited 15 minutes without a reservation. Definitely book ahead!",
            dateTime: "20 Oct 2026, 20:50",
            editable: false
        }
    ];

    function calculateReviewMetrics(list) {
        if (list.length === 0) {
            return { average: "0.0", positivePercent: 0, total: 0 };
        }
        let sum = 0;
        let positiveCount = 0;
        for (let i = 0; i < list.length; i += 1) {
            const r = Number(list[i].rating) || 0;
            sum += r;
            if (r >= 4) {
                positiveCount += 1;
            }
        }
        return {
            average: (sum / list.length).toFixed(1),
            positivePercent: Math.round((positiveCount / list.length) * 100),
            total: list.length
        };
    }

    window.meatPointReviewsPreview = calculateReviewMetrics(reviews);
}());
