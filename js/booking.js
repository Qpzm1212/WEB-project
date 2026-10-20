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

    // Reusable Function 3: Render a single table card via DOM methods and classList
    function createTableCard(tableItem) {
        const col = createElement("div", "col-12 col-md-6 col-lg-3");
        const isSelected = tableItem.id === selectedTableId;
        const card = createElement("div", "card h-100 shadow-sm");
        card.classList.toggle("border-danger", isSelected);
        card.classList.toggle("border-2", isSelected);
        card.classList.toggle("bg-white", isSelected);

        const body = createElement("div", "card-body d-flex flex-column");

        const topRow = createElement("div", "d-flex justify-content-between align-items-start mb-2");
        const title = createElement("h3", "h6 card-title fw-bold mb-0", tableItem.name);
        const badgeClass = tableItem.hall === "vip" ? "badge text-bg-danger" : "badge text-bg-dark";
        const badge = createElement("span", badgeClass, tableItem.hallLabel);
        topRow.append(title, badge);

        const featureText = createElement("p", "card-text small text-muted flex-grow-1", tableItem.feature);
        const metaList = createElement("ul", "list-unstyled small mb-3");
        const capItem = createElement("li", "", `Capacity: ${tableItem.minGuests}–${tableItem.capacity} guests`);
        const depLabel = tableItem.depositPerGuest > 0
            ? `${formatMoney(tableItem.depositPerGuest)} / guest`
            : "0 ₸ (No deposit under 10 guests)";
        const depItem = createElement("li", "fw-semibold", `Deposit: ${depLabel}`);
        metaList.append(capItem, depItem);

        const selectBtn = createElement(
            "button",
            "btn btn-sm w-100",
            isSelected ? "Selected for Booking" : "Select This Table"
        );
        selectBtn.classList.add(isSelected ? "btn-danger" : "btn-outline-danger");
        selectBtn.type = "button";
        selectBtn.dataset.tableId = tableItem.id;

        body.append(topRow, featureText, metaList, selectBtn);
        card.append(body);
        col.append(card);
        return col;
    }

    // Build Interactive Table Explorer Section via DOM before the booking form
    const bookingSection = document.getElementById("booking-form-section");
    const explorerSection = createElement("section", "mb-5 p-4 bg-light border rounded shadow-sm");
    explorerSection.id = "table-explorer-section";

    const explorerHeader = createElement("div", "d-flex flex-wrap justify-content-between align-items-center mb-3");
    const explorerTitle = createElement("h2", "h4 text-danger mb-0", "Interactive Table & Zone Explorer");
    const randomTableBtn = createElement("button", "btn btn-sm btn-outline-danger", "Recommend Random Table");
    randomTableBtn.type = "button";
    explorerHeader.append(explorerTitle, randomTableBtn);

    const filterRow = createElement("div", "row g-2 mb-3");
    const searchCol = createElement("div", "col-12 col-md-4");
    const searchInput = createElement("input", "form-control");
    searchInput.type = "search";
    searchInput.placeholder = "Search by zone or feature...";
    searchInput.setAttribute("aria-label", "Search tables");
    searchCol.append(searchInput);

    const hallCol = createElement("div", "col-6 col-md-3");
    const hallSelect = createElement("select", "form-select");
    hallSelect.setAttribute("aria-label", "Filter by hall");
    [
        { value: "all", label: "All Halls (Main & VIP)" },
        { value: "main", label: "Main Hall Only" },
        { value: "vip", label: "VIP Room Only" }
    ].forEach(function (opt) {
        const option = createElement("option", "", opt.label);
        option.value = opt.value;
        hallSelect.append(option);
    });
    hallCol.append(hallSelect);

    const capCol = createElement("div", "col-6 col-md-2");
    const capInput = createElement("input", "form-control");
    capInput.type = "number";
    capInput.min = "1";
    capInput.max = "80";
    capInput.placeholder = "Min guests";
    capInput.setAttribute("aria-label", "Minimum guest capacity");
    capCol.append(capInput);

    const sortCol = createElement("div", "col-6 col-md-2");
    const sortSelect = createElement("select", "form-select");
    sortSelect.setAttribute("aria-label", "Sort tables");
    [
        { value: "default", label: "Default Order" },
        { value: "capacity-asc", label: "Capacity: Small to Large" },
        { value: "capacity-desc", label: "Capacity: Large to Small" },
        { value: "deposit-asc", label: "Deposit: Low to High" }
    ].forEach(function (opt) {
        const option = createElement("option", "", opt.label);
        option.value = opt.value;
        sortSelect.append(option);
    });
    sortCol.append(sortSelect);

    const resetCol = createElement("div", "col-6 col-md-1 d-grid");
    const resetFilterBtn = createElement("button", "btn btn-outline-secondary", "Reset");
    resetFilterBtn.type = "button";
    resetCol.append(resetFilterBtn);

    filterRow.append(searchCol, hallCol, capCol, sortCol, resetCol);

    const filterStatus = createElement("p", "small text-muted mb-3");
    filterStatus.setAttribute("aria-live", "polite");
    const tableGrid = createElement("div", "row g-3");

    explorerSection.append(explorerHeader, filterRow, filterStatus, tableGrid);
    if (bookingSection) {
        bookingSection.before(explorerSection);
    }

    function renderTableExplorer() {
        const filtered = filterTables(searchInput.value, hallSelect.value, capInput.value);
        const sorted = sortTables(filtered, sortSelect.value);
        tableGrid.replaceChildren();

        filterStatus.textContent = `Showing ${sorted.length} of ${restaurantTables.length} tables/zones.`;

        if (sorted.length === 0) {
            const emptyCol = createElement("div", "col-12");
            const emptyAlert = createElement(
                "div",
                "alert alert-warning mb-0",
                "No tables match your filter criteria. Try lowering the guest count or clicking Reset."
            );
            emptyCol.append(emptyAlert);
            tableGrid.append(emptyCol);
            return;
        }

        for (let i = 0; i < sorted.length; i += 1) {
            tableGrid.append(createTableCard(sorted[i]));
        }
    }

    // Build Live Booking Summary & Cost Calculator panel after the form
    const summary = createElement("section", "mt-4 p-4 bg-white border rounded shadow-sm");
    const summaryTitle = createElement("h3", "h5 text-danger mb-2", "Live Booking & Deposit Calculator");
    const summaryText = createElement(
        "p",
        "mb-2",
        "Choose a hall, guest count, date, and time to calculate tables and required deposit."
    );
    const quoteList = createElement("ul", "list-group list-group-flush mb-2 small");
    const confirmation = createElement("div", "alert alert-success mt-3 mb-0 d-none");

    summary.setAttribute("aria-live", "polite");
    summary.append(summaryTitle, summaryText, quoteList, confirmation);
    form.after(summary);

    // Reusable Function 4: Update live booking summary and financial calculation
    function updateSummary() {
        const selectedHallInput = form.querySelector('input[name="hall"]:checked');
        const hallValue = selectedHallInput ? selectedHallInput.value : "main";
        const guestCount = Number(guestsInput.value) || 0;
        const quote = window.meatPointBooking
            ? window.meatPointBooking.calculateBookingQuote(hallValue, guestCount)
            : {
                hallName: hallValue === "vip" ? "VIP Hall" : "Main Hall",
                guests: guestCount,
                tablesNeeded: Math.ceil(guestCount / 4),
                baseDeposit: 0,
                serviceFee: 0,
                totalPrepayment: 0
            };

        const bookingDate = dateInput.value || "Date not selected";
        const bookingTime = timeInput.value || "Time not selected";
        const selectedTable = restaurantTables.find(function (item) {
            return item.id === selectedTableId;
        });
        const tableLabel = selectedTable ? ` · Table: ${selectedTable.name}` : "";

        summaryText.textContent =
            `${quote.hallName}${tableLabel} · ${quote.guests || "0"} guest(s) · ${bookingDate} at ${bookingTime}.`;

        quoteList.replaceChildren();
        const items = [
            `Estimated Tables / Suites Reserved: ${quote.tablesNeeded || 0}`,
            `Advance Deposit Required: ${formatMoney(quote.baseDeposit)}`,
            `Estimated 10% Service Charge on Deposit: ${formatMoney(quote.serviceFee)}`,
            `Total Advance Prepayment Due: ${formatMoney(quote.totalPrepayment)}`
        ];

        for (let i = 0; i < items.length; i += 1) {
            const li = createElement(
                "li",
                i === items.length - 1 ? "list-group-item fw-bold text-danger px-0" : "list-group-item px-0",
                items[i]
            );
            quoteList.append(li);
        }
    }

    // Event listeners for Table Explorer
    searchInput.addEventListener("input", renderTableExplorer);
    hallSelect.addEventListener("change", renderTableExplorer);
    capInput.addEventListener("input", renderTableExplorer);
    sortSelect.addEventListener("change", renderTableExplorer);

    resetFilterBtn.addEventListener("click", function () {
        searchInput.value = "";
        hallSelect.value = "all";
        capInput.value = "";
        sortSelect.value = "default";
        selectedTableId = "";
        renderTableExplorer();
        updateSummary();
    });

    randomTableBtn.addEventListener("click", function () {
        const randomIndex = Math.floor(Math.random() * restaurantTables.length);
        const chosen = restaurantTables[randomIndex];
        selectedTableId = chosen.id;
        const targetRadio = form.querySelector(`input[name="hall"][value="${chosen.hall}"]`);
        if (targetRadio) {
            targetRadio.checked = true;
            if (window.meatPointBooking) {
                window.meatPointBooking.updateHallCapacityHelp();
            }
        }
        if (!guestsInput.value || Number(guestsInput.value) > chosen.capacity) {
            guestsInput.value = String(Math.min(chosen.capacity, Math.max(2, chosen.minGuests)));
        }
        renderTableExplorer();
        updateSummary();
    });

    tableGrid.addEventListener("click", function (event) {
        const btn = event.target.closest("button[data-table-id]");
        if (!btn) {
            return;
        }
        const chosen = restaurantTables.find(function (t) {
            return t.id === btn.dataset.tableId;
        });
        if (!chosen) {
            return;
        }
        selectedTableId = chosen.id;
        const targetRadio = form.querySelector(`input[name="hall"][value="${chosen.hall}"]`);
        if (targetRadio) {
            targetRadio.checked = true;
            if (window.meatPointBooking) {
                window.meatPointBooking.updateHallCapacityHelp();
            }
        }
        if (!guestsInput.value || Number(guestsInput.value) > chosen.capacity) {
            guestsInput.value = String(Math.max(2, chosen.minGuests));
            if (window.meatPointBooking) {
                window.meatPointBooking.validateInput(guestsInput);
            }
        }
        confirmation.classList.add("d-none");
        renderTableExplorer();
        updateSummary();
        form.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    [nameInput, phoneInput, guestsInput, dateInput, timeInput].forEach(function (input) {
        if (!input) {
            return;
        }
        ["input", "change"].forEach(function (eventName) {
            input.addEventListener(eventName, function () {
                confirmation.classList.add("d-none");
                updateSummary();
            });
        });
    });

    hallInputs.forEach(function (input) {
        input.addEventListener("change", function () {
            confirmation.classList.add("d-none");
            updateSummary();
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const isValid = window.meatPointBooking
            ? window.meatPointBooking.validateAllBookingFields()
            : !form.querySelector(".is-invalid");

        const firstInvalidField = form.querySelector(".is-invalid");
        if (!isValid || firstInvalidField) {
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
            confirmation.classList.add("d-none");
            return;
        }

        const selectedHallInput = form.querySelector('input[name="hall"]:checked');
        const hallValue = selectedHallInput ? selectedHallInput.value : "main";
        const quote = window.meatPointBooking.calculateBookingQuote(hallValue, guestsInput.value);
        const selectedTable = restaurantTables.find(function (item) {
            return item.id === selectedTableId;
        });
        const tableNote = selectedTable ? ` (${selectedTable.name})` : "";
        const refCode = window.meatPoint.createDemoReference("MP");

        confirmation.textContent =
            `Demonstration booking request ${refCode} confirmed for ${nameInput.value.trim()} (${phoneInput.value.trim()}): ` +
            `${quote.hallName}${tableNote}, ${quote.guests} guest(s), ${quote.tablesNeeded} table(s), ` +
            `${dateInput.value} at ${timeInput.value}. Required advance prepayment: ${formatMoney(quote.totalPrepayment)}. ` +
            "Note: This is a front-end demonstration and no real data was sent to a server.";
        confirmation.classList.remove("d-none");
    });

    form.addEventListener("reset", function () {
        window.setTimeout(function () {
            selectedTableId = "";
            confirmation.classList.add("d-none");
            renderTableExplorer();
            updateSummary();
        }, 0);
    });

    renderTableExplorer();
    updateSummary();
}());
