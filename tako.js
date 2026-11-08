$(function () {
    "use strict";

    const $form = $('#restaurant-booking-form');
    if (!$form.length) return;

    const $date = $('#booking-date');
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    $date.attr('min', today.toISOString().slice(0, 10));

    function showError($input, message) {
        $input.toggleClass("is-invalid", !!message)
              .attr("aria-invalid", message ? "true" : "false");
        $input.siblings('.invalid-feedback').text(message);
    }

    function validateInput($input) {
        let message = "";
        const id = $input.attr('id');
        const val = $input.val().trim();

        if (id === "client-name" && val.length < 2) {
            message = "Please enter your name.";
        } else if (id === "client-phone") {
            const digitCount = val.replace(/\D/g, "").length;
            if (!/^\+?[0-9\s()-]+$/.test(val) || digitCount < 10) {
                message = "Enter a valid phone number.";
            }
        } else if (id === "guest-count") {

            const isVip = $('#hall-vip').prop('checked');
            const max = isVip ? 15 : 80;
            const count = Number(val);
            if (!val || !Number.isInteger(count) || count < 1 || count > max) {
                message = `Enter a count from 1 to ${max}.`;
            }
        } else if (id === "booking-date") {
            if (!val || val < $date.attr('min')) message = "Please choose a valid date.";
        } else if (id === "booking-time") {
            if (!val) message = "Please choose a visit time.";
        }

        showError($input, message);
        return message === "";
    }

    $form.on('submit', function (event) {

        event.preventDefault();
        let allValid = true;

        $form.find('input:not([type="radio"])').each(function () {
            if (!validateInput($(this))) allValid = false;
        });

        if (!allValid) {
            $form.find('.is-invalid').first().trigger('focus');
        }
    });

    $form.on('input change', 'input', function () {
        validateInput($(this));
        if ($(this).attr('id') === 'booking-date') validateInput($('#booking-time'));
        if ($(this).attr('name') === 'hall') validateInput($('#guest-count'));
    });

    $form.on('reset', function () {
        setTimeout(() => {
            $form.find('.is-invalid').removeClass('is-invalid');
            $form.find('.invalid-feedback').text("");
        }, 10);
    });
});
