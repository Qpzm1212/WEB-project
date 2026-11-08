"use strict";

function oldFeature1_cardList(createElement, formatMoney, filterHighlights, restaurantHighlights,
    cardsGrid, statusText, searchInput, catSelect, sortSelect, currentSpotlightId) {

    function createHighlightCard(item, spotlightId) {
        const col = createElement("div", "col-12 col-md-6 col-lg-3");
        const isSpotlight = item.id === spotlightId;
        const card = createElement(
            "div",
            `card h-100 shadow-sm ${isSpotlight ? "border-danger border-2" : ""}`
        );
        const body = createElement("div", "card-body d-flex flex-column");

        const topRow = createElement("div", "d-flex justify-content-between align-items-center mb-2");
        const catBadge = createElement("span", "badge text-bg-danger", item.category);
        const yearBadge = createElement("span", "badge text-bg-dark", String(item.year));
        topRow.append(catBadge, yearBadge);

        const title = createElement("h3", "h6 card-title fw-bold", item.title);
        const metric = createElement("p", "small text-danger fw-semibold mb-2", item.metric);
        const desc = createElement("p", "card-text small text-muted flex-grow-1", item.description);
        const priceLine = createElement(
            "p",
            "small fw-bold mb-0 mt-2",
            item.pricePerGuest > 0 ? `Set price: ${formatMoney(item.pricePerGuest)} / guest` : "Included in Restaurant Experience"
        );

        body.append(topRow, title, metric, desc, priceLine);
        card.append(body);
        col.append(card);
        return col;
    }

        function renderExplorer() {
            const filtered = filterHighlights(searchInput.value, catSelect.value, sortSelect.value);
            cardsGrid.replaceChildren();

            statusText.textContent = `Showing ${filtered.length} of ${restaurantHighlights.length} restaurant highlights.`;

            if (filtered.length === 0) {
                const emptyCol = createElement("div", "col-12");
                emptyCol.append(
                    createElement(
                        "div",
                        "alert alert-warning mb-0",
                        "No items match your search. Click Reset to view all highlights and milestones."
                    )
                );
                cardsGrid.append(emptyCol);
                return;
            }

            for (let i = 0; i < filtered.length; i += 1) {
                cardsGrid.append(createHighlightCard(filtered[i], currentSpotlightId));
            }
        }

    renderExplorer();
}

function oldFeature2_showHide(newsletterCheck, vipBox, passInput, confInput, showHideBtn) {
        if (newsletterCheck) {
            newsletterCheck.closest(".form-check").after(vipBox);
            newsletterCheck.addEventListener("change", function () {
                vipBox.classList.toggle("d-none", !newsletterCheck.checked);
            });
        }

        showHideBtn.addEventListener("click", function () {
            const isHidden = passInput.type === "password";
            passInput.type = isHidden ? "text" : "password";
            confInput.type = isHidden ? "text" : "password";
            showHideBtn.textContent = isHidden ? "Hide Password" : "Show Password";
        });
}

