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
/* COOKIE PREFERENCES + GOOGLE ANALYTICS */
(() => {
  function initCookies() {
    if (document.getElementById("cb-cookie-panel")) return;

    const measurementId = "G-7CQG8F53NB";
    const storageKey = "chromoboz-analytics-consent-v1";
    const lifetime = 180 * 24 * 60 * 60 * 1000;
    let analyticsStarted = false;

    const english =
      document.documentElement.lang.toLowerCase().startsWith("en") ||
      /\/en\.html$/.test(location.pathname);

    const text = english
      ? {
          title: "Your privacy",
          body: "With your permission, we use Google Analytics cookies to measure visits and how our website is used. Rejecting does not affect the website. Your choice is saved for 6 months and can be changed using the Cookies button.",
          accept: "Accept analytics",
          reject: "Reject analytics",
          settings: "Cookies",
          details: "How Google uses data"
        }
      : {
          title: "Το απόρρητό σας",
          body: "Με τη συγκατάθεσή σας, χρησιμοποιούμε cookies του Google Analytics για τη μέτρηση επισκέψεων και της χρήσης του ιστοτόπου. Η απόρριψη δεν επηρεάζει τη λειτουργία του. Η επιλογή σας αποθηκεύεται για 6 μήνες και αλλάζει από το κουμπί Cookies.",
          accept: "Αποδοχή στατιστικών",
          reject: "Απόρριψη στατιστικών",
          settings: "Cookies",
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
        localStorage.setItem(storageKey, JSON.stringify({
          choice,
          expires: Date.now() + lifetime
        }));
      } catch (_) {
        // If storage is blocked, ask again on the next page.
      }
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
            name + "=; Max-Age=0; Path=/; SameSite=Lax" +
            (domain ? "; Domain=" + domain : "");
        });
      });
    }

    window["ga-disable-" + measurementId] = true;

    function startAnalytics() {
      window["ga-disable-" + measurementId] = false;
      if (analyticsStarted) return;
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
        position: fixed; bottom: 70px; left: 16px;
        width: min(440px, calc(100vw - 32px));
        max-height: 75vh; overflow: auto;
        box-sizing: border-box; padding: 22px;
        background: #fff; color: #172333;
        border: 1px solid #ccd3dd; border-radius: 14px;
        box-shadow: 0 8px 35px #0003;
        z-index: 10000; font: 15px/1.6 system-ui, sans-serif;
      }
      #cb-cookie-panel[hidden] { display: none !important; }
      #cb-cookie-panel h2 {
        margin: 0 0 10px; font: bold 20px/1.3 system-ui;
        color: #172333;
      }
      #cb-cookie-panel p { margin: 0 0 12px; color: #172333; }
      #cb-cookie-panel a { color: #174b91; text-decoration: underline; }
      #cb-cookie-panel .cb-actions {
        display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px;
      }
      #cb-cookie-panel button, #cb-cookie-settings {
        border: 1px solid #17385b; border-radius: 8px;
        padding: 11px 15px; background: #17385b; color: #fff;
        cursor: pointer; font: 600 14px/1.4 system-ui;
      }
      #cb-cookie-panel button { flex: 1; }
      #cb-cookie-settings {
        position: fixed; bottom: 16px; left: 16px; z-index: 9999;
      }
      #cb-cookie-panel button:focus-visible,
      #cb-cookie-settings:focus-visible {
        outline: 3px solid #eaa900; outline-offset: 3px;
      }
    `;
    document.head.appendChild(style);

    const panel = document.createElement("section");
    panel.id = "cb-cookie-panel";
    panel.setAttribute("aria-labelledby", "cb-cookie-title");
    panel.innerHTML = `
      <h2 id="cb-cookie-title">${text.title}</h2>
      <p>${text.body}</p>
      <a href="https://policies.google.com/technologies/partner-sites"
         target="_blank" rel="noopener noreferrer">${text.details}</a>
      <div class="cb-actions">
        <button type="button" data-choice="accepted">${text.accept}</button>
        <button type="button" data-choice="rejected">${text.reject}</button>
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
      if (!panel.hidden) panel.querySelector("button").focus();
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
      settings.focus();
    });

    document.body.append(panel, settings);

    const choice = readChoice();
    showPanel(choice === null);
    if (choice === "accepted") startAnalytics();
    else clearAnalyticsCookies();

    // Apply preference changes made in another open tab.
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
