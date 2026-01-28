// Hero Carousel Functionality
(function() {
  let currentSlide = 0;
  let heroImages = [];
  let carouselInterval = null;
  let intervalTime = 5000; // Default 5 seconds

  // Initialize carousel
  async function initCarousel() {
    try {
      // Fetch hero images from API
      const response = await fetch('/api/hero-images');
      if (response.ok) {
        heroImages = await response.json();
        if (heroImages.length > 0) {
          renderSlides();
          renderIndicators();
          startAutoPlay();
          setupEventListeners();
        }
      }
      
      // Fetch carousel interval from settings
      const settingsResponse = await fetch('/api/site-settings');
      if (settingsResponse.ok) {
        const settings = await settingsResponse.json();
        if (settings.carousel_interval) {
          intervalTime = parseInt(settings.carousel_interval) || 5000;
        }
      }
    } catch (error) {
      console.log('Using default hero images');
      // Use default images if API fails
      heroImages = [
        { image_url: '/images/hero/hero1.png', title_en: 'United for Democracy', subtitle_en: 'Building bridges across nations and cultures' },
        { image_url: '/images/hero/hero2.png', title_en: 'Strong Institutions', subtitle_en: 'Supporting democratic governance worldwide' },
        { image_url: '/images/hero/hero3.png', title_en: 'People Power', subtitle_en: 'Empowering citizens to shape their future' },
        { image_url: '/images/hero/hero4.png', title_en: 'Global Connections', subtitle_en: 'Federalism uniting diverse communities' },
        { image_url: '/images/hero/hero5.png', title_en: 'Your Voice Matters', subtitle_en: 'Every vote counts in a true democracy' }
      ];
      renderSlides();
      renderIndicators();
      startAutoPlay();
      setupEventListeners();
    }
  }

  // Render carousel slides
  function renderSlides() {
    const slidesContainer = document.getElementById('hero-slides');
    if (!slidesContainer || heroImages.length === 0) return;

    slidesContainer.innerHTML = heroImages.map((image, index) => `
      <div class="hero-slide ${index === 0 ? 'active' : ''}" 
           style="background-image: url('${image.image_url}')"
           data-index="${index}">
      </div>
    `).join('');
  }

  // Render carousel indicators
  function renderIndicators() {
    const indicatorsContainer = document.getElementById('hero-indicators');
    if (!indicatorsContainer || heroImages.length <= 1) return;

    indicatorsContainer.innerHTML = heroImages.map((_, index) => `
      <button class="hero-indicator ${index === 0 ? 'active' : ''}" 
              data-index="${index}"
              aria-label="Go to slide ${index + 1}">
      </button>
    `).join('');
  }

  // Go to specific slide
  function goToSlide(index) {
    if (index < 0) index = heroImages.length - 1;
    if (index >= heroImages.length) index = 0;

    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });

    currentSlide = index;

    // Update hero content based on current slide
    const currentImage = heroImages[index];
    const lang = window.currentLanguage || localStorage.getItem('lang') || 'en';
    
    // Update hero title and subtitle for each slide
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    
    if (heroTitle) {
      const title = currentImage[`title_${lang}`] || currentImage.title_en || '';
      if (title) {
        heroTitle.textContent = title;
      }
    }
    
    if (heroSubtitle) {
      const subtitle = currentImage[`subtitle_${lang}`] || currentImage.subtitle_en || '';
      if (subtitle) {
        heroSubtitle.textContent = subtitle;
      }
    }
  }

  // Next slide
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  // Previous slide
  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // Start auto-play
  function startAutoPlay() {
    stopAutoPlay();
    if (heroImages.length > 1) {
      carouselInterval = setInterval(nextSlide, intervalTime);
    }
  }

  // Stop auto-play
  function stopAutoPlay() {
    if (carouselInterval) {
      clearInterval(carouselInterval);
      carouselInterval = null;
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    // Navigation buttons
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoPlay(); // Reset timer
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoPlay(); // Reset timer
      });
    }

    // Indicator clicks
    const indicatorsContainer = document.getElementById('hero-indicators');
    if (indicatorsContainer) {
      indicatorsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('hero-indicator')) {
          const index = parseInt(e.target.dataset.index);
          goToSlide(index);
          startAutoPlay(); // Reset timer
        }
      });
    }

    // Pause on hover
    const heroSection = document.querySelector('.hero-carousel');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopAutoPlay);
      heroSection.addEventListener('mouseleave', startAutoPlay);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const heroSection = document.querySelector('.hero-carousel');
      if (!heroSection) return;
      
      const rect = heroSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        if (e.key === 'ArrowLeft') {
          prevSlide();
          startAutoPlay();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
          startAutoPlay();
        }
      }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    const slidesContainer = document.getElementById('hero-slides');
    if (slidesContainer) {
      slidesContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      slidesContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        startAutoPlay();
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }

  // Listen for language changes and update hero content
  document.addEventListener('languageChanged', (e) => {
    if (heroImages.length > 0) {
      // Re-render current slide content with new language
      goToSlide(currentSlide);
    }
  });

  // Expose functions globally for potential external use
  window.heroCarousel = {
    next: nextSlide,
    prev: prevSlide,
    goTo: goToSlide,
    start: startAutoPlay,
    stop: stopAutoPlay
  };
})();