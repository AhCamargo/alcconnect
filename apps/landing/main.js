// ============================================
// ALC Connect — Landing Page Scripts
// ============================================

(function () {
  "use strict";

  // --- Navbar scroll effect ---
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener(
      "scroll",
      function () {
        navbar.classList.toggle("scrolled", window.scrollY > 20);
      },
      { passive: true },
    );
  }

  // --- Mobile menu toggle ---
  const menuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("open");
      const isOpen = navLinks.classList.contains("open");
      menuBtn.setAttribute("aria-expanded", isOpen);
      menuBtn.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    // Close on nav link click
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  // --- Scroll-based fade-in animations ---
  var animatedElements = document.querySelectorAll(
    ".step-card, .use-case-card, .plan-card, .faq-item, .problem-card, .stat-card, .why-card, .integration-card, .preview-mockup",
  );

  animatedElements.forEach(function (el) {
    el.classList.add("fade-in");
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all
    animatedElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  // --- Lead capture form ---
  var leadForm = document.getElementById("leadForm");
  var formSuccess = document.getElementById("formSuccess");
  var API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://api.alcconnect.com.br";

  if (leadForm) {
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var formData = new FormData(leadForm);
      var data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });

      var submitBtn = leadForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";
      }

      fetch(API_URL + "/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (result) {
          if (result.success) {
            leadForm.reset();
            if (formSuccess) {
              formSuccess.classList.add("show");
              setTimeout(function () {
                formSuccess.classList.remove("show");
              }, 5000);
            }
          } else {
            alert(result.error || "Erro ao enviar solicitação.");
          }
        })
        .catch(function () {
          alert("Erro ao enviar solicitação. Tente novamente.");
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Solicitar número";
          }
        });
    });
  }
})();
