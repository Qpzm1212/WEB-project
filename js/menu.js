"use strict";

(function () {
    "use strict";

    const menuTableSection = document.getElementById("menu-table");
    if (!menuTableSection || !window.meatPoint) {
        return;
    }

    const createElement = window.meatPoint.createElement;
    const formatMoney = window.meatPoint.formatMoney;
    const normalizeText = window.meatPoint.normalizeText;

    // Array of 10 real Turkish Halal dishes at Meat Point, each with 8 meaningful properties
    const menuDishes = [
        {
            id: "DISH-01",
            name: "Adana Kebab",
            category: "Kebabs",
            price: 4500,
            weightGrams: 340,
            prepMinutes: 20,
            isVegetarian: false,
            spicyLevel: "Spicy",
            description: "Spicy minced lamb and beef grilled on a wide iron skewer, served with bulgur and flatbread."
        },
        {
            id: "DISH-02",
            name: "Chicken Shish",
            category: "Kebabs",
            price: 3800,
            weightGrams: 320,
            prepMinutes: 18,
            isVegetarian: false,
            spicyLevel: "Mild",
            description: "Tender marinated halal chicken breast cubes grilled over charcoal, served with grilled tomatoes."
        },
        {
            id: "DISH-03",
            name: "Kasarli Pide",
            category: "Pide (Turkish Pizza)",
            price: 3200,
            weightGrams: 400,
            prepMinutes: 15,
            isVegetarian: true,
            spicyLevel: "Mild",
            description: "Traditional boat-shaped stone-oven flatbread baked with golden melted Kasar cheese."
        },
        {
            id: "DISH-04",
            name: "Beef Ribeye",
            category: "Steaks",
            price: 8500,
            weightGrams: 380,
            prepMinutes: 25,
            isVegetarian: false,
            spicyLevel: "Medium",
            description: "Premium local halal beef aged for 21 days and fire-grilled to your preferred doneness."
        },
        {
            id: "DISH-05",
            name: "Iskender Kebab",
            category: "Kebabs",
            price: 5200,
            weightGrams: 420,
            prepMinutes: 20,
            isVegetarian: false,
            spicyLevel: "Medium",
            description: "Thinly sliced doner meat over warm pita cubes with rich tomato sauce, browned butter, and yogurt."
        },
        {
            id: "DISH-06",
            name: "Kusbasili Beef Pide",
            category: "Pide (Turkish Pizza)",
            price: 4100,
            weightGrams: 430,
            prepMinutes: 18,
            isVegetarian: false,
            spicyLevel: "Medium",
            description: "Crisp Turkish flatbread topped with diced tender beef, sweet peppers, and herbs."
        },
        {
            id: "DISH-07",
            name: "Lamb T-Bone Steak",
            category: "Steaks",
            price: 7400,
            weightGrams: 360,
            prepMinutes: 22,
            isVegetarian: false,
            spicyLevel: "Mild",
            description: "Charcoal-seared tender lamb loin chops seasoned with Anatolian mountain oregano."
        },
        {
            id: "DISH-08",
            name: "Mercimek Lentil Soup",
            category: "Soups & Salads",
            price: 1800,
            weightGrams: 300,
            prepMinutes: 10,
            isVegetarian: true,
            spicyLevel: "Mild",
            description: "Velvety red lentil soup served with fresh lemon wedges and warm crusty Turkish bread."
        },
        {
            id: "DISH-09",
            name: "Choban Shepherd Salad",
            category: "Soups & Salads",
            price: 2200,
            weightGrams: 280,
            prepMinutes: 8,
            isVegetarian: true,
            spicyLevel: "Mild",
            description: "Crisp cucumbers, ripe tomatoes, red onions, parsley, and olive oil dressing."
        },
        {
            id: "DISH-10",
            name: "Kunefe & Turkish Tea Set",
            category: "Desserts & Tea",
            price: 2900,
            weightGrams: 260,
            prepMinutes: 14,
            isVegetarian: true,
            spicyLevel: "Mild",
            description: "Hot crispy shredded phyllo pastry with melted cheese, pistachios, and double-filtered H2O black tea."
        }
    ];

    const cartItems = [];
    let spotlightDishId = "";

    // Reusable Function 1: Filter dishes by search query, category, and dietary preference using a for loop
    function filterDishes(query, category, dietary) {
        const cleanQuery = normalizeText(query);
        const cleanCategory = category || "all";
        const cleanDietary = dietary || "all";
        const matched = [];

        for (let i = 0; i < menuDishes.length; i += 1) {
            const dish = menuDishes[i];
            const searchable = normalizeText(`${dish.name} ${dish.category} ${dish.description} ${dish.spicyLevel}`);
            const matchesQuery = cleanQuery === "" || searchable.includes(cleanQuery);
            const matchesCategory = cleanCategory === "all" || dish.category === cleanCategory;

            let matchesDiet = true;
            if (cleanDietary === "vegetarian") {
                matchesDiet = dish.isVegetarian === true;
            } else if (cleanDietary === "meat") {
                matchesDiet = dish.isVegetarian === false;
            }

            if (matchesQuery && matchesCategory && matchesDiet) {
                matched.push(dish);
            }
        }

        return matched;
    }

    // Reusable Function 2: Sort dishes by selected criterion
    function sortDishes(list, sortKey) {
        const sorted = list.slice();
        sorted.sort(function (a, b) {
            switch (sortKey) {
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "prep-asc":
                    return a.prepMinutes - b.prepMinutes;
                case "name-asc":
                    return a.name.localeCompare(b.name);
                default:
                    return a.id.localeCompare(b.id);
            }
        });
        return sorted;
    }

    // Reusable Function 3: Calculate cart totals (calls window.meatPoint.calculateOrderBreakdown)
    function calculateCartSummary(items, serviceMode) {
        let itemCount = 0;
        let totalGrams = 0;
        let maxPrepMinutes = 0;
        let rawSubtotal = 0;

        for (let i = 0; i < items.length; i += 1) {
            const entry = items[i];
            itemCount += entry.quantity;
            totalGrams += entry.dish.weightGrams * entry.quantity;
            rawSubtotal += entry.dish.price * entry.quantity;
            if (entry.dish.prepMinutes > maxPrepMinutes) {
                maxPrepMinutes = entry.dish.prepMinutes;
            }
        }

        const discountAmount = rawSubtotal >= 15000 ? Math.round(rawSubtotal * 0.15) : 0;
        const serviceRate = serviceMode === "dine-in" ? 10 : 0;
        const breakdown = window.meatPoint.calculateOrderBreakdown(rawSubtotal, discountAmount, serviceRate);
        const deliveryFee = serviceMode === "delivery" && rawSubtotal > 0 && rawSubtotal < 12000 ? 1500 : 0;
        const grandTotal = breakdown.total + deliveryFee;

        return {
            itemCount: itemCount,
            totalGrams: totalGrams,
            estimatedMinutes: itemCount > 0 ? maxPrepMinutes + Math.min(15, itemCount * 2) : 0,
            subtotal: breakdown.subtotal,
            discount: breakdown.discount,
            serviceFee: breakdown.serviceFee,
            deliveryFee: deliveryFee,
            grandTotal: grandTotal
        };
    }
}());
