(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (slides.length <= 1) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });

    start();
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function initFilters() {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = normalize(params.get("q"));
    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
      var input = scope.querySelector("[data-search-input]");
      var yearSelect = scope.querySelector("[data-filter-year]");
      var typeSelect = scope.querySelector("[data-filter-type]");
      var categorySelect = scope.querySelector("[data-filter-category]");
      var fixedCategory = scope.querySelector("[data-fixed-category]");
      var container = scope.parentElement.querySelector("[data-card-container]") || document.querySelector("[data-card-container]");
      var cards = container ? Array.prototype.slice.call(container.querySelectorAll("[data-card]")) : [];
      if (input && initialQuery) {
        input.value = initialQuery;
      }

      function apply() {
        var term = normalize(input ? input.value : "");
        var year = yearSelect ? yearSelect.value : "";
        var type = typeSelect ? typeSelect.value : "";
        var category = categorySelect ? categorySelect.value : "";
        var lockedCategory = fixedCategory ? fixedCategory.value : "";
        cards.forEach(function (card) {
          var text = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-keywords")
          ].join(" "));
          var ok = true;
          if (term && text.indexOf(term) === -1) {
            ok = false;
          }
          if (year && card.getAttribute("data-year") !== year) {
            ok = false;
          }
          if (type && card.getAttribute("data-type") !== type) {
            ok = false;
          }
          if (category && card.getAttribute("data-category") !== category) {
            ok = false;
          }
          if (lockedCategory && card.getAttribute("data-category") !== lockedCategory) {
            ok = false;
          }
          card.hidden = !ok;
        });
      }

      [input, yearSelect, typeSelect, categorySelect].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
      apply();
    });
  }

  function initPlayers() {
    document.querySelectorAll("[data-player]").forEach(function (player) {
      var video = player.querySelector("video");
      var cover = player.querySelector(".video-cover");
      var mediaUrl = player.getAttribute("data-media-url");
      var instance = null;

      function playVideo() {
        if (!video || !mediaUrl) {
          return;
        }
        if (player.getAttribute("data-ready") !== "true") {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = mediaUrl;
            player.setAttribute("data-ready", "true");
          } else if (window.Hls && window.Hls.isSupported()) {
            instance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
            instance.loadSource(mediaUrl);
            instance.attachMedia(video);
            player.setAttribute("data-ready", "true");
          } else {
            video.src = mediaUrl;
            player.setAttribute("data-ready", "true");
          }
        }
        if (cover) {
          cover.classList.add("hidden");
        }
        var action = video.play();
        if (action && typeof action.catch === "function") {
          action.catch(function () {});
        }
      }

      if (cover) {
        cover.addEventListener("click", playVideo);
      }
      player.addEventListener("click", function (event) {
        if (event.target === video) {
          return;
        }
        if (!cover || cover.classList.contains("hidden")) {
          return;
        }
        playVideo();
      });
      document.querySelectorAll("[data-play-link]").forEach(function (link) {
        link.addEventListener("click", function (event) {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          playVideo();
        });
      });
      window.addEventListener("beforeunload", function () {
        if (instance && typeof instance.destroy === "function") {
          instance.destroy();
        }
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayers();
  });
})();
