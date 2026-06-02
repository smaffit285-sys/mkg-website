// ====================================================
// SPA PANEL NAVIGATION
// ====================================================
const PANEL_IDS = ['home','sharp-after-dark','miami-knife-club','before-after','services','reviews','our-story'];
const NAV_MAP = {
    'sharp-after-dark': 'nav-sad',
    'miami-knife-club':  'nav-mkc',
    'before-after':      'nav-proof',
    'reviews':           'nav-reviews',
    'services':          'nav-services',
    'our-story':         'nav-story',
};
let currentPanel = 'home';
let isTransitioning = false;

window.navigateTo = function navigateTo(panelId) {
    if (panelId === currentPanel || isTransitioning) return;
    if (!PANEL_IDS.includes(panelId)) return;
    isTransitioning = true;

    const currentEl = document.getElementById('panel-' + currentPanel);
    const nextEl    = document.getElementById('panel-' + panelId);

    // Update nav active states
    Object.entries(NAV_MAP).forEach(([pid, navId]) => {
        const el = document.getElementById(navId);
        if (el) el.classList.toggle('nav-active', pid === panelId);
    });

    // Exit current
    currentEl.classList.add('panel-exiting');
    currentEl.setAttribute('aria-hidden', 'true');

    setTimeout(function() {
        currentEl.classList.remove('active', 'panel-exiting');
        nextEl.scrollTop = 0;
        nextEl.classList.add('active');
        nextEl.setAttribute('aria-hidden', 'false');
        currentPanel = panelId;
        isTransitioning = false;
    }, 310);

    history.pushState({panel: panelId}, '', panelId === 'home' ? window.location.pathname : '#' + panelId);
}

// Browser back/forward — popstate fires when the user hits back/forward
window.addEventListener('popstate', function(e) {
    var panelId = (e.state && e.state.panel) ? e.state.panel : 'home';
    if (panelId === currentPanel || isTransitioning) return;
    if (!PANEL_IDS.includes(panelId)) return;
    isTransitioning = true;

    var currentEl = document.getElementById('panel-' + currentPanel);
    var nextEl    = document.getElementById('panel-' + panelId);

    Object.entries(NAV_MAP).forEach(function([pid, navId]) {
        var el = document.getElementById(navId);
        if (el) el.classList.toggle('nav-active', pid === panelId);
    });

    currentEl.classList.add('panel-exiting');
    currentEl.setAttribute('aria-hidden', 'true');
    setTimeout(function() {
        currentEl.classList.remove('active', 'panel-exiting');
        nextEl.scrollTop = 0;
        nextEl.classList.add('active');
        nextEl.setAttribute('aria-hidden', 'false');
        currentPanel = panelId;
        isTransitioning = false;
    }, 310);
});

// Deep-link support on load
(function() {
    var hash = window.location.hash.replace('#', '');
    if (hash && PANEL_IDS.includes(hash) && hash !== 'home') {
        setTimeout(function() { navigateTo(hash); }, 60);
    }
})();
