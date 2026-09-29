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
/* SLAYTI FAREYLE SURUKLEME */

(() => {
  function initEnergyMouseDrag() {
    document.querySelectorAll(
      "[data-energy-slider] .energy-track"
    ).forEach((track) => {

      if (track.dataset.mouseDragReady) return;
      track.dataset.mouseDragReady = "true";

      track.querySelectorAll("img").forEach((image) => {
        image.draggable = false;
      });

      track.addEventListener("dragstart", (event) => {
        event.preventDefault();
      });

      let drag = null;

      track.addEventListener("pointerdown", (event) => {
        if (
          event.pointerType !== "mouse" ||
          event.button !== 0
        ) {
          return;
        }

        const slide = track.querySelector(".energy-slide");
        if (!slide) return;

        event.preventDefault();
        track.focus({ preventScroll: true });

        const width = slide.getBoundingClientRect().width;

        drag = {
          id: event.pointerId,
          x: event.clientX,
          scroll: track.scrollLeft,
          width,
          index: Math.round(track.scrollLeft / width),
          distance: 0
        };

        track.classList.add("is-dragging");
        track.setPointerCapture(event.pointerId);
      });

      track.addEventListener("pointermove", (event) => {
        if (!drag || event.pointerId !== drag.id) return;

        drag.distance = event.clientX - drag.x;
        track.scrollLeft = drag.scroll - drag.distance;
      });

      function finish(event) {
        if (!drag || event.pointerId !== drag.id) return;

        const saved = drag;
        drag = null;

        const total =
          track.querySelectorAll(".energy-slide").length;

        let target = Math.round(
          track.scrollLeft / saved.width
        );

        const threshold = Math.min(
          60,
          saved.width * 0.15
        );

        if (
          event.type === "pointerup" &&
          Math.abs(saved.distance) > threshold
        ) {
          target =
            saved.index + (saved.distance < 0 ? 1 : -1);
        }

        target = Math.max(
          0,
          Math.min(total - 1, target)
        );

        track.classList.remove("is-dragging");

        if (track.hasPointerCapture(saved.id)) {
          track.releasePointerCapture(saved.id);
        }

        const reducedMotion = matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        track.scrollTo({
          left: target * saved.width,
          behavior: reducedMotion ? "instant" : "smooth"
        });
      }

      track.addEventListener("pointerup", finish);
      track.addEventListener("pointercancel", finish);
      track.addEventListener("lostpointercapture", finish);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initEnergyMouseDrag
    );
  } else {
    initEnergyMouseDrag();
  }
})();
