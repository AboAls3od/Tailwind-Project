
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuIcon = menuBtn?.querySelector("i");
const navSearch = document.getElementById("nav-search");

menuBtn?.addEventListener("click", () => {
  navLinks?.classList.toggle("hidden");
  navLinks?.classList.toggle("flex");
  navLinks?.classList.toggle("-translate-y-full");
  navLinks?.classList.toggle("translate-y-0");
  if (menuIcon) {
    menuIcon.className = navLinks?.classList.contains("translate-y-0")
      ? "ri-close-line"
      : "ri-menu-line";
  }
});

navLinks?.addEventListener("click", () => {
  if (window.innerWidth < 768) {
    navLinks.classList.add("hidden");
    navLinks.classList.remove("flex");
    navLinks.classList.add("-translate-y-full");
    navLinks.classList.remove("translate-y-0");
    if (menuIcon) {
      menuIcon.className = "ri-menu-line";
    }
  }
});

navSearch?.addEventListener("click", () => {
  navSearch.classList.toggle("open");
});


const revealOptions = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header-image img", { ...revealOptions, origin: "right" });
ScrollReveal().reveal(".header-content div", { duration: 1000, delay: 500 });
ScrollReveal().reveal(".header-content h1", { ...revealOptions, delay: 1000 });
ScrollReveal().reveal(".header-content p", { ...revealOptions, delay: 1500 });
ScrollReveal().reveal(".deals-card", { ...revealOptions, interval: 500 });
ScrollReveal().reveal(".about-image img", { ...revealOptions, origin: "right" });
ScrollReveal().reveal(".about-card", { duration: 1000, interval: 500, delay: 500 });



document.getElementById("login").onclick = () => {
  location.href = "login.html";
};

