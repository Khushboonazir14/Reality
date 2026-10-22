/* ==========================================================================
   REALITY.EXE — BETWEEN | COMPLETE JAVASCRIPT (script.js)
   Architecture: Asset Registry (MP4 + Images Support), Lenis Smooth Scroll, 
   GSAP ScrollTrigger, Custom Transitions, Index Drawer & Lightbox Modal
   ========================================================================== */

(() => {
  'use strict';

  /* ========================================================================
     1. CENTRAL CONFIGURATION & ARTWORK REGISTRY (des1 — des10)
     Note: Change extensions to .mp4, .jpg, or .gif based on your actual files in assets/
     ======================================================================== */
  const EXHIBITION_CONFIG = {
    artistName: 'THE ARTIST', // Change to the creator's actual name if desired
    enableGlitchPulses: true
  };

  const ARTWORK_REGISTRY = [
    {
      id: 'des1',
      index: '01',
      title: 'Freedom',
      edition: '1/1 EDITION',
      src: 'assets/des1.mp4',
      transition: 'clip-eclipse'
    },
    {
      id: 'des2',
      index: '02',
      title: 'Balance',
      edition: '1/1 EDITION',
      src: 'assets/des2.mp4',
      transition: 'mirror-split'
    },
    {
      id: 'des3',
      index: '03',
      title: 'Time',
      edition: '1/1 EDITION',
      src: 'assets/des3.mp4',
      transition: 'vertical-slit'
    },
    {
      id: 'des4',
      index: '04',
      title: 'Identity',
      edition: '1/1 EDITION',
      src: 'assets/des4.mp4',
      transition: 'glitch-slice'
    },
    {
      id: 'des5',
      index: '05',
      title: 'Memories',
      edition: '1/1 EDITION',
      src: 'assets/des5.mp4',
      transition: 'fragment-drift'
    },
    {
      id: 'des6',
      index: '06',
      title: 'Hope',
      edition: '1/1 EDITION',
      src: 'assets/des6.mp4',
      transition: 'light-breach'
    },
    {
      id: 'des7',
      index: '07',
      title: 'Healing',
      edition: '1/1 EDITION',
      src: 'assets/des7.mp4', // Change to .jpg/.gif if this is one of the 2 images
      transition: 'chromatic-bloom'
    },
    {
      id: 'des8',
      index: '08',
      title: 'Lost —',
      edition: '1/1 EDITION',
      src: 'assets/des8.mp4', // Change to .jpg/.gif if this is the other image
      transition: 'abrupt-cut'
    },
    {
      id: 'des9',
      index: '09',
      title: 'Overthinking',
      edition: '1/1 EDITION',
      src: 'assets/des9.mp4',
      transition: 'high-frequency-glitch'
    },
    {
      id: 'des10',
      index: '10',
      title: 'Isolation',
      edition: '1/1 EDITION // COLLECTED',
      src: 'assets/des10.mp4',
      transition: 'slow-emerge'
    }
    
  ];
// ARTWORK_REGISTRY ko yahan reverse kar do taaki last wala pehle aa jaye
  ARTWORK_REGISTRY.reverse();
  // Runtime State
  let lenis = null;
  let currentModalIndex = 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ========================================================================
     2. ASSET SYNCHRONIZATION & MULTI-FORMAT SUPPORT (MP4 + Images)
     ======================================================================== */
function initAssetManagement() {
    const heroArtistEl = document.getElementById('artist-name-hero');
    const footerArtistEl = document.getElementById('artist-name-footer');

    if (heroArtistEl && EXHIBITION_CONFIG.artistName) {
      heroArtistEl.textContent = EXHIBITION_CONFIG.artistName;
    }
    if (footerArtistEl && EXHIBITION_CONFIG.artistName) {
      footerArtistEl.textContent = `CURATED VISUALS BY ${EXHIBITION_CONFIG.artistName}`;
    }

    ARTWORK_REGISTRY.forEach((item, index) => {
      // Original HTML me des1 se des10 static hain, isliye hum unhein 1 se 10 assign kar rahe hain reversed array ke hisab se
      const originalId = `des${index + 1}`;
      const mediaWrap = document.querySelector(`#artwork-${originalId} .artwork-media-wrap`);
      const titleEl = document.querySelector(`#artwork-${originalId} .artwork-title`);
      const editionEl = document.querySelector(`#artwork-${originalId} .artwork-edition`);

      // Naam (Title) aur Edition update karne ke liye
      if (titleEl) titleEl.textContent = item.title;
      if (editionEl) editionEl.textContent = item.edition;

      if (!mediaWrap) return;

      const isVideo = item.src.toLowerCase().endsWith('.mp4');
      mediaWrap.innerHTML = '';

      if (isVideo) {
        const videoEl = document.createElement('video');
        videoEl.src = item.src;
        videoEl.id = `img-${originalId}`;
        videoEl.className = 'artwork-gif';
        videoEl.autoplay = true;
        videoEl.muted = true;
        videoEl.loop = true;
        videoEl.playsInline = true;
        videoEl.setAttribute('muted', '');
        videoEl.setAttribute('autoplay', '');
        videoEl.setAttribute('loop', '');
        videoEl.setAttribute('playsinline', '');

        videoEl.addEventListener('error', () => {
          mediaWrap.innerHTML = `<img src="${createPlaceholderSVG(originalId, item.title, index + 1)}" alt="${item.title}" class="artwork-gif" />`;
        });

        mediaWrap.appendChild(videoEl);
      } else {
        const imgEl = document.createElement('img');
        imgEl.src = item.src;
        imgEl.id = `img-${originalId}`;
        imgEl.className = 'artwork-gif';
        imgEl.alt = `${item.title} — Artwork visual`;
        imgEl.loading = 'lazy';

        imgEl.addEventListener('error', () => {
          imgEl.src = createPlaceholderSVG(originalId, item.title, index + 1);
        });

        mediaWrap.appendChild(imgEl);
      }
    });

    // Ambient hero background setup (pehla item)
    const heroAmbientWrap = document.querySelector('.hero-bg-ambient');
    if (heroAmbientWrap && ARTWORK_REGISTRY.length > 0) {
      const heroSrc = ARTWORK_REGISTRY[0].src;
      if (heroSrc.toLowerCase().endsWith('.mp4')) {
        heroAmbientWrap.innerHTML = `
          <video src="${heroSrc}" autoplay muted loop playsinline class="hero-ambient-gif"></video>
          <div class="hero-vignette"></div>
        `;
      } else {
        heroAmbientWrap.innerHTML = `
          <img src="${heroSrc}" alt="" class="hero-ambient-gif" />
          <div class="hero-vignette"></div>
        `;
      }
    }
  }

  function createPlaceholderSVG(id, title, index) {
    const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
      <rect width="800" height="800" fill="#060608"/>
      <g stroke="rgba(255,255,255,0.06)" stroke-width="1">
        <line x1="0" y1="400" x2="800" y2="400"/>
        <line x1="400" y1="0" x2="400" y2="800"/>
        <rect x="60" y="60" width="680" height="680" fill="none"/>
      </g>
      <text x="400" y="340" fill="#52525b" font-family="monospace" font-size="18" text-anchor="middle" letter-spacing="6">ASSET PLACEHOLDER // [${id.toUpperCase()}]</text>
      <text x="400" y="410" fill="#f4f4f6" font-family="sans-serif" font-weight="700" font-size="44" text-anchor="middle" letter-spacing="2">${safeTitle}</text>
      <text x="400" y="465" fill="#a0a0ab" font-family="monospace" font-size="14" text-anchor="middle" letter-spacing="4">PATH: assets/${id}.mp4 (${index}/10)</text>
    </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  /* ========================================================================
     3. SMOOTH SCROLLING (LENIS) & GSAP SCROLLTRIGGER INTEGRATION
     ======================================================================== */
  function initSmoothScroll() {
    if (prefersReducedMotion || typeof window.Lenis === 'undefined') {
      setupNativeScrollProgress();
      return;
    }

    lenis = new window.Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5
    });

    if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
      window.gsap.registerPlugin(window.ScrollTrigger);
      lenis.on('scroll', window.ScrollTrigger.update);

      window.gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    lenis.on('scroll', ({ progress }) => {
      updateHUDProgress(progress);
    });
  }

  function setupNativeScrollProgress() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      updateHUDProgress(progress);
    }, { passive: true });
  }

  function updateHUDProgress(progress) {
    const clamped = Math.max(0, Math.min(1, progress || 0));
    const percentage = Math.round(clamped * 100);
    const readoutEl = document.getElementById('scroll-readout');
    const barFillEl = document.getElementById('scroll-bar-fill');

    if (readoutEl) {
      readoutEl.textContent = `${String(percentage).padStart(3, '0')}%`;
    }
    if (barFillEl) {
      barFillEl.style.width = `${percentage}%`;
    }
  }

  /* ========================================================================
     4. OPENING HERO & GLITCH PULSE CHOREOGRAPHY
     ======================================================================== */
  function initHeroExperience() {
    document.body.classList.remove('is-loading');

    const heroTitle = document.querySelector('.hero-main-title');

    if (heroTitle && EXHIBITION_CONFIG.enableGlitchPulses && !prefersReducedMotion) {
      setInterval(() => {
        if (Math.random() > 0.45) {
          heroTitle.classList.add('is-glitching');
          setTimeout(() => {
            heroTitle.classList.remove('is-glitching');
          }, 160 + Math.random() * 180);
        }
      }, 3600);
    }

    if (prefersReducedMotion || typeof window.gsap === 'undefined') return;

    const tl = window.gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.fromTo(
      '.hero-meta-top .mono-label',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, delay: 0.15 }
    )
      .fromTo(
        '.hero-main-title',
        { y: 60, opacity: 0, skewY: 2 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.4 },
        '-=0.8'
      )
      .fromTo(
        ['.between-badge', '.hero-subtitle'],
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.15 },
        '-=0.9'
      )
      .fromTo(
        '.hero-footer',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.7'
      );

    window.gsap.to('.hero-ambient-gif', {
      yPercent: 18,
      scale: 1.14,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /* ========================================================================
     5. CONCEPTUAL MANIFESTO SCROLL STORYTELLING
     ======================================================================== */
  function initManifestoAnimations() {
    if (prefersReducedMotion || typeof window.gsap === 'undefined') return;

    const phrases = document.querySelectorAll('.reveal-phrase');
    phrases.forEach((phrase) => {
      window.gsap.fromTo(
        phrase,
        { opacity: 0.12, y: 32, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: phrase,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 0.6
          }
        }
      );
    });

    const blocks = document.querySelectorAll('.manifesto-block:not([data-scroll-step="1"])');
    blocks.forEach((block) => {
      window.gsap.fromTo(
        block,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 84%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    window.gsap.fromTo(
      '.manifesto-axis-divider .axis-line',
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.4,
        ease: 'expo.inOut',
        scrollTrigger: {
          trigger: '.manifesto-axis-divider',
          start: 'top 85%'
        }
      }
    );
  }

  /* ========================================================================
     6. DISTINCT ARTWORK REVEALS & HORIZONTAL CONTINUUM (des1 — des10)
     ======================================================================== */
  function initGalleryChoreography() {
    if (prefersReducedMotion || typeof window.gsap === 'undefined') return;

    const mm = window.gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      const horizontalSection = document.getElementById('horizontal-chapter');
      const horizontalTrack = document.getElementById('horizontal-track');

      if (horizontalSection && horizontalTrack) {
        const getScrollDistance = () =>
          Math.max(0, horizontalTrack.scrollWidth - window.innerWidth + 96);

        window.gsap.to(horizontalTrack, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: horizontalSection,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            pin: '.horizontal-sticky-viewport',
            scrub: 1,
            invalidateOnRefresh: true
          }
        });
      }
    });

    const artworkNodes = document.querySelectorAll('.artwork-node');

    artworkNodes.forEach((node) => {
      const transitionType = node.dataset.transition;
      const frame = node.querySelector('.artwork-frame');
      const mediaWrap = node.querySelector('.artwork-media-wrap');
      const gif = node.querySelector('.artwork-gif');
      const caption = node.querySelector('.artwork-caption');
      const whisper = node.querySelector('.artwork-whisper');

      const isHorizontalPanel = node.classList.contains('horizontal-panel');
      if (isHorizontalPanel && window.innerWidth >= 769) {
        window.gsap.fromTo(
          frame,
          { y: 35, opacity: 0.4 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#horizontal-chapter',
              start: 'top 75%'
            }
          }
        );
        return;
      }

      const tl = window.gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: 'top 82%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });

      switch (transitionType) {
        case 'clip-eclipse':
          tl.fromTo(
            mediaWrap,
            { clipPath: 'circle(12% at 50% 50%)', opacity: 0.2 },
            { clipPath: 'circle(100% at 50% 50%)', opacity: 1, duration: 1.45, ease: 'expo.out' }
          ).fromTo(gif, { scale: 1.18 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0);
          break;

        case 'mirror-split':
          tl.fromTo(
            mediaWrap,
            { clipPath: 'polygon(50% 0%, 50% 50%, 50% 100%, 50% 50%)', opacity: 0 },
            { clipPath: 'polygon(0% -20%, 120% 50%, 50% 120%, -20% 50%)', opacity: 1, duration: 1.35, ease: 'power4.out' }
          ).set(mediaWrap, { clipPath: 'none' });
          break;

        case 'vertical-slit':
          tl.fromTo(
            mediaWrap,
            { clipPath: 'inset(0% 48% 0% 48%)', opacity: 0.3 },
            { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.3, ease: 'expo.inOut' }
          );
          break;

        case 'glitch-slice':
          tl.fromTo(
            frame,
            { x: 40, opacity: 0, skewX: -4 },
            { x: 0, opacity: 1, skewX: 0, duration: 0.9, ease: 'power3.out' }
          );
          break;

        case 'abrupt-cut':
          tl.fromTo(
            frame,
            { opacity: 0, scale: 0.94 },
            { opacity: 1, scale: 1, duration: 0.45, ease: 'steps(5)' }
          );
          break;

        case 'high-frequency-glitch':
          tl.fromTo(
            frame,
            { y: 60, opacity: 0, filter: 'contrast(180%) brightness(1.3)' },
            { y: 0, opacity: 1, filter: 'contrast(100%) brightness(1)', duration: 1.05, ease: 'elastic.out(1, 0.75)' }
          );
          break;

        case 'slow-emerge':
          tl.fromTo(
            frame,
            { opacity: 0, y: 80, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 1.9, ease: 'power2.out' }
          );
          break;

        default:
          tl.fromTo(
            frame,
            { opacity: 0, y: 45 },
            { opacity: 1, y: 0, duration: 1.15, ease: 'expo.out' }
          );
          break;
      }

      if (caption) {
        tl.fromTo(
          caption,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.65'
        );
      }

      if (whisper) {
        window.gsap.fromTo(
          whisper,
          { yPercent: 30 },
          {
            yPercent: -35,
            ease: 'none',
            scrollTrigger: {
              trigger: node,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }
    });
  }

  /* ========================================================================
     7. CUSTOM INTERACTIVE CURSOR (DESKTOP ONLY)
     ======================================================================== */
  function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const cursorLabel = document.getElementById('cursor-label');
    if (!cursor || isTouchDevice) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function renderCursor() {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate3d(-50%, -50%, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    const inspectTargets = document.querySelectorAll('[data-interactive="inspect"]');
    inspectTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        if (cursorLabel) cursorLabel.textContent = 'EXPAND';
      });
      target.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
      });
    });
  }

  /* ========================================================================
     8. ARCHIVE INDEX DRAWER & SMOOTH ANCHOR NAVIGATION
     ======================================================================== */
  function initNavigationAndDrawer() {
    const indexBtn = document.getElementById('index-toggle-btn');
    const closeBtn = document.getElementById('drawer-close-btn');
    const drawer = document.getElementById('archive-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-item');

    function toggleDrawer(forceState) {
      if (!drawer || !indexBtn) return;
      const willOpen = typeof forceState === 'boolean' ? forceState : !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', willOpen);
      drawer.setAttribute('aria-hidden', String(!willOpen));
      indexBtn.setAttribute('aria-expanded', String(willOpen));
    }

    if (indexBtn) {
      indexBtn.addEventListener('click', () => toggleDrawer());
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => toggleDrawer(false));
    }

    drawerLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSelector = link.getAttribute('href');
        toggleDrawer(false);
        scrollToTarget(targetSelector);
      });
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      if (anchor.classList.contains('drawer-item')) return;
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href && href.length > 1) {
          e.preventDefault();
          scrollToTarget(href);
        }
      });
    });

    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        scrollToTarget('#hero');
      });
    }
  }

  function scrollToTarget(selector) {
    const targetEl = document.querySelector(selector);
    if (!targetEl) return;

    if (lenis) {
      lenis.scrollTo(targetEl, { offset: -40, duration: 1.5 });
    } else {
      targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  }

  /* ========================================================================
     9. DEDICATED ARTWORK DETAIL / LIGHTBOX MODAL (Video & Image Support)
     ======================================================================== */
  function initLightboxModal() {
    const modal = document.getElementById('reality-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('modal-close-btn');
    const prevBtn = document.getElementById('modal-prev-btn');
    const nextBtn = document.getElementById('modal-next-btn');

    const modalIdEl = document.getElementById('modal-artwork-id');
    const modalIndexEl = document.getElementById('modal-artwork-index');
    const modalTitleEl = document.getElementById('modal-artwork-title');

    if (!modal) return;

    function openModalById(artworkId) {
      const foundIndex = ARTWORK_REGISTRY.findIndex((item) => item.id === artworkId);
      if (foundIndex === -1) return;

      currentModalIndex = foundIndex;
      renderModalContent();

      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      if (lenis) lenis.stop();
    }

    function closeModal() {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      if (lenis) lenis.start();
    }

    function renderModalContent() {
      const item = ARTWORK_REGISTRY[currentModalIndex];
      if (!item) return;

      if (modalIdEl) modalIdEl.textContent = item.id;
      if (modalIndexEl) modalIndexEl.textContent = `${item.index} OF ${ARTWORK_REGISTRY.length}`;
      if (modalTitleEl) modalTitleEl.textContent = item.title;

      const modalMediaContainer = document.querySelector('.modal-media-container');
      if (modalMediaContainer) {
        const isVideo = item.src.toLowerCase().endsWith('.mp4');
        if (isVideo) {
          modalMediaContainer.innerHTML = `
            <video src="${item.src}" autoplay muted loop playsinline class="modal-gif" id="modal-gif"></video>
          `;
        } else {
          modalMediaContainer.innerHTML = `
            <img src="${item.src}" alt="${item.title}" class="modal-gif" id="modal-gif" />
          `;
        }
      }
    }

    function stepModal(direction) {
      currentModalIndex = (currentModalIndex + direction + ARTWORK_REGISTRY.length) % ARTWORK_REGISTRY.length;
      renderModalContent();
    }

    document.querySelectorAll('.artwork-inspect-trigger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModalById(btn.dataset.target);
      });
    });

    document.querySelectorAll('.artwork-frame').forEach((frame) => {
      frame.addEventListener('click', () => {
        const parentNode = frame.closest('.artwork-node');
        if (parentNode && parentNode.dataset.id) {
          openModalById(parentNode.dataset.id);
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (prevBtn) prevBtn.addEventListener('click', () => stepModal(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => stepModal(1));

    window.addEventListener('keydown', (e) => {
      const drawer = document.getElementById('archive-drawer');
      if (e.key === 'Escape') {
        if (modal.classList.contains('is-active')) closeModal();
        if (drawer && drawer.classList.contains('is-open')) {
          drawer.classList.remove('is-open');
          drawer.setAttribute('aria-hidden', 'true');
        }
      } else if (modal.classList.contains('is-active')) {
        if (e.key === 'ArrowRight') stepModal(1);
        if (e.key === 'ArrowLeft') stepModal(-1);
      }
    });
  }

  /* ========================================================================
     10. INITIALIZE EXHIBITION ON DOM READY
     ======================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initAssetManagement();
    initSmoothScroll();
    initHeroExperience();
    initManifestoAnimations();
    initGalleryChoreography();
    initCustomCursor();
    initNavigationAndDrawer();
    initLightboxModal();
  });
})();