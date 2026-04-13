document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector<HTMLElement>(".aplicaciones");
  if (!section) return;

  const cards = Array.from(
    section.querySelectorAll<HTMLElement>(".aplicaciones__card")
  );

  const dots = Array.from(
    section.querySelectorAll<HTMLButtonElement>(".aplicaciones__dot")
  );

  const prevButton = section.querySelector<HTMLButtonElement>(
    ".aplicaciones__button--prev"
  );

  const nextButton = section.querySelector<HTMLButtonElement>(
    ".aplicaciones__button--next"
  );

  if (!cards.length || !dots.length || !prevButton || !nextButton) return;

  let currentIndex = 0;
  let autoPlay: ReturnType<typeof setInterval> | null = null;

  const getSafeIndex = (index: number): number => {
    const total = cards.length;
    return (index + total) % total;
  };

  const updateCarousel = (): void => {
    const total = cards.length;

    cards.forEach((card, index) => {
      card.classList.remove(
        "is-active",
        "is-left",
        "is-right",
        "is-hidden-left",
        "is-hidden-right"
      );

      if (index === currentIndex) {
        card.classList.add("is-active");
        return;
      }

      if (index === getSafeIndex(currentIndex - 1)) {
        card.classList.add("is-left");
        return;
      }

      if (index === getSafeIndex(currentIndex + 1)) {
        card.classList.add("is-right");
        return;
      }

      const isOnLeftSide =
        index < currentIndex
          ? currentIndex - index < total / 2
          : index - currentIndex > total / 2;

      card.classList.add(isOnLeftSide ? "is-hidden-left" : "is-hidden-right");
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
    });
  };

  const goToSlide = (index: number): void => {
    currentIndex = getSafeIndex(index);
    updateCarousel();
  };

  const nextSlide = (): void => {
    goToSlide(currentIndex + 1);
  };

  const prevSlide = (): void => {
    goToSlide(currentIndex - 1);
  };

  const startAutoPlay = (): void => {
    if (autoPlay) clearInterval(autoPlay);

    autoPlay = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const stopAutoPlay = (): void => {
    if (autoPlay) {
      clearInterval(autoPlay);
      autoPlay = null;
    }
  };

  prevButton.addEventListener("click", () => {
    prevSlide();
    startAutoPlay();
  });

  nextButton.addEventListener("click", () => {
    nextSlide();
    startAutoPlay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      startAutoPlay();
    });
  });

  section.addEventListener("mouseenter", stopAutoPlay);
  section.addEventListener("mouseleave", startAutoPlay);

  section.addEventListener("touchstart", stopAutoPlay, { passive: true });
  section.addEventListener("touchend", startAutoPlay, { passive: true });

  updateCarousel();
  startAutoPlay();
});