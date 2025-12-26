function checkPasswordStrength() {
  const password = document.getElementById("password")?.value || "";
  const meter = document.getElementById("strengthMeter");
  const text = document.getElementById("strengthText");
  if (!meter || !text) return;
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  let level = "";
  let color = "";
  let width = 0;

  if (score <= 1) {
    level = "Weak";
    color = "#dc3545";
    width = 25;
  } else if (score === 2) {
    level = "Fair";
    color = "#fd7e14";
    width = 50;
  } else if (score === 3) {
    level = "Good";
    color = "#ffc107";
    width = 75;
  } else {
    level = "Strong";
    color = "#28a745";
    width = 100;
  }
  meter.style.width = width + "%";
  meter.style.background = color;
  text.textContent = `Password strength: ${level}`;
}
function togglePassword(inputId) {
  const passwordInput = document.getElementById(inputId);
  if (!passwordInput) return;
  const icon = passwordInput.nextElementSibling?.querySelector("i");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    if (icon) icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    passwordInput.type = "password";
    if (icon) icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}
function handleFormSubmit(e) {
  const form = e.target;
  const submitButton = form.querySelector(".btn");
  if (!submitButton) return;
  const originalText = submitButton.innerHTML;
  const wasDisabled = submitButton.disabled;
  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Processing...';
  submitButton.disabled = true;
  setTimeout(() => {
    submitButton.innerHTML = originalText;
    submitButton.disabled = wasDisabled;
  }, 3000);
}
function hideAlert(alertElement) {
  alertElement.style.opacity = "0";
  alertElement.style.transition = "opacity 0.5s ease";
  setTimeout(() => {
    alertElement.style.display = "none";
  }, 500);
}

function showAlert(type, message, containerSelector = "#alertContainer") {
  const container = document.querySelector(containerSelector) || document.body;
  const alert = document.createElement("div");
  alert.className = `alert ${
    type === "success" ? "alert-success" : "alert-error"
  }`;
  alert.setAttribute("role", "alert");
  alert.innerHTML = `
        <i class="${
          type === "success"
            ? "fas fa-check-circle"
            : "fas fa-exclamation-circle"
        }"></i>
        <div>${message}</div>
        <button type="button" class="close-alert" aria-label="Close">&times;</button>
    `;
  container.prepend(alert);
  // close handler
  alert.querySelector(".close-alert").addEventListener("click", () => {
    hideAlert(alert);
  });
  // auto hide after 5s
  setTimeout(() => {
    if (alert.style.display !== "none") hideAlert(alert);
  }, 5000);
  return alert;
}
function setupInputAnimations() {
  const inputs = document.querySelectorAll(".input-with-icon input");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "scale(1.02)";
    });
    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "scale(1)";
    });
  });
}
function setupSocialButtons() {
  const socialButtons = document.querySelectorAll(".btn-social");
  socialButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
    });
    button.addEventListener("mouseleave", function () {
      this.style.boxShadow = "none";
    });
  });
}
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
function isValidPassword(password) {
  return password.length >= 6;
}
function initializePage() {
  console.log("Initializing auth page...");
  setupInputAnimations();
  if (document.querySelector(".btn-social")) {
    setupSocialButtons();
  }
  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    passwordInput.addEventListener("input", checkPasswordStrength);
  }
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    // keep the default visual processing behavior
    form.addEventListener("submit", handleFormSubmit);
  });

  // If we have a registration form, attach the stronger validation flow
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      handleRegisterSubmit(e);
    });
  }
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => {
    setTimeout(() => {
      if (alert.style.display !== "none") {
        hideAlert(alert);
      }
    }, 5000);
  });
  console.log("Auth page initialized!");
}
document.addEventListener("DOMContentLoaded", initializePage);
window.passwordUtils = {
  checkPasswordStrength,
  togglePassword,
  isValidEmail,
  isValidPassword,
};

// Registration-specific submit handling and validation
async function hashString(message) {
  const enc = new TextEncoder();
  const data = enc.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function handleRegisterSubmit(e) {
  const form = document.getElementById("registerForm");
  if (!form) return;
  const name = form.querySelector("#fullName")?.value.trim() || "";
  const email = form.querySelector("#email")?.value.trim() || "";
  const password = form.querySelector("#password")?.value || "";
  const confirm = form.querySelector("#confirmPassword")?.value || "";
  const terms = form.querySelector("#terms")?.checked || false;

  if (name.length < 2) {
    showAlert("error", "Please enter your full name.");
    form.querySelector("#fullName").focus();
    return;
  }
  if (!isValidEmail(email)) {
    showAlert("error", "Please provide a valid email address.");
    form.querySelector("#email").focus();
    return;
  }
  if (!isValidPassword(password)) {
    showAlert("error", "Password must be at least 6 characters.");
    form.querySelector("#password").focus();
    return;
  }
  if (password !== confirm) {
    showAlert("error", "Passwords do not match.");
    form.querySelector("#confirmPassword").focus();
    return;
  }
  if (!terms) {
    showAlert("error", "You must agree to the Terms and Privacy Policy.");
    return;
  }

  // check for duplicate email
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    showAlert("error", "An account with this email already exists.");
    return;
  }

  // All good — show processing state
  handleFormSubmit({ target: form });

  try {
    const passwordHash = await hashString(password);
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    // set session
    localStorage.setItem("currentUser", newUser.email);

    setTimeout(() => {
      showAlert("success", "Account created successfully — redirecting...");
      // clear form and reset meter
      form.reset();
      const meter = document.getElementById("strengthMeter");
      const text = document.getElementById("strengthText");
      if (meter) meter.style.width = "0%";
      if (text) text.textContent = "Password strength:";
      // redirect to dashboard
      setTimeout(() => {
        location.href = "dashboard.html";
      }, 900);
    }, 700);
  } catch (err) {
    console.error(err);
    showAlert("error", "An unexpected error occurred. Please try again.");
  }
}
