/**
 * Main JavaScript - Jekyll News Theme
 * Clean, Modern, SEO-Optimized
 */

(function() {
  'use strict';

  // ============================================================
  // MOBILE NAVIGATION
  // ============================================================
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navMenu.classList.toggle('open');
    });

    // Dropdown toggle on mobile
    var dropdowns = document.querySelectorAll('.has-dropdown > a');
    dropdowns.forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          var parent = link.parentElement;
          parent.classList.toggle('open');
          link.setAttribute('aria-expanded', parent.classList.contains('open'));
        }
      });
    });

    // Close nav when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ============================================================
  // SEARCH OVERLAY
  // ============================================================
  var searchToggle = document.querySelector('.search-toggle');
  var searchOverlay = document.getElementById('search-overlay');
  var searchClose = document.querySelector('.search-close');
  var searchInput = document.getElementById('search-input');

  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', function() {
      searchOverlay.removeAttribute('hidden');
      searchToggle.setAttribute('aria-expanded', 'true');
      if (searchInput) setTimeout(function() { searchInput.focus(); }, 100);
    });

    if (searchClose) {
      searchClose.addEventListener('click', closeSearch);
    }

    searchOverlay.addEventListener('click', function(e) {
      if (e.target === searchOverlay) closeSearch();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeSearch();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchOverlay.removeAttribute('hidden');
        if (searchInput) setTimeout(function() { searchInput.focus(); }, 100);
      }
    });

    function closeSearch() {
      searchOverlay.setAttribute('hidden', '');
      searchToggle.setAttribute('aria-expanded', 'false');
      searchToggle.focus();
    }
  }

  // ============================================================
  // TABLE OF CONTENTS - Auto Generate
  // ============================================================
  var tocList = document.getElementById('toc-list');
  var postContent = document.querySelector('.post-content');

  if (tocList && postContent) {
    var headings = postContent.querySelectorAll('h2, h3, h4');

    if (headings.length > 0) {
      var tocHTML = '';
      var currentLevel = 2;

      headings.forEach(function(heading, index) {
        var level = parseInt(heading.tagName.charAt(1));
        var id = heading.id || 'heading-' + index;
        heading.id = id;

        var text = heading.textContent;

        if (level > currentLevel) {
          tocHTML += '<ol>';
        } else if (level < currentLevel) {
          tocHTML += '</ol>';
        }

        tocHTML += '<li><a href="#' + id + '">' + text + '</a></li>';
        currentLevel = level;
      });

      tocList.innerHTML = tocHTML;

      // TOC Toggle
      var tocToggle = document.querySelector('.toc-toggle');
      if (tocToggle) {
        tocToggle.addEventListener('click', function() {
          var expanded = tocToggle.getAttribute('aria-expanded') === 'true';
          tocToggle.setAttribute('aria-expanded', !expanded);
          tocToggle.classList.toggle('collapsed');
          tocList.style.display = expanded ? 'none' : '';
        });
      }

      // Active TOC link on scroll
      var tocLinks = tocList.querySelectorAll('a');
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            tocLinks.forEach(function(link) { link.classList.remove('active'); });
            var activeLink = tocList.querySelector('a[href="#' + entry.target.id + '"]');
            if (activeLink) activeLink.classList.add('active');
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });

      headings.forEach(function(h) { observer.observe(h); });
    } else {
      // Hide TOC if no headings
      var toc = document.getElementById('toc');
      if (toc) toc.style.display = 'none';
    }
  }

  // ============================================================
  // LAZY LOADING IMAGES (Fallback for older browsers)
  // ============================================================
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
  } else {
    // Polyfill
    var lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      var imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      });
      lazyImages.forEach(function(img) { imageObserver.observe(img); });
    }
  }

  // ============================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var headerHeight = document.querySelector('.site-header') ? document.querySelector('.site-header').offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // READING PROGRESS BAR
  // ============================================================
  var progressBar = document.createElement('div');
  progressBar.id = 'reading-progress';
  progressBar.style.cssText = 'position:fixed;top:0;left:0;width:0%;height:3px;background:var(--color-primary);z-index:9999;transition:width 0.1s linear;';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });

  // ============================================================
  // BACK TO TOP BUTTON
  // ============================================================
  var backToTop = document.createElement('button');
  backToTop.id = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>';
  backToTop.style.cssText = 'position:fixed;bottom:2rem;right:2rem;width:44px;height:44px;background:var(--color-primary);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.2);opacity:0;visibility:hidden;transition:opacity 0.3s,visibility 0.3s,transform 0.3s;cursor:pointer;z-index:500;';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 400) {
      backToTop.style.opacity = '1';
      backToTop.style.visibility = 'visible';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.visibility = 'hidden';
    }
  }, { passive: true });

  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================================
  // COPY CODE BLOCKS
  // ============================================================
  document.querySelectorAll('pre').forEach(function(pre) {
    var btn = document.createElement('button');
    btn.textContent = 'Copy';
    btn.style.cssText = 'position:absolute;top:8px;right:8px;padding:4px 10px;background:rgba(255,255,255,0.15);color:#fff;border-radius:4px;font-size:12px;cursor:pointer;transition:background 0.2s;';
    btn.addEventListener('click', function() {
      var code = pre.querySelector('code');
      navigator.clipboard.writeText(code ? code.textContent : pre.textContent).then(function() {
        btn.textContent = 'Copied!';
        setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
      });
    });
    pre.style.position = 'relative';
    pre.appendChild(btn);
  });

  // ============================================================
  // EXTERNAL LINKS - Open in new tab with security
  // ============================================================
  document.querySelectorAll('a[href^="http"]').forEach(function(link) {
    if (!link.hostname || link.hostname !== window.location.hostname) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

})();
