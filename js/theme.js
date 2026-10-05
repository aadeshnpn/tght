/**
 * TGHT Theme Management Module
 * Option A/B Hybrid (Dark Mode: Slate Charcoal Canvas + Monastery Crimson Cards + Saffron Gold)
 * Option D Glacial Zen (Light Mode: Mountain Mist Alabaster + Snow White Cards + Glacial Cyan)
 * Handles auto-detection, safe storage persistence, header toggle UI, mobile touch interactions,
 * and explicit color-scheme protection against mobile browser force-dark heuristics (e.g. Brave Night Mode).
 */

(function () {
  // Idempotency guard: prevent duplicate script initialization
  if (window.TGHT_Theme_Initialized) {
    if (window.TGHT_Theme && typeof window.TGHT_Theme.setupHeaderToggles === 'function') {
      window.TGHT_Theme.setupHeaderToggles();
    }
    return;
  }
  window.TGHT_Theme_Initialized = true;

  const STORAGE_KEY = 'tght_theme_preference';

  // Safe storage helper with memory fallback for privacy-hardened environments (Brave Shields / Private Tabs)
  const memoryStore = {};
  const SafeStorage = {
    getItem(key) {
      try {
        const val = localStorage.getItem(key);
        if (val !== null) return val;
      } catch (_) {}
      try {
        const sVal = sessionStorage.getItem(key);
        if (sVal !== null) return sVal;
      } catch (_) {}
      return memoryStore[key] || null;
    },
    setItem(key, val) {
      memoryStore[key] = val;
      try {
        localStorage.setItem(key, val);
      } catch (_) {}
      try {
        sessionStorage.setItem(key, val);
      } catch (_) {}
    }
  };

  const ThemeManager = {
    currentTheme: 'dark', // 'dark' | 'light'

    init() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlTheme = urlParams.get('theme');
        if (urlTheme === 'dark' || urlTheme === 'light') {
          this.currentTheme = urlTheme;
          SafeStorage.setItem(STORAGE_KEY, urlTheme);
        } else {
          const saved = SafeStorage.getItem(STORAGE_KEY);
          if (saved === 'dark' || saved === 'light') {
            this.currentTheme = saved;
          } else {
            const docTheme = document.documentElement.getAttribute('data-theme');
            if (docTheme === 'dark' || docTheme === 'light') {
              this.currentTheme = docTheme;
            } else {
              this.currentTheme = 'dark';
            }
          }
        }
      } catch (e) {
        this.currentTheme = 'dark';
      }

      this.applyTheme(this.currentTheme, false);

      const runSetup = () => {
        this.setupHeaderToggles();
        this.updateToggleUI();
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runSetup);
      } else {
        runSetup();
      }

      window.addEventListener('load', runSetup);

      // Document-level event delegation (supporting both touch and click with text node safety)
      const handleEvent = (e) => {
        const target = e.target && e.target.nodeType === Node.ELEMENT_NODE ? e.target : (e.target ? e.target.parentElement : null);
        if (!target) return;

        const btnDark = target.closest('.theme-btn-dark');
        if (btnDark) {
          if (e.cancelable) e.preventDefault();
          this.setTheme('dark');
          return;
        }
        const btnLight = target.closest('.theme-btn-light');
        if (btnLight) {
          if (e.cancelable) e.preventDefault();
          this.setTheme('light');
          return;
        }
        const toggleBtn = target.closest('.theme-toggle-btn');
        if (toggleBtn) {
          if (e.cancelable) e.preventDefault();
          this.toggle();
          return;
        }
      };

      document.addEventListener('click', handleEvent, { capture: false });
      document.addEventListener('touchend', handleEvent, { passive: false, capture: false });

      // Cross-tab synchronization
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
          this.applyTheme(e.newValue, true);
        }
      });
    },

    isDark() {
      return this.currentTheme === 'dark';
    },

    isLight() {
      return this.currentTheme === 'light';
    },

    setTheme(theme) {
      if (theme !== 'dark' && theme !== 'light') return;
      this.currentTheme = theme;
      SafeStorage.setItem(STORAGE_KEY, theme);
      this.applyTheme(theme, true);
    },

    toggle() {
      this.setTheme(this.isDark() ? 'light' : 'dark');
    },

    applyTheme(theme, dispatch = true) {
      this.currentTheme = theme;
      const isLight = theme === 'light';

      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.remove('theme-dark', 'theme-light');
      document.documentElement.classList.add(`theme-${theme}`);

      if (document.body) {
        document.body.setAttribute('data-theme', theme);
        document.body.classList.remove('theme-dark', 'theme-light');
        document.body.classList.add(`theme-${theme}`);
      }

      // Explicit color-scheme declarations prevent Brave Mobile / Chromium forced dark mode (Night Mode)
      // from inverting or darkening custom light themes
      const schemeVal = isLight ? 'only light' : 'only dark';
      try {
        document.documentElement.style.setProperty('color-scheme', schemeVal, 'important');
        if (document.body) {
          document.body.style.setProperty('color-scheme', schemeVal, 'important');
        }
      } catch (_) {}

      // Keep meta[name="color-scheme"] in sync
      try {
        let metaScheme = document.querySelector('meta[name="color-scheme"]');
        if (!metaScheme) {
          metaScheme = document.createElement('meta');
          metaScheme.name = 'color-scheme';
          document.head.appendChild(metaScheme);
        }
        metaScheme.content = schemeVal;
      } catch (_) {}

      this.updateToggleUI();

      if (dispatch) {
        const detail = {
          theme: this.currentTheme,
          isDark: this.isDark(),
          isLight: this.isLight()
        };
        window.dispatchEvent(new CustomEvent('tght:themeChange', { detail }));
        window.dispatchEvent(new CustomEvent('tght:theme-changed', { detail }));
      }
    },

    setupHeaderToggles() {
      const containers = document.querySelectorAll('.tght-theme-toggle-target');
      containers.forEach(container => {
        container.innerHTML = `
          <div class="unit-switcher theme-switcher" role="group" aria-label="Display Theme Switcher">
            <button type="button" class="theme-btn theme-btn-dark ${this.isDark() ? 'is-active' : ''}" role="button" aria-pressed="${this.isDark()}" title="Night Mode: Option A/B Hybrid (Monastery Crimson & Saffron)">
              <span>🌙</span>
              <span class="hidden sm:inline">Night</span>
            </button>
            <button type="button" class="theme-btn theme-btn-light ${this.isLight() ? 'is-active' : ''}" role="button" aria-pressed="${this.isLight()}" title="Day Mode: Option D Glacial Zen (Clean Alpine Light)">
              <span>☀️</span>
              <span class="hidden sm:inline">Day</span>
            </button>
          </div>
        `;

        const btnDark = container.querySelector('.theme-btn-dark');
        const btnLight = container.querySelector('.theme-btn-light');

        const bindTrigger = (btn, targetTheme) => {
          if (!btn) return;
          const onTrigger = (e) => {
            if (e) {
              if (e.cancelable) e.preventDefault();
              e.stopPropagation();
            }
            this.setTheme(targetTheme);
          };
          btn.addEventListener('touchend', onTrigger, { passive: false });
          btn.addEventListener('click', onTrigger);
        };

        bindTrigger(btnDark, 'dark');
        bindTrigger(btnLight, 'light');
      });

      this.updateToggleUI();
    },

    updateToggleUI() {
      const isDark = this.isDark();
      document.querySelectorAll('.tght-theme-toggle-target').forEach(container => {
        const btnDark = container.querySelector('.theme-btn-dark');
        const btnLight = container.querySelector('.theme-btn-light');
        if (btnDark && btnLight) {
          if (isDark) {
            btnDark.classList.add('is-active');
            btnDark.setAttribute('aria-pressed', 'true');
            btnLight.classList.remove('is-active');
            btnLight.setAttribute('aria-pressed', 'false');
          } else {
            btnLight.classList.add('is-active');
            btnLight.setAttribute('aria-pressed', 'true');
            btnDark.classList.remove('is-active');
            btnDark.setAttribute('aria-pressed', 'false');
          }
        }
      });
    }
  };

  ThemeManager.init();
  window.TGHT_Theme = ThemeManager;
})();
