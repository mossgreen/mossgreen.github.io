// "On this page" sidebar: built from the post's h2/h3 anchors (kramdown
// auto_ids), current section highlighted while scrolling. h3 entries are
// grouped under their h2 and only the group being read is expanded, so the
// TOC stays short on posts with many repeated subsections.
(function () {
  var content = document.querySelector('.post-content');
  var toc = document.getElementById('toc');
  var nav = document.getElementById('toc-nav');
  if (!content || !toc || !nav) return;

  var headings = Array.prototype.slice.call(
    content.querySelectorAll('h2[id], h3[id]')
  );
  if (headings.length < 3) return; // short post: not worth a TOC

  var root = document.createElement('ul');
  var links = {};  // heading id -> its <a>
  var groups = {}; // heading id -> owning h2 <li> (accordion unit)
  var currentLi = null;
  var currentSub = null;

  headings.forEach(function (h) {
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    links[h.id] = a;

    if (h.tagName === 'H2' || !currentLi) {
      var li = document.createElement('li');
      li.className = 'toc-h2';
      li.appendChild(a);
      root.appendChild(li);
      currentLi = li;
      currentSub = null;
    } else {
      if (!currentSub) {
        currentSub = document.createElement('ul');
        currentSub.className = 'toc-sub';
        currentLi.appendChild(currentSub);
      }
      var li3 = document.createElement('li');
      li3.className = 'toc-h3';
      li3.appendChild(a);
      currentSub.appendChild(li3);
    }
    groups[h.id] = currentLi;
  });
  nav.appendChild(root);
  toc.hidden = false;

  var activeId = null;
  var openLi = null;
  function setActive(id) {
    if (id === activeId) return;
    if (activeId) links[activeId].classList.remove('active');
    if (id) links[id].classList.add('active');
    activeId = id;

    var li = id ? groups[id] : null;
    if (li !== openLi) {
      if (openLi) openLi.classList.remove('open');
      if (li) li.classList.add('open');
      openLi = li;
    }
  }

  // Current section = last heading above the reading line (25% down the
  // viewport); before the first heading, nothing is highlighted.
  function currentHeading() {
    var line = window.innerHeight * 0.25;
    var current = null;
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].getBoundingClientRect().top <= line) {
        current = headings[i].id;
      } else {
        break;
      }
    }
    return current;
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      setActive(currentHeading());
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
})();
