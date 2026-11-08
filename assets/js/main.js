/* ==========================================================================
   Логика интерфейса: мобильное меню и подстановка значений из config.js.
   Без внешних библиотек. Если JavaScript отключён, страница остаётся
   читаемой: все тексты по умолчанию уже записаны в HTML.
   ========================================================================== */

(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};
  var isLive = config.releaseStatus === "live";

  /* ---------- Цены ---------- */
  document.querySelectorAll("[data-price]").forEach(function (el) {
    var value = config.price && config.price[el.dataset.price];
    if (value) el.textContent = value;
  });

  /* ---------- Тексты о статусе релиза ---------- */
  document.querySelectorAll("[data-release]").forEach(function (el) {
    var texts = config.releaseText && config.releaseText[el.dataset.release];
    if (texts) el.textContent = isLive ? texts.live : texts.planned;
  });

  /* Блоки, которые относятся только к одному статусу релиза */
  document.querySelectorAll("[data-when]").forEach(function (el) {
    el.hidden = el.dataset.when !== (isLive ? "live" : "planned");
  });

  /* ---------- Ссылка на установку ---------- */
  var downloadButtons = document.querySelectorAll("[data-download]");
  var pendingNotes = document.querySelectorAll("[data-download-pending]");
  var canDownload = isLive && Boolean(config.downloadUrl);

  downloadButtons.forEach(function (btn) {
    if (canDownload) {
      btn.href = config.downloadUrl;
      btn.hidden = false;
    } else {
      btn.hidden = true;
    }
  });
  pendingNotes.forEach(function (note) {
    note.hidden = canDownload;
  });

  /* ---------- Социальные и контактные ссылки ---------- */
  var hasAnyLink = false;

  document.querySelectorAll("[data-link]").forEach(function (el) {
    var url = config.links && config.links[el.dataset.link];
    if (url) {
      el.href = url;
      el.hidden = false;
      hasAnyLink = true;
    } else {
      el.hidden = true;
    }
  });

  var linksNote = document.getElementById("links-pending");
  if (linksNote) linksNote.hidden = hasAnyLink;

  /* ---------- Мобильное меню ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  var desktopQuery = window.matchMedia("(min-width: 821px)");

  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    /* Закрываем меню после перехода к разделу */
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    /* Escape закрывает меню и возвращает фокус на кнопку */
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    /* На широком экране меню всегда открыто через обычную панель */
    var onBreakpoint = function (event) {
      if (event.matches) setOpen(false);
    };
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", onBreakpoint);
    } else {
      desktopQuery.addListener(onBreakpoint);
    }
  }
})();
