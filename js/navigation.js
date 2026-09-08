/**
 * Navigation — Material Design 3
 *
 * Features:
 * - Mobile navigation drawer with scrim overlay
 * - Scroll-aware top app bar (elevation on scroll)
 * - Active page highlighting
 * - Typing animation (homepage only)
 * - Lazy-load images with blur placeholder
 * - Easter egg (profile image clicks)
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ─── Navigation Drawer ───────────────────────────────────
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

  // Close drawer when clicking a link inside it
  drawer?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });


  // ─── Scroll-aware Top App Bar ────────────────────────────
  const appBar = document.querySelector('.top-app-bar');
  let lastScrollY = 0;
  const SCROLL_THRESHOLD = 8;

  function updateAppBarElevation() {
    if (!appBar) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      appBar.classList.add('top-app-bar--scrolled');
    } else {
      appBar.classList.remove('top-app-bar--scrolled');
    }
    lastScrollY = window.scrollY;
  }

  window.addEventListener('scroll', updateAppBarElevation, { passive: true });
  updateAppBarElevation(); // Initial check


  // ─── Typing Animation (Homepage) ─────────────────────────
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


  // ─── Easter Egg ──────────────────────────────────────────
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


  // ─── Lazy Load Images ────────────────────────────────────
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


  // ─── Fade-in Animation on Scroll ─────────────────────────
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in--visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => fadeObserver.observe(el));
  }

  // ─── Dynamic Age Calculator ──────────────────────────────
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

});

if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
