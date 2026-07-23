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
