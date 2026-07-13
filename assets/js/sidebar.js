// Collapsible post-tree sidebar. The open/closed class is set before paint
// by an inline script in head.html; this only wires up the toggle button.
(function () {
  var toggle = document.getElementById('sidebar-toggle');
  var html = document.documentElement;
  if (!toggle) return;
  toggle.addEventListener('click', function () {
    var open = html.classList.toggle('sidebar-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    try { localStorage.sidebar = open ? 'open' : 'closed'; } catch (e) {}
  });
  toggle.setAttribute('aria-expanded', html.classList.contains('sidebar-open') ? 'true' : 'false');

  // On narrow screens the sidebar is an overlay drawer that covers the
  // toggle button, so a click outside it closes it (without persisting).
  document.addEventListener('click', function (e) {
    if (!html.classList.contains('sidebar-open')) return;
    if (window.innerWidth >= 1100) return;
    var sidebar = document.getElementById('sidebar');
    if (sidebar && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
      html.classList.remove('sidebar-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
