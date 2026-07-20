"use strict";
const searchInput = document.querySelector(".search-input");
const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-btn");
const welcome = document.querySelector(".hero-welcome");
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
