document.addEventListener("DOMContentLoaded", () => {

  /* MOBILE MENU */

  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".nav");

  if (menuButton && nav) {
    function closeMenu() {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
    }

    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.textContent = open ? "✕" : "☰";
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  /* CURRENT YEAR */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* PHOTO LIGHTBOX */

  const dialog = document.getElementById("lightbox");

  if (dialog) {
    const dialogImage = dialog.querySelector("img");
    const closeButton = dialog.querySelector(".lightbox-close");
    let previousOverflow = "";

    document.querySelectorAll(".gallery-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (
          typeof dialog.showModal !== "function" ||
          !dialogImage
        ) {
          return;
        }

        event.preventDefault();

        const image = link.querySelector("img");
        dialogImage.src = link.href;
        dialogImage.alt = image?.alt || "ChromoBoz";

        if (!dialog.open) {
          previousOverflow = document.body.style.overflow;
          dialog.showModal();
          document.body.style.overflow = "hidden";
        }
      });
    });

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        dialog.close();
      });
    }

    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;

      const bounds = dialog.getBoundingClientRect();
      const outside =
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom;

      if (outside) dialog.close();
    });

    dialog.addEventListener("close", () => {
      document.body.style.overflow = previousOverflow;

      if (dialogImage) {
        dialogImage.removeAttribute("src");
      }
    });
  }
});

/* COOKIE PREFERENCES AND GOOGLE ANALYTICS */

(() => {
  function initCookies() {
    if (document.getElementById("cb-cookie-panel")) return;

    const measurementId = "G-7CQG8F53NB";
    const storageKey = "ChoromoBoz-analytics-consent-v1";
    const lifetime = 180 * 24 * 60 * 60 * 1000;

    let analyticsStarted = false;

    const english =
      document.documentElement.lang.toLowerCase().startsWith("en") ||
      /\/en\.html$/.test(location.pathname);

    const text = english
      ? {
          title: "Your privacy",
          body: "With your permission, we use Google Analytics cookies to measure visits and how our website is used. Rejecting does not affect the website. Your choice is saved for 6 months and can be changed using Cookie preferences in the footer.",
          accept: "Accept analytics",
          reject: "Reject analytics",
          settings: "Cookie preferences",
          details: "How Google uses data"
        }
      : {
          title: "Το απόρρητό σας",
          body: "Με τη συγκατάθεσή σας, χρησιμοποιούμε cookies του Google Analytics για τη μέτρηση επισκέψεων και της χρήσης του ιστοτόπου. Η απόρριψη δεν επηρεάζει τη λειτουργία του. Η επιλογή σας αποθηκεύεται για 6 μήνες και αλλάζει από τις Προτιμήσεις cookies στο κάτω μέρος της σελίδας.",
          accept: "Αποδοχή στατιστικών",
          reject: "Απόρριψη στατιστικών",
          settings: "Προτιμήσεις cookies",
          details: "Πώς χρησιμοποιεί η Google τα δεδομένα"
        };

    function readChoice() {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey));

        if (
          saved &&
          saved.expires > Date.now() &&
          ["accepted", "rejected"].includes(saved.choice)
        ) {
          return saved.choice;
        }
      } catch (_) {}

      return null;
    }

    function saveChoice(choice) {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            choice,
            expires: Date.now() + lifetime
          })
        );
      } catch (_) {}
    }

    function clearAnalyticsCookies() {
      const domains = [
        "",
        location.hostname,
        "." + location.hostname,
        "chromoboz.com",
        ".chromoboz.com"
      ];

      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();

        if (name !== "_ga" && !name.startsWith("_ga_")) return;

        domains.forEach((domain) => {
          document.cookie =
            name +
            "=; Max-Age=0; Path=/; SameSite=Lax" +
            (domain ? "; Domain=" + domain : "");
        });
      });
    }

    window["ga-disable-" + measurementId] = true;

    function startAnalytics() {
      window["ga-disable-" + measurementId] = false;

      if (analyticsStarted) {
        window.gtag("consent", "update", {
          analytics_storage: "granted"
        });
        return;
      }

      analyticsStarted = true;
      window.dataLayer = window.dataLayer || [];

      window.gtag = window.gtag || function () {
        window.dataLayer.push(arguments);
      };

      window.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      });

      window.gtag("consent", "update", {
        analytics_storage: "granted"
      });

      window.gtag("js", new Date());

      window.gtag("config", measurementId, {
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_expires: 15552000
      });

      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://www.googletagmanager.com/gtag/js?id=" + measurementId;

      document.head.appendChild(script);
    }

    const style = document.createElement("style");

    style.textContent = `
      #cb-cookie-panel {
        position: fixed;
        bottom: 16px;
        left: 16px;
        width: min(440px, calc(100vw - 32px));
        max-height: 75vh;
        overflow: auto;
        box-sizing: border-box;
        padding: 22px;
        background: #fff;
        color: #172333;
        border: 1px solid #ccd3dd;
        border-radius: 14px;
        box-shadow: 0 8px 35px #0003;
        z-index: 10000;
        font: 15px/1.6 system-ui, sans-serif;
      }

      #cb-cookie-panel[hidden] {
        display: none !important;
      }

      #cb-cookie-panel h2 {
        margin: 0 0 10px;
        font: bold 20px/1.3 system-ui, sans-serif;
        color: #172333;
        letter-spacing: normal;
        word-spacing: normal;
      }

      #cb-cookie-panel p {
        margin: 0 0 12px;
        color: #172333;
      }

      #cb-cookie-panel a {
        color: #174b91;
        text-decoration: underline;
      }

      #cb-cookie-panel .cb-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }

      #cb-cookie-panel button {
        flex: 1;
        border: 1px solid #17385b;
        border-radius: 8px;
        padding: 11px 15px;
        background: #17385b;
        color: #fff;
        cursor: pointer;
        font: 600 14px/1.4 system-ui, sans-serif;
      }

      #cb-cookie-settings {
        position: static;
        background: transparent;
        color: inherit;
        border: 0;
        padding: 8px 0;
        border-radius: 0;
        font: inherit;
        text-decoration: underline;
        cursor: pointer;
      }

      #cb-cookie-panel button:focus-visible,
      #cb-cookie-settings:focus-visible {
        outline: 3px solid #eaa900;
        outline-offset: 3px;
      }
    `;

    document.head.appendChild(style);

    const panel = document.createElement("section");
    panel.id = "cb-cookie-panel";
    panel.setAttribute("aria-labelledby", "cb-cookie-title");

    panel.innerHTML = `
      <h2 id="cb-cookie-title">${text.title}</h2>
      <p>${text.body}</p>

      <a
        href="https://policies.google.com/technologies/partner-sites"
        target="_blank"
        rel="noopener noreferrer">
        ${text.details}
      </a>

      <div class="cb-actions">
        <button type="button" data-choice="accepted">
          ${text.accept}
        </button>
        <button type="button" data-choice="rejected">
          ${text.reject}
        </button>
      </div>
    `;

    const settings = document.createElement("button");
    settings.id = "cb-cookie-settings";
    settings.type = "button";
    settings.textContent = text.settings;
    settings.setAttribute("aria-controls", panel.id);

    function showPanel(show) {
      panel.hidden = !show;
      settings.setAttribute("aria-expanded", String(show));
    }

    settings.addEventListener("click", () => {
      showPanel(panel.hidden);

      if (!panel.hidden) {
        panel.querySelector("button").focus();
      }
    });

    panel.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-choice]");
      if (!button) return;

      const choice = button.dataset.choice;
      saveChoice(choice);

      if (choice === "accepted") {
        startAnalytics();
      } else {
        window["ga-disable-" + measurementId] = true;

        if (analyticsStarted && window.gtag) {
          window.gtag("consent", "update", {
            analytics_storage: "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied"
          });
        }

        clearAnalyticsCookies();
      }

      showPanel(false);
      settings.focus({ preventScroll: true });
    });

    document.body.appendChild(panel);

    const footer = document.querySelector(".footer-bottom");
    (footer || document.body).appendChild(settings);

    const choice = readChoice();
    showPanel(choice === null);

    if (choice === "accepted") {
      startAnalytics();
    } else {
      clearAnalyticsCookies();
    }

    window.addEventListener("storage", (event) => {
      if (event.key === storageKey || event.key === null) {
        window["ga-disable-" + measurementId] = true;
        location.reload();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCookies);
  } else {
    initCookies();
  }
})();

