/**
 * MOSQUITO Hero Poster Infinite Continuous Slider Engine
 * Seamless infinite forward/backward continuous transitions, touch gestures, auto-play
 */

class PosterSlider {
  constructor() {
    this.currentIndex = 1; // 1-based because index 0 is prepended clone
    this.autoPlayInterval = null;
    this.autoPlayDelay = 4000; // 4 seconds per slide
    this.isTransitioning = false;

    this.startX = 0;
    this.currentX = 0;
    this.isDragging = false;

    this.init();
  }

  init() {
    this.wrapper = document.getElementById('poster-slider-wrapper');
    this.track = document.getElementById('poster-slider-track');
    
    if (!this.track) return;
    
    this.originalSlides = Array.from(this.track.children);
    this.totalOriginal = this.originalSlides.length;
    this.counter = document.getElementById('slider-counter');
    this.prevBtn = document.getElementById('slider-prev-btn');
    this.nextBtn = document.getElementById('slider-next-btn');

    if (this.totalOriginal === 0) return;

    // Create clones for seamless infinite loop
    const firstClone = this.originalSlides[0].cloneNode(true);
    const lastClone = this.originalSlides[this.totalOriginal - 1].cloneNode(true);
    
    firstClone.classList.add('clone-slide');
    lastClone.classList.add('clone-slide');

    this.track.appendChild(firstClone);
    this.track.insertBefore(lastClone, this.originalSlides[0]);

    this.allSlides = Array.from(this.track.children);
    this.totalSlides = this.allSlides.length;

    // Set initial position without transition
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

    // Handle transition end for seamless infinite reset
    this.track.addEventListener('transitionend', () => this.handleTransitionEnd());

    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prevSlide();
        this.resetAutoPlay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextSlide();
        this.resetAutoPlay();
      });
    }

    // Hover pause
    if (this.wrapper) {
      this.wrapper.addEventListener('mouseenter', () => this.pauseAutoPlay());
      this.wrapper.addEventListener('mouseleave', () => this.startAutoPlay());

      // Touch handlers
      this.wrapper.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
      this.wrapper.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
      this.wrapper.addEventListener('touchend', () => this.handleTouchEnd());

      // Mouse drag handlers
      this.wrapper.addEventListener('mousedown', (e) => this.handleMouseDown(e));
      window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      window.addEventListener('mouseup', () => this.handleMouseUp());
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key === 'ArrowLeft') {
        this.prevSlide();
        this.resetAutoPlay();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
        this.resetAutoPlay();
      }
    });

    this.updateUI();
    this.startAutoPlay();
  }

  goToSlide(index) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentIndex = index;
    this.track.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.updateUI();
  }

  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentIndex - 1);
  }

  handleTransitionEnd() {
    this.isTransitioning = false;

    // If we reached the cloned first slide at the end
    if (this.currentIndex >= this.totalSlides - 1) {
      this.track.style.transition = 'none';
      this.currentIndex = 1;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }
    // If we reached the cloned last slide at the beginning
    else if (this.currentIndex <= 0) {
      this.track.style.transition = 'none';
      this.currentIndex = this.totalOriginal;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }

    this.updateUI();
  }

  updateUI() {
    // Determine the real 1-based index (1 to totalOriginal)
    let realIndex = this.currentIndex;
    if (realIndex === 0) realIndex = this.totalOriginal;
    if (realIndex > this.totalOriginal) realIndex = 1;

    // Update active class
    this.allSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === this.currentIndex);
    });

    // Update counter
    if (this.counter) {
      const cur = String(realIndex).padStart(2, '0');
      const total = String(this.totalOriginal).padStart(2, '0');
      this.counter.textContent = `${cur} / ${total}`;
    }
  }

  startAutoPlay() {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }

  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoPlay() {
    this.pauseAutoPlay();
    this.startAutoPlay();
  }

  handleTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.currentX = this.startX;
    this.isDragging = true;
    this.pauseAutoPlay();
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;
    this.currentX = e.touches[0].clientX;
  }

  handleTouchEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    const diff = this.startX - this.currentX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) this.nextSlide();
      else this.prevSlide();
    }
    this.startAutoPlay();
  }

  handleMouseDown(e) {
    if (e.target.closest('button') || e.target.closest('a')) return;
    this.startX = e.clientX;
    this.currentX = this.startX;
    this.isDragging = true;
    this.pauseAutoPlay();
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    this.currentX = e.clientX;
  }

  handleMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    const diff = this.startX - this.currentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) this.nextSlide();
      else this.prevSlide();
    }
    this.startAutoPlay();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.posterSlider = new PosterSlider();
});
