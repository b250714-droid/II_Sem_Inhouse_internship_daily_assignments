/* =========================================================
   PRAVAH — script.js
   Two independent features:
   1. Live countdown to the next 1st January
   2. Client-side register / login demo using localStorage

   NOTE ON SECURITY: This runs entirely in the browser. There is
   no real server, so passwords are only lightly encoded (never
   sent anywhere) and this must NOT be treated as production-grade
   authentication. For a real event site, registration and login
   need a proper backend that hashes passwords and manages sessions.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. COUNTDOWN TIMER
     --------------------------------------------------------- */

  function getNextJanFirst() {
    const now = new Date();
    let year = now.getFullYear();
    // If Jan 1 of this year has already passed, target next year.
    const thisYearTarget = new Date(year, 0, 1, 0, 0, 0);
    if (thisYearTarget.getTime() <= now.getTime()) {
      year += 1;
    }
    return new Date(year, 0, 1, 0, 0, 0);
  }

  const targetDate = getNextJanFirst();

  const els = {
    days: document.getElementById("daysVal"),
    hours: document.getElementById("hoursVal"),
    minutes: document.getElementById("minutesVal"),
    seconds: document.getElementById("secondsVal"),
    targetText: document.getElementById("targetDateText"),
    liveMsg: document.getElementById("countdownLiveMsg"),
  };

  const flipCards = {
    days: document.querySelector('.flip-card[data-unit="days"] .flip-fill'),
    hours: document.querySelector('.flip-card[data-unit="hours"] .flip-fill'),
    minutes: document.querySelector('.flip-card[data-unit="minutes"] .flip-fill'),
    seconds: document.querySelector('.flip-card[data-unit="seconds"] .flip-fill'),
  };

  if (els.targetText) {
    els.targetText.textContent = targetDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }) + ", 12:00 AM";
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      // Event has started.
      if (els.days) els.days.textContent = "00";
      if (els.hours) els.hours.textContent = "00";
      if (els.minutes) els.minutes.textContent = "00";
      if (els.seconds) els.seconds.textContent = "00";
      if (els.liveMsg) els.liveMsg.hidden = false;
      clearInterval(timerHandle);
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (els.days) els.days.textContent = pad(days);
    if (els.hours) els.hours.textContent = pad(hours);
    if (els.minutes) els.minutes.textContent = pad(minutes);
    if (els.seconds) els.seconds.textContent = pad(seconds);

    // Fill level purely as a visual flourish (percentage within each unit's max range).
    if (flipCards.days) flipCards.days.style.setProperty("--level", Math.min(100, (days / 365) * 100) + "%");
    if (flipCards.hours) flipCards.hours.style.setProperty("--level", (hours / 24) * 100 + "%");
    if (flipCards.minutes) flipCards.minutes.style.setProperty("--level", (minutes / 60) * 100 + "%");
    if (flipCards.seconds) flipCards.seconds.style.setProperty("--level", (seconds / 60) * 100 + "%");
  }

  updateCountdown();
  const timerHandle = setInterval(updateCountdown, 1000);

  /* ---------------------------------------------------------
     2. MOBILE NAV TOGGLE
     --------------------------------------------------------- */

  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------
     3. AUTH: REGISTER / LOGIN (localStorage demo)
     --------------------------------------------------------- */

  const STORAGE_USERS_KEY = "pravah_users";
  const STORAGE_SESSION_KEY = "pravah_session";

  function loadUsers() {
    try {
      const raw = localStorage.getItem(STORAGE_USERS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }

  // Lightweight obfuscation only — NOT real password security.
  function encode(str) {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      return str;
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(inputEl, errorEl, message) {
    if (message) {
      inputEl.classList.add("is-invalid");
      errorEl.textContent = message;
    } else {
      inputEl.classList.remove("is-invalid");
      errorEl.textContent = "";
    }
  }

  // --- Tabs ---
  const tabRegister = document.getElementById("tabRegister");
  const tabLogin = document.getElementById("tabLogin");
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const authSuccess = document.getElementById("authSuccess");
  const authTabsWrap = document.querySelector(".auth-tabs");

  function showTab(which) {
    const showingRegister = which === "register";
    tabRegister.classList.toggle("is-active", showingRegister);
    tabLogin.classList.toggle("is-active", !showingRegister);
    tabRegister.setAttribute("aria-selected", String(showingRegister));
    tabLogin.setAttribute("aria-selected", String(!showingRegister));
    registerForm.classList.toggle("is-active", showingRegister);
    loginForm.classList.toggle("is-active", !showingRegister);
  }

  if (tabRegister && tabLogin) {
    tabRegister.addEventListener("click", () => showTab("register"));
    tabLogin.addEventListener("click", () => showTab("login"));
  }

  // Header + footer shortcuts that should open the right tab.
  document.getElementById("openRegisterBtn")?.addEventListener("click", () => {
    goToAuth("register");
  });
  document.getElementById("openLoginBtn")?.addEventListener("click", () => {
    goToAuth("login");
  });
  document.getElementById("footerRegisterLink")?.addEventListener("click", () => goToAuth("register"));
  document.getElementById("footerLoginLink")?.addEventListener("click", () => goToAuth("login"));

  function goToAuth(which) {
    const session = getSession();
    if (!session) {
      showTab(which);
    }
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  }

  // --- Password show/hide toggles ---
  document.querySelectorAll(".pw-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (!input) return;
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.textContent = showing ? "👁" : "🙈";
      btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
  });

  // --- Register submit ---
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailInput = document.getElementById("regEmail");
      const passwordInput = document.getElementById("regPassword");
      const confirmInput = document.getElementById("regConfirm");
      const emailError = document.getElementById("regEmailError");
      const passwordError = document.getElementById("regPasswordError");
      const confirmError = document.getElementById("regConfirmError");
      const note = document.getElementById("registerNote");

      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value;
      const confirm = confirmInput.value;

      let valid = true;

      if (!isValidEmail(email)) {
        setError(emailInput, emailError, "Enter a valid email address.");
        valid = false;
      } else {
        setError(emailInput, emailError, "");
      }

      if (password.length < 6) {
        setError(passwordInput, passwordError, "Use at least 6 characters.");
        valid = false;
      } else {
        setError(passwordInput, passwordError, "");
      }

      if (confirm !== password) {
        setError(confirmInput, confirmError, "Passwords don't match.");
        valid = false;
      } else {
        setError(confirmInput, confirmError, "");
      }

      if (!valid) {
        note.textContent = "";
        return;
      }

      const users = loadUsers();

      if (users[email]) {
        note.textContent = "That email is already registered — try logging in instead.";
        note.className = "form-note is-error";
        return;
      }

      users[email] = { password: encode(password), registeredAt: new Date().toISOString() };
      saveUsers(users);

      note.textContent = "Account created! Logging you in…";
      note.className = "form-note is-success";

      setTimeout(() => {
        registerForm.reset();
        note.textContent = "";
        startSession(email);
      }, 600);
    });
  }

  // --- Login submit ---
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailInput = document.getElementById("logEmail");
      const passwordInput = document.getElementById("logPassword");
      const emailError = document.getElementById("logEmailError");
      const passwordError = document.getElementById("logPasswordError");
      const note = document.getElementById("loginNote");

      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value;

      let valid = true;

      if (!isValidEmail(email)) {
        setError(emailInput, emailError, "Enter a valid email address.");
        valid = false;
      } else {
        setError(emailInput, emailError, "");
      }

      if (!password) {
        setError(passwordInput, passwordError, "Enter your password.");
        valid = false;
      } else {
        setError(passwordInput, passwordError, "");
      }

      if (!valid) {
        note.textContent = "";
        return;
      }

      const users = loadUsers();
      const record = users[email];

      if (!record || record.password !== encode(password)) {
        note.textContent = "Incorrect email or password.";
        note.className = "form-note is-error";
        return;
      }

      note.textContent = "Welcome back!";
      note.className = "form-note is-success";

      setTimeout(() => {
        loginForm.reset();
        note.textContent = "";
        startSession(email);
      }, 400);
    });
  }

  // --- Session management ---
  function getSession() {
    return localStorage.getItem(STORAGE_SESSION_KEY);
  }

  function startSession(email) {
    localStorage.setItem(STORAGE_SESSION_KEY, email);
    renderSession();
  }

  function endSession() {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    renderSession();
    showTab("login");
  }

  function renderSession() {
    const email = getSession();
    const userChip = document.getElementById("userChip");
    const userChipEmail = document.getElementById("userChipEmail");
    const openLoginBtn = document.getElementById("openLoginBtn");
    const openRegisterBtn = document.getElementById("openRegisterBtn");
    const authSuccessEmail = document.getElementById("authSuccessEmail");

    if (email) {
      if (userChip) userChip.hidden = false;
      if (userChipEmail) userChipEmail.textContent = email;
      if (openLoginBtn) openLoginBtn.hidden = true;
      if (openRegisterBtn) openRegisterBtn.hidden = true;

      if (registerForm) registerForm.classList.remove("is-active");
      if (loginForm) loginForm.classList.remove("is-active");
      if (authTabsWrap) authTabsWrap.hidden = true;
      if (authSuccess) {
        authSuccess.hidden = false;
        if (authSuccessEmail) authSuccessEmail.textContent = email;
      }
    } else {
      if (userChip) userChip.hidden = true;
      if (openLoginBtn) openLoginBtn.hidden = false;
      if (openRegisterBtn) openRegisterBtn.hidden = false;
      if (authTabsWrap) authTabsWrap.hidden = false;
      if (authSuccess) authSuccess.hidden = true;
      showTab("register");
    }
  }

  document.getElementById("logoutBtn")?.addEventListener("click", endSession);
  document.getElementById("authSwitchAccount")?.addEventListener("click", endSession);

  // Initialize session UI on load.
  renderSession();
})();
