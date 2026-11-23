"use strict";
// Auth pages (demo, no backend): switch forms, show/hide password,
// create an account / sign in against localStorage, then enter the site.
// NOTE: localStorage is readable by anyone using this browser, so this is for
// demos only — real accounts need a server.
const USERS_KEY = "coffea-users";
const SESSION_KEY = "coffea-session";
const HOME_URL = "./index.html";
const REDIRECT_DELAY = 900; // ms the success message stays visible

const authForms = {
  signup: document.querySelector("#signupForm"),
  login: document.querySelector("#loginForm"),
};

// ---- form switching (animated) ----
// Leaving form: content fades out. Entering form: the card morphs from the old
// card's height to its own while the fields rise in one after another.
const OUT_MS = 180;
const MORPH_MS = 420;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let currentForm = "signup";
let switching = false;

function playEnter(form, dir) {
  form.style.setProperty("--auth-dir", dir);
  Array.from(form.children).forEach(function (el, i) {
    el.style.setProperty("--auth-i", i);
  });
  form.classList.add("auth-form--in");
  window.setTimeout(function () {
    form.classList.remove("auth-form--in");
  }, 900);
}

function showAuthForm(name) {
  currentForm = authForms[name] ? name : "signup";
  Object.keys(authForms).forEach(function (key) {
    authForms[key].hidden = key !== currentForm;
  });
}

function switchAuthForm(name) {
  if (switching || name === currentForm || !authForms[name]) return;
  const from = authForms[currentForm];
  const to = authForms[name];
  const dir = name === "login" ? 1 : -1;
  currentForm = name;

  // clear old messages on the form we are leaving
  from.querySelector(".auth-error").hidden = true;
  from.querySelector(".auth-success").hidden = true;

  if (reduceMotion.matches) {
    from.hidden = true;
    to.hidden = false;
    return;
  }

  switching = true;
  const fromHeight = from.offsetHeight;
  from.classList.add("auth-form--out");

  window.setTimeout(function () {
    from.hidden = true;
    from.classList.remove("auth-form--out");

    to.hidden = false;
    const toHeight = to.offsetHeight; // natural height
    to.style.overflow = "hidden";
    to.style.height = fromHeight + "px";
    playEnter(to, dir);
    void to.offsetHeight; // commit the start height
    to.style.height = toHeight + "px";

    let done = false;
    function finish() {
      if (done) return;
      done = true;
      to.style.height = "";
      to.style.overflow = "";
      switching = false;
    }
    to.addEventListener("transitionend", function onEnd(e) {
      if (e.target === to && e.propertyName === "height") {
        to.removeEventListener("transitionend", onEnd);
        finish();
      }
    });
    window.setTimeout(finish, MORPH_MS + 150); // safety net
  }, OUT_MS);
}

document.querySelectorAll("[data-auth-show]").forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const name = link.dataset.authShow;
    switchAuthForm(name);
    window.history.replaceState(null, "", "#" + name);
  });
});
showAuthForm(window.location.hash.replace("#", ""));
playEnter(authForms[currentForm], 0);

// ---- show / hide password ----
document.querySelectorAll(".auth-eye").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const input = btn.parentElement.querySelector("[data-password]");
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.setAttribute("aria-pressed", String(show));
    btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    btn.querySelector("use").setAttribute("href", show ? "#eye-slash" : "#eye");
  });
});

// ---- confirm password must equal password ----
const signupPassword = document.querySelector("#signupPassword");
const signupConfirm = document.querySelector("#signupConfirm");

function checkPasswordsMatch() {
  signupConfirm.setCustomValidity(
    signupConfirm.value && signupConfirm.value !== signupPassword.value
      ? "Passwords do not match"
      : "",
  );
}
signupPassword.addEventListener("input", checkPasswordsMatch);
signupConfirm.addEventListener("input", checkPasswordsMatch);

// ---- storage helpers ----
function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

