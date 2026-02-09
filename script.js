// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav
const hamburger = document.querySelector(".nav__hamburger");
const mobile = document.querySelector(".nav__mobile");

if (hamburger && mobile) {
  hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));
    mobile.hidden = expanded;
  });

  mobile.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      hamburger.setAttribute("aria-expanded", "false");
      mobile.hidden = true;
    });
  });
}

// Subtle reveal on scroll (Apple-ish: calm, minimal)
const targets = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("is-visible");
  });
}, { threshold: 0.12 });

targets.forEach(t => io.observe(t));
