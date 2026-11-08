# Meat Point Astana — Halal Turkish Restaurant Website

> **Endterm Project — Front-End Web Development (Weeks 6–10)**  
> **Course:** Web Development / Client-Side Scripting  
> **Git Tag:** `endterm`  
> **Repository:** [https://github.com/Qpzm1212/WEB-project](https://github.com/Qpzm1212/WEB-project)

---

## 1. Project Overview

**Meat Point** is a comprehensive, production-ready website for an authentic halal Turkish restaurant located in Astana, Kazakhstan (Uly Dala Ave 45, EXPO / Botanical Garden district). 

This project represents the culmination of the semester coursework (Weeks 1–10), evolving from static markup and modern responsive Bootstrap 5 styling into a fully interactive single-page and multi-page web application powered by **Plain JavaScript (ES6+)** and **jQuery 3.7.1**.

### Core Constraints & Quality Standards
- **The CSS Freeze Rule:** In strict accordance with course regulations, zero hand-written HTML markup or CSS rules were introduced after the `midterm` baseline tag (`git diff midterm -- css/` is completely clean). All dynamic components, visual state changes, and interactive elements are built dynamically via JavaScript and styled utilizing existing Bootstrap 5 utility classes and standard DOM element style properties.
- **Strict Separation of Technologies:** Plain JavaScript (Weeks 6–8) and jQuery (Weeks 9–10) are decoupled into dedicated script files. No single feature mixes Plain JavaScript DOM methods and jQuery APIs.
- **Complete End-to-End Logic:** Every visitor interaction finishes completely: filters update counters, calculators compute totals with transparent service fees and discounts, forms validate fields with contextual feedback, and submissions display formatted demo receipts with simulated order references.
- **Zero Console Errors:** All scripts execute cleanly across all pages with zero runtime errors, broken references, or dead links.

---

## 2. Project Team & Responsibilities

| Student | Assigned Pages | Script Modules & Technologies | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **Kamza Asset** | `index.html`<br>`about.html`<br>`contacts.html` | `js/main.js`<br>`js/kamza-jquery.js` | Shared utility framework, global live search bar, real-time working status panel, dynamic promo generator, jQuery highlight explorer, and contacts inquiry calculator. |
| **Madiyar Akylbek** | `menu.html`<br>`events.html` | `js/menu.js`<br>`js/events.js` | Menu category filters, dietary preference selectors, interactive order cart, stage surcharge calculator, and live concert ticket reservation with date constraints. |
| **Tangzharyk Asset** | `booking.html`<br>`feedback.html` | `js/booking.js`<br>`js/feedback.js` | Dining table capacity explorer, table reservation form with deposit calculations, verified review registry, live ratings metric calculator, and inline review editor. |

---

## 3. Technology Architecture: Plain JavaScript vs. jQuery

In compliance with the project specification, the front-end logic strictly separates native DOM programming from jQuery library capabilities.

| Aspect | Plain JavaScript (Weeks 6–8) | jQuery (Weeks 9–10) |
| :--- | :--- | :--- |
| **Files** | `js/main.js`, `js/menu.js`, `js/events.js`, `js/booking.js`, `js/feedback.js` | `js/kamza-jquery.js` |
| **Scope** | Site-wide utilities, Menu, Events, Booking, Feedback | Home, About Us, Contacts |
| **DOM Creation** | `document.createElement()`, `element.append()`, `element.replaceChildren()` | `$('<tag>', { ... })`, `.html()`, `.appendTo()` |
| **Traversal** | `element.closest()`, `element.querySelector()`, `element.nextElementSibling` | `.closest()`, `.find()`, `.siblings()`, `.parent()` |
| **Event Handling** | `addEventListener()` on parents for delegated click/input | `.on('click', selector, handler)` with chaining |
| **Animations / Effects** | CSS transitions applied via JS `.style` and Bootstrap classes (`classList.toggle`) | `.slideDown()`, `.slideUp()`, `.slideToggle()`, `.fadeIn()`, `.fadeOut()` |
| **Data Collections** | Native ES6 arrays, `.filter()`, `.find()`, `.reduce()`, `.map()`, `.some()` | jQuery collections with method chaining |

---

## 4. Comprehensive Feature Inventory

### 4.1 Global Site-Wide Features (Plain JavaScript — `js/main.js`)
- **Real-Time Restaurant Status Panel:** Calculates live operating hours (24/7 kitchen availability, business lunch hours 12:00–15:00, and evening live music starting at 19:00) using the client system time (`new Date()`).
- **Interactive Daily Promo Code Generator:** Generates a randomized Turkish cuisine discount code (`MEAT-SAVE-XX%`) with calculated expiry timestamps.
- **Global Search Engine:** Instant keyword search across menu categories, table bookings, live concert programs, and restaurant stories with dynamic dropdown results and `Escape` key listeners.
- **Shared Validation & Utilities:** Reusable helper methods for phone format verification, email validation, currency formatting (`formatMoney()`), and unique transaction reference generation.

### 4.2 Menu Page & Cart Pre-Order (Plain JavaScript — `js/menu.js`)
- **Dynamic Dish Registry:** Renders 10 authentic Turkish dishes with prices, spice levels, calorie counts, and preparation times.
- **Category & Dietary Filtering:** Filters dishes by category (Steaks, Kebabs, Desserts, Beverages) and dietary tags (`100% Halal`, `Vegetarian`).
- **Interactive Cart & Order Calculator:** Live calculation of subtotal, 10% restaurant service fee, and automated 15% discount for orders exceeding 15,000 KZT.
- **Pre-Order Form Validation:** Validates customer name, phone number, guest count, and pickup/dine-in time with inline feedback and demo confirmation receipts.

### 4.3 Events Page & Live Music Reservations (Plain JavaScript — `js/events.js`)
- **Weekend Music Lineup Explorer:** Filter live concerts by genre (Acoustic Guitar, Traditional Turkish Saz, Jazz Quartet).
- **Stage Zone Ticket Calculator:** Computes ticket prices based on seat location (VIP Stage Front, Balcony, Main Hall) with real-time seat availability tracking.
- **Reservation Date Restriction:** Validates event booking dates to ensure selection strictly matches valid weekend concert days (Friday through Sunday).
- **VIP Code Validation:** Unlocks exclusive backstage passes when a valid VIP access code is supplied.

### 4.4 Booking Page & Table Reservation (Plain JavaScript — `js/booking.js`)
- **Restaurant Hall Table Explorer:** Dynamic visual map displaying 8 tables categorized by hall section (Terrace, Main Hall, Private VIP Room, Family Booth).
- **Capacity Filtering:** Instant filter to display tables accommodating solo diners (1–2), families (3–6), or banquet parties (8–15).
- **Deposit Calculator:** Computes mandatory advance booking deposits (5,000 KZT per guest for parties exceeding 6 people).
- **Dynamic Hall Policy Reminders:** Displays conditional banquet warnings and decoration rules depending on selected party size and hall zone.

### 4.5 Customer Feedback & Review Registry (Plain JavaScript — `js/feedback.js`)
- **Verified Customer Review Feed:** Displays genuine customer reviews with star ratings (1–5), verified visit badges, and review date formatting.
- **Live Metrics Dashboard:** Automatically recalculates average rating score and total review counts when new reviews are submitted or removed.
- **Review Submission & Character Counter:** Interactive review form enforcing minimum message length (minimum 35 characters for negative reviews to ensure constructive feedback).
- **Inline Review Editing & Removal:** Full CRUD capabilities within client session allowing users to edit or delete their submitted reviews.

### 4.6 Home, About & Contacts (jQuery — `js/kamza-jquery.js`)
- **Interactive Highlight Explorer:** Built with jQuery selectors, traversal (`.closest()`, `.find()`, `.siblings()`), and animated card expansion (`.slideToggle()`).
- **Smooth Elevation Transitions:** Modern micro-interactions elevating active cards by `-4px` with smooth CSS transitions triggered via jQuery.
- **Interactive Lunch Calculator:** Computes banquet and business lunch estimates with dynamic guest count multipliers and beverage options.
- **Inquiry Form Handling:** Validates contact forms with jQuery effect transitions (`.fadeIn()`, `.slideDown()`) and displays formatted summary cards upon submission.

---

## 5. Extensions Added for the Endterm

In compliance with the grading guideline requiring documentation of what was extended since previous assignments:

| Module / Feature | Baseline State | Endterm Extension & Enhancement |
| :--- | :--- | :--- |
| **`js/main.js`** | Static utility helper functions. | Added live status indicators (24/7 kitchen, business lunch window, evening music), interactive promo generator with copy support, and enhanced global search dropdown styling. |
| **`js/kamza-jquery.js`** | Basic jQuery toggle functionality. | Implemented card elevation micro-interactions, accordion transitions using `.find()` / `.siblings()`, banquet quote calculator, and VIP password animated disclosure box. |
| **`js/menu.js`** | Basic dish rendering. | Added dietary badges (`Halal`, `Vegetarian`), item quantity counters, instant order calculation with automatic 15% discount for orders over 15,000 KZT, and comprehensive pre-order modal confirmation. |
| **`js/events.js`** | Simple event list. | Implemented weekend day-of-week validation, seat zone surcharge calculator, ticket availability tracker, and VIP access code toggle with password visibility switch. |
| **`js/booking.js`** | Basic table form. | Added interactive table explorer with capacity filtering, deposit calculation logic for large groups, hall policies panel, and smooth title hover micro-interactions. |
| **`js/feedback.js`** | Static review list. | Added dynamic metrics aggregator (average score, star distribution), conditional character counter requiring 35+ chars for 1–2 star reviews, inline edit mode, and review deletion handler. |
| **Title Micro-Interactions** | Default static headers. | Added JavaScript `mouseenter` and `mouseleave` event listeners to interactive page headers (e.g., `#welcome-heading`, booking titles) that smoothly morph brand accent colors. |

---

## 6. Verification & Quality Assurance

All requirements from the course specification have been verified:

1. **CSS Freeze Verification:**
   ```powershell
   git diff midterm -- css/
   # Output: 0 lines changed (strictly clean)
   ```
2. **JavaScript Syntax Verification:**
   All scripts in `js/` compile without syntax errors.
3. **Cross-Browser DOM Compatibility:**
   All user inputs are safely escaped using `textContent` to prevent XSS vulnerabilities; no raw `innerHTML` is used for user-provided data.
4. **Accessible Forms & Feedback:**
   All inputs feature associated `<label>` tags, `.invalid-feedback` error containers, and `aria-invalid` / `aria-describedby` attributes for assistive technology support.
5. **Simulated Server Logic:**
   All generated confirmations explicitly notify the visitor that the transaction is a front-end client demonstration and no real payment or reservation charge was incurred.

---

## 7. How to Run the Project Locally

### Option A: Using Python (Recommended)
From the project root directory, run:
```bash
python -m http.server 8000
```
Open your browser and navigate to: `http://localhost:8000/`

### Option B: Using VS Code Live Server
1. Open the project folder in Visual Studio Code / WebStorm.
2. Right-click `index.html` and select **"Open with Live Server"**.

### Option C: Direct Browser Launch
Double-click `index.html` in your file explorer to open it directly in Google Chrome, Mozilla Firefox, or Microsoft Edge.

---

## 8. AI Policy Disclosure & Academic Integrity

As required by university policy, AI assistance (Google Antigravity) was utilized solely for code review, debugging, syntax validation, documentation formatting, and architectural guidance. All business rules, Turkish cuisine domain modeling, validation logic, and event structures were conceived, tailored, and verified specifically for the Meat Point restaurant web application. Full conversation records are preserved in accordance with course requirements.
