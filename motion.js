// Si Mbok motion layer: scroll reveals, header state, hero counter.
// Uses IntersectionObserver only (no scroll listeners), and does nothing when reduced motion is requested.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // [selector, reveal style, stagger children?]
  var targets = [
    ['.cat-intro', 'left', false],
    ['.cat-list > *', 'up', true],
    ['.sec-head', 'up', false],
    ['.menu-grid > *', 'up', true],
    ['.center-row', 'up', false],
    ['.promo', 'zoom', false],
    ['.promo-copy > *', 'up', true],
    ['.story-grid > *', 'up', true],
    ['.gal-head > *', 'up', true],
    ['.gal-grid > *', 'zoom', true],
    ['#lokasi .gal-title', 'up', false],
    ['.branch-list > *', 'left', true],
    ['.map', 'zoom', false],
    ['.cta', 'zoom', false],
    ['.cta-copy', 'up', false],
    ['.cta-actions', 'up', false],
    ['.foot-grid > *', 'up', true]
  ];

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      observer.unobserve(el);
      el.classList.add('is-in');
      // Hand the element back to its normal hover transitions once the reveal is done
      var delay = (parseInt(el.style.getPropertyValue('--i'), 10) || 0) * 90;
      setTimeout(function () {
        el.removeAttribute('data-reveal');
        el.style.removeProperty('--i');
      }, 950 + delay);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  targets.forEach(function (t) {
    document.querySelectorAll(t[0]).forEach(function (el, i) {
      if (el.hasAttribute('data-reveal')) return;
      el.setAttribute('data-reveal', t[1]);
      if (t[2]) el.style.setProperty('--i', Math.min(i, 6));
      observer.observe(el);
    });
  });

  // Header shadow once the hero has scrolled away
  var nav = document.querySelector('.nav');
  var hero = document.querySelector('.hero');
  if (nav && hero) {
    new IntersectionObserver(function (entries) {
      nav.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    }, { rootMargin: '-80px 0px 0px 0px' }).observe(hero);
  }

  // Count up the customer number in the hero
  var strong = document.querySelector('.proof-text strong');
  if (strong && /5\.000/.test(strong.textContent)) {
    strong.innerHTML = strong.innerHTML.replace('5.000', '<span class="count" style="font-variant-numeric:tabular-nums">0</span>');
    var span = strong.querySelector('.count');
    var start = null, target = 5000, duration = 1400, fmt = new Intl.NumberFormat('id-ID');
    var step = function (now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      span.textContent = fmt.format(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    setTimeout(function () { requestAnimationFrame(step); }, 600);
  }
})();
