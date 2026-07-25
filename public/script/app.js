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
