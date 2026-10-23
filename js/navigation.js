/**
 * Navigation — Material Design 3
 *
 * Features:
 * - One-pager in-page smooth scrolling (with instant cross-page hash landing)
 * - Robust, non-flickering Scrollspy
 * - Mobile navigation drawer with scrim overlay
 * - Scroll-aware top app bar (elevation on scroll)
 * - Certificates expandable "View More" toggle in a single unified grid
 * - Responsive 2 full rows (3x2 on wide desktop, 2x2 on medium, 4 stacked on mobile)
 * - Typing animation (homepage hero)
 * - Lazy-load images with blur placeholder
 * - Dynamic age calculator & copyright year
 * - Easter egg (profile image clicks)
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- In-Page Smooth Scrolling for Anchor Links -----------
  // Smooth-scroll only on explicit in-page anchor clicks; cross-page navigation lands instantly
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        history.replaceState(null, '', hash);
      }
    });
  });


  // --- Navigation Drawer (Mobile) --------------------------
  const menuBtn = document.getElementById('nav-menu-btn');
  const drawer = document.getElementById('nav-drawer');
  const scrim = document.getElementById('nav-scrim');

  function openDrawer() {
    if (!drawer || !scrim) return;
    drawer.classList.add('nav-drawer--open');
    scrim.classList.add('nav-scrim--visible');
    document.body.style.overflow = 'hidden';
    menuBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    if (!drawer || !scrim) return;
    drawer.classList.remove('nav-drawer--open');
    scrim.classList.remove('nav-scrim--visible');
    document.body.style.overflow = '';
    menuBtn?.setAttribute('aria-expanded', 'false');
  }

  menuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = drawer?.classList.contains('nav-drawer--open');
    isOpen ? closeDrawer() : openDrawer();
  });

  scrim?.addEventListener('click', closeDrawer);

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Close drawer when clicking any link inside it
  drawer?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });


  // --- Scroll-aware Top App Bar ----------------------------
  const appBar = document.querySelector('.top-app-bar');
  const SCROLL_THRESHOLD = 8;

  function updateAppBarElevation() {
    if (!appBar) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      appBar.classList.add('top-app-bar--scrolled');
    } else {
      appBar.classList.remove('top-app-bar--scrolled');
    }
  }

  updateAppBarElevation();


  // --- Scrollspy: Active Section Highlighting (Homepage One-pager only) ---
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const isOnePager = document.getElementById('over-mij') !== null && sections.length > 1;

  if (isOnePager) {
    const railItems = document.querySelectorAll('.nav-rail__item[data-section]');
    const drawerItems = document.querySelectorAll('.nav-drawer__item[data-section]');
    let currentActiveId = 'home';

    function setActiveNavLink(sectionId) {
      if (!sectionId || sectionId === currentActiveId) return;
      currentActiveId = sectionId;

      railItems.forEach(item => {
        if (item.getAttribute('data-section') === sectionId) {
          item.classList.add('nav-rail__item--active');
        } else {
          item.classList.remove('nav-rail__item--active');
        }
      });

      drawerItems.forEach(item => {
        if (item.getAttribute('data-section') === sectionId) {
          item.classList.add('nav-drawer__item--active');
        } else {
          item.classList.remove('nav-drawer__item--active');
        }
      });
    }

    function calculateActiveSection() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // When near the very bottom of the page, activate contact
      if (scrollY + windowHeight >= docHeight - 50) {
        setActiveNavLink('contact');
        return;
      }

      // Check sections from top to bottom against a 35% viewport threshold line
      const triggerPoint = windowHeight * 0.35;
      let activeId = sections[0].id;

      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= triggerPoint) {
          activeId = sections[i].id;
        } else {
          break; // Sections are in vertical DOM order
        }
      }

      setActiveNavLink(activeId);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateAppBarElevation();
          calculateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    calculateActiveSection();
  } else {
    // Subpages: lightweight throttled scroll listener for app bar elevation
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateAppBarElevation();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  // --- Certificates: "View More" Toggle (Responsive 3x2, 2x2, 1x4) ---
  const certGrid = document.getElementById('cert-grid');
  const certToggleBtn = document.getElementById('cert-toggle-btn');
  const certToggleText = document.getElementById('cert-toggle-text');
  const certToggleIcon = document.getElementById('cert-toggle-icon');

  if (certGrid && certToggleBtn) {
    let isExpanded = false;

    function updateButtonLabel() {
      if (isExpanded) {
        if (certToggleText) certToggleText.textContent = 'Minder weergeven';
        if (certToggleIcon) certToggleIcon.textContent = 'expand_less';
      } else {
        const isWide = window.innerWidth >= 1080;
        const moreCount = isWide ? 9 : 11;
        if (certToggleText) certToggleText.textContent = `Toon alle certificeringen (${moreCount} meer)`;
        if (certToggleIcon) certToggleIcon.textContent = 'expand_more';
      }
    }

    certToggleBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      certGrid.classList.toggle('is-expanded', isExpanded);
      certToggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

      updateButtonLabel();

      if (!isExpanded) {
        const certSection = document.getElementById('certificeringen');
        if (certSection && window.scrollY > certSection.offsetTop) {
          certSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    window.addEventListener('resize', () => {
      if (!isExpanded) {
        updateButtonLabel();
      }
    });

    updateButtonLabel();
  }


  // --- Typing Animation (Homepage Hero) --------------------
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const texts = ['Hey', 'Hallo'];
    let textIndex = 0;
    let charIndex = 0;
    const typingSpeed = 150;
    const deletingSpeed = 100;
    const minScreenWidth = 600;

    function typeCharacter() {
      if (window.innerWidth < minScreenWidth) {
        typingEl.textContent = texts[0];
        return;
      }
      if (charIndex < texts[textIndex].length) {
        typingEl.textContent = texts[textIndex].substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeCharacter, typingSpeed);
      } else {
        setTimeout(deleteCharacter, 2000);
      }
    }

    function deleteCharacter() {
      if (window.innerWidth < minScreenWidth) return;
      if (charIndex > 0) {
        typingEl.textContent = texts[textIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(deleteCharacter, deletingSpeed);
      } else {
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(typeCharacter, typingSpeed);
      }
    }

    typeCharacter();
  }


  // --- Easter Egg (Profile photo click) --------------------
  const mainImg = document.getElementById('mainImg');
  if (mainImg) {
    let clickCount = 0;
    mainImg.addEventListener('click', () => {
      clickCount++;
      if (clickCount === 10) {
        mainImg.src = 'img/cat.gif';
      }
    });
  }


  // --- Lazy Load Images ------------------------------------
  const blurDivs = document.querySelectorAll('.blur-load');
  blurDivs.forEach(div => {
    const img = div.querySelector('img');
    if (!img) return;

    function onLoaded() {
      div.classList.add('loaded');
    }

    if (img.complete) {
      onLoaded();
    } else {
      img.addEventListener('load', onLoaded);
    }
  });


  // --- Fade-in Animation on Scroll -------------------------
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in--visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    fadeEls.forEach(el => fadeObserver.observe(el));
  }


  // --- Dynamic Age Calculator ------------------------------
  const birthDateString = '2004-03-12';
  const ageEls = document.querySelectorAll('.dynamic-age');
  if (ageEls.length > 0) {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    ageEls.forEach(el => {
      el.textContent = age;
    });
  }


  // --- Current Year in Footer ------------------------------
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});

if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
