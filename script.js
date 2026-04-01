const siteConfig = {
  instagram: "https://www.instagram.com/itz_me_luxy?igsh=aDdzYnMxNXhweHp1",
  deposit: "upi://pay?pa=8147729010@ybl&pn=ZENEX&tn=Project%20Deposit&cu=INR",
  balance: "upi://pay?pa=8147729010@ybl&pn=ZENEX&tn=Remaining%20Balance&cu=INR"
};

const portfolioItems = [
  {
    title: "Moody Night Drive Sequence",
    description: "Cinematic edit with controlled pacing, dramatic lighting, smooth transitions, and immersive sound design.",
    category: "cinematic",
    label: "Cinematic Edit",
    duration: "12:18",
    base: "#17181e",
    accent: "#ff7a1a",
    embedUrl: "cinematic%20edit.mp4"
  },
  {
    title: "Hook-First Reel Cut",
    description: "Short-form vertical edit built for fast retention with punchy captions, cleaner pacing, and instant visual hooks.",
    category: "shorts",
    label: "Shorts / Reels",
    duration: "00:34",
    base: "#121319",
    accent: "#ff8f47",
    embedUrl: "shortreels.mp4"
  },
  {
    title: "commercial edit",
    description: "Brand-focused commercial edit with premium pacing, product detail shots, and polished promotional storytelling.",
    category: "commercial",
    label: "Commercial Edit",
    duration: "05:42",
    base: "#161422",
    accent: "#8f61ff",
    embedUrl: "commercial edit.mp4"
  },
  {
    title: "Performance Car Reel",
    description: "Automotive edit inspired by YouTube and Instagram car content with speed ramps, low-angle details, and cinematic motion.",
    category: "car",
    label: "Car Edit",
    duration: "00:47",
    base: "#19161a",
    accent: "#ff9c4d",
    embedUrl: "https://player.vimeo.com/video/357274789?autoplay=1"
  },
  {
    title: "Atmospheric Travel Montage",
    description: "Cinematic storytelling edit shaped with softer transitions, ambient sound layering, and premium visual rhythm.",
    category: "cinematic",
    label: "Cinematic Edit",
    duration: "09:11",
    base: "#111318",
    accent: "#ffa84f",
    embedUrl: "cinematic%20edit2.mp4"
  },
  {
    title: "Fast Promo Reel",
    description: "Shorts and reels edit focused on aggressive hooks, subtitle rhythm, and a clean high-energy social format.",
    category: "shorts",
    label: "Shorts / Reels",
    duration: "00:27",
    base: "#13151b",
    accent: "#ff7a1a",
    embedUrl: "shortreels2.mp4"
  },
  {
    title: "Street Build Feature",
    description: "Car edit with engine-focused sound design, rolling shots, speed ramps, and bold contrast-heavy pacing.",
    category: "car",
    label: "Car Edit",
    duration: "07:25",
    base: "#14151f",
    accent: "#7d63ff",
    embedUrl: "https://www.youtube.com/embed/ysz5S6PUM-U?autoplay=1&rel=0"
  },
  {
    title: "commercial edit 2",
    description: "Commercial-style brand edit combining product storytelling, premium motion, and a clear conversion-focused finish.",
    category: "commercial",
    label: "Commercial Edit",
    duration: "00:39",
    base: "#181418",
    accent: "#ff8f47",
    embedUrl: "commercial edit 2.mp4"
  }
];

const portfolioGrid = document.getElementById("portfolioGrid");
const filterRow = document.getElementById("filterRow");
const modal = document.getElementById("videoModal");
const videoPlayer = document.getElementById("videoPlayer");
const modalClose = document.getElementById("modalClose");
const externalLinks = document.querySelectorAll(".external-link");
const siteNav = document.getElementById("site-nav-container");
const navLinks = document.querySelectorAll("#site-nav-container ul a[href^='#']");
let navScrollLock = false;
let navScrollLockTimer = null;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function setActiveNavLink(sectionId) {
  navLinks.forEach((link) => {
    // Skip the logo link which contains the aria-label
    if (link.getAttribute("aria-label") === "home") return;

    const isActive = link.getAttribute("href") === `#${sectionId}`;

    if (isActive) {
      link.setAttribute("aria-current", "page");
      link.classList.remove("text-[#b8b1a7]");
      link.classList.add("text-white", "font-bold");
    } else {
      link.removeAttribute("aria-current");
      link.classList.remove("text-white", "font-bold");
      link.classList.add("text-[#b8b1a7]");
    }
  });
}

