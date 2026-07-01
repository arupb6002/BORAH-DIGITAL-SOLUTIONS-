/* ===========================================================
   Borah Digital Solutions — script.js
   Vanilla JS: nav toggle, sticky header shadow, scroll reveal,
   active nav link, FAQ accordion, stats counter, form validation
   =========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile nav after clicking a link
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.getElementById('siteHeader');
  function handleHeaderScroll() {
    if (window.scrollY > 8) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  if (header) {
    handleHeaderScroll();
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  }

  /* ---------- Back to top button ---------- */
  var backToTop = document.getElementById('backToTop');
  function handleBackToTop() {
    if (window.scrollY > 480) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }
  if (backToTop) {
    handleBackToTop();
    window.addEventListener('scroll', handleBackToTop, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    var scrollPos = window.scrollY + 120;
    var currentId = sections.length ? sections[0].id : null;

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      var match = link.getAttribute('href') === '#' + currentId;
      link.classList.toggle('active-link', match);
    });
  }
  if (sections.length) {
    setActiveLink();
    window.addEventListener('scroll', setActiveLink, { passive: true });
  }

  /* ---------- Scroll reveal (fade + slide) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close all other items
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Stats counter ---------- */
  var statNums = document.querySelectorAll('.stat-num');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    window.requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && statNums.length) {
    var statObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(function (el) { statObserver.observe(el); });
  } else {
    statNums.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    var successMsg = document.getElementById('formSuccess');

    function showError(input, errorEl, message) {
      input.classList.toggle('invalid', !!message);
      if (errorEl) errorEl.textContent = message || '';
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      successMsg.classList.remove('show');

      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var message = document.getElementById('message');

      var nameError = document.getElementById('nameError');
      var emailError = document.getElementById('emailError');
      var messageError = document.getElementById('messageError');

      var valid = true;

      if (!name.value.trim()) {
        showError(name, nameError, 'Please enter your name.');
        valid = false;
      } else {
        showError(name, nameError, '');
      }

      if (!email.value.trim()) {
        showError(email, emailError, 'Please enter your email.');
        valid = false;
      } else if (!isValidEmail(email.value.trim())) {
        showError(email, emailError, 'Please enter a valid email address.');
        valid = false;
      } else {
        showError(email, emailError, '');
      }

      if (!message.value.trim()) {
        showError(message, messageError, 'Please add a short message.');
        valid = false;
      } else {
        showError(message, messageError, '');
      }

      if (valid) {

    emailjs.send(
        "service_bx6sip1",
        "template_rfjmtek",
        {
            name: name.value.trim(),
            email: email.value.trim(),
            phone: document.getElementById("phone").value.trim(),
            message: message.value.trim()
        }
    ).then(function () {

        successMsg.textContent = "✅ Thank you! Your message has been sent successfully.";
        document.getElementById("successPopup").classList.add("show");

        form.reset();

}).catch(function (error) {

    alert("Failed to send message.");
    console.log(error);

});

}
const closePopup = document.getElementById("closePopup");

if(closePopup){
    closePopup.addEventListener("click",function(){
        document.getElementById("successPopup").classList.remove("show");
    });
}
});

}

});