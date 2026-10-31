// Используем jQuery 3.7.1 (из CDN). 
// Обертка $(function() { ... }) ждет полной загрузки DOM перед выполнением скрипта.
$(function () {
    "use strict";

    const sitePages = [
        { title: "Home", url: "index.html", keywords: "welcome restaurant location meat point", summary: "Restaurant overview and quick links." },
        { title: "About", url: "about.html", keywords: "story history values team", summary: "Learn about the restaurant and its values." },
        { title: "Contact", url: "contacts.html", keywords: "contact phone email address hours", summary: "Find contact details and send a request." },
        { title: "Menu", url: "menu.html", keywords: "food dishes kebab pide steaks prices", summary: "Browse dishes, prices and the demo cart." },
        { title: "Events", url: "events.html", keywords: "music friday saturday registration", summary: "View weekend music and request a place." },
        { title: "Booking", url: "booking.html", keywords: "table booking date time guests hall", summary: "Create a front-end table booking request." },
        { title: "Reviews", url: "feedback.html", keywords: "reviews feedback rating comments", summary: "Read and submit visitor feedback." }
    ];

    window.meatPoint = Object.freeze({
        createDemoReference: prefix => `${prefix}-${String(Math.floor(Math.random() * 900000) + 100000)}`
    });

    const $navbarContent = $('.navbar .navbar-collapse');
    if (!$navbarContent.length) return;

    // [Замена чистого JS]: Создание элементов через $("<tag>", { attributes }).
    const $form = $('<form>', { class: 'mt-3 mt-lg-0 ms-lg-3', role: 'search' });
    const $controls = $('<div>', { class: 'input-group' });
    const $input = $('<input>', { class: 'form-control', type: 'search', placeholder: 'Search the site' });
    const $searchBtn = $('<button>', { class: 'btn btn-outline-light', type: 'submit', text: 'Search' });
    const $resetBtn = $('<button>', { class: 'btn btn-outline-light', type: 'button', text: 'Clear' });
    const $status = $('<p>', { class: 'small text-white mb-1 mt-2', 'aria-live': 'polite' });
    const $resultList = $('<ul>', { class: 'list-group mb-2' }).hide();

    $controls.append($input, $searchBtn, $resetBtn);
    $form.append($controls, $status, $resultList).appendTo($navbarContent);

    function renderSearchResults(query) {
        const normalizedQuery = query.trim().toLowerCase();
        $resultList.empty();

        if (!normalizedQuery) {
            $status.text("Type a page or topic to search the website.");
            $resultList.slideUp();
            return;
        }

        const results = sitePages.filter(page => 
            `${page.title} ${page.keywords} ${page.summary}`.toLowerCase().includes(normalizedQuery)
        );

        $status.text(`${results.length} ${results.length === 1 ? "page" : "pages"} found.`);

        if (results.length === 0) {
            // [Разница text/html]: .html() рендерит теги (например, <b>), а .text() вставил бы их как обычный текст.
            $resultList.append($('<li>', { class: 'list-group-item' }).html("No matching pages. <b>Try another search.</b>")).slideDown();
            return;
        }

        // [Построение списка из массива]: Разметка генерируется в коде, в HTML её нет.
        $.each(results, function (index, page) {
            // [Цепочка методов из 3+ звеньев]:
            // 1. $('<a>') создает тег. 2. .addClass() вешает классы. 3. .attr() задает ссылку. 4. .text() задает текст.
            const $link = $('<a>').addClass('fw-semibold').attr('href', page.url).text(page.title);
            const $summary = $('<p>').addClass('mb-0 small text-muted').text(page.summary);
            $('<li>').addClass('list-group-item').append($link, $summary).appendTo($resultList);
        });
        
        $resultList.slideDown(300);
    }

    $form.on('submit', function (e) {
        e.preventDefault();
        renderSearchResults($input.val());
    });

    $input.on('input', function () {
        renderSearchResults($input.val());
    });

    $resetBtn.on('click', function () {
        $input.val("").trigger('focus');
        renderSearchResults("");
    });
});