// Salted SHA-256 so the password itself is never stored as plain text.
// crypto.subtle only exists on https / localhost, so a small pure-JS SHA-256
// (same output) is used on plain http — never a plain-text fallback.
function sha256Fallback(message) {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
  ];
  const bytes = Array.from(new TextEncoder().encode(message));
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i--)
    bytes.push(i >= 4 ? 0 : (bitLen >>> (i * 8)) & 0xff);
  const rotr = function (x, n) {
    return (x >>> n) | (x << (32 - n));
  };
  for (let off = 0; off < bytes.length; off += 64) {
    const w = new Array(64);
    for (let i = 0; i < 16; i++) {
      w[i] =
        (bytes[off + i * 4] << 24) |
        (bytes[off + i * 4 + 1] << 16) |
        (bytes[off + i * 4 + 2] << 8) |
        bytes[off + i * 4 + 3];
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + w[i]) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    H[0] = (H[0] + a) | 0;
    H[1] = (H[1] + b) | 0;
    H[2] = (H[2] + c) | 0;
    H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0;
    H[5] = (H[5] + f) | 0;
    H[6] = (H[6] + g) | 0;
    H[7] = (H[7] + h) | 0;
  }
  return H.map(function (n) {
    return (n >>> 0).toString(16).padStart(8, "0");
  }).join("");
}

async function hashPassword(password, salt) {
  if (window.crypto && window.crypto.subtle) {
    const data = new TextEncoder().encode(salt + password);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map(function (b) {
        return b.toString(16).padStart(2, "0");
      })
      .join("");
  }
  return sha256Fallback(salt + password);
}
function makeSalt() {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map(function (b) {
      return b.toString(16).padStart(2, "0");
    })
    .join("");
}

// ---- messages ----
function showError(form, text) {
  const err = form.querySelector(".auth-error");
  form.querySelector(".auth-success").hidden = true;
  err.textContent = text;
  err.hidden = false;
}
function showSuccess(form, text) {
  const ok = form.querySelector(".auth-success");
  form.querySelector(".auth-error").hidden = true;
  ok.textContent = text;
  ok.hidden = false;
}
function enterSite(user) {
  writeJSON(SESSION_KEY, {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
  window.setTimeout(function () {
    window.location.href = HOME_URL;
  }, REDIRECT_DELAY);
}

// ---- submit handlers (the browser's own validation runs first) ----
authForms.signup.addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = authForms.signup;
  const submitBtn = form.querySelector(".auth-submit");
  const data = new FormData(form);
  const email = String(data.get("email")).trim().toLowerCase();
  const users = readJSON(USERS_KEY, []);

  if (
    users.some(function (u) {
      return u.email === email;
    })
  ) {
    showError(form, "An account with this email already exists.");
    return;
  }

  submitBtn.disabled = true;
  const salt = makeSalt();
  const user = {
    firstName: String(data.get("firstName")).trim(),
    lastName: String(data.get("lastName")).trim(),
    email: email,
    salt: salt,
    hash: await hashPassword(String(data.get("password")), salt),
  };
  users.push(user);

  if (!writeJSON(USERS_KEY, users)) {
    submitBtn.disabled = false;
    showError(
      form,
      "Could not save your account. Check browser storage settings.",
    );
    return;
  }
  showSuccess(form, "Account created. Taking you to the site…");
  enterSite(user);
});

authForms.login.addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = authForms.login;
  const submitBtn = form.querySelector(".auth-submit");
  const data = new FormData(form);
  const email = String(data.get("email")).trim().toLowerCase();
  const users = readJSON(USERS_KEY, []);
  const user = users.find(function (u) {
    return u.email === email;
  });

  submitBtn.disabled = true;
  const hash = user
    ? await hashPassword(String(data.get("password")), user.salt)
    : null;
  submitBtn.disabled = false;

  // same message for "no such email" and "wrong password"
  if (!user || hash !== user.hash) {
    showError(form, "Incorrect email or password.");
    return;
  }
  submitBtn.disabled = true;
  showSuccess(form, "Signed in. Taking you to the site…");
  enterSite(user);
});
