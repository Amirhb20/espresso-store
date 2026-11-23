"use strict";
// loading screen
const loader = document.querySelector("#loader");

const LOADER_DURATION = 4000; // ms - total time the loader stays before fading out (per request: 3-5s)

if (loader) {
  document.body.classList.add("overflow-hidden");

  window.setTimeout(function () {
    loader.classList.add("loader--hidden");
    document.body.classList.remove("overflow-hidden");
  }, LOADER_DURATION);
}

//varible
const searchInput = document.querySelector(".search-input");
const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-btn");
const welcome = document.querySelector(".hero-welcome");
const navOpenBtn = document.querySelector(".nav-open-icon");
const navcloseBtn = document.querySelector(".nav-close-icon");
const overlay = document.querySelector(".overlay");
const nav = document.querySelector(".nav");

// search Box open & close
searchBtn.addEventListener("click", function () {
  searchInput.classList.toggle("search-input--active");
  if (searchInput.classList.contains("search-input--active")) {
    searchInput.focus();
  } else {
    searchInput.blur();
  }
});

// Animation title
const text = "Welcome";
let index = 0;
welcome.textContent = "";

function typeWriter() {
  if (index < text.length) {
    welcome.textContent += text.charAt(index);
    index++;
    setTimeout(typeWriter, 90);
  }
}
window.addEventListener("load", typeWriter);

// open & close menu
function openMobileNav() {
  nav.classList.remove("-left-80");
  nav.classList.add("left-0");
  overlay.classList.add("overlay--visible");
  document.body.classList.add("overflow-hidden"); // lock page scroll behind the drawer
}
function closeMobileNav() {
  nav.classList.remove("left-0");
  nav.classList.add("-left-80");
  overlay.classList.remove("overlay--visible");
  document.body.classList.remove("overflow-hidden");
}

navOpenBtn.addEventListener("click", openMobileNav);
navcloseBtn.addEventListener("click", closeMobileNav);
overlay.addEventListener("click", closeMobileNav);

// back to top button
const backToTop = document.querySelector(".back-to-top");
const shopSection = document.querySelector("#shop");

if (backToTop && shopSection) {
  let isVisible = false;
  let ticking = false;

  function getShopTop() {
    return shopSection.getBoundingClientRect().top + window.scrollY;
  }

  function updateBackToTop() {
    const shopTop = getShopTop();
    const shouldShow = window.scrollY >= shopTop;

    if (shouldShow && !isVisible) {
      // slide in from the right
      backToTop.classList.remove("back-to-top--exit");
      backToTop.classList.add("back-to-top--enter");
      isVisible = true;
    } else if (!shouldShow && isVisible) {
      // fade out in place (no slide)
      backToTop.classList.remove("back-to-top--enter");
      backToTop.classList.add("back-to-top--exit");
      isVisible = false;
    }
  }

  // once the fade-out finishes, reset off-screen so it can slide in again next time
  backToTop.addEventListener("transitionend", function (e) {
    if (
      e.propertyName === "opacity" &&
      backToTop.classList.contains("back-to-top--exit")
    ) {
      backToTop.classList.remove("back-to-top--exit");
    }
  });

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  });

  window.addEventListener("load", updateBackToTop);
}

const heartBtns = document.querySelectorAll(".heart-btn");

heartBtns.forEach(function (heartBtn) {
  heartBtn.addEventListener("click", function () {
    const outline = this.querySelector(".heart-outline");
    const filled = this.querySelector(".heart-filled");

    outline.classList.toggle("hidden");
    filled.classList.toggle("hidden");
  });
});
document.querySelectorAll(".like-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("fill-red-500");
    btn.classList.toggle("stroke-red-500");
    btn.classList.toggle("fill-transparent");
    btn.classList.toggle("stroke-white");
  });
});

// cart
const CART_STORAGE_KEY = "coffea-cart";

