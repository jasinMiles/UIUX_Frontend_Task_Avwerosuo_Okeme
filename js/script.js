
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initCourseFilter();
  initLoginForm();
  initDashboard();
});

/* Mobile navigation*/
function initMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".mobile-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when a link inside it is used
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* Courses page: category filtering */
function initCourseFilter() {
  const chips = document.querySelectorAll(".filter-chip");
  const cards = document.querySelectorAll("[data-category]");
  if (!chips.length || !cards.length) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");

      const category = chip.dataset.filter;
      cards.forEach((card) => {
        const match = category === "all" || card.dataset.category === category;
        card.hidden = !match;
      });
    });
  });
}

/* Login page: client-side validation*/
function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  const emailField = document.getElementById("email");
  const passwordField = document.getElementById("password");
  const status = document.getElementById("form-status");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let valid = true;

    valid = validateField(emailField, emailField.value.trim().length > 0
      ? (emailPattern.test(emailField.value.trim()) ? "" : "Enter a valid email address.")
      : "Email is required.") && valid;

    valid = validateField(passwordField, passwordField.value.length > 0
      ? ""
      : "Password is required.") && valid;

    if (!valid) {
      status.textContent = "";
      return;
    }

    status.textContent = "Signed in — redirecting to your dashboard…";
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 700);
  });

  [emailField, passwordField].forEach((field) => {
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) {
        validateField(field, "");
      }
    });
  });

  function validateField(field, message) {
    const errorEl = document.getElementById(field.id + "-error");
    if (message) {
      field.classList.add("is-invalid");
      if (errorEl) errorEl.textContent = message;
      return false;
    }
    field.classList.remove("is-invalid");
    if (errorEl) errorEl.textContent = "";
    return true;
  }
}

/* Dashboard: sidebar sections, continue course, saved items, logout*/
function initDashboard() {
  const dash = document.querySelector(".dash-shell");
  if (!dash) return;

  // Sidebar section switching (Dashboard / Courses / Services / Saved / Profile)
  const navLinks = dash.querySelectorAll(".dash-nav a[data-section]");
  const sections = dash.querySelectorAll("[data-panel]");
  if (navLinks.length && sections.length) {
    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        navLinks.forEach((l) => l.removeAttribute("aria-current"));
        link.setAttribute("aria-current", "page");

        const target = link.dataset.section;
        sections.forEach((panel) => {
          panel.hidden = panel.dataset.panel !== target;
        });
      });
    });
  }


  const continueBtn = document.querySelector("[data-continue]");
  const progressFill = document.querySelector(".progress-fill");
  const progressLabel = document.querySelector(".progress-label");
  if (continueBtn && progressFill && progressLabel) {
    continueBtn.addEventListener("click", () => {
      let current = parseInt(progressFill.style.width || "68", 10);
      current = Math.min(current + 8, 100);
      progressFill.style.width = current + "%";
      progressLabel.textContent = current + "% complete";
      if (current >= 100) {
        continueBtn.textContent = "Course completed";
        continueBtn.disabled = true;
      }
    });
  }

  // Remove saved item
  document.querySelectorAll("[data-remove-saved]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".saved-item").classList.add("is-removed");
    });
  });

  // Logout
  const logoutBtn = document.querySelector("[data-logout]");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
}
