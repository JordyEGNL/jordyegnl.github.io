/**
 * Theme Manager — Material Design 3 Dark/Light/Auto Mode
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'theme-preference';
  const THEMES = ['light', 'dark', 'auto'];

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getStoredPreference() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(stored) ? stored : 'auto';
  }

  function getEffectiveTheme(preference) {
    if (preference === 'auto') {
      return getSystemPreference();
    }
    return preference;
  }

  function applyTheme(preference, isInitial = false) {
    const root = document.documentElement;
    const effectiveTheme = getEffectiveTheme(preference);

    if (!isInitial) {
      root.classList.add('theme-transitioning');
    }
    root.setAttribute('data-theme', effectiveTheme);

    // Update all toggle buttons (icons and aria-labels)
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn, #theme-toggle, #theme-toggle-rail');
    toggleBtns.forEach(toggleBtn => {
      const icon = toggleBtn.querySelector('.material-symbols-outlined');
      if (icon) {
        if (preference === 'light') icon.textContent = 'light_mode';
        else if (preference === 'dark') icon.textContent = 'dark_mode';
        else icon.textContent = 'brightness_auto';
      }
      toggleBtn.setAttribute('aria-label', `Thema: ${preference} (klik om te wijzigen)`);
    });

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = effectiveTheme === 'dark' ? '#111413' : '#FAFDFB';
    }

    if (!isInitial) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => root.classList.remove('theme-transitioning'));
      });
    }
  }

  function toggleTheme() {
    const currentPref = getStoredPreference();
    const currentIndex = THEMES.indexOf(currentPref);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    const nextPref = THEMES[nextIndex];
    
    localStorage.setItem(STORAGE_KEY, nextPref);
    applyTheme(nextPref);
  }

  // Initialize immediately without transition
  applyTheme(getStoredPreference(), true);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getStoredPreference() === 'auto') {
      applyTheme('auto');
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn, #theme-toggle, #theme-toggle-rail');
    toggleBtns.forEach(btn => btn.addEventListener('click', toggleTheme));
    // Apply icon states
    applyTheme(getStoredPreference());
  });

  window.themeManager = { toggle: toggleTheme, apply: applyTheme, getPreference: getStoredPreference };
})();
