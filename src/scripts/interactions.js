(function () {
    var btn  = document.getElementById('mkg-hamburger');
    var menu = document.getElementById('mkg-mobile-menu');
    if (!btn || !menu) return;

    function openMenu() {
        menu.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Close navigation menu');
    }
    function closeMenu() {
        menu.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open navigation menu');
    }
    function toggleMenu() {
        menu.classList.contains('is-open') ? closeMenu() : openMenu();
    }

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) {
            closeMenu();
            btn.focus();
        }
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
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (event) {
        if (event.matches) closeMenu();
    });
}());

/* Preserve referral context through the service chooser without storing it. */
(function () {
    var ref = new URLSearchParams(window.location.search).get('ref');
    var codedRoute = window.location.pathname.match(/^\/r\/([^/]+)\/?$/);
    if (!ref && codedRoute) {
        try { ref = decodeURIComponent(codedRoute[1]); } catch { return; }
    }
    if (!ref || ref.length > 100) return;
    document.querySelectorAll('[data-referral-link], a[href^="/book/"], a[href^="/send-photos/"]').forEach(function (link) {
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) === '#') return;
        var url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        url.searchParams.set('ref', ref);
        link.setAttribute('href', url.pathname + url.search + url.hash);
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
