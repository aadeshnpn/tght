/**
 * TGHT Unit Management Module (Metric SI vs Imperial)
 * Handles auto-location/locale detection, local storage persistence, conversions, and UI event broadcasting.
 */

(function () {
  const STORAGE_KEY = 'tght_unit_preference';

  const UnitManager = {
    currentUnit: 'metric', // 'metric' | 'imperial'
    hasExplicitPreference: false,

    init() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'imperial' || saved === 'metric') {
          this.currentUnit = saved;
          this.hasExplicitPreference = true;
        } else {
          this.currentUnit = this.detectLocationUnit();
          this.hasExplicitPreference = false;
        }
      } catch (e) {
        this.currentUnit = this.detectLocationUnit();
      }

      this.setupHeaderToggle();
      this.updateDOM();
    },

    detectLocationUnit() {
      try {
        // 1. Check modern Intl.Locale measurementSystem
        if (typeof Intl !== 'undefined' && Intl.Locale) {
          const userLocale = navigator.language || (navigator.languages && navigator.languages[0]) || 'en-US';
          const localeObj = new Intl.Locale(userLocale);
          if (localeObj && localeObj.measurementSystem) {
            if (localeObj.measurementSystem === 'us') return 'imperial';
            if (localeObj.measurementSystem === 'metric') return 'metric';
          }
        }

        // 2. Check Timezone heuristic (US timezones utilize Imperial standard)
        if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
          const usTzPrefixes = [
            'America/New_York', 'America/Detroit', 'America/Kentucky', 'America/Indiana',
            'America/Chicago', 'America/Denver', 'America/Boise', 'America/Phoenix',
            'America/Los_Angeles', 'America/Anchorage', 'America/Juneau', 'America/Sitka',
            'America/Metlakatla', 'America/Yakutat', 'America/Nome', 'America/Adak',
            'Pacific/Honolulu', 'US/'
          ];
          if (usTzPrefixes.some(p => tz.startsWith(p) || tz === p)) {
            return 'imperial';
          }
        }

        // 3. Language & country tag heuristic
        const lang = (navigator.language || '').toLowerCase();
        if (lang.endsWith('-us') || lang.endsWith('_us') || lang === 'en-us' || lang.endsWith('-lr') || lang.endsWith('-mm')) {
          return 'imperial';
        }
      } catch (err) {
        console.warn('Unit location detection error:', err);
      }

      return 'metric';
    },

    isMetric() {
      return this.currentUnit === 'metric';
    },

    setUnit(unit) {
      if (unit !== 'metric' && unit !== 'imperial') return;
      this.currentUnit = unit;
      this.hasExplicitPreference = true;
      try {
        localStorage.setItem(STORAGE_KEY, unit);
      } catch (e) {}

      this.updateToggleUI();
      this.updateDOM();

      const detail = { unit: this.currentUnit, isMetric: this.isMetric() };
      window.dispatchEvent(new CustomEvent('tght:unitChange', { detail }));
      window.dispatchEvent(new CustomEvent('tght:units-changed', { detail }));
    },

    toggle() {
      this.setUnit(this.isMetric() ? 'imperial' : 'metric');
    },

    kmToMi(km) {
      return km * 0.621371;
    },

    miToKm(mi) {
      return mi / 0.621371;
    },

    mToFt(m) {
      return m * 3.28084;
    },

    ftToM(ft) {
      return ft / 3.28084;
    },

    formatDistance(km, opts = {}) {
      const num = parseFloat(km);
      if (isNaN(num)) return km;

      if (this.isMetric()) {
        const decimals = opts.decimals !== undefined ? opts.decimals : (num % 1 !== 0 ? 1 : 0);
        const unitLabel = opts.full ? 'kilometers' : (opts.unit !== false ? 'km' : '');
        const factor = Math.pow(10, decimals);
        const rounded = decimals > 0 ? (Math.round(num * factor) / factor) : Math.round(num);
        const text = rounded.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        return unitLabel ? `${text} ${unitLabel}` : text;
      } else {
        const mi = this.kmToMi(num);
        const decimals = opts.decimals !== undefined ? opts.decimals : (num % 1 !== 0 ? 1 : (mi < 10 && mi % 1 !== 0 ? 1 : 0));
        const unitLabel = opts.full ? 'miles' : (opts.unit !== false ? 'mi' : '');
        const factor = Math.pow(10, decimals);
        const rounded = decimals > 0 ? (Math.round(mi * factor) / factor) : Math.round(mi);
        const text = rounded.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        return unitLabel ? `${text} ${unitLabel}` : text;
      }
    },

    formatElevation(m, opts = {}) {
      const num = parseFloat(m);
      if (isNaN(num)) return m;

      if (this.isMetric()) {
        const unitLabel = opts.full ? ' meters' : (opts.unit !== false ? 'm' : '');
        return `${Math.round(num).toLocaleString()}${unitLabel}`;
      } else {
        const ft = Math.round(this.mToFt(num));
        const unitLabel = opts.full ? ' feet' : (opts.unit !== false ? ' ft' : '');
        return `${ft.toLocaleString()}${unitLabel}`;
      }
    },

    formatAscent(m) {
      let num = parseFloat(m);
      if (isNaN(num)) return m;

      const sign = num < 0 ? '-' : '+';
      const absVal = Math.abs(num);

      if (this.isMetric()) {
        return `${sign}${Math.round(absVal).toLocaleString()}m`;
      } else {
        const ft = Math.round(this.mToFt(absVal));
        return `${sign}${ft.toLocaleString()} ft`;
      }
    },

    formatAbbreviatedAscent(m) {
      let num = parseFloat(m);
      if (isNaN(num)) return m;

      if (this.isMetric()) {
        return `${Math.round(num).toLocaleString()} m`;
      } else {
        const ft = Math.round(this.mToFt(num));
        return `${ft.toLocaleString()} ft`;
      }
    },

    setupHeaderToggle() {
      const containers = document.querySelectorAll('.tght-unit-switcher-target');
      containers.forEach(container => {
        container.innerHTML = `
          <div class="unit-switcher">
            <button type="button" class="unit-btn unit-btn-metric" title="Metric SI (km / meters)">
              KM / M
            </button>
            <button type="button" class="unit-btn unit-btn-imperial" title="Imperial (miles / feet)">
              MI / FT
            </button>
          </div>
        `;

        const btnMetric = container.querySelector('.unit-btn-metric');
        const btnImperial = container.querySelector('.unit-btn-imperial');

        if (btnMetric) {
          btnMetric.addEventListener('click', (e) => {
            e.preventDefault();
            this.setUnit('metric');
          });
        }
        if (btnImperial) {
          btnImperial.addEventListener('click', (e) => {
            e.preventDefault();
            this.setUnit('imperial');
          });
        }
      });

      this.updateToggleUI();
    },

    updateToggleUI() {
      const isMet = this.isMetric();
      document.querySelectorAll('.tght-unit-switcher-target').forEach(container => {
        const btnMetric = container.querySelector('.unit-btn-metric');
        const btnImperial = container.querySelector('.unit-btn-imperial');
        if (btnMetric && btnImperial) {
          if (isMet) {
            btnMetric.classList.add('is-active');
            btnImperial.classList.remove('is-active');
          } else {
            btnImperial.classList.add('is-active');
            btnMetric.classList.remove('is-active');
          }
        }
      });
    },

    applyUnitsToElement(root = document) {
      this.updateDOM(root);
    },

    updateDOM(root = document) {
      if (!root) return;

      // Update elements with data-km (distance in km)
      root.querySelectorAll('[data-km]').forEach(el => {
        const val = parseFloat(el.getAttribute('data-km'));
        const isFull = el.getAttribute('data-full') === 'true';
        const hasUnit = el.getAttribute('data-unit') !== 'false';
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = el.getAttribute('data-decimals') !== null ? parseInt(el.getAttribute('data-decimals')) : undefined;
        const distFormatted = this.formatDistance(val, { decimals, full: isFull, unit: hasUnit });
        if (suffix === '+' && (distFormatted.endsWith(' mi') || distFormatted.endsWith(' km'))) {
          el.innerText = distFormatted.replace(' ', '+ ');
        } else {
          el.innerText = distFormatted + suffix;
        }
      });

      // Update elements with data-mi (distance specified in miles)
      root.querySelectorAll('[data-mi]').forEach(el => {
        const miVal = parseFloat(el.getAttribute('data-mi'));
        const kmVal = this.miToKm(miVal);
        const isFull = el.getAttribute('data-full') === 'true';
        const hasUnit = el.getAttribute('data-unit') !== 'false';
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = el.getAttribute('data-decimals') !== null ? parseInt(el.getAttribute('data-decimals')) : (miVal % 1 !== 0 ? 1 : 0);
        const distFormatted = this.formatDistance(kmVal, { decimals, full: isFull, unit: hasUnit });
        if (suffix === '+' && (distFormatted.endsWith(' mi') || distFormatted.endsWith(' km'))) {
          el.innerText = distFormatted.replace(' ', '+ ');
        } else {
          el.innerText = distFormatted + suffix;
        }
      });

      // Update elements with data-m (elevation in meters)
      root.querySelectorAll('[data-m]').forEach(el => {
        const val = parseFloat(el.getAttribute('data-m'));
        const isFull = el.getAttribute('data-full') === 'true';
        const suffix = el.getAttribute('data-suffix') || '';
        el.innerText = this.formatElevation(val, { full: isFull }) + suffix;
      });

      // Update elements with data-ascent-m (vertical gain in meters)
      root.querySelectorAll('[data-ascent-m]').forEach(el => {
        const val = parseFloat(el.getAttribute('data-ascent-m'));
        const suffix = el.getAttribute('data-suffix') || '';
        el.innerText = this.formatAscent(val) + suffix;
      });

      // Update elements with data-ascent-k (abbreviated vertical gain)
      root.querySelectorAll('[data-ascent-k]').forEach(el => {
        const val = parseFloat(el.getAttribute('data-ascent-k'));
        const suffix = el.getAttribute('data-suffix') || '';
        el.innerText = this.formatAbbreviatedAscent(val) + suffix;
      });

      // Update elements with data-range-m (e.g. "4000,6200")
      root.querySelectorAll('[data-range-m]').forEach(el => {
        const parts = el.getAttribute('data-range-m').split(',').map(s => parseFloat(s.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          if (this.isMetric()) {
            el.innerText = `${Math.round(parts[0]).toLocaleString()}m – ${Math.round(parts[1]).toLocaleString()}m`;
          } else {
            const ft1 = Math.round(this.mToFt(parts[0]));
            const ft2 = Math.round(this.mToFt(parts[1]));
            el.innerText = `${ft1.toLocaleString()} ft – ${ft2.toLocaleString()} ft`;
          }
        }
      });

      // Update elements with data-vam-m (Vertical Ascent in m/hr)
      root.querySelectorAll('[data-vam-m]').forEach(el => {
        const valM = parseFloat(el.getAttribute('data-vam-m'));
        if (this.isMetric()) {
          el.innerText = `${Math.round(valM).toLocaleString()} m/hr`;
        } else {
          const ftVal = Math.round(this.mToFt(valM));
          el.innerText = `${ftVal.toLocaleString()} ft/hr`;
        }
      });

      // Update elements with data-vam-sub (VAM subtitle contextual detail)
      root.querySelectorAll('[data-vam-sub]').forEach(el => {
        const valM = parseFloat(el.getAttribute('data-vam-sub'));
        if (this.isMetric()) {
          const ftVal = Math.round(this.mToFt(valM));
          el.innerText = `~${ftVal.toLocaleString()} vertical ft / hour`;
        } else {
          el.innerText = `~${Math.round(valM).toLocaleString()} vertical meters / hour`;
        }
      });
    }
  };

  window.UnitManager = UnitManager;

  // Cross-tab synchronization
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && (e.newValue === 'imperial' || e.newValue === 'metric')) {
      UnitManager.setUnit(e.newValue);
    }
  });

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UnitManager.init());
  } else {
    UnitManager.init();
  }
})();
