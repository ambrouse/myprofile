const I18N_FILES = {
  vi: "./i18n/vi.json",
  en: "./i18n/en.json"
};

const loadI18n = async () => {
  const entries = await Promise.all(
    Object.entries(I18N_FILES).map(async ([lang, file]) => {
      const res = await fetch(file, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Unable to load i18n file: ${file}`);
      }
      return [lang, await res.json()];
    })
  );
  return Object.fromEntries(entries);
};

const setupQualityControl = () => {
  let quality = "auto";

  const applyQuality = (nextQuality) => {
    quality = nextQuality;
    localStorage.setItem("vfx-quality", quality);
    document.documentElement.dataset.vfxQuality = quality;
    window.dispatchEvent(
      new CustomEvent("vfx-quality-change", {
        detail: { quality }
      })
    );
  };

  applyQuality(quality);
};

const setupThemeControl = () => {
  const themeToggle = document.getElementById("themeToggle");
  const stored = localStorage.getItem("portfolio-theme");
  let theme = stored === "light" || stored === "dark" ? stored : "dark";

  const playThemeRipple = (nextTheme, trigger) => {
    document.querySelectorAll(".theme-transition").forEach((el) => el.remove());
    const ripple = document.createElement("div");
    ripple.className = `theme-transition theme-transition--${nextTheme}`;
    const rect = trigger?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    ripple.style.setProperty("--theme-x", `${x}px`);
    ripple.style.setProperty("--theme-y", `${y}px`);
    ripple.innerHTML = `
      <span class="theme-transition__field"></span>
      <span class="theme-transition__ring theme-transition__ring--outer"></span>
      <span class="theme-transition__ring theme-transition__ring--inner"></span>
      <span class="theme-transition__sheen"></span>
    `;
    document.body.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 1250);
  };

  const applyTheme = (nextTheme, options = {}) => {
    theme = nextTheme;
    if (options.animate) playThemeRipple(theme, options.trigger);
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
    if (themeToggle) {
      themeToggle.textContent = theme === "dark" ? "Light" : "Dark";
      themeToggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    }
    window.dispatchEvent(new CustomEvent("portfolio-theme-change", { detail: { theme } }));
  };

  if (themeToggle) {
    themeToggle.addEventListener("click", (event) => {
      applyTheme(theme === "dark" ? "light" : "dark", { animate: true, trigger: event.currentTarget });
    });
  }

  applyTheme(theme);
};

const initDeck = (dict) => {
  const deck = document.getElementById("deck");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const navButtons = Array.from(document.querySelectorAll(".nav button"));
  const dotsWrap = document.getElementById("dots");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const slideCounter = document.getElementById("slideCounter");
  const langToggle = document.getElementById("langToggle");
  const jumpButtons = Array.from(document.querySelectorAll("[data-slide-jump]"));

  if (!deck || !slides.length) return;

  let index = 0;
  let lastTransitionAt = 0;
  let lang = localStorage.getItem("cv-lang") || "vi";
  if (!dict[lang]) lang = "vi";
  const preloadedImageUrls = new Set();

  const idxProject = slides.findIndex((s) => s.id === "slide-project");
  const idxProjectEdge = slides.findIndex((s) => s.id === "slide-project-edge");
  const idxContact = slides.findIndex((s) => s.id === "slide-contact");
  const navOrder = navButtons.map((btn) => Number(btn.dataset.slide));

  const playbackOrder = (() => {
    const base = slides.map((_, i) => i);
    if (idxProject === -1 || idxProjectEdge === -1 || idxContact === -1) return base;

    const ordered = [];
    for (let i = 0; i < slides.length; i += 1) {
      if (i === idxContact || i === idxProjectEdge) continue;
      ordered.push(i);
      if (i === idxProject) ordered.push(idxProjectEdge, idxContact);
    }
    return ordered;
  })();

  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Go to slide ${i + 1}`);
    b.addEventListener("click", () => goTo(playbackOrder[i] ?? i));
    if (dotsWrap) dotsWrap.appendChild(b);
    return b;
  });

  const nextByOrder = () => {
    const pos = playbackOrder.indexOf(index);
    if (pos === -1) return Math.min(index + 1, slides.length - 1);
    return playbackOrder[Math.min(pos + 1, playbackOrder.length - 1)];
  };

  const prevByOrder = () => {
    const pos = playbackOrder.indexOf(index);
    if (pos === -1) return Math.max(index - 1, 0);
    return playbackOrder[Math.max(pos - 1, 0)];
  };

  const preloadSlideImages = (slideIndex) => {
    if (slideIndex < 0 || slideIndex >= slides.length) return;

    const images = slides[slideIndex].querySelectorAll("img");
    images.forEach((img) => {
      const src = img.currentSrc || img.src;
      if (!src || preloadedImageUrls.has(src)) return;

      const preImg = new Image();
      preImg.src = src;
      preloadedImageUrls.add(src);
    });
  };

  const updateUI = () => {
    const pos = playbackOrder.indexOf(index);
    const next1 = pos >= 0 ? playbackOrder[pos + 1] : undefined;
    const next2 = pos >= 0 ? playbackOrder[pos + 2] : undefined;
    const prev1 = pos >= 0 ? playbackOrder[pos - 1] : undefined;

    slides.forEach((slide, i) => {
      slide.classList.remove("is-active", "is-back-1", "is-back-2", "is-prev-1");
      if (i === index) slide.classList.add("is-active");
      if (i === next1) slide.classList.add("is-back-1");
      if (i === next2) slide.classList.add("is-back-2");
      if (i === prev1) slide.classList.add("is-prev-1");
    });

    navButtons.forEach((btn, navIndex) => {
      const targetSlide = navOrder[navIndex];
      btn.classList.toggle("active", targetSlide === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", playbackOrder[i] === index);
    });

    if (slideCounter) {
      const current = String((pos >= 0 ? pos : index) + 1).padStart(2, "0");
      const total = String(playbackOrder.length).padStart(2, "0");
      slideCounter.textContent = `${current} / ${total}`;
    }

    window.dispatchEvent(
      new CustomEvent("deck-slide-change", {
        detail: { index, total: slides.length }
      })
    );

    preloadSlideImages(nextByOrder());
  };

  const playTransitionVfx = () => {
    deck.dataset.transitionPulse = String(Date.now());
  };

  const goTo = (next) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    if (clamped === index) return;

    const now = performance.now();
    if (now - lastTransitionAt < 180) return;

    lastTransitionAt = now;
    const direction = clamped > index ? "next" : "prev";
    index = clamped;

    deck.classList.remove("dir-next", "dir-prev");
    deck.classList.add(direction === "next" ? "dir-next" : "dir-prev");

    deck.classList.add("vfx");
    updateUI();
    playTransitionVfx();

    window.setTimeout(() => {
      deck.classList.remove("vfx");
    }, 240);
  };

  const goNext = () => goTo(nextByOrder());
  const goPrev = () => goTo(prevByOrder());

  if (prevBtn) prevBtn.addEventListener("click", goPrev);
  if (nextBtn) nextBtn.addEventListener("click", goNext);

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => goTo(Number(btn.dataset.slide)));
  });

  jumpButtons.forEach((btn) => {
    btn.addEventListener("click", () => goTo(Number(btn.dataset.slideJump)));
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
    if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      goTo(slides.length - 1);
    }
  });

  const applyLang = (nextLang) => {
    lang = nextLang;
    document.documentElement.lang = lang;
    localStorage.setItem("cv-lang", lang);

    if (langToggle) langToggle.textContent = lang === "vi" ? "EN" : "VI";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const value = dict[lang]?.[key] ?? dict.vi?.[key];
      if (value) el.textContent = value;
    });
  };

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      applyLang(lang === "vi" ? "en" : "vi");
    });
  }

  applyLang(lang);
  preloadSlideImages(0);
  preloadSlideImages(1);
  updateUI();
};

