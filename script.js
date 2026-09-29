document.addEventListener("DOMContentLoaded", () => {
  /* MOBILE MENU */

  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        open ? "true" : "false"
      );

      menuButton.textContent = open ? "✕" : "☰";
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";
      }
    });
  }

  /* CURRENT YEAR */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* LIGHTBOX */

  const dialog = document.getElementById("lightbox");

  if (dialog) {
    const dialogImage = dialog.querySelector("img");
    const closeButton = dialog.querySelector(".lightbox-close");
    const galleryLinks = document.querySelectorAll(".gallery-link");

    galleryLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        if (typeof dialog.showModal !== "function") {
          return;
        }

        event.preventDefault();

        const image = link.querySelector("img");

        if (dialogImage && image) {
          dialogImage.src = link.getAttribute("href");
          dialogImage.alt = image.alt || "CHROMO BOZ";
        }

        dialog.showModal();
        document.body.style.overflow = "hidden";
      });
    });

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        dialog.close();
      });
    }

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    dialog.addEventListener("close", () => {
      document.body.style.overflow = "";

      if (dialogImage) {
        dialogImage.removeAttribute("src");
      }
    });
  }
});

/* COOKIE PREFERENCES + GOOGLE ANALYTICS */

(() => {
  function initCookies() {
    if (document.getElementById("cb-cookie-panel")) return;

    const measurementId = "G-7CQG8F53NB";

    // Keep the
/* ACTIVE PROJECTS SLIDER */

(() => {
  function initEnergySliders() {
    document.querySelectorAll("[data-energy-slider]").forEach((slider) => {
      if (slider.dataset.ready) return;
      slider.dataset.ready = "true";

      const track = slider.querySelector(".energy-track");
      const slides = Array.from(track.querySelectorAll(".energy-slide"));
      const previous = slider.querySelector(".energy-prev");
      const next = slider.querySelector(".energy-next");
      const count = slider.querySelector(".energy-count");

      if (!slides.length) return;

      let current = 0;

      function update() {
        const width = slides[0].getBoundingClientRect().width;

        current = Math.max(
          0,
          Math.min(
            slides.length - 1,
            Math.round(track.scrollLeft / width)
          )
        );

        count.textContent = (current + 1) + " / " + slides.length;
      }

      function move(direction) {
        const target =
          (current + direction + slides.length) % slides.length;

        const reducedMotion =
          matchMedia("(prefers-reduced-motion: reduce)").matches;

        track.scrollTo({
          left: target * slides[0].getBoundingClientRect().width,
          behavior: reducedMotion ? "instant" : "smooth"
        });
      }

      previous.disabled = next.disabled = slides.length < 2;

      previous.addEventListener("click", () => move(-1));
      next.addEventListener("click", () => move(1));

      track.addEventListener("scroll", update, { passive: true });

      track.addEventListener("keydown", (event) => {
        if (
          event.key === "ArrowRight" ||
          event.key === "ArrowLeft"
        ) {
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }
      });

      update();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEnergySliders);
  } else {
    initEnergySliders();
  }
})();
