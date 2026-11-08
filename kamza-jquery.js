$(function () {
    "use strict";

    if (!window.meatPoint) {
        return;
    }

    const mp = window.meatPoint;
    const formatMoney = mp.formatMoney;

    const restaurantHighlights = [
        { id: "HL-01", title: "Weekday Business Lunch Set", category: "Specials", year: 2026, pricePerGuest: 3500, metric: "12:00 – 15:00 Mon-Fri", description: "Includes red lentil soup, choice of Chicken Shish or Pide, shepherd salad, and unlimited Turkish tea." },
        { id: "HL-02", title: "Signature Meat Point Grill Platter", category: "Specials", year: 2025, pricePerGuest: 6500, metric: "400g Mixed Grill / Guest", description: "Chef's assortment of Adana Kebab, lamb chops, chicken wings, grilled vegetables, and warm lavash." },
        { id: "HL-03", title: "Sultan Royal Banquet Menu", category: "Specials", year: 2026, pricePerGuest: 9800, metric: "Full 4-Course Feast", description: "Aged Beef Ribeye, mezze platter, hot cheese Kunefe dessert, and dedicated table service." },
        { id: "HL-04", title: "Summer Terrace Opening", category: "Milestones", year: 2026, pricePerGuest: 0, metric: "Up to 25 Outdoor Seats", description: "Opened our landscaped open-air terrace near the Botanical Garden and EXPO boulevard." },
        { id: "HL-05", title: "10,000th Guest Celebration", category: "Milestones", year: 2025, pricePerGuest: 0, metric: "4.9★ Guest Satisfaction", description: "Welcomed our ten thousandth visitor and expanded our 24/7 delivery fleet across Astana." },
        { id: "HL-06", title: "Restaurant Foundation & Halal Audit", category: "Milestones", year: 2024, pricePerGuest: 0, metric: "400 m² Dining Hall", description: "Founded Meat Point on Uly Dala 45 with 100% certified Halal local beef and imported Turkish spices." },
        { id: "HL-07", title: "Double-Filtered H2O Tea Standard", category: "Quality", year: 2024, pricePerGuest: 1200, metric: "100% Pure Water", description: "Every pot of traditional Rize black tea and cold beverage is prepared with double-filtered H2O." },
        { id: "HL-08", title: "24/7 Round-the-Clock Grill Kitchen", category: "Quality", year: 2025, pricePerGuest: 4500, metric: "Open 365 Days 24/7", description: "Full charcoal grill and breakfast menu available day and night without kitchen breaks." }
    ];

    function make(tag, classes, text) {
        const props = { "class": classes };
        if (text !== undefined) {
            props.text = text;
        }
        return $("<" + tag + ">", props);
    }

    function filterHighlights(query, category, sortBy) {
        const cleanQuery = mp.normalizeText(query);
        const cleanCat = category || "all";

        const matched = $.grep(restaurantHighlights, function (item) {
            const searchable = mp.normalizeText(`${item.title} ${item.category} ${item.metric} ${item.description} ${item.year}`);
            const matchesQuery = cleanQuery === "" || searchable.includes(cleanQuery);
            const matchesCat = cleanCat === "all" || item.category === cleanCat;
            return matchesQuery && matchesCat;
        });

        if (sortBy === "year-desc") {
            matched.sort(function (a, b) { return b.year - a.year; });
        } else if (sortBy === "year-asc") {
            matched.sort(function (a, b) { return a.year - b.year; });
        }

        return matched;
    }

    function calculateGroupMealQuote(packagePrice, guests, isWeekdayLunch) {
        const cleanGuests = Math.max(1, Math.min(50, Math.floor(Number(guests) || 1)));
        const rawTotal = cleanGuests * packagePrice;
        const lunchDiscount = isWeekdayLunch ? Math.round(rawTotal * 0.2) : 0;
        const discounted = rawTotal - lunchDiscount;
        const serviceFee = mp.calculateServiceFee(discounted, 10);

        return {
            guests: cleanGuests,
            rawTotal: rawTotal,
            lunchDiscount: lunchDiscount,
            serviceFee: serviceFee,
            finalCost: discounted + serviceFee,
            complimentaryTeaPots: Math.ceil(cleanGuests / 3)
        };
    }

    function createHighlightCard(item, spotlightId) {
        const $card = make("div", "card h-100 shadow-sm kamza-card border-0 rounded-4")
            .attr("data-id", item.id)
            .css({ "transition": "transform 0.25s ease, box-shadow 0.25s ease", "cursor": "pointer" });

        if (item.id === spotlightId) {
            $card.addClass("border-danger border-2 shadow");
        }

        const $body = make("div", "card-body d-flex flex-column").appendTo($card);

        make("div", "d-flex justify-content-between align-items-center mb-2")
            .append(
                make("span", "badge text-bg-danger rounded-pill px-2 py-1 shadow-sm", item.category),
                make("span", "badge text-bg-dark rounded-pill px-2 py-1 shadow-sm", String(item.year))
            )
            .appendTo($body);

        make("h3", "h6 card-title fw-bold", item.title).appendTo($body);
        make("p", "small text-danger fw-semibold mb-2", item.metric).appendTo($body);

        make("div", "kamza-card-more")
            .append(
                make("p", "card-text small text-muted", item.description),
                make("p", "small fw-bold mb-0 mt-2",
                    item.pricePerGuest > 0 ? `Set price: ${formatMoney(item.pricePerGuest)} / guest` : "Included in Restaurant Experience")
            )
            .hide()
            .appendTo($body);

        make("p", "small text-muted mb-0 mt-auto pt-2", "👆 Click card to expand").appendTo($body);

        return make("div", "col-12 col-md-6 col-lg-3").append($card);
    }

    function initExplorer() {

        const $anchor = $("#atmosphere, #values").first();
        if ($anchor.length === 0) {
            return;
        }

        let spotlightId = "";

        const $random = make("button", "btn btn-sm btn-outline-danger rounded-pill px-3 shadow-sm", "🎲 Random Chef Fact / Offer")
            .attr({ id: "kamza-random", type: "button" });

        const $search = make("input", "form-control rounded-3")
            .attr({ id: "kamza-search", type: "search", placeholder: "Search specials, milestones, or standards...", "aria-label": "Search restaurant highlights" });

        const $category = make("select", "form-select rounded-3").attr({ id: "kamza-category", "aria-label": "Filter by category" });
        $.each(["all", "Specials", "Milestones", "Quality"], function (_, c) {
            make("option", "", c === "all" ? "All Categories" : c).val(c).appendTo($category);
        });

        const $sort = make("select", "form-select rounded-3").attr({ id: "kamza-sort", "aria-label": "Sort by year" });
        $.each([
            { value: "default", label: "Default Order" },
            { value: "year-desc", label: "Newest First (2026 → 2024)" },
            { value: "year-asc", label: "Chronological (2024 → 2026)" }
        ], function (_, o) {
            make("option", "", o.label).val(o.value).appendTo($sort);
        });

        const $reset = make("button", "btn btn-outline-secondary rounded-3 shadow-sm", "Reset").attr({ id: "kamza-reset", type: "button" });
        const $status = make("p", "small text-muted mb-3").attr({ id: "kamza-status", "aria-live": "polite" });
        const $grid = make("div", "row g-3 mb-4").attr("id", "kamza-cards");

        const $pkg = make("select", "form-select rounded-3").attr("id", "mp-calc-package");
        $.each([
            { value: "3500", label: "Weekday Business Lunch Set (3,500 ₸ / guest)" },
            { value: "6500", label: "Signature Mixed Grill Platter (6,500 ₸ / guest)" },
            { value: "9800", label: "Sultan Royal 4-Course Feast (9,800 ₸ / guest)" }
        ], function (_, p) {
            make("option", "", p.label).val(p.value).appendTo($pkg);
        });

        const $guests = make("input", "form-control rounded-3")
            .attr({ id: "mp-calc-guests", type: "number", min: 1, max: 50 })
            .val(4);

        const $lunch = make("input", "form-check-input")
            .attr({ id: "mp-calc-lunch-time", type: "checkbox" })
            .prop("checked", true);

        const $calcOutput = make("p", "mt-3 mb-0 fw-semibold text-dark p-3 bg-white rounded-3 border-start border-3 border-danger shadow-sm").attr({ id: "kamza-calc-output", "aria-live": "polite" });

        const $calcBox = make("div", "p-4 bg-light border-0 rounded-4 shadow-sm").append(
            make("h3", "h5 text-danger mb-3", "Business Lunch & Group Dining Calculator"),
            make("div", "row g-3 align-items-end").append(
                make("div", "col-12 col-md-5").append(
                    make("label", "form-label small fw-semibold", "Select Set Menu").attr("for", "mp-calc-package"), $pkg),
                make("div", "col-6 col-md-3").append(
                    make("label", "form-label small fw-semibold", "Number of Guests (1–50)").attr("for", "mp-calc-guests"), $guests),
                make("div", "col-6 col-md-4").append(
                    make("div", "form-check mb-2").append(
                        $lunch,
                        make("label", "form-check-label small", "Visiting Weekdays 12:00–15:00 (−20% Lunch Promo)").attr("for", "mp-calc-lunch-time")))
            ),
            $calcOutput
        );

        const $section = make("section", "mb-5 p-4 bg-white border-0 rounded-4 shadow-sm")
            .attr("id", "kamza-interactive-explorer")
            .append(
                make("div", "d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3").append(
                    make("h2", "h3 text-danger mb-0", "Explore Meat Point Specials, Quality & Milestones"), $random),
                make("div", "row g-2 mb-3").append(
                    make("div", "col-12 col-md-5").append($search),
                    make("div", "col-6 col-md-3").append($category),
                    make("div", "col-6 col-md-3").append($sort),
                    make("div", "col-12 col-md-1 d-grid").append($reset)),
                $status, $grid, $calcBox
            );

        $anchor.after($section);

        function renderExplorer() {
            const filtered = filterHighlights($search.val(), $category.val(), $sort.val());

            $grid.empty();
            $status.text(`Showing ${filtered.length} of ${restaurantHighlights.length} restaurant highlights.`);

            if (filtered.length === 0) {

                make("div", "col-12")
                    .append(make("div", "alert alert-warning mb-0", "No items match your search. Click Reset to view all highlights and milestones."))
                    .hide()
                    .appendTo($grid)
                    .fadeIn(250);
                return;
            }

            $.each(filtered, function (_, item) {
                createHighlightCard(item, spotlightId).appendTo($grid);
            });
        }

        function updateCalc() {
            const quote = calculateGroupMealQuote(Number($pkg.val()), $guests.val(), $lunch.prop("checked"));
            $calcOutput.html(
                `For <strong>${quote.guests}</strong> guest(s): Base ${formatMoney(quote.rawTotal)} ` +
                `| Weekday Lunch Savings: −${formatMoney(quote.lunchDiscount)} ` +
                `| 10% Service: ${formatMoney(quote.serviceFee)} ` +
                `| Total Estimate: <strong class="text-danger">${formatMoney(quote.finalCost)}</strong> ` +
                `(Includes ${quote.complimentaryTeaPots} complimentary Turkish tea pot(s)!).`
            );
        }

        $search.on("input", renderExplorer);
        $category.add($sort).on("change", renderExplorer);

        $search.on("keyup", function (event) {
            if (event.key === "Escape") {
                $(this).val("");
                renderExplorer();
            }
        });

        $reset.on("click", function () {
            $search.val("");
            $category.val("all");
            $sort.val("default");
            spotlightId = "";
            renderExplorer();
        });

        $grid.on("click", ".kamza-card", function () {
            const $card = $(this);
            const $more = $card.find(".kamza-card-more");

            $card.parent().siblings().find(".kamza-card")
                .removeClass("border-danger border-2")
                .find(".kamza-card-more:visible")
                .slideUp(200);

            $more.slideToggle(250, function () {
                $card.toggleClass("border-danger border-2", $(this).is(":visible"));
            });
        });

        $grid.on("mouseenter mouseleave", ".kamza-card", function (event) {
            const isHover = event.type === "mouseenter";
            $(this).toggleClass("shadow", isHover)
                   .css("transform", isHover ? "translateY(-4px)" : "none");
        });

        $random.on("click", function () {
            const chosen = restaurantHighlights[Math.floor(Math.random() * restaurantHighlights.length)];
            spotlightId = chosen.id;
            $search.val("");
            $category.val("all");
            renderExplorer();
            $status.text(`Chef Spotlight: ${chosen.title} (${chosen.metric}) — ${chosen.description}`);

            const $spot = $grid.find(`.kamza-card[data-id="${chosen.id}"]`);

            $("html, body").stop(true).animate({ scrollTop: $spot.offset().top - 120 }, 500)
                .promise().done(function () {
                    $spot.find(".kamza-card-more").slideDown(250);
                });
        });

        $pkg.add($guests).add($lunch).on("input change", updateCalc);

        renderExplorer();
        updateCalc();
    }

    function initContactsForm() {
        const $form = $("#reservation form");
        if ($form.length === 0) {
            return;
        }

        const $name = $("#client_name");
        const $email = $("#client_email");
        const $phone = $("#client_phone");
        const $guests = $("#guest_count");
        const $date = $("#visit_date");
        const $reason = $("#visit_reason");
        const $message = $("#client_message");
        const $newsletter = $("#newsletter");
        const $resetBtn = $form.find('button[type="reset"]');
        const $seating = $form.find('input[name="seating"]');
        const todayStr = mp.getLocalDateString(new Date());

        $date.attr("min", todayStr);

        $resetBtn.removeClass("disabled").removeAttr("aria-disabled").prop("disabled", false);

        $form.prop("noValidate", true);

        const $pass = make("input", "form-control")
            .attr({ id: "vip_password", type: "password", placeholder: "e.g. Astana#2026" });
        const $conf = make("input", "form-control")
            .attr({ id: "vip_password_confirm", type: "password", placeholder: "Repeat password" });
        const $showHide = make("button", "btn btn-outline-secondary", "Show Password").attr("type", "button");

        const $vipBox = make("div", "p-4 mb-4 bg-white border-0 rounded-4 shadow-sm")
            .attr("id", "vip-club-password-box")
            .append(
                make("h3", "h6 text-danger mb-2", "VIP Club Member Password Setup"),
                make("p", "small text-muted mb-3", "Create a password for your monthly discount account (min 8 chars, uppercase, lowercase, digit, special character)."),
                make("div", "row g-3 align-items-start").append(
                    make("div", "col-12 col-md-5").append(make("label", "form-label small fw-semibold", "Create Password").attr("for", "vip_password"), $pass),
                    make("div", "col-12 col-md-5").append(make("label", "form-label small fw-semibold", "Confirm Password").attr("for", "vip_password_confirm"), $conf),
                    make("div", "col-12 col-md-2 d-grid").append(make("span", "form-label small d-none d-md-block", "Visibility"), $showHide)
                )
            )
            .hide();

        $newsletter.closest(".form-check").after($vipBox);

        $newsletter.on("change", function () {

            if ($(this).prop("checked")) {

                $vipBox.slideDown(250, function () {
                    $pass.trigger("focus");
                });
            } else {
                $vipBox.slideUp(250);
                clearFieldState($pass.add($conf));
            }
            calculateBanquetQuote();
        });

        $showHide.on("click", function () {
            const makeVisible = $pass.prop("type") === "password";
            $pass.add($conf).prop("type", makeVisible ? "text" : "password");
            $(this).text(makeVisible ? "Hide Password" : "Show Password");
        });

        const $quoteText = make("p", "mb-0 fw-semibold text-secondary", "");
        const $resultBanner = make("div", "alert alert-success border-0 rounded-4 shadow-sm mt-3 mb-0 p-3")
            .attr({ id: "kamza-result-banner", "aria-live": "polite" })
            .hide();

        make("div", "mt-4 p-4 bg-white border-0 rounded-4 shadow-sm border-start border-4 border-danger")
            .append(make("h3", "h5 text-danger mb-2", "Live Visit & Banquet Budget Estimator"), $quoteText, $resultBanner)
            .insertAfter($form);

        function calculateBanquetQuote() {
            const guests = Math.max(0, Math.floor(Number($guests.val()) || 0));
            const reason = $reason.val();
            const seating = $seating.filter(":checked").val() || "indoor";

            let ratePerGuest = 5500;
            if (reason === "birthday") {
                ratePerGuest = 7500;
            } else if (reason === "business") {
                ratePerGuest = 6800;
            } else if (reason === "date") {
                ratePerGuest = 8200;
            }

            const subtotal = guests * ratePerGuest;
            const discount = $newsletter.prop("checked") ? Math.round(subtotal * 0.1) : 0;
            const breakdown = mp.calculateOrderBreakdown(subtotal, discount, 10);

            $quoteText.text(
                `Occasion: ${reason.toUpperCase()} · Zone: ${seating === "terrace" ? "Summer Terrace (max 25 guests)" : "Indoor Hall (max 50 guests)"} · ` +
                `Guests: ${guests} × ${formatMoney(ratePerGuest)} | Newsletter 10% Discount: −${formatMoney(discount)} | ` +
                `10% Service: ${formatMoney(breakdown.serviceFee)} | Estimated Total: ${formatMoney(breakdown.total)}.`
            );

            return breakdown;
        }

        function clearFieldState($fields) {
            $fields.removeClass("is-invalid is-valid").removeAttr("aria-invalid")
                .next(".invalid-feedback").empty();
        }

        function setFieldError($input, message) {
            const hasError = message !== "";

            $input.toggleClass("is-invalid", hasError)
                .toggleClass("is-valid", !hasError && $input.val().trim() !== "")
                .attr("aria-invalid", hasError ? "true" : "false");

            let $err = $input.next(".invalid-feedback");
            if ($err.length === 0) {
                $err = make("div", "invalid-feedback").attr("id", `${$input.attr("id")}-error`).insertAfter($input);
            }
            $err.text(message);
        }

        function validateContactField($input) {
            const isPassword = $input.is("#vip_password, #vip_password_confirm");

            const val = isPassword ? $input.val() : $input.val().trim();
            const isTerrace = $seating.filter(":checked").val() === "terrace";
            const guests = Number($guests.val()) || 0;
            let msg = "";

            switch ($input.attr("id")) {
                case "client_name":
                    if (val.length < 2 || val.length > 50) {
                        msg = "Please enter your full name (2 to 50 characters).";
                    }
                    break;
                case "client_email":
                    if (!mp.isValidEmail(val)) {
                        msg = "Please enter a valid email address (e.g. name@example.com).";
                    }
                    break;
                case "client_phone":
                    if (!mp.isValidPhone(val)) {
                        msg = "Please enter a valid phone number (10–15 digits).";
                    }
                    break;
                case "guest_count":
                    if (val === "" || !Number.isInteger(Number(val)) || guests < 1 || guests > (isTerrace ? 25 : 50)) {
                        msg = isTerrace
                            ? "Summer Terrace accommodates 1 to 25 guests. For 26–50 guests, select Indoor Hall."
                            : "Please enter a whole number of guests between 1 and 50.";
                    }
                    break;
                case "visit_date":
                    if (val === "") {
                        msg = "Please choose a visit date.";
                    } else if (val < todayStr) {
                        msg = "Past dates are not accepted. Please select today or a future date.";
                    }
                    break;
                case "client_message": {

                    const needsDetails = ($reason.val() === "birthday" || $reason.val() === "business") && guests >= 10;
                    if (needsDetails && val.length < 15) {
                        msg = "For Birthday or Business banquets of 10+ guests, please describe your menu/seating requests (at least 15 characters).";
                    }
                    break;
                }
                case "vip_password":
                    if ($newsletter.prop("checked") && !mp.isStrongPassword(val)) {
                        msg = "Password requires 8+ chars with uppercase, lowercase, digit, and special character.";
                    }
                    break;
                case "vip_password_confirm":
                    if ($newsletter.prop("checked") && (val === "" || val !== $pass.val())) {
                        msg = "Password confirmation does not match.";
                    }
                    break;
                default:
                    break;
            }

            setFieldError($input, msg);
            return msg === "";
        }

        const $fields = $name.add($email).add($phone).add($guests).add($date).add($message).add($pass).add($conf);
        const $textFields = $fields.filter(":not([type='password'])");

        let keepBannerOnReset = false;

        $fields.on("input", function () {
            const $field = $(this);
            if ($field.hasClass("is-invalid")) {
                validateContactField($field);
            }
            $resultBanner.stop(true, true).fadeOut(150);
            calculateBanquetQuote();
        });

        $fields.on("change", function () {
            const $field = $(this);
            if ($textFields.is($field)) {
                $field.val($field.val().trim());
            }
            validateContactField($field);

            if ($field.is($guests) && $message.val() !== "") {
                validateContactField($message);
            }
            if ($field.is($pass) && $conf.val() !== "") {
                validateContactField($conf);
            }
            calculateBanquetQuote();
        });

        $reason.on("change", function () {
            if ($message.val() !== "" || $message.hasClass("is-invalid")) {
                validateContactField($message);
            }
            calculateBanquetQuote();
        });

        $seating.on("change", function () {
            if ($guests.val() !== "" || $guests.hasClass("is-invalid")) {
                validateContactField($guests);
            }
            calculateBanquetQuote();
        });

        $form.on("submit", function (event) {

            event.preventDefault();

            $textFields.each(function () {
                $(this).val($(this).val().trim());
            });

            let invalidCount = 0;
            $fields.each(function () {
                if (!validateContactField($(this))) {
                    invalidCount += 1;
                }
            });

            if (invalidCount > 0) {
                $form.find(".is-invalid:first").trigger("focus");
                $resultBanner.stop(true, true).fadeOut(150);
                return;
            }

            const quote = calculateBanquetQuote();
            const ref = mp.createDemoReference("CNT");
            const seatLabel = $seating.filter(":checked").val() === "terrace" ? "Summer Terrace" : "Indoor Hall";
            const summary =
                `Demonstration Inquiry ${ref} prepared for ${$name.val()} (${$email.val()}, ${$phone.val()}): ` +
                `${$guests.val()} guest(s) on ${$date.val()} (${$reason.val()}, ${seatLabel}). ` +
                `Estimated budget: ${formatMoney(quote.total)}. ` +
                "Note: This is a front-end demonstration and no real data was sent to submit_handler.php or any server.";

            keepBannerOnReset = true;
            $form.trigger("reset");

            $resultBanner.stop(true, true).text(summary).fadeIn(400);
        });

        $form.on("reset", function () {
            const keepBanner = keepBannerOnReset;
            keepBannerOnReset = false;

            window.setTimeout(function () {
                clearFieldState($fields);
                $vipBox.slideUp(200);
                if (!keepBanner) {
                    $resultBanner.stop(true, true).fadeOut(150);
                }
                calculateBanquetQuote();
            }, 0);
        });

        calculateBanquetQuote();
    }

    function initScrollTop() {
        $(".scroll-to-top").on("click", function (event) {

            event.preventDefault();
            $("html, body").stop(true).animate({ scrollTop: 0 }, 400);
        });
    }

    initExplorer();
    initContactsForm();
    initScrollTop();
});