const initUiInteractions = () => {
  const orbA = document.querySelector(".orb-a");
  const orbB = document.querySelector(".orb-b");

  const pointer = { x: 0, y: 0, active: false };
  let oAx = 0;
  let oAy = 0;
  let oBx = 0;
  let oBy = 0;
  let rafId = 0;
  let running = true;

  const onPointerMove = (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  };

  const onPointerLeave = () => {
    pointer.active = false;
  };

  const updateOrbs = () => {
    if (!pointer.active) return;
    const tgX = (pointer.x / window.innerWidth - 0.5) * 110;
    const tgY = (pointer.y / window.innerHeight - 0.5) * 110;

    oAx += (tgX - oAx) * 0.04;
    oAy += (tgY - oAy) * 0.04;
    oBx += (-tgX - oBx) * 0.04;
    oBy += (-tgY - oBy) * 0.04;

    if (orbA) orbA.style.transform = `translate(${oAx}px, ${oAy}px)`;
    if (orbB) orbB.style.transform = `translate(${oBx}px, ${oBy}px)`;
  };

  const tick = () => {
    if (!running) return;
    updateOrbs();
    rafId = requestAnimationFrame(tick);
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(rafId);
      return;
    }
    if (!running) {
      running = true;
      rafId = requestAnimationFrame(tick);
    }
  };

  document.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerleave", onPointerLeave, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange);
  rafId = requestAnimationFrame(tick);
};

const boot = async () => {
  setupQualityControl();
  setupThemeControl();

  try {
    const dict = await loadI18n();
    initDeck(dict);
  } catch (error) {
    console.error(error);
    initDeck({ vi: {}, en: {} });
  }
};

document.addEventListener("DOMContentLoaded", boot);
