document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // MOBILE MENU
  // =========================

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".navigation");

  if (toggle && nav) {

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      toggle.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

      toggle.textContent = isOpen ? "✕" : "☰";
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
      }
    });

  }


  // =========================
  // CURRENT YEAR
  // =========================

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  // =========================
  // IMAGE LIGHTBOX
  // =========================

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

        const thumbnail = link.querySelector("img");

        if (dialogImage && thumbnail) {
          dialogImage.src = link.getAttribute("href");
          dialogImage.alt = thumbnail.alt || "CHROMO BOZ";
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
        dialogImage.src = "";
      }

    });


    document.addEventListener("keydown", (event) => {

      if (event.key === "Escape" && dialog.open) {
        dialog.close();
      }

    });

  }

});
