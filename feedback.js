$(function () {
    "use strict";

    const $form = $('#feedback-form');
    if (!$form.length) return;

    const $reviewList = $('<div>', { class: 'row g-3 my-3' });
    const $status = $('<p>', { class: 'small mb-3' });
    
    $form.after($status, $reviewList);

    function renderReview(name, rating, text) {
        const $body = $('<div>', { class: 'card-body' }).append(
            $('<h3>', { class: 'h5 card-title', text: name }),
            $('<p>', { class: 'badge text-bg-warning', text: `${rating}/5` }),
            $('<p>', { class: 'card-text', text: text })
        );
        
        const $actions = $('<div>', { class: 'card-footer d-flex gap-2' }).append(
            $('<button>', { class: 'btn btn-sm btn-outline-danger', type: 'button', 'data-action': 'remove', text: 'Remove' })
        );

        return $('<article>', { class: 'col-12 col-md-6 col-lg-4' }).append(
            $('<div>', { class: 'card h-100 shadow-sm' }).append($body, $actions)
        );
    }

    $form.on('submit', function (event) {
        event.preventDefault();
        
        const name = $('#reviewer-name').val().trim();
        const rating = $('#review-rating').val();
        const msg = $('#review-message').val().trim();

        if (!name || !rating || !msg) return;

        const $newReview = renderReview(name, rating, msg).hide();
        $reviewList.append($newReview);
        
        // [Эффект с продолжительностью]: Плавно показываем новый отзыв за 500мс
        $newReview.fadeIn(500);
        
        $form.trigger('reset');
        $status.text("Review added!");
    });

    // [Делегированный обработчик]:
    // Почему прямая привязка $('button[data-action="remove"]').on(...) не сработает?
    // Кнопки удаления создаются динамически при добавлении отзыва. Если вешать событие напрямую, оно не привяжется к будущим кнопкам, которых еще нет на странице.
    $reviewList.on('click', 'button[data-action="remove"]', function () {
        // [Обход DOM]: Находим родительскую колонку через .closest()
        const $card = $(this).closest('article');
        
        // [Эффект с коллбэком]: Карточка плавно исчезает за 400мс, и только после окончания эффекта удаляется из DOM.
        $card.fadeOut(400, function () {
            $(this).remove();
            if ($reviewList.children().length === 0) $status.text("All reviews removed.");
        });
    });
});