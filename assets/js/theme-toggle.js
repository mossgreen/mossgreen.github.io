(function() {
  var toggle = document.getElementById('theme-toggle');
  var html = document.documentElement;
  if (!toggle) return;
  toggle.addEventListener('click', function() {
    var isDark = html.classList.toggle('theme-dark');
    try { localStorage.theme = isDark ? 'dark' : 'light'; } catch (e) {}
    toggle.setAttribute('aria-checked', isDark ? 'true' : 'false');
  });
  toggle.setAttribute('aria-checked', html.classList.contains('theme-dark') ? 'true' : 'false');
})();
