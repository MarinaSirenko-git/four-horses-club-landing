(function initParticipantsCarousel() {
  const root = document.querySelector("#participants .carousel");
  if (!root) return;

  const viewport = root.querySelector(".carousel__viewport");
  const items = [...root.querySelectorAll(".carousel__item")];
  if (!viewport || items.length === 0) return;

  const btnPrev = root.querySelector(".carousel__btn--prev");
  const btnNext = root.querySelector(".carousel__btn--next");
  const currentEl = root.querySelector(".carousel__current");
  const totalEl = root.querySelector(".carousel__total");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function scrollBehavior() {
    return reducedMotion.matches ? "instant" : "smooth";
  }

  function closestIndex() {
    const x = viewport.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < items.length; i++) {
      const d = Math.abs(items[i].offsetLeft - x);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  }

  function scrollToIndex(i) {
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    viewport.scrollTo({
      left: items[clamped].offsetLeft,
      behavior: scrollBehavior(),
    });
  }

  function updateUi() {
    const i = closestIndex();
    if (currentEl) currentEl.textContent = String(i + 1);
    if (totalEl) totalEl.textContent = String(items.length);

    const atStart = i <= 0;
    const atEnd = i >= items.length - 1;
    if (btnPrev) {
      btnPrev.disabled = atStart;
      btnPrev.setAttribute("aria-disabled", atStart ? "true" : "false");
    }
    if (btnNext) {
      btnNext.disabled = atEnd;
      btnNext.setAttribute("aria-disabled", atEnd ? "true" : "false");
    }
  }

  btnPrev?.addEventListener("click", () => {
    scrollToIndex(closestIndex() - 1);
  });

  btnNext?.addEventListener("click", () => {
    scrollToIndex(closestIndex() + 1);
  });

  viewport.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateUi);
  });

  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIndex(closestIndex() - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIndex(closestIndex() + 1);
    }
  });

  updateUi();
})();
