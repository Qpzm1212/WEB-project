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

    // Dynamically inject VIP Pass Password & Confirm Password + Show/Hide Password button via DOM
    const passwordRow = createElement("div", "col-12");
    const passBox = createElement("div", "p-3 bg-white border rounded");
    const passHeading = createElement("h3", "h6 text-danger mb-2", "Guest Ticket Account Password (Required)");
    const passHelp = createElement(
        "p",
        "small text-muted mb-2",
        "Create a password to manage your event pass (min 8 chars, uppercase, lowercase, digit, and special symbol)."
    );

    const passInnerRow = createElement("div", "row g-2 align-items-start");
    const passCol1 = createElement("div", "col-12 col-md-5");
    const passLabel1 = createElement("label", "form-label small", "Ticket Password");
    passLabel1.setAttribute("for", "event-password");
    const passwordInput = createElement("input", "form-control");
    passwordInput.type = "password";
    passwordInput.id = "event-password";
    passwordInput.placeholder = "e.g. MeatPoint#2026";
    passCol1.append(passLabel1, passwordInput);

    const passCol2 = createElement("div", "col-12 col-md-5");
    const passLabel2 = createElement("label", "form-label small", "Confirm Password");
    passLabel2.setAttribute("for", "event-password-confirm");
    const passwordConfirmInput = createElement("input", "form-control");
    passwordConfirmInput.type = "password";
    passwordConfirmInput.id = "event-password-confirm";
    passwordConfirmInput.placeholder = "Repeat password";
    passCol2.append(passLabel2, passwordConfirmInput);

    const passCol3 = createElement("div", "col-12 col-md-2 d-grid");
    const passToggleLabel = createElement("span", "form-label small d-none d-md-block", "Visibility");
    const togglePassBtn = createElement("button", "btn btn-outline-secondary", "Show Password");
    togglePassBtn.type = "button";
    passCol3.append(passToggleLabel, togglePassBtn);

    passInnerRow.append(passCol1, passCol2, passCol3);
    passBox.append(passHeading, passHelp, passInnerRow);
    passwordRow.append(passBox);

    const termsRow = termsCheckbox.closest(".col-12");
    if (termsRow) {
        termsRow.before(passwordRow);
    }

    togglePassBtn.addEventListener("click", function () {
        const isHidden = passwordInput.type === "password";
        passwordInput.type = isHidden ? "text" : "password";
        passwordConfirmInput.type = isHidden ? "text" : "password";
        togglePassBtn.textContent = isHidden ? "Hide Password" : "Show Password";
        togglePassBtn.classList.toggle("btn-secondary", isHidden);
        togglePassBtn.classList.toggle("btn-outline-secondary", !isHidden);
    });

    // Reusable Function 1: Filter music events by search query and day type using a for loop
    function filterEvents(query, dayFilter) {
        const cleanQuery = normalizeText(query);
        const cleanDay = dayFilter || "all";
        const matched = [];

        for (let i = 0; i < musicEvents.length; i += 1) {
            const ev = musicEvents[i];
            const searchable = normalizeText(`${ev.title} ${ev.genre} ${ev.dayLabel} ${ev.description}`);
            const matchesQuery = cleanQuery === "" || searchable.includes(cleanQuery);
            const matchesDay = cleanDay === "all" || ev.eventType === cleanDay;

            if (matchesQuery && matchesDay) {
                matched.push(ev);
            }
        }
        return matched;
    }

    // Reusable Function 2: Calculate event ticket & seating cost
    function calculateEventCost(eventType, guestCount, seatingZone) {
        const cleanGuests = Math.max(0, Math.floor(Number(guestCount) || 0));
        const selectedCard = musicEvents.find(function (e) {
            return e.id === selectedEventCardId;
        });
        const baseCover = selectedCard
            ? selectedCard.coverCharge
            : eventType === "saturday"
                ? 4000
                : 3000;
        const stageSurcharge = seatingZone === "stage" ? 2000 : 0;
        const pricePerPerson = baseCover + stageSurcharge;
        const rawSubtotal = cleanGuests * pricePerPerson;
        const groupDiscount = cleanGuests >= 6 ? Math.round(rawSubtotal * 0.1) : 0;
        const totalCost = rawSubtotal - groupDiscount;

        return {
            guests: cleanGuests,
            pricePerPerson: pricePerPerson,
            stageSurcharge: stageSurcharge,
            rawSubtotal: rawSubtotal,
            groupDiscount: groupDiscount,
            totalCost: totalCost
        };
    }

    // Reusable Function 3: Check if a YYYY-MM-DD date string matches required Friday (5) or Saturday (6)
    function checkDateMatchesEventDay(dateString, eventType) {
        if (!dateString || !eventType) {
            return { valid: true, dayName: "" };
        }
        const parts = dateString.split("-").map(Number);
        const utcDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
        const dayOfWeek = utcDate.getUTCDay();
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = dayNames[dayOfWeek] || "";

        if (eventType === "friday" && dayOfWeek !== 5) {
            return { valid: false, dayName: dayName, expected: "Friday" };
        }
        if (eventType === "saturday" && dayOfWeek !== 6) {
            return { valid: false, dayName: dayName, expected: "Saturday" };
        }
        return { valid: true, dayName: dayName, expected: dayName };
    }

    // Reusable Function 4: Render a single event card via DOM
    function createEventCard(ev) {
        const col = createElement("div", "col-12 col-md-6");
        const isSelected = ev.id === selectedEventCardId;
        const card = createElement(
            "div",
            `card h-100 shadow-sm ${isSelected ? "border-danger border-2" : ""}`
        );
        const body = createElement("div", "card-body d-flex flex-column");

        const topRow = createElement("div", "d-flex justify-content-between align-items-start gap-2 mb-2");
        const title = createElement("h3", "h6 card-title fw-bold mb-0", ev.title);
        const badge = createElement(
            "span",
            ev.eventType === "friday" ? "badge text-bg-dark" : "badge text-bg-danger",
            `${ev.dayLabel} · ${ev.genre}`
        );
        topRow.append(title, badge);

        const desc = createElement("p", "card-text small text-muted flex-grow-1", ev.description);
        const meta = createElement(
            "p",
            "small fw-semibold mb-2",
            `${ev.timeWindow} · Cover: ${formatMoney(ev.coverCharge)}/guest · ${ev.seatsLeft} seats left`
        );

        const chooseBtn = createElement(
            "button",
            isSelected ? "btn btn-sm btn-danger w-100" : "btn btn-sm btn-outline-danger w-100",
            isSelected ? "Selected for Registration" : "Select This Program"
        );
        chooseBtn.type = "button";
        chooseBtn.dataset.eventCardId = ev.id;

        body.append(topRow, desc, meta, chooseBtn);
        card.append(body);
        col.append(card);
        return col;
    }

    // Build Interactive Event Catalog Panel inside left column
    const leftColumn = registrationSection.previousElementSibling;
    const scheduleExplorer = createElement("div", "p-3 bg-light border rounded shadow-sm mt-4");
    const explorerHeader = createElement("div", "d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2");
    const explorerTitle = createElement("h3", "h5 text-danger mb-0", "Interactive Weekend Lineup Explorer");
    const randomSpotlightBtn = createElement("button", "btn btn-sm btn-outline-danger", "Random Concert Pick");
    randomSpotlightBtn.type = "button";
    explorerHeader.append(explorerTitle, randomSpotlightBtn);

    const filterRow = createElement("div", "row g-2 mb-2");
    const searchCol = createElement("div", "col-12 col-sm-6");
    const searchInput = createElement("input", "form-control form-control-sm");
    searchInput.type = "search";
    searchInput.placeholder = "Search artist, instrument, or genre...";
    searchInput.setAttribute("aria-label", "Search music events");
    searchCol.append(searchInput);

    const dayCol = createElement("div", "col-8 col-sm-4");
    const daySelect = createElement("select", "form-select form-select-sm");
    daySelect.setAttribute("aria-label", "Filter events by day");
    [
        { value: "all", label: "All Weekend Nights" },
        { value: "friday", label: "Fridays (Smooth Jazz)" },
        { value: "saturday", label: "Saturdays (Turkish Tunes)" }
    ].forEach(function (opt) {
        const option = createElement("option", "", opt.label);
        option.value = opt.value;
        daySelect.append(option);
    });
    dayCol.append(daySelect);

    const resetCol = createElement("div", "col-4 col-sm-2 d-grid");
    const resetEventsBtn = createElement("button", "btn btn-sm btn-outline-secondary", "Reset");
    resetEventsBtn.type = "button";
    resetCol.append(resetEventsBtn);

    filterRow.append(searchCol, dayCol, resetCol);
    const explorerStatus = createElement("p", "small text-muted mb-2");
    explorerStatus.setAttribute("aria-live", "polite");
    const eventCardsGrid = createElement("div", "row g-2");

    scheduleExplorer.append(explorerHeader, filterRow, explorerStatus, eventCardsGrid);
    if (leftColumn) {
        leftColumn.append(scheduleExplorer);
    }

    // Build Live Event Cost Calculator & Confirmation Panel below the form
    const calcPanel = createElement("div", "mt-3 p-3 bg-white border rounded shadow-sm");
    const calcTitle = createElement("h3", "h6 text-danger fw-bold mb-2", "Live Event Cost & Seating Calculator");
    const calcSummary = createElement("p", "small mb-1", "");
    const calcTotalLine = createElement("p", "fw-bold text-danger mb-0", "");
    const confirmationAlert = createElement("div", "alert alert-success mt-3 mb-0 d-none");
    confirmationAlert.setAttribute("aria-live", "polite");

    calcPanel.append(calcTitle, calcSummary, calcTotalLine, confirmationAlert);
    form.after(calcPanel);

    function renderEventExplorer() {
        const filtered = filterEvents(searchInput.value, daySelect.value);
        eventCardsGrid.replaceChildren();

        let totalSeats = 0;
        for (let i = 0; i < filtered.length; i += 1) {
            totalSeats += filtered[i].seatsLeft;
        }

        explorerStatus.textContent =
            `Showing ${filtered.length} of ${musicEvents.length} live programs (${totalSeats} total seats available).`;

        if (filtered.length === 0) {
            const emptyCol = createElement("div", "col-12");
            emptyCol.append(
                createElement(
                    "div",
                    "alert alert-warning py-2 mb-0 small",
                    "No live music programs match your search. Click Reset to view all weekend shows."
                )
            );
            eventCardsGrid.append(emptyCol);
            return;
        }

        for (let i = 0; i < filtered.length; i += 1) {
            eventCardsGrid.append(createEventCard(filtered[i]));
        }
    }

    function updateCalculatorDisplay() {
        const checkedSeat = form.querySelector('input[name="seating"]:checked');
        const seatValue = checkedSeat ? checkedSeat.value : "far";
        const calc = calculateEventCost(eventSelect.value || "friday", guestsInput.value, seatValue);
        const chosenProgram = musicEvents.find(function (e) {
            return e.id === selectedEventCardId;
        });

        calcSummary.textContent =
            `Program: ${chosenProgram ? chosenProgram.title : "Weekend Live Music"} · ` +
            `Zone: ${seatValue === "stage" ? "Near the Stage (+2,000 ₸/guest)" : "Quiet Corner (+0 ₸)"} · ` +
            `Guests: ${calc.guests} × ${formatMoney(calc.pricePerPerson)} ` +
            `(Group 6+ discount: −${formatMoney(calc.groupDiscount)})`;
        calcTotalLine.textContent = `Estimated Event Reservation Total: ${formatMoney(calc.totalCost)}`;
    }

    function setError(element, message) {
        if (!element) {
            return;
        }
        const hasError = message !== "";
        element.classList.toggle("is-invalid", hasError);
        if (element.type !== "checkbox" && element.type !== "radio") {
            element.classList.toggle("is-valid", !hasError && element.value.trim() !== "");
        }
        element.setAttribute("aria-invalid", hasError ? "true" : "false");

        const container = element.type === "radio"
            ? element.closest(".col-12, .col-md-6")
            : element.parentElement;
        if (!container) {
            return;
        }

        const errId = `${element.id || element.name}-error`;
        let errEl = document.getElementById(errId);
        if (!errEl) {
            errEl = createElement("div", "invalid-feedback d-block");
            errEl.id = errId;
            container.append(errEl);
        }
        errEl.textContent = hasError ? message : "";
        errEl.classList.toggle("d-none", !hasError);
    }

    function validateField(field) {
        let msg = "";
        const val = field.value ? field.value.trim() : "";

        if (field === nameInput) {
            if (val.length < 2 || val.length > 60) {
                msg = "Please enter your full name (2 to 60 characters).";
            }
        } else if (field === emailInput) {
            if (!window.meatPoint.isValidEmail(val)) {
                msg = "Please enter a valid email address (e.g. guest@example.com).";
            }
        } else if (field === phoneInput) {
            if (!window.meatPoint.isValidPhone(val)) {
                msg = "Please enter a valid phone number (10–15 digits).";
            }
        } else if (field === guestsInput) {
            const count = Number(val);
            const checkedSeat = form.querySelector('input[name="seating"]:checked');
            const maxForZone = checkedSeat && checkedSeat.value === "stage" ? 12 : 20;
            if (!Number.isInteger(count) || count < 1 || count > maxForZone) {
                msg = `Enter a whole guest count between 1 and ${maxForZone} for the selected seating area.`;
            }
        } else if (field === dateInput) {
            if (val === "") {
                msg = "Please select an event date.";
            } else if (val < todayStr) {
                msg = "Past dates cannot be selected. Choose today or a future weekend date.";
            } else if (eventSelect.value !== "") {
                const dayCheck = checkDateMatchesEventDay(val, eventSelect.value);
                if (!dayCheck.valid) {
                    msg = `Selected date is a ${dayCheck.dayName}, but this event takes place on ${dayCheck.expected}. Please pick a ${dayCheck.expected} date.`;
                }
            }
        } else if (field === eventSelect) {
            if (val === "") {
                msg = "Please choose an event type (Smooth Jazz Friday or Turkish Tunes Saturday).";
            }
        } else if (field === seatingRadios[0]) {
            const checked = form.querySelector('input[name="seating"]:checked');
            if (!checked) {
                msg = "Please select a seating preference (Near the Stage or Quiet Corner).";
            }
        } else if (field === passwordInput) {
            if (!window.meatPoint.isStrongPassword(passwordInput.value)) {
                msg = "Password must be at least 8 characters and include uppercase, lowercase, a digit, and a special character.";
            }
        } else if (field === passwordConfirmInput) {
            if (passwordConfirmInput.value === "" || passwordConfirmInput.value !== passwordInput.value) {
                msg = "Password confirmation does not match the password above.";
            }
        } else if (field === termsCheckbox) {
            if (!termsCheckbox.checked) {
                msg = "You must agree to the reservation rules and conditions.";
            }
        }

        setError(field, msg);
        return msg === "";
    }

    // Explorer event listeners
    searchInput.addEventListener("input", renderEventExplorer);
    daySelect.addEventListener("change", renderEventExplorer);

    resetEventsBtn.addEventListener("click", function () {
        searchInput.value = "";
        daySelect.value = "all";
        renderEventExplorer();
    });

    randomSpotlightBtn.addEventListener("click", function () {
        const idx = Math.floor(Math.random() * musicEvents.length);
        const picked = musicEvents[idx];
        selectedEventCardId = picked.id;
        eventSelect.value = picked.eventType;
        validateField(eventSelect);
        renderEventExplorer();
        updateCalculatorDisplay();
    });

    eventCardsGrid.addEventListener("click", function (event) {
        const btn = event.target.closest("button[data-event-card-id]");
        if (!btn) {
            return;
        }
        const chosen = musicEvents.find(function (e) {
            return e.id === btn.dataset.eventCardId;
        });
        if (!chosen) {
            return;
        }
        selectedEventCardId = chosen.id;
        eventSelect.value = chosen.eventType;
        validateField(eventSelect);
        if (dateInput.value !== "") {
            validateField(dateInput);
        }
        renderEventExplorer();
        updateCalculatorDisplay();
        form.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    form.noValidate = true;

    const allValidatedFields = [
        nameInput,
        emailInput,
        phoneInput,
        guestsInput,
        dateInput,
        seatingRadios[0],
        eventSelect,
        passwordInput,
        passwordConfirmInput,
        termsCheckbox
    ];

    allValidatedFields.forEach(function (field) {
        if (!field) {
            return;
        }
        ["input", "change"].forEach(function (evtName) {
            field.addEventListener(evtName, function () {
                validateField(field);
                if (field === eventSelect && dateInput.value !== "") {
                    validateField(dateInput);
                }
                if (field === passwordInput && passwordConfirmInput.value !== "") {
                    validateField(passwordConfirmInput);
                }
                confirmationAlert.classList.add("d-none");
                updateCalculatorDisplay();
            });
        });
    });

    seatingRadios.forEach(function (radio) {
        radio.addEventListener("change", function () {
            validateField(seatingRadios[0]);
            if (guestsInput.value !== "") {
                validateField(guestsInput);
            }
            updateCalculatorDisplay();
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const invalidFields = [];

        for (let i = 0; i < allValidatedFields.length; i += 1) {
            const f = allValidatedFields[i];
            if (f && !validateField(f)) {
                invalidFields.push(f);
            }
        }

        if (invalidFields.length > 0) {
            invalidFields[0].focus();
            confirmationAlert.classList.add("d-none");
            return;
        }

        const checkedSeat = form.querySelector('input[name="seating"]:checked');
        const seatLabel = checkedSeat && checkedSeat.value === "stage" ? "Near the Stage" : "Quiet Corner";
        const calc = calculateEventCost(eventSelect.value, guestsInput.value, checkedSeat ? checkedSeat.value : "far");
        const ticketRef = window.meatPoint.createDemoReference("EVT");
        const chosenProgram = musicEvents.find(function (e) {
            return e.id === selectedEventCardId;
        });

        confirmationAlert.textContent =
            `Demonstration Event Ticket ${ticketRef} registered for ${nameInput.value.trim()} (${emailInput.value.trim()}, ${phoneInput.value.trim()}): ` +
            `${chosenProgram ? chosenProgram.title : eventSelect.value} on ${dateInput.value}, ` +
            `${calc.guests} guest(s) in ${seatLabel}. Total reservation cost: ${formatMoney(calc.totalCost)}. ` +
            " VIP pass password verified. Note: This is a front-end demonstration and no real data was sent to a server.";
        confirmationAlert.classList.remove("d-none");
    });

    form.addEventListener("reset", function () {
        window.setTimeout(function () {
            for (let i = 0; i < allValidatedFields.length; i += 1) {
                const f = allValidatedFields[i];
                if (f) {
                    f.classList.remove("is-invalid", "is-valid");
                    setError(f, "");
                }
            }
            confirmationAlert.classList.add("d-none");
            updateCalculatorDisplay();
        }, 0);
    });

    renderEventExplorer();
    updateCalculatorDisplay();
}());
