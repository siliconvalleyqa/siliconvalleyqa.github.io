// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const burger = document.querySelector(".burger");
const mobile = document.querySelector(".mobilemenu");

if (burger && mobile) {
  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!expanded));
    mobile.hidden = expanded;
  });

  mobile.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      burger.setAttribute("aria-expanded", "false");
      mobile.hidden = true;
    });
  });
}

/**
 * Subtle parallax for product-shot panels.
 * - Uses mouse position (desktop) + tiny scroll influence (all).
 * - Honors prefers-reduced-motion.
 * - Very low amplitude to keep it "premium".
 */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const panels = Array.from(document.querySelectorAll("[data-parallax]"));

if (!reduceMotion && panels.length) {
  const state = {
    mx: 0, my: 0, // mouse normalized -0.5..0.5
    sx: 0, sy: 0, // scroll influence
    raf: null
  };

  // Cache geometry for nicer behavior
  const geo = panels.map(el => ({
    el,
    depth: Number(el.getAttribute("data-depth") || 10),
    rect: el.getBoundingClientRect(),
  }));

  const updateRects = () => {
    for (const g of geo) g.rect = g.el.getBoundingClientRect();
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // mouse parallax
  window.addEventListener("mousemove", (e) => {
    const nx = (e.clientX / window.innerWidth) - 0.5;
    const ny = (e.clientY / window.innerHeight) - 0.5;
    state.mx = clamp(nx, -0.5, 0.5);
    state.my = clamp(ny, -0.5, 0.5);
    requestTick();
  }, { passive: true });

  // scroll parallax (tiny)
  window.addEventListener("scroll", () => {
    const t = window.scrollY || 0;
    // gentle oscillation feel, not a dramatic drift
    state.sy = clamp((t % 800) / 800 - 0.5, -0.5, 0.5);
    requestTick();
  }, { passive: true });

  window.addEventListener("resize", () => {
    updateRects();
    requestTick();
  });

  // run initial measure
  updateRects();

  function requestTick() {
    if (state.raf) return;
    state.raf = requestAnimationFrame(tick);
  }

  function tick() {
    state.raf = null;

    for (const g of geo) {
      const { el, depth, rect } = g;

      // Element-specific center weighting so panels move slightly differently
      const cx = (rect.left + rect.width / 2) / window.innerWidth - 0.5;
      const cy = (rect.top + rect.height / 2) / window.innerHeight - 0.5;

      // Compose mouse influence + small element offset + small scroll influence
      const dx = (state.mx - cx) * (depth * 0.65);
      const dy = (state.my - cy + state.sy * 0.35) * (depth * 0.65);

      // keep it subtle: clamp movement in pixels
      const tx = clamp(dx, -10, 10);
      const ty = clamp(dy, -10, 10);

      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    }
  }

  // also animate in gently when the page loads
  requestTick();
} else {
  // Ensure no transform if reduced motion is on
  panels.forEach(p => p.style.transform = "translate3d(0,0,0)");
}
