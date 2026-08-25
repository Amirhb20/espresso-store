"use strict";
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
navOpenBtn.addEventListener("click", function () {
  nav.classList.remove("-left-64");
  nav.classList.add("left-0");
  overlay.classList.add("overlay--visible");
});
navcloseBtn.addEventListener("click", function () {
  nav.classList.remove("left-0");
  nav.classList.add("-left-64");
  overlay.classList.remove("overlay--visible");
});
overlay.addEventListener("click", function () {
  nav.classList.remove("left-0");
  nav.classList.add("-left-64");

  overlay.classList.remove("overlay--visible");
});

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
