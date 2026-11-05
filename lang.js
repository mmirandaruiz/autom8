(function () {
  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[data-lang]');
    if (!link) return;
    var lang = link.getAttribute('data-lang');
    if (lang !== 'es' && lang !== 'en') return;
    document.cookie = 'autom8-lang=' + lang + '; Path=/; Max-Age=31536000; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
  });
})();