function oldFeature3_formValidation(window, form, nameInput, emailInput, phoneInput, guestsInput, dateInput,
    reasonSelect, messageInput, passInput, confInput, newsletterCheck, seatingRadios, todayStr,
    createElement, formatMoney, resultBanner, vipBox, calculateBanquetQuote) {
        function setFieldError(input, message) {
            const hasError = message !== "";
            input.classList.toggle("is-invalid", hasError);
            input.classList.toggle("is-valid", !hasError && input.value.trim() !== "");
            input.setAttribute("aria-invalid", hasError ? "true" : "false");

            const errId = `${input.id}-error`;
            let errEl = document.getElementById(errId);
            if (!errEl) {
                errEl = createElement("div", "invalid-feedback d-block");
                errEl.id = errId;
                input.after(errEl);
            }
            errEl.textContent = message;
            errEl.classList.toggle("d-none", !hasError);
        }

        function validateContactField(input) {
            let msg = "";
            const val = input.value.trim();
            const checkedSeat = form.querySelector('input[name="seating"]:checked');
            const isTerrace = checkedSeat && checkedSeat.value === "terrace";
            const guests = Number(guestsInput.value) || 0;

            if (input === nameInput) {
                if (val.length < 2 || val.length > 50) {
                    msg = "Please enter your full name (2 to 50 characters).";
                }
            } else if (input === emailInput) {
                if (!window.meatPoint.isValidEmail(val)) {
                    msg = "Please enter a valid email address (e.g. name@example.com).";
                }
            } else if (input === phoneInput) {
                if (!window.meatPoint.isValidPhone(val)) {
                    msg = "Please enter a valid phone number (10–15 digits).";
                }
            } else if (input === guestsInput) {
                const maxAllowed = isTerrace ? 25 : 50;
                if (val === "" || !Number.isInteger(Number(val)) || guests < 1 || guests > maxAllowed) {
                    msg = isTerrace
                        ? "Summer Terrace accommodates 1 to 25 guests. For 26–50 guests, select Indoor Hall."
                        : "Please enter a whole number of guests between 1 and 50.";
                }
            } else if (input === dateInput) {
                if (val === "") {
                    msg = "Please choose a visit date.";
                } else if (val < todayStr) {
                    msg = "Past dates are not accepted. Please select today or a future date.";
                }
            } else if (input === messageInput) {

                const requiresDetails = (reasonSelect.value === "birthday" || reasonSelect.value === "business") && guests >= 10;
                if (requiresDetails && val.length < 15) {
                    msg = "For Birthday or Business banquets of 10+ guests, please describe your menu/seating requests (at least 15 characters).";
                }
            } else if (input === passInput) {
                if (newsletterCheck.checked && !window.meatPoint.isStrongPassword(passInput.value)) {
                    msg = "Password requires 8+ chars with uppercase, lowercase, digit, and special character.";
                }
            } else if (input === confInput) {
                if (newsletterCheck.checked && (confInput.value === "" || confInput.value !== passInput.value)) {
                    msg = "Password confirmation does not match.";
                }
            }

            setFieldError(input, msg);
            return msg === "";
        }

        const fields = [nameInput, emailInput, phoneInput, guestsInput, dateInput, messageInput, passInput, confInput];

        fields.forEach(function (field) {
            if (!field) {
                return;
            }
            ["input", "change"].forEach(function (evt) {
                field.addEventListener(evt, function () {
                    validateContactField(field);
                    if (field === guestsInput && messageInput.value !== "") {
                        validateContactField(messageInput);
                    }
                    resultBanner.classList.add("d-none");
                    calculateBanquetQuote();
                });
            });
        });

        reasonSelect.addEventListener("change", function () {
            if (messageInput.value !== "" || messageInput.classList.contains("is-invalid")) {
                validateContactField(messageInput);
            }
            calculateBanquetQuote();
        });

        seatingRadios.forEach(function (radio) {
            radio.addEventListener("change", function () {
                if (guestsInput.value !== "" || guestsInput.classList.contains("is-invalid")) {
                    validateContactField(guestsInput);
                }
                calculateBanquetQuote();
            });
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const invalid = [];

            for (let i = 0; i < fields.length; i += 1) {
                if (fields[i] && !validateContactField(fields[i])) {
                    invalid.push(fields[i]);
                }
            }

            if (invalid.length > 0) {
                invalid[0].focus();
                resultBanner.classList.add("d-none");
                return;
            }

            const quote = calculateBanquetQuote();
            const ref = window.meatPoint.createDemoReference("CNT");
            const checkedSeat = form.querySelector('input[name="seating"]:checked');
            const seatLabel = checkedSeat && checkedSeat.value === "terrace" ? "Summer Terrace" : "Indoor Hall";

            resultBanner.textContent =
                `Demonstration Inquiry ${ref} prepared for ${nameInput.value.trim()} (${emailInput.value.trim()}, ${phoneInput.value.trim()}): ` +
                `${guestsInput.value} guest(s) on ${dateInput.value} (${reasonSelect.value}, ${seatLabel}). ` +
                `Estimated budget: ${formatMoney(quote.total)}. ` +
                "Note: This is a front-end demonstration and no real data was sent to submit_handler.php or any server.";
            resultBanner.classList.remove("d-none");
        });

        form.addEventListener("reset", function () {
            window.setTimeout(function () {
                for (let i = 0; i < fields.length; i += 1) {
                    if (fields[i]) {
                        fields[i].classList.remove("is-invalid", "is-valid");
                        setFieldError(fields[i], "");
                    }
                }
                vipBox.classList.add("d-none");
                resultBanner.classList.add("d-none");
                calculateBanquetQuote();
            }, 0);
        });
}
