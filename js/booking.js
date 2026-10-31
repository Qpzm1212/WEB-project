$(function () {
    "use strict";

    const $form = $('#restaurant-booking-form');
    if (!$form.length) return;

    const $summaryText = $('<p>', { class: 'mb-0' });
    const $confirmation = $('<div>', { class: 'alert alert-success mt-3' }).hide();
    
    $('<section>', { class: 'mt-4 p-3 bg-white border rounded' })
        .append($('<h3>', { class: 'h5', text: 'Booking summary' }), $summaryText, $confirmation)
        .insertAfter($form);

    function updateSummary() {
        // Обход DOM через .siblings
        const $selectedHall = $('input[name="hall"]:checked');
        const hallLabel = $selectedHall.length ? $selectedHall.siblings('label').text().trim() : "No hall selected";
        
        const date = $('#booking-date').val() || "Date not selected";
        const time = $('#booking-time').val() || "Time not selected";
        const guests = $('#guest-count').val() || "Not selected";
        
        $summaryText.text(`${hallLabel} · ${guests} guest(s) · ${date} at ${time}. Preview only.`);
    }

    $form.on('input change', 'input', function () {
        $confirmation.hide();
        updateSummary();
    });

    $form.on('submit', function () {
        if ($form.find('.is-invalid').length) return;

        const hallLabel = $('input[name="hall"]:checked').siblings('label').text().trim();
        const ref = window.meatPoint.createDemoReference("MP");
        
        $confirmation.text(`Success! Request ${ref} for ${$('#client-name').val()}: ${hallLabel}, ${$('#guest-count').val()} guest(s).`)
                     .fadeIn();
    });

    $form.on('reset', function () {
        setTimeout(() => {
            $confirmation.hide();
            updateSummary();
        }, 10);
    });

    updateSummary();
});