function createBarsMarkup() {
  const heights = [20, 34, 16, 28, 38, 22];
  return heights.map((height) => `<span style="height:${height}px"></span>`).join("");
}

function renderPortfolio(items) {
  portfolioGrid.innerHTML = items
    .map(
      (item, index) => `
        <article
          class="portfolio-card reveal"
          data-category="${item.category}"
          data-index="${index}"
          style="--card-base:${item.base}; --card-accent:${item.accent};"
        >
          <div class="portfolio-thumb">
            ${
              item.embedUrl.endsWith(".mp4") 
              ? `<video src='${item.embedUrl}' muted loop autoplay playsinline style='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;'></video>
                 <button type="button" class="video-mute-btn" aria-label="Unmute video">
                   <i data-lucide="volume-x"></i>
                 </button>`
              : ""
            }
          </div>
        </article>
      `
    )
    .join("");

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function applyLinks() {
  externalLinks.forEach((link) => {
    const key = link.dataset.link;
    if (!key || !siteConfig[key]) {
      return;
    }

    const url = siteConfig[key];
    link.href = url;

    // UPI intent links must NOT open in a new tab — they trigger native app intents
    if (url.startsWith('upi://')) {
      link.removeAttribute('target');
      link.removeAttribute('rel');
    } else if (key !== "email") {
      link.target = "_blank";
      link.rel = "noreferrer";
    }
  });
}

function openModal(item) {
  videoPlayer.src = item.embedUrl;
  videoPlayer.load();
  videoPlayer.play();
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  videoPlayer.pause();
  videoPlayer.src = "";
  modal.hidden = true;
  document.body.style.overflow = "";
}

function handlePortfolioActivation(target) {
  const card = target.closest(".portfolio-card");
  if (!card) {
    return;
  }

  const item = portfolioItems[Number(card.dataset.index)];
  if (item) {
    openModal(item);
  }
}

function setupFilters() {
  const applyFilter = (filter) => {
    document.querySelectorAll(".portfolio-card").forEach((card) => {
      const matches = card.dataset.category === filter;
      card.classList.toggle("is-hidden", !matches);
    });
  };

  applyFilter("shorts");

  filterRow.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-chip");
    if (!button) {
      return;
    }

    const filter = button.dataset.filter;
    document.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.classList.remove("is-active");
      chip.setAttribute("aria-pressed", "false");
    });
    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");

    applyFilter(filter);
  });
}

function setupPortfolioEvents() {
  document.querySelectorAll('.video-mute-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const video = btn.closest('.portfolio-thumb').querySelector('video');
      if (video) {
        if (video.muted) {
          video.muted = false;
          btn.innerHTML = '<i data-lucide="volume-2"></i>';
          btn.setAttribute('aria-label', 'Mute video');
        } else {
          video.muted = true;
          btn.innerHTML = '<i data-lucide="volume-x"></i>';
          btn.setAttribute('aria-label', 'Unmute video');
        }
        if (window.lucide) {
          window.lucide.createIcons();
        }
      }
    });
  });
}

function setupModalEvents() {
  modal.addEventListener("click", (event) => {
    if (event.target.dataset.closeModal === "true") {
      closeModal();
    }
  });

  modalClose.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
}

function setupRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "50px 0px",
      threshold: 0
    }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    if (!element.classList.contains("is-visible")) {
      observer.observe(element);
    }
  });
}