/* ACTIVE PROJECTS SLIDER */

(() => {
  function initEnergySliders() {
    document.querySelectorAll("[data-energy-slider]").forEach((slider) => {
      if (slider.dataset.ready) return;
      slider.dataset.ready = "true";

      const track = slider.querySelector(".energy-track");
      if (!track) return;

      const slides = Array.from(track.querySelectorAll(".energy-slide"));
      const previous = slider.querySelector(".energy-prev");
      const next = slider.querySelector(".energy-next");
      const count = slider.querySelector(".energy-count");

      if (!slides.length || !previous || !next || !count) return;

      let current = 0;

      function update() {
        const width = slides[0].getBoundingClientRect().width;
        if (!width) return;

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

/* MOUSE DRAG */

(() => {
  function initEnergyMouseDrag() {
    const dragStyle = document.createElement("style");

    dragStyle.textContent = `
      .energy-track {
        cursor: grab;
      }

      .energy-track.is-dragging {
        cursor: grabbing;
        scroll-snap-type: none;
        scroll-behavior: auto;
      }

      .energy-track,
      .energy-track * {
        user-select: none;
        -webkit-user-select: none;
      }

      .energy-track img {
        -webkit-user-drag: none;
      }
    `;

    document.head.appendChild(dragStyle);

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

        const total = track.querySelectorAll(".energy-slide").length;

        let target = Math.round(track.scrollLeft / saved.width);
        const threshold = Math.min(60, saved.width * 0.15);

        if (
          event.type === "pointerup" &&
          Math.abs(saved.distance) > threshold
        ) {
          target = saved.index + (saved.distance < 0 ? 1 : -1);
        }

        target = Math.max(0, Math.min(total - 1, target));

        track.classList.remove("is-dragging");

        if (track.hasPointerCapture(saved.id)) {
          track.releasePointerCapture(saved.id);
        }

        const reducedMotion =
          matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    document.addEventListener("DOMContentLoaded", initEnergyMouseDrag);
  } else {
    initEnergyMouseDrag();
  }
})();
