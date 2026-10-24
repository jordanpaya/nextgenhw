// Shared behaviour for the subpages. Mirrors the relevant parts of nextgen-site.html.
(function () {
  // ===== SITE CONFIG: keep in sync with TICKET_URL in nextgen-site.html =====
  var TICKET_URL = '';
  if (TICKET_URL) {
    document.querySelectorAll('[data-tickets]').forEach(function (a) { a.href = TICKET_URL; a.target = '_blank'; a.rel = 'noopener'; a.innerHTML = 'Buy tickets <span class="arr">&rarr;</span>'; });
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // countdown (days only, used in the footer band)
  var doors = new Date('2027-01-23T09:00:00-08:00');
  var el = document.getElementById('cta-days');
  if (el) el.textContent = Math.max(0, Math.floor((doors - new Date()) / 86400000));

  // scroll reveal
  var revs = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revs.forEach(function (r) { io.observe(r); });
  } else revs.forEach(function (r) { r.classList.add('in'); });

  // sticky nav: frosted bar once you leave the top
  var nav = document.getElementById('nav'), navTick = false;
  function navUpdate() {
    navTick = false;
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
  }
  window.addEventListener('scroll', function () { if (!navTick) { navTick = true; requestAnimationFrame(navUpdate); } }, { passive: true });
  navUpdate();

  // tilt + glare on cards marked data-tilt (fine pointers only)
  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(function (vc) {
      vc.addEventListener('pointermove', function (e) {
        var r = vc.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        vc.classList.add('live');
        vc.style.setProperty('--ry', ((x - 0.5) * 8).toFixed(2) + 'deg');
        vc.style.setProperty('--rx', ((0.5 - y) * 6).toFixed(2) + 'deg');
        vc.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
        vc.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
        vc.style.setProperty('--ix', ((0.5 - x) * 5).toFixed(1) + 'px');
        vc.style.setProperty('--iy', ((0.5 - y) * 4).toFixed(1) + 'px');
      });
      vc.addEventListener('pointerleave', function () {
        vc.classList.remove('live');
        ['--rx', '--ry'].forEach(function (k) { vc.style.setProperty(k, '0deg'); });
        ['--ix', '--iy'].forEach(function (k) { vc.style.setProperty(k, '0px'); });
      });
    });
  }

  // back to top
  var tt = document.getElementById('totop');
  if (tt) tt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });
})();
