/* ==========================================================================
   AVANT TECHNOLOGIES — MAIN.JS
   Vanilla JS only. No dependencies, no build step.
   Sections:
     1. Mobile nav toggle
     2. Header scroll state + active nav link
     3. Smooth scroll for in-page anchors
     4. Scroll reveal animations (IntersectionObserver)
     5. Animated stat counters (home page)
     6. Client logo strip — pause-on-hover marquee
     7. Projects page — category filter tabs
     8. Contact page — interactive form validation
     9. Footer — current year
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------------
     1. MOBILE NAV TOGGLE
     --------------------------------------------------------------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close mobile menu whenever a link is tapped */
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------------------------------------------------------------------
     2. HEADER SCROLL STATE + ACTIVE NAV LINK
     --------------------------------------------------------------------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var currentPage = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------------------------------------------------------------------
     3. SMOOTH SCROLL FOR IN-PAGE ANCHORS (e.g. "#services")
     --------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------------------------------------------------------------------
     4. SCROLL REVEAL ANIMATIONS
     Add class="reveal" (optionally reveal-delay-1..4) to any element.
     --------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------------------------------------------------------------
     5. ANIMATED STAT COUNTERS
     Add class="counter" and data-target="1200" to a <span>.
     --------------------------------------------------------------------- */
  var counters = document.querySelectorAll('.counter');
  if (counters.length) {
    var animateCounter = function (el) {
      var target = parseFloat(el.getAttribute('data-target')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1400;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); /* ease-out-cubic */
        var value = Math.floor(eased * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) window.requestAnimationFrame(step);
        else el.textContent = target.toLocaleString() + suffix;
      }
      window.requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------------------------------------------------------------------
     6. CLIENT LOGO STRIP — pause marquee on hover/focus
     --------------------------------------------------------------------- */
  var marquee = document.querySelector('.clients-track');
  if (marquee) {
    marquee.addEventListener('mouseenter', function () { marquee.style.animationPlayState = 'paused'; });
    marquee.addEventListener('mouseleave', function () { marquee.style.animationPlayState = 'running'; });
  }

  /* ---------------------------------------------------------------------
     7. PROJECTS PAGE — CATEGORY FILTER TABS
     --------------------------------------------------------------------- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        var filter = btn.getAttribute('data-filter');

        projectCards.forEach(function (card) {
          var match = filter === 'all' || card.getAttribute('data-category') === filter;
          if (match) {
            card.style.display = '';
            requestAnimationFrame(function () {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px) scale(.97)';
            setTimeout(function () {
              if (card.style.opacity === '0') card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     8. CONTACT PAGE — INTERACTIVE FORM VALIDATION
     --------------------------------------------------------------------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var showError = function (field, message) {
      var wrapper = field.closest('.form-field');
      if (!wrapper) return;
      var errorEl = wrapper.querySelector('.field-error');
      wrapper.classList.add('has-error');
      if (errorEl) errorEl.textContent = message;
    };
    var clearError = function (field) {
      var wrapper = field.closest('.form-field');
      if (!wrapper) return;
      wrapper.classList.remove('has-error');
      var errorEl = wrapper.querySelector('.field-error');
      if (errorEl) errorEl.textContent = '';
    };
    var isValidEmail = function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    ['input', 'blur'].forEach(function (evt) {
      form.querySelectorAll('input, textarea').forEach(function (field) {
        field.addEventListener(evt, function () { clearError(field); });
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      var name = form.querySelector('#name');
      var email = form.querySelector('#email');
      var subject = form.querySelector('#subject');
      var message = form.querySelector('#message');

      if (!name.value.trim()) { showError(name, 'Please enter your name.'); valid = false; }
      if (!email.value.trim()) { showError(email, 'Please enter your email.'); valid = false; }
      else if (!isValidEmail(email.value.trim())) { showError(email, 'Enter a valid email address.'); valid = false; }
      if (!subject.value.trim()) { showError(subject, 'Please add a subject.'); valid = false; }
      if (!message.value.trim() || message.value.trim().length < 10) {
        showError(message, 'Message should be at least 10 characters.'); valid = false;
      }

      var statusEl = document.getElementById('form-status');

      if (!valid) {
        if (statusEl) {
          statusEl.textContent = 'Please fix the highlighted fields.';
          statusEl.className = 'form-status is-error';
        }
        return;
      }

      /* No backend wired up — replace this block with a fetch() call to
         your form handler / cPanel PHP mail script when ready. */
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(function () {
        if (statusEl) {
          statusEl.textContent = 'Thank you — your message has been received. Our team will respond within 1 business day.';
          statusEl.className = 'form-status is-success';
        }
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 900);
    });
  }

  /* ---------------------------------------------------------------------
     9. FOOTER — CURRENT YEAR
     --------------------------------------------------------------------- */
  document.querySelectorAll('.current-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  document.querySelectorAll('.download-profile-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var downloadLink = document.createElement('a');
      downloadLink.href = 'assets/Avant_Technologies_Company_Profile.pdf';
      downloadLink.download = 'Avant_Technologies_Company_Profile.pdf';
      downloadLink.target = '_blank';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  });

});
