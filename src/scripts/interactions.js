(function () {
    var btn  = document.getElementById('mkg-hamburger');
    var menu = document.getElementById('mkg-mobile-menu');
    if (!btn || !menu) return;

    function openMenu() {
        menu.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
        menu.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
    }
    function toggleMenu() {
        menu.classList.contains('is-open') ? closeMenu() : openMenu();
    }

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', function (e) {
        if (menu.classList.contains('is-open') && !menu.contains(e.target) && e.target !== btn) {
            closeMenu();
        }
    });

    var links = menu.querySelectorAll('.mkg-mobile-menu-link');
    links.forEach(function (link) {
        link.addEventListener('click', function () {
            closeMenu();
        });
    });
}());

/* ── Desktop panel-scroll → header is-scrolled state ───────────────── */
(function () {
    var hdr = document.querySelector('.mkg-header');
    if (!hdr) return;
    var THRESHOLD = 20;
    function onScroll() {
        if (window.innerWidth < 1024) { hdr.classList.remove('is-scrolled'); return; }
        var active = document.querySelector('.panel.active');
        hdr.classList.toggle('is-scrolled', active ? active.scrollTop > THRESHOLD : false);
    }
    document.querySelectorAll('.panel').forEach(function (p) {
        p.addEventListener('scroll', onScroll, { passive: true });
    });
    var observer = new MutationObserver(onScroll);
    document.querySelectorAll('.panel').forEach(function (p) {
        observer.observe(p, { attributes: true, attributeFilter: ['class'] });
    });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
}());
