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
        dialogImage.src = "";
      }

    });

  }

});
