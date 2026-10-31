# Meat Point - Restaurant Website

## Assignment 4: jQuery Integration
*Part of Tangzharyk*

This repository contains the updated layout and logic for the Meat Point restaurant website. The layout was previously rebuilt using Bootstrap 5, and the front-end logic has now been migrated from plain JavaScript to jQuery.

### Key Updates for Assignment 4:
* **jQuery CDN:** Connected jQuery 3.7.1 via CDN to all relevant pages.
* **DOM Traversal & Chaining:** Replaced `document.getElementById` and custom element creators with jQuery selectors, `.find()`, `.closest()`, `.siblings()`, and chained methods.
* **Event Delegation:** Replaced manual `forEach` event loops with delegated `.on()` handlers (e.g., catching clicks on dynamically created review remove buttons).
* **Effects:** Added visual feedback using `.slideDown()`, `.fadeIn()`, and `.fadeOut()` with callbacks (e.g., removing a review card only after the fadeOut animation completes).
* **Form Validation:** Completely rebuilt the table booking and feedback form validations using jQuery, checking `.val()` and `.prop('checked')` while preventing default submission.

### Files Included for Assessment:
* Updated HTML files with jQuery script tags (`booking.html`, `feedback.html`)
* New jQuery scripts (`js/main.js`, `js/booking.js`, `js/tako.js`, `js/feedback.js`)
* `old-js-version.js` (Preserved plain-JS versions of three rewritten features for side-by-side comparison)
* `ai_log_tanzharyk.txt` (Log of AI consultations, including jQuery transition notes)

**Technologies used:** HTML5, CSS3, Bootstrap 5.3.3, jQuery 3.7.1.

---

## Assignment 4: Functionality Plan

The existing midterm HTML and CSS interface is preserved. jQuery creates the additional controls, messages, summaries, and repeated items at runtime.

| Page | Visitor goal | Planned functionality and expected result | Responsible student |
| :--- | :--- | :--- | :--- |
| **All pages** | Find information and move to a relevant page | Shared page search shows matching links, result count, empty state, and clear action. Rendered via jQuery `.append()`. | Kamza Asset + Tangzharyk Asset |
| **Menu** | Find a dish and review an order | Search, category filter, price/name sorting, cart quantity controls. | Kamza Asset |
| **Booking** | Request a table | Validate name, telephone, party size, hall capacity, date, and time via jQuery; show a live request summary and explicit non-confirmed demo result using `.fadeIn()`. | Tangzharyk Asset |
| **Events** | Request seats at a scheduled music event | Validate contact fields, party size, seating; show a request preview and demo result. | Kamza Asset |
| **Contact** | Send a front-end reservation/contact request | Validate name, email, phone, date; show occasion, deposit note for 10+ guests, and demo result. | Kamza Asset |
| **Reviews** | Read, submit, edit, or remove feedback | Render reviews as cards below the form; validate rating/text. Allow removing reviews using delegated jQuery events and `.fadeOut()` callback. | Tangzharyk Asset |

> **Note:** All booking, event, contact, review, and cart results are browser-only demonstrations. No personal data is sent to a server, and no real reservation, registration, payment, or order is created.

---

## jQuery Checklist

- [x] Connected jQuery via CDN on all pages before custom scripts.
- [x] Wrapped all custom code in `$(function () { ... })` document ready blocks.
- [x] Rewrote 3 plain-JS features (Search, Validation, Review List) and kept old logic in `old-js-version.js`.
- [x] Used selectors by id, class, element, attribute, and filters (`:checked`).
- [x] Used DOM traversal (`.siblings()`, `.closest()`, `.find()`).
- [x] Manipulated DOM using `.text()`, `.html()`, `.val()`, and `.prop()`.
- [x] Dynamically built lists/cards from arrays using `.append()`.
- [x] Handled events using `.on()` (click, input, change, submit).
- [x] Implemented delegated handlers for dynamic elements (Review remove buttons).
- [x] Used `event.preventDefault()` correctly on form submissions.
- [x] Added jQuery effects with purpose (`.slideDown()` for search results, `.fadeIn()` for alerts, `.fadeOut()` with callback for removing cards).
- [x] No inline `onclick` attributes and no mixed JS/jQuery approaches in the same feature.

## Submission notes
Assignment tags, evidence screenshots, and the required multi-day individual/team commits must be created by the team in its Git workflow. The browser console is clean of errors on all pages.