function getCart() {
  try {
    return JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function formatPrice(amount) {
  return "Rs. " + amount;
}

function showToast(message) {
  const toast = document.querySelector("#cartToast");
  if (!toast) return;

  toast.querySelector(".toast-message").textContent = message;
  toast.classList.add("toast--visible");

  window.clearTimeout(toast._hideTimer);
  toast._hideTimer = window.setTimeout(function () {
    toast.classList.remove("toast--visible");
  }, 2000);
}

function parsePrice(text) {
  const match = text.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

function renderCart() {
  const cart = getCart();
  const totalQty = cart.reduce(function (sum, item) {
    return sum + item.qty;
  }, 0);
  const totalPrice = cart.reduce(function (sum, item) {
    return sum + item.qty * item.price;
  }, 0);

  document.querySelectorAll(".cart-badge").forEach(function (badge) {
    if (totalQty > 0) {
      badge.textContent = totalQty;
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  });

  document.querySelectorAll(".cart-display").forEach(function (display) {
    const list = display.querySelector(".cart-items");
    const emptyMsg = display.querySelector(".cart-empty-msg");
    const totalRow = display.querySelector(".cart-total-row");
    const totalPriceEl = display.querySelector(".cart-total-price");

    list.innerHTML = "";

    if (cart.length === 0) {
      emptyMsg.classList.remove("hidden");
      totalRow.classList.add("hidden");
      return;
    }

    emptyMsg.classList.add("hidden");
    totalRow.classList.remove("hidden");
    totalPriceEl.textContent = formatPrice(totalPrice);

    cart.forEach(function (item) {
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML =
        '<img class="cart-item-img" src="' +
        (item.image || "") +
        '" alt="" onerror="this.style.display=\'none\'" />' +
        '<div class="cart-item-info"><p class="font-Outfit-Medium text-Dark-Walnut text-sm truncate">' +
        item.name +
        ' <span class="text-Light-Taupe">\u00d7' +
        item.qty +
        '</span></p><p class="font-Outfit-Regular text-xs text-Light-Taupe">' +
        formatPrice(item.price) +
        '</p></div><button class="cart-item-remove" data-id="' +
        item.id +
        '" aria-label="Remove item"><svg class="w-3.5 h-3.5"><use href="#x-mark"></use></svg></button>';
      list.appendChild(li);
    });
  });
}

function bumpCartBadges() {
  document.querySelectorAll(".cart-badge").forEach(function (badge) {
    badge.classList.remove("cart-badge--bump");
    void badge.offsetWidth; // restart animation
    badge.classList.add("cart-badge--bump");
  });
}

function addToCart(id, name, price, image) {
  const cart = getCart();
  const existing = cart.find(function (item) {
    return item.id === id;
  });

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: id, name: name, price: price, qty: 1, image: image });
  }

  saveCart(cart);
  renderCart();
  bumpCartBadges();
  showToast(name + " added to cart");
}

function removeFromCart(id) {
  let cart = getCart();
  const existing = cart.find(function (item) {
    return item.id === id;
  });

  if (existing) {
    existing.qty -= 1;
    if (existing.qty <= 0) {
      cart = cart.filter(function (item) {
        return item.id !== id;
      });
    }
  }

  saveCart(cart);
  renderCart();
}

function closeAllCartDropdowns() {
  document.querySelectorAll(".cart-dropdown--open").forEach(function (d) {
    d.classList.remove("cart-dropdown--open");
    const btn = d.parentElement.querySelector(".cart-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  });
}

renderCart();

document.addEventListener("click", function (e) {
  const addBtn = e.target.closest(".add-to-cart-btn");
  if (addBtn) {
    const slide = addBtn.closest(".swiper-slide");
    const nameEl = slide && slide.querySelector("h4");
    const priceEl = slide && slide.querySelector("p.font-Poppins-SemiBold");
    const imgEl = slide && slide.querySelector("img");
    const productId = addBtn.dataset.productId;
    if (!nameEl || !priceEl || !productId) return;

    addToCart(
      productId,
      nameEl.textContent.trim(),
      parsePrice(priceEl.textContent),
      imgEl ? imgEl.getAttribute("src") : "",
    );

    // temporary "added" feedback, then revert to the cart icon
    window.clearTimeout(addBtn._resetTimer);
    if (!addBtn.dataset.originalHtml) {
      addBtn.dataset.originalHtml = addBtn.innerHTML;
    }
    addBtn.classList.add("add-to-cart-btn--added");
    addBtn.innerHTML =
      '<span class="font-Poppins-SemiBold text-base text-white">\u2713</span>';

    addBtn._resetTimer = window.setTimeout(function () {
      addBtn.classList.remove("add-to-cart-btn--added");
      addBtn.innerHTML = addBtn.dataset.originalHtml;
    }, 1200);
    return;
  }

  const cartBtn = e.target.closest(".cart-btn");
  if (cartBtn) {
    const dropdown = cartBtn.parentElement.querySelector(".cart-dropdown");

    // mobile cart icon has no popover of its own — it opens the drawer,
    // where the cart panel already lives
    if (!dropdown) {
      openMobileNav();
      return;
    }

    const isOpen = dropdown.classList.contains("cart-dropdown--open");
    closeAllCartDropdowns();

    if (!isOpen) {
      dropdown.classList.add("cart-dropdown--open");
      cartBtn.setAttribute("aria-expanded", "true");
    }
    return;
  }

  const removeBtn = e.target.closest(".cart-item-remove");
  if (removeBtn) {
    removeFromCart(removeBtn.dataset.id);
    return;
  }

  if (!e.target.closest(".cart-dropdown")) {
    closeAllCartDropdowns();
  }
});

// account state in the header (session is written by auth.js on login / sign up)
const SESSION_KEY = "coffea-session";

function getSession() {
  try {
    const session = JSON.parse(window.localStorage.getItem(SESSION_KEY));
    return session && session.email ? session : null;
  } catch (e) {
    return null;
  }
}

function setText(selector, text) {
  document.querySelectorAll(selector).forEach(function (el) {
    el.textContent = text; // textContent, never innerHTML: names are user input
  });
}

function closeUserMenus() {
  document.querySelectorAll(".user-dropdown--open").forEach(function (d) {
    d.classList.remove("user-dropdown--open");
  });
  document.querySelectorAll(".user-menu-btn").forEach(function (b) {
    b.setAttribute("aria-expanded", "false");
  });
}

function renderAuthState() {
  const session = getSession();

  document.querySelectorAll("[data-login-link]").forEach(function (el) {
    el.classList.toggle("hidden", !!session);
  });
  document.querySelectorAll("[data-user-menu]").forEach(function (el) {
    el.classList.toggle("hidden", !session);
  });

  if (!session) {
    closeUserMenus();
    return;
  }
  const first = (session.firstName || "").trim();
  const full = (first + " " + (session.lastName || "")).trim();
  setText("[data-user-initial]", (first || session.email).charAt(0));
  setText("[data-user-first]", first || session.email);
  setText("[data-user-fullname]", full || session.email);
  setText("[data-user-email]", session.email);
}

renderAuthState();
window.addEventListener("storage", function (e) {
  if (e.key === SESSION_KEY) renderAuthState(); // signed in/out in another tab
});

document.addEventListener("click", function (e) {
  const userBtn = e.target.closest(".user-menu-btn");
  if (userBtn) {
    const dropdown = userBtn.parentElement.querySelector(".user-dropdown");
    const isOpen = dropdown.classList.contains("user-dropdown--open");
    closeUserMenus();
    if (!isOpen) {
      dropdown.classList.add("user-dropdown--open");
      userBtn.setAttribute("aria-expanded", "true");
    }
    return;
  }

  if (e.target.closest("[data-logout]")) {
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch (err) {
      /* storage blocked: nothing to clear */
    }
    closeUserMenus();
    renderAuthState();
    showToast("You have been signed out");
    return;
  }

  if (!e.target.closest(".user-dropdown")) {
    closeUserMenus();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeUserMenus();
});

//swiper varible
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 4,
  spaceBetween: 10,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".coffee-next",
    prevEl: ".coffee-prev",
  },
  breakpoints: {
    330: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 50,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 10,
    },
  },
});
var swiper = new Swiper(".mySwiper2", {
  slidesPerView: 4,
  spaceBetween: 10,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".dessert-next",
    prevEl: ".dessert-prev",
  },
  breakpoints: {
    330: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 50,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 10,
    },
  },
});
var swiper = new Swiper(".mySwiper3", {
  slidesPerView: 4,
  spaceBetween: 10,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".dessert-next",
    prevEl: ".dessert-prev",
  },
  breakpoints: {
    330: {
      slidesPerView: 1,
    },
    910: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1300: {
      slidesPerView: 3,
      spaceBetween: 50,
    },
  },
});
