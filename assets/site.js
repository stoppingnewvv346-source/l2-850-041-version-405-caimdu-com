(function() {
    var header = document.getElementById('site-header');
    var toggle = document.querySelector('.menu-toggle');
    var mobileMenu = document.getElementById('mobile-menu');

    function updateHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 12) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (toggle && mobileMenu) {
        toggle.addEventListener('click', function() {
            var open = mobileMenu.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var sliders = document.querySelectorAll('.hero-slider');
    sliders.forEach(function(slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function() {
                show(index + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function(dot, dotIndex) {
            dot.addEventListener('click', function() {
                show(dotIndex);
                start();
            });
        });

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    var localFilter = document.querySelector('[data-filter-form]');
    if (localFilter) {
        var input = localFilter.querySelector('[data-filter-input]');
        var select = localFilter.querySelector('[data-filter-select]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
        var empty = document.querySelector('[data-empty]');
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';

        if (input && initial) {
            input.value = initial;
        }

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function cardText(card) {
            return [
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-year'),
                card.getAttribute('data-category'),
                card.getAttribute('data-tags')
            ].join(' ').toLowerCase();
        }

        function apply() {
            var query = normalize(input ? input.value : '');
            var category = select ? select.value : '';
            var visible = 0;

            cards.forEach(function(card) {
                var okQuery = !query || cardText(card).indexOf(query) !== -1;
                var okCategory = !category || card.getAttribute('data-category') === category;
                var showCard = okQuery && okCategory;
                card.classList.toggle('is-hidden', !showCard);
                if (showCard) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        if (input) {
            input.addEventListener('input', apply);
        }
        if (select) {
            select.addEventListener('change', apply);
        }
        localFilter.addEventListener('submit', function(event) {
            event.preventDefault();
            apply();
        });
        apply();
    }
})();