function setupSectionTracking() {
  const trackedSections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (trackedSections.length === 0) {
    return;
  }

  let activeSectionId = trackedSections[0].id;

  const updateActiveSection = () => {
    if (navScrollLock) {
      return;
    }

    const headerOffset = 180;
    const scrollPosition = window.scrollY + headerOffset;

    trackedSections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        activeSectionId = section.id;
      }
    });

    setActiveNavLink(activeSectionId);
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("href").slice(1);
      navScrollLock = true;
      clearTimeout(navScrollLockTimer);
      setActiveNavLink(targetId);

      navScrollLockTimer = setTimeout(() => {
        navScrollLock = false;
        updateActiveSection();
      }, 700);
    });
  });

  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);
  setActiveNavLink("home");
}

function setYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

function setupPricingToggle() {
  // Setup toggle for each pricing panel independently
  document.querySelectorAll('.pricing-toggle').forEach(toggle => {
    const slide = toggle.closest('.pricing-slide') || document;
    const btns = toggle.querySelectorAll('.pricing-switch-btn');
    const indicator = toggle.querySelector('.pricing-switch-indicator');
    const values = slide.querySelectorAll('.pricing-value');
    const periodLabels = slide.querySelectorAll('.pricing-period-label');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const period = btn.dataset.period;
        const isYearly = period === 'yearly';

        btns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        if (isYearly) {
          indicator.classList.add('is-yearly');
        } else {
          indicator.classList.remove('is-yearly');
        }

        values.forEach(v => {
          v.classList.add('is-animating');
          setTimeout(() => {
            v.textContent = isYearly ? v.dataset.yearly : v.dataset.monthly;
            v.classList.remove('is-animating');
          }, 180);
        });

        periodLabels.forEach(l => {
          l.textContent = isYearly ? 'year' : 'month';
        });
      });
    });
  });
}

function setupPricingStack() {
  // Setup stack drag for each pricing stack independently
  document.querySelectorAll('.pricing-stack').forEach(stack => {
    const cards = [...stack.querySelectorAll('.pricing-card')];
    const DRAG_THRESHOLD = 100;
    const ELASTIC = 0.35;

    let dragStartX = 0;
    let isDragging = false;
    let currentDragCard = null;
    let dragOffsetX = 0;

    function getFrontCard() {
      return cards.find(c => c.dataset.position === 'front');
    }

    function shuffleCards() {
      cards.forEach(card => {
        const current = card.dataset.position;
        if (current === 'front') card.dataset.position = 'back';
        else if (current === 'middle') card.dataset.position = 'front';
        else if (current === 'back') card.dataset.position = 'middle';
      });
    }

    function getBaseTransform(position) {
      const isMobile = window.innerWidth <= 719;
      if (isMobile) {
        if (position === 'front') return { rotate: -3, x: -8 };
        if (position === 'middle') return { rotate: 1, x: 4 };
        return { rotate: 4, x: 14 };
      }
      if (position === 'front') return { rotate: -6, x: -15 };
      if (position === 'middle') return { rotate: 0, x: 8 };
      return { rotate: 6, x: 30 };
    }

    function applyDragTransform(card, offsetX) {
      const base = getBaseTransform('front');
      const elasticX = offsetX * ELASTIC;
      card.style.transform = `rotate(${base.rotate}deg) translateX(calc(${base.x}% + ${elasticX}px))`;
    }

    function clearDragTransform(card) {
      card.style.transform = '';
    }

    function onPointerDown(e) {
      const front = getFrontCard();
      if (!front || !front.contains(e.target)) return;
      if (e.target.closest('a, button')) return;

      isDragging = true;
      currentDragCard = front;
      dragStartX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      dragOffsetX = 0;
      front.classList.add('is-dragging');
      e.preventDefault();
    }

    function onPointerMove(e) {
      if (!isDragging || !currentDragCard) return;
      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      dragOffsetX = clientX - dragStartX;
      applyDragTransform(currentDragCard, dragOffsetX);
    }

    function onPointerUp() {
      if (!isDragging || !currentDragCard) return;
      currentDragCard.classList.remove('is-dragging');
      clearDragTransform(currentDragCard);

      if (Math.abs(dragOffsetX) > DRAG_THRESHOLD) {
        shuffleCards();
        const hint = document.getElementById('pricingSwipeHint');
        if (hint) hint.style.display = 'none';
      }

      isDragging = false;
      currentDragCard = null;
      dragOffsetX = 0;
    }

    stack.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    stack.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  });
}

function setupPricingCarousel() {
  const carousel = document.getElementById('pricingCarousel');
  if (!carousel) return;

  const track = document.getElementById('pricingCarouselTrack');
  const dots = carousel.querySelectorAll('.pricing-carousel-dot');
  const prevBtn = document.getElementById('pricingPrev');
  const nextBtn = document.getElementById('pricingNext');
  const slides = carousel.querySelectorAll('.pricing-slide');
  const totalSlides = slides.length;

  let currentSlide = 0;
  let touchStartX = 0;
  let touchDeltaX = 0;
  let isSwiping = false;
  const SWIPE_THRESHOLD = 50;

  function goToSlide(index) {
    currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentSlide);
    });

    // Trigger reveal animations for the new slide
    slides[currentSlide].querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
      el.classList.add('is-visible');
    });
  }

  // Arrow buttons
  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  // Dot buttons
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(Number(dot.dataset.goto));
    });
  });

  // Touch swipe on the carousel (not on the card stacks)
  carousel.addEventListener('touchstart', (e) => {
    // Only capture if NOT touching a pricing-card (let card stack handle those)
    if (e.target.closest('.pricing-stack')) return;

    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
    isSwiping = true;
  }, { passive: true });

  carousel.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    touchDeltaX = e.touches[0].clientX - touchStartX;
  }, { passive: true });

  carousel.addEventListener('touchend', () => {
    if (!isSwiping) return;
    isSwiping = false;

    if (touchDeltaX < -SWIPE_THRESHOLD) {
      goToSlide(currentSlide + 1);
    } else if (touchDeltaX > SWIPE_THRESHOLD) {
      goToSlide(currentSlide - 1);
    }

    touchDeltaX = 0;
  });
}

function setupUpiModal() {
  const modal = document.getElementById('upiModal');
  const backdrop = document.getElementById('upiModalBackdrop');
  const closeBtn = document.getElementById('upiModalClose');
  const titleEl = document.getElementById('upiModalTitle');
  const copyBtn = document.getElementById('upiCopyBtn');
  const copiedMsg = document.getElementById('upiCopiedMsg');
  const numberEl = document.getElementById('upiModalNumber');

  if (!modal) return;

  const titles = {
    deposit: 'Pay Deposit via UPI',
    balance: 'Pay Remaining Balance via UPI'
  };

  function openUpiModal(type) {
    titleEl.textContent = titles[type] || 'Pay via UPI';
    copiedMsg.classList.remove('is-visible');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeUpiModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  // Button click handlers
  document.querySelectorAll('.upi-pay-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openUpiModal(btn.dataset.upiType);
    });
  });

  // Close handlers
  closeBtn.addEventListener('click', closeUpiModal);
  backdrop.addEventListener('click', closeUpiModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeUpiModal();
    }
  });

  // Copy to clipboard
  copyBtn.addEventListener('click', () => {
    const number = numberEl.textContent;
    navigator.clipboard.writeText(number).then(() => {
      copiedMsg.classList.add('is-visible');
      setTimeout(() => copiedMsg.classList.remove('is-visible'), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = number;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      copiedMsg.classList.add('is-visible');
      setTimeout(() => copiedMsg.classList.remove('is-visible'), 2000);
    });
  });
}

renderPortfolio(portfolioItems);
applyLinks();
setupFilters();
setupPortfolioEvents();
setupModalEvents();
setupRevealAnimations();
setupSectionTracking();
setupPricingToggle();
setupPricingStack();
setupPricingCarousel();
setupUpiModal();
setYear();
