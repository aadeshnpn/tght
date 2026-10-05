/**
 * TGHT Interactive Data Visualization & Mountain Physics Engine
 * Powers the graphical revamp of the Great Himalayan Trail home page
 * Integrates with window.UnitManager for dynamic SI/Imperial metric conversion
 */

(function () {
  'use strict';

  // Wait for DOM and UnitManager
  document.addEventListener('DOMContentLoaded', () => {
    initEverestMultiplier();
    initThinAirSimulator();
    initElevationBiomeExplorer();
    initHumanMachineSimulator();
    initPackLoadoutChart();
    initRouteRadarChart();
    initTrailBenchmarkModule();
  });

  /* ==========================================================================
     1. THE EVEREST MULTIPLIER: LANDMARK ELEVATION COMPARATIVE VISUALIZER
     Total Vertical Ascent: +105,000 meters (+344,488 ft)
     ========================================================================== */
  const LANDMARKS = [
    {
      id: 'everest_sea',
      name: 'Mount Everest (Sea Level to Summit)',
      short: 'Mt. Everest',
      gainM: 8848,
      gainFt: 29029,
      icon: '🏔️',
      description: 'The roof of the world measured from ocean level to the 8,848m summit.'
    },
    {
      id: 'everest_bc',
      name: 'Mount Everest (Base Camp to Summit)',
      short: 'Everest BC to Top',
      gainM: 3484,
      gainFt: 11430,
      icon: '⛺',
      description: 'Climbing from Everest South Base Camp (5,364m) to the highest point on Earth.'
    },
    {
      id: 'whitney',
      name: 'Mount Whitney (Whitney Portal to Summit)',
      short: 'Mt. Whitney',
      gainM: 1900,
      gainFt: 6234,
      icon: '⛰️',
      description: 'The highest summit in the contiguous US, ascending from Lone Pine Portal.'
    },
    {
      id: 'rainier',
      name: 'Mount Rainier (Paradise to Crater)',
      short: 'Mt. Rainier',
      gainM: 2750,
      gainFt: 9022,
      icon: '🧊',
      description: 'Ascending through glaciers, crevasses, and seracs to the volcanic summit.'
    },
    {
      id: 'kilimanjaro',
      name: 'Mount Kilimanjaro (Machame to Uhuru)',
      short: 'Kilimanjaro',
      gainM: 4100,
      gainFt: 13451,
      icon: '🌋',
      description: 'Climbing from the equatorial rainforest to the glaciated rim of Africa.'
    },
    {
      id: 'grand_canyon',
      name: 'Grand Canyon (Rim to River to Rim)',
      short: 'Grand Canyon R2R2R',
      gainM: 1400,
      gainFt: 4593,
      icon: '🏜️',
      description: 'Descending to the Colorado River and ascending back to the canyon rim.'
    },
    {
      id: 'empire_state',
      name: 'Empire State Building (102 Floors)',
      short: 'Empire State',
      gainM: 381,
      gainFt: 1250,
      icon: '🏙️',
      description: 'Taking the stairs to the 102nd floor observation deck of the NYC landmark.'
    },
    {
      id: 'burj_khalifa',
      name: 'Burj Khalifa (163 Floors)',
      short: 'Burj Khalifa',
      gainM: 828,
      gainFt: 2717,
      icon: '🗼',
      description: 'Ascending the tallest free-standing architectural structure in human history.'
    }
  ];

  const GHT_TOTAL_ASCENT_M = 105000;
  const GHT_TOTAL_ASCENT_FT = 344488;

  function initEverestMultiplier() {
    const selectorContainer = document.getElementById('multiplier-selector');
    const multiplierNumberEl = document.getElementById('multiplier-number');
    const landmarkNameEl = document.getElementById('multiplier-landmark-name');
    const landmarkHeightEl = document.getElementById('multiplier-landmark-height');
    const landmarkDescEl = document.getElementById('multiplier-landmark-desc');
    const stackVisualEl = document.getElementById('multiplier-stack-visual');

    if (!selectorContainer || !multiplierNumberEl) return;

    let selectedId = 'everest_sea';

    function renderSelector() {
      selectorContainer.innerHTML = LANDMARKS.map(lm => `
        <button 
          type="button" 
          class="multiplier-btn px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${lm.id === selectedId ? 'bg-[#d49b42] text-[#080c14] border-[#d49b42] font-bold shadow-md shadow-[#d49b42]/20' : 'bg-white/5 border-white/10 text-[#d1c7b7] hover:text-white hover:bg-white/10'}"
          data-lm="${lm.id}"
        >
          <span>${lm.icon}</span>
          <span>${lm.short}</span>
        </button>
      `).join('');

      selectorContainer.querySelectorAll('.multiplier-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedId = btn.getAttribute('data-lm');
          updateMultiplier();
          renderSelector();
        });
      });
    }

    function updateMultiplier() {
      const lm = LANDMARKS.find(l => l.id === selectedId) || LANDMARKS[0];
      const isMet = !window.UnitManager || window.UnitManager.isMetric();

      const multiplier = (GHT_TOTAL_ASCENT_M / lm.gainM).toFixed(1);
      multiplierNumberEl.innerText = `${multiplier}×`;

      if (landmarkNameEl) landmarkNameEl.innerText = lm.name;
      if (landmarkDescEl) landmarkDescEl.innerText = lm.description;
      if (landmarkHeightEl) {
        landmarkHeightEl.innerText = isMet
          ? `${lm.gainM.toLocaleString()} m vertical gain`
          : `${lm.gainFt.toLocaleString()} ft vertical gain`;
      }

      // Render mini graphic stack (up to 18 visible visual blocks)
      if (stackVisualEl) {
        const count = Math.min(Math.round(multiplier), 18);
        let blocks = '';
        for (let i = 0; i < count; i++) {
          blocks += `<span class="inline-block px-1 text-sm transition-transform hover:scale-125" title="Ascent #${i + 1}">${lm.icon}</span>`;
        }
        if (multiplier > 18) {
          blocks += `<span class="text-xs font-mono text-[#d49b42] font-bold pl-2">+${(multiplier - 18).toFixed(1)} more</span>`;
        }
        stackVisualEl.innerHTML = blocks;
      }
    }

    renderSelector();
    updateMultiplier();

    window.addEventListener('tght:unitChange', updateMultiplier);
    window.addEventListener('tght:units-changed', updateMultiplier);
  }

  /* ==========================================================================
     2. THIN AIR SIMULATOR: ALTITUDE VS. OXYGEN & ATMOSPHERIC PHYSICS
     Formula: P = 101.325 * (1 - 0.0065*h/288.15)^5.25588
     ========================================================================== */
  function initThinAirSimulator() {
    const slider = document.getElementById('altitude-slider');
    const valAltitudeM = document.getElementById('sim-alt-m');
    const valAltitudeFt = document.getElementById('sim-alt-ft');
    const valOxygen = document.getElementById('sim-oxygen-pct');
    const valPressure = document.getElementById('sim-pressure-kpa');
    const valBoilC = document.getElementById('sim-boil-c');
    const valHeartRate = document.getElementById('sim-hr-delta');
    const valZoneDesc = document.getElementById('sim-zone-desc');
    const valOxygenBar = document.getElementById('sim-oxygen-bar');
    const landmarkBadge = document.getElementById('sim-landmark-badge');
    const figureStage = document.getElementById('thin-air-figure');
    const figureClimber = document.getElementById('sim-climber');
    const figurePose = document.getElementById('sim-climber-pose');
    const figureLeg = document.getElementById('sim-leg-front');
    const figureLabel = document.getElementById('sim-figure-label');
    const figureCue = document.getElementById('sim-figure-cue');
    const figureBpm = document.getElementById('sim-pulse-bpm');

    if (!slider || !valOxygen) return;

    const FIGURE_STEPS = [
      { h: 800, breath: 2.8, depth: 1.06, pulse: 1.05, lean: 0, fog: 0, stride: 8, bpm: 66, label: 'Jungle pace', cue: 'Upright stance. Slow, full breaths. Pulse at rest.' },
      { h: 1500, breath: 2.2, depth: 1.05, pulse: 0.9, lean: 2, fog: 0.08, stride: 6, bpm: 78, label: 'Temperate pace', cue: 'Breathing deepens. Heart rate starts to lift.' },
      { h: 3000, breath: 1.45, depth: 1.035, pulse: 0.68, lean: 6, fog: 0.35, stride: 2, bpm: 98, label: 'High-altitude pace', cue: 'Shorter breaths. Pulse is clearly faster.' },
      { h: 4500, breath: 1.0, depth: 1.02, pulse: 0.5, lean: 10, fog: 0.7, stride: -2, bpm: 118, label: 'Alpine pace', cue: 'Leaning into the slope. Breath fog. Pulse running high.' },
      { h: 6190, breath: 0.62, depth: 1.012, pulse: 0.36, lean: 14, fog: 1, stride: -6, bpm: 142, label: 'Crux pace', cue: 'Hunched rest-step. Rapid pulse. Thick breath fog.' }
    ];

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function sampleFigure(h) {
      let i = 0;
      while (i < FIGURE_STEPS.length - 1 && h > FIGURE_STEPS[i + 1].h) i += 1;
      const a = FIGURE_STEPS[i];
      const b = FIGURE_STEPS[Math.min(i + 1, FIGURE_STEPS.length - 1)];
      const t = a.h === b.h ? 0 : Math.min(1, Math.max(0, (h - a.h) / (b.h - a.h)));
      const zone = h < 1500 ? FIGURE_STEPS[0] : h < 3000 ? FIGURE_STEPS[1] : h < 4500 ? FIGURE_STEPS[2] : h < 5500 ? FIGURE_STEPS[3] : FIGURE_STEPS[4];
      return {
        breath: zone.breath,
        depth: lerp(a.depth, b.depth, t),
        pulse: zone.pulse,
        lean: lerp(a.lean, b.lean, t),
        fog: lerp(a.fog, b.fog, t),
        stride: lerp(a.stride, b.stride, t),
        bpm: Math.round(lerp(a.bpm, b.bpm, t)),
        label: zone.label,
        cue: zone.cue
      };
    }

    function ridgeY(x) {
      const t = x / 640;
      const p0 = 208;
      const p1 = 188;
      const p2 = 150;
      return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    }

    let figureBucket = '';

    // High Route landmark altitudes
    const ALT_LANDMARKS = [
      { alt: 800, name: 'Arun & Karnali River Basins' },
      { alt: 1400, name: 'Kathmandu Valley Level' },
      { alt: 2200, name: 'Subalpine Fir & Bamboo' },
      { alt: 3440, name: 'Namche Bazaar (Sherpa Capital)' },
      { alt: 4200, name: 'Dingboche & High Beyuls' },
      { alt: 5106, name: 'Larkya La Pass (Manaslu)' },
      { alt: 5364, name: 'Everest South Base Camp' },
      { alt: 5416, name: 'Thorong La (Annapurna)' },
      { alt: 5845, name: 'Amphu Labsta Technical Col' },
      { alt: 6190, name: 'West Col (GHT Crux Pass)' }
    ];

    function calculateAtmosphere(h) {
      // Atmospheric pressure in kPa
      const P = 101.325 * Math.pow(1 - (0.0065 * h) / 288.15, 5.25588);
      // Effective Oxygen percentage relative to sea level (20.9% of air at current density)
      const oxygenPct = Math.max(10, Math.round((P / 101.325) * 100));
      // Water boiling point in Celsius
      const boilC = Math.max(65, +(100 - 0.0034 * h).toFixed(1));
      const boilF = +(boilC * 1.8 + 32).toFixed(1);
      // Heart rate baseline elevation spike
      const hrDelta = h < 1500 ? '+0-5 bpm' : h < 3000 ? '+10-15 bpm' : h < 4500 ? '+20-30 bpm' : '+35-45 bpm';

      let zoneText = '';
      if (h < 1500) {
        zoneText = 'Subtropical Jungle Zone: Full oxygen saturation (SpO2 ~99%). Complete aerobic capacity.';
      } else if (h < 3000) {
        zoneText = 'Temperate Transition: Kidneys begin compensating for hypoxia by increasing respiration and bicarbonate excretion.';
      } else if (h < 4500) {
        zoneText = 'High Altitude Hypoxia: SpO2 drops to 80–86%. Pulse accelerates. Conscious breathing rhythm is essential.';
      } else if (h < 5500) {
        zoneText = 'Extreme Alpine Realm: Half of sea-level oxygen molecules per breath. Water boils too cool to cook raw lentils.';
      } else {
        zoneText = 'The Crux Death-Threshold Zone: Only 47% effective oxygen. Every 10 paces require 3 deliberate resting breaths.';
      }

      // Closest landmark
      let closestLm = ALT_LANDMARKS[0];
      let minDiff = 9999;
      ALT_LANDMARKS.forEach(lm => {
        const diff = Math.abs(lm.alt - h);
        if (diff < minDiff) {
          minDiff = diff;
          closestLm = lm;
        }
      });

      return {
        h,
        ft: Math.round(h * 3.28084),
        P: P.toFixed(1),
        oxygenPct,
        boilC,
        boilF,
        hrDelta,
        zoneText,
        closestLm
      };
    }

    function update() {
      const h = parseInt(slider.value, 10);
      const data = calculateAtmosphere(h);
      const isMet = !window.UnitManager || window.UnitManager.isMetric();

      if (valAltitudeM) valAltitudeM.innerText = `${data.h.toLocaleString()} m`;
      if (valAltitudeFt) valAltitudeFt.innerText = `${data.ft.toLocaleString()} ft`;
      if (valOxygen) valOxygen.innerText = `${data.oxygenPct}%`;
      if (valPressure) valPressure.innerText = `${data.P} kPa`;
      if (valBoilC) valBoilC.innerText = isMet ? `${data.boilC}°C` : `${data.boilF}°F`;
      if (valHeartRate) valHeartRate.innerText = data.hrDelta;
      if (valZoneDesc) valZoneDesc.innerText = data.zoneText;
      if (valOxygenBar) {
        valOxygenBar.style.width = `${data.oxygenPct}%`;
        // Color transition from emerald to gold to amber to red
        if (data.oxygenPct > 75) {
          valOxygenBar.style.backgroundColor = '#4e9166';
        } else if (data.oxygenPct > 55) {
          valOxygenBar.style.backgroundColor = '#d49b42';
        } else {
          valOxygenBar.style.backgroundColor = '#b85c3c';
        }
      }
      if (landmarkBadge) {
        landmarkBadge.innerText = data.closestLm.name;
      }

      if (figureStage && figureClimber && figurePose) {
        const fig = sampleFigure(h);
        const climb = (h - 800) / (6190 - 800);
        const x = 28 + climb * 430;
        const y = ridgeY(x) - 154;
        figureClimber.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        figurePose.setAttribute('transform', `rotate(${fig.lean.toFixed(1)} 52 154)`);
        if (figureLeg) figureLeg.setAttribute('transform', `rotate(${fig.stride.toFixed(1)} 54 102)`);
        if (figureBpm) figureBpm.textContent = String(fig.bpm);
        figureStage.style.setProperty('--breath-depth', fig.depth.toFixed(3));
        figureStage.style.setProperty('--fog', fig.fog.toFixed(3));
        figureStage.style.setProperty('--zone-color', h < 1500 ? '#72b388' : h < 3000 ? '#8cb5f2' : h < 4500 ? '#d49b42' : h < 5500 ? '#df7a57' : '#e07a5f');

        const bucket = fig.label;
        if (bucket !== figureBucket) {
          figureBucket = bucket;
          figureStage.style.setProperty('--breath-dur', `${fig.breath.toFixed(2)}s`);
          figureStage.style.setProperty('--pulse-dur', `${fig.pulse.toFixed(2)}s`);
          if (figureLabel) figureLabel.textContent = fig.label;
          if (figureCue) figureCue.textContent = fig.cue;
        }
      }
    }

    slider.addEventListener('input', update);
    update();

    window.addEventListener('tght:unitChange', update);
    window.addEventListener('tght:units-changed', update);
  }

  /* ==========================================================================
     3. 1,700 KM ELEVATION PROFILE & 8 BIOME ZONES INTERACTIVE VISUALIZER
     ========================================================================== */
  function initElevationBiomeExplorer() {
    const container = document.getElementById('home-elevation-profile');
    if (!container) return;

    const PROFILE_DATA = [
      [0, 2420, 'Taplejung (Start)', false, false],
      [50, 3400, 'Ghunsa Valley', false, false],
      [110, 5160, 'Lapsang La Pass', true, false],
      [130, 4800, 'Pangpema (Kanchenjunga)', false, true],
      [180, 2200, 'Arun River Gorge', false, false],
      [240, 5300, 'Makalu Base Camp', false, true],
      [280, 6150, 'Sherpani Col (Crux 1)', true, false],
      [300, 6190, 'West Col (Max Alt 6,190m)', true, false],
      [330, 5845, 'Amphu Labsta (Crux 3)', true, false],
      [370, 5364, 'Everest Base Camp', false, true],
      [420, 5755, 'Tashi Laptsa Pass (Crux 4)', true, false],
      [470, 3600, 'Beding (Rolwaling Sanctuary)', false, false],
      [540, 5308, 'Tilman Pass (Langtang)', true, false],
      [610, 4380, 'Gosainkunda Sacred Lake', false, false],
      [710, 5106, 'Larkya La (Manaslu)', true, true],
      [790, 4200, 'Naar-Phu Medieval Valley', false, false],
      [840, 5416, 'Thorong La Pass (Annapurna)', true, true],
      [910, 2800, 'Kali Gandaki Gorge', false, true],
      [990, 5595, 'Teri La (Mustang Wild)', true, false],
      [1080, 3800, 'Lo Manthang (Walled City)', false, false],
      [1180, 5550, 'Jungben La (Dolpo)', true, false],
      [1250, 4100, 'Shey Gompa (Crystal Mt)', false, false],
      [1320, 3600, 'Phoksundo Turquoise Lake', false, false],
      [1410, 5115, 'Kagmara La Pass', true, false],
      [1490, 2990, 'Rara Mirror Lake', false, false],
      [1600, 4990, 'Nyalu La Pass', true, false],
      [1700, 3050, 'Hilsa Tibetan Border (Finish)', false, false]
    ];

    const svgWidth = 1000;
    const svgHeight = 280;
    const padding = { top: 40, right: 30, bottom: 45, left: 50 };
    const plotW = svgWidth - padding.left - padding.right;
    const plotH = svgHeight - padding.top - padding.bottom;

    const maxDist = 1700;
    const minEle = 800;
    const maxEle = 6500;

    function getX(dist) {
      return padding.left + (dist / maxDist) * plotW;
    }

    function getY(ele) {
      return padding.top + plotH - ((ele - minEle) / (maxEle - minEle)) * plotH;
    }

    const pointsStr = PROFILE_DATA.map(p => `${getX(p[0]).toFixed(1)},${getY(p[1]).toFixed(1)}`).join(' L ');
    const areaStr = `M ${getX(0)},${getY(minEle)} L ${pointsStr} L ${getX(maxDist)},${getY(minEle)} Z`;

    const biomes = [
      { name: 'Nival Glacial (>5,500m)', min: 5500, max: 6500, color: 'rgba(96,144,212,0.12)' },
      { name: 'Alpine Tundra (4,200-5,500m)', min: 4200, max: 5500, color: 'rgba(212,155,66,0.08)' },
      { name: 'Subalpine Forest (2,800-4,200m)', min: 2800, max: 4200, color: 'rgba(78,145,102,0.09)' },
      { name: 'Temperate / Subtropical (<2,800m)', min: 800, max: 2800, color: 'rgba(14,20,34,0.3)' }
    ];

    const biomeBandsSvg = biomes.map(b => {
      const yTop = getY(b.max);
      const yBtm = getY(b.min);
      const h = yBtm - yTop;
      return `<rect x="${padding.left}" y="${yTop}" width="${plotW}" height="${h}" fill="${b.color}" />`;
    }).join('');

    const markersSvg = PROFILE_DATA.filter(p => p[3] || p[4]).map(p => {
      const cx = getX(p[0]);
      const cy = getY(p[1]);
      const color = p[3] ? '#d49b42' : '#8cb5f2';
      return `
        <g class="profile-pin group cursor-pointer" data-dist="${p[0]}" data-ele="${p[1]}" data-name="${p[2]}">
          <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${padding.top + plotH}" stroke="${color}" stroke-dasharray="2 3" opacity="0.35" />
          <circle cx="${cx}" cy="${cy}" r="4" fill="${color}" stroke="#080c14" stroke-width="2" class="transition-transform group-hover:scale-150" />
        </g>
      `;
    }).join('');

    function renderSvgProfile() {
      const isMet = !window.UnitManager || window.UnitManager.isMetric();
      const ele2000 = isMet ? '2000m' : '6,560 ft';
      const ele4000 = isMet ? '4000m' : '13,120 ft';
      const ele6000 = isMet ? '6000m' : '19,685 ft';

      const dist0 = isMet ? '0 km (East)' : '0 mi (East)';
      const distMid = isMet ? '850 km (Central)' : '528 mi (Central)';
      const distEnd = isMet ? '1,700 km (West)' : '1,056 mi (West)';

      container.innerHTML = `
        <div class="relative w-full overflow-hidden">
          <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="w-full h-auto overflow-visible select-none">
            <defs>
              <linearGradient id="profileGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#d49b42" stop-opacity="0.5" />
                <stop offset="40%" stop-color="#6090d4" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#080c14" stop-opacity="0.05" />
              </linearGradient>
              <linearGradient id="lineStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#f1be6d" />
                <stop offset="30%" stop-color="#b85c3c" />
                <stop offset="60%" stop-color="#8cb5f2" />
                <stop offset="100%" stop-color="#72b388" />
              </linearGradient>
            </defs>

            ${biomeBandsSvg}

            <line x1="${padding.left}" y1="${getY(2000)}" x2="${padding.left + plotW}" y2="${getY(2000)}" stroke="rgba(255,255,255,0.06)" />
            <line x1="${padding.left}" y1="${getY(4000)}" x2="${padding.left + plotW}" y2="${getY(4000)}" stroke="rgba(255,255,255,0.06)" />
            <line x1="${padding.left}" y1="${getY(6000)}" x2="${padding.left + plotW}" y2="${getY(6000)}" stroke="rgba(212,155,66,0.15)" stroke-dasharray="4 4" />

            <text x="${padding.left - 8}" y="${getY(2000) + 4}" fill="#8e867a" font-size="10" text-anchor="end" font-family="monospace">${ele2000}</text>
            <text x="${padding.left - 8}" y="${getY(4000) + 4}" fill="#8e867a" font-size="10" text-anchor="end" font-family="monospace">${ele4000}</text>
            <text x="${padding.left - 8}" y="${getY(6000) + 4}" fill="#d49b42" font-size="10" text-anchor="end" font-family="monospace" font-weight="bold">${ele6000}</text>

            <path d="${areaStr}" fill="url(#profileGradient)" />
            <path d="M ${pointsStr}" fill="none" stroke="url(#lineStrokeGradient)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            ${markersSvg}

            <text x="${padding.left}" y="${padding.top + plotH + 20}" fill="#8e867a" font-size="10" font-family="monospace">${dist0}</text>
            <text x="${padding.left + plotW / 2}" y="${padding.top + plotH + 20}" fill="#8e867a" font-size="10" text-anchor="middle" font-family="monospace">${distMid}</text>
            <text x="${padding.left + plotW}" y="${padding.top + plotH + 20}" fill="#8e867a" font-size="10" text-anchor="end" font-family="monospace">${distEnd}</text>
          </svg>

          <div id="profile-tooltip" class="absolute hidden pointer-events-none z-30 bg-[#0e1422]/95 border border-[#d49b42]/40 rounded-xl px-3 py-2 text-xs shadow-2xl backdrop-blur-md transition-all">
            <div id="profile-tt-name" class="font-bold text-white font-serif"></div>
            <div class="text-[11px] text-[#d49b42] font-mono mt-0.5" id="profile-tt-stats"></div>
          </div>
        </div>
      `;

      const tooltip = document.getElementById('profile-tooltip');
      const ttName = document.getElementById('profile-tt-name');
      const ttStats = document.getElementById('profile-tt-stats');

      container.querySelectorAll('.profile-pin').forEach(pin => {
        pin.addEventListener('mouseenter', () => {
          const name = pin.getAttribute('data-name');
          const dist = pin.getAttribute('data-dist');
          const ele = pin.getAttribute('data-ele');
          const currentIsMet = !window.UnitManager || window.UnitManager.isMetric();

          const distStr = currentIsMet ? `${dist} km` : `${Math.round(dist * 0.621371)} mi`;
          const eleStr = currentIsMet ? `${ele}m` : `${Math.round(ele * 3.28084).toLocaleString()} ft`;

          ttName.innerText = name;
          ttStats.innerText = `${distStr} · Elevation: ${eleStr}`;

          const rect = pin.getBoundingClientRect();
          const parentRect = container.getBoundingClientRect();

          tooltip.style.left = `${rect.left - parentRect.left - 50}px`;
          tooltip.style.top = `${rect.top - parentRect.top - 45}px`;
          tooltip.classList.remove('hidden');
        });

        pin.addEventListener('mouseleave', () => {
          tooltip.classList.add('hidden');
        });
      });
    }

    renderSvgProfile();
    window.addEventListener('tght:unitChange', renderSvgProfile);
    window.addEventListener('tght:units-changed', renderSvgProfile);
  }

  /* ==========================================================================
     4. THE HUMAN MACHINE: CALORIE, FOOTSTEP & GEAR DESTRUCTION SIMULATOR
     ========================================================================== */
  function initHumanMachineSimulator() {
    const weightInput = document.getElementById('user-weight-input');
    const weightUnitLabel = document.getElementById('user-weight-unit-label');
    const paceSelect = document.getElementById('user-pace-select');
    const totalCalEl = document.getElementById('stat-total-calories');
    const dailyCalEl = document.getElementById('stat-daily-calories');
    const dalBhatEl = document.getElementById('stat-dal-bhat');
    const stepsEl = document.getElementById('stat-total-steps');
    const shoesEl = document.getElementById('stat-shoes-destroyed');

    if (!weightInput || !totalCalEl) return;

    let isInputMetric = true;

    function calculate() {
      const isMet = !window.UnitManager || window.UnitManager.isMetric();
      const rawVal = parseFloat(weightInput.value);
      let weightKg = 72;

      if (!isNaN(rawVal)) {
        weightKg = isMet ? rawVal : rawVal / 2.20462;
      }

      const paceMultiplier = parseFloat(paceSelect ? paceSelect.value : 1.0) || 1.0;
      const packWeightKg = 14;

      const baseMetabolic = 1800;
      const activityBurn = (weightKg + packWeightKg) * 36 * paceMultiplier;
      const dailyKcal = Math.round(baseMetabolic + activityBurn);
      const totalKcal = dailyKcal * 140;

      const dalBhatCount = Math.round(totalKcal / 580);
      const totalSteps = 3540000;

      if (totalCalEl) totalCalEl.innerText = `${totalKcal.toLocaleString()} kcal`;
      if (dailyCalEl) dailyCalEl.innerText = `${dailyKcal.toLocaleString()} kcal/day`;
      if (dalBhatEl) dalBhatEl.innerText = `${dalBhatCount.toLocaleString()} plates`;
      if (stepsEl) stepsEl.innerText = `~${(totalSteps / 1000000).toFixed(1)}M steps`;
      if (shoesEl) shoesEl.innerText = '4–5 pairs';
    }

    function syncUnitSystem() {
      const isMet = !window.UnitManager || window.UnitManager.isMetric();
      if (isMet !== isInputMetric) {
        const val = parseFloat(weightInput.value) || (isInputMetric ? 72 : 158);
        if (isMet) {
          // was imperial, now metric
          weightInput.value = Math.round(val / 2.20462);
          weightInput.min = '45';
          weightInput.max = '120';
          if (weightUnitLabel) weightUnitLabel.innerText = 'kg';
        } else {
          // was metric, now imperial
          weightInput.value = Math.round(val * 2.20462);
          weightInput.min = '100';
          weightInput.max = '265';
          if (weightUnitLabel) weightUnitLabel.innerText = 'lbs';
        }
        isInputMetric = isMet;
      }
      calculate();
    }

    weightInput.addEventListener('input', calculate);
    if (paceSelect) paceSelect.addEventListener('change', calculate);

    syncUnitSystem();

    window.addEventListener('tght:unitChange', syncUnitSystem);
    window.addEventListener('tght:units-changed', syncUnitSystem);
  }

  /* ==========================================================================
     5. ULTRALIGHT ALPINE LOADOUT: PACK BREAKDOWN (CHART.JS DONUT)
     ========================================================================== */
  function initPackLoadoutChart() {
    const canvas = document.getElementById('pack-loadout-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const PACK_CATEGORIES = [
      {
        name: 'Sleep & Alpine Shelter',
        pct: 24,
        kg: 3.4,
        color: '#d49b42',
        items: '4-Season ultralight tent, -20°C hydrophobic down quilt, R-value 6.9 insulated sleeping pad.'
      },
      {
        name: 'Technical Climbing Hardware',
        pct: 21,
        kg: 3.0,
        color: '#b85c3c',
        items: 'Petzl crampons, lightweight ice axe, alpine harness, 30m 6.0mm RAD line, 2 ice screws, 4 lockers.'
      },
      {
        name: 'Thermal & Weather Layering',
        pct: 22,
        kg: 3.1,
        color: '#6090d4',
        items: '850fp baffled down parka, Gore-Tex Pro 3L hardshell, 200g merino base, alpine wind mittens.'
      },
      {
        name: 'Kitchen & Glacial Filtration',
        pct: 14,
        kg: 2.0,
        color: '#4e9166',
        items: 'Multifuel sub-zero stove, 1.2L titanium pot, Katadyn BeFree 0.1μ filter, chlorine dioxide drops.'
      },
      {
        name: 'Navigation & Sub-Zero Power',
        pct: 11,
        kg: 1.6,
        color: '#f1be6d',
        items: 'Garmin inReach Mini 2 (Satellite SOS), 20k mAh cold-resistant battery, 10W folding solar panel.'
      },
      {
        name: 'High-Altitude Meds & Trauma',
        pct: 8,
        kg: 1.1,
        color: '#72b388',
        items: 'Acetazolamide (Diamox), Dexamethasone, trauma dressing, SAM splint, Tenacious repair tape.'
      }
    ];

    const ctx = canvas.getContext('2d');

    const packChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: PACK_CATEGORIES.map(c => c.name),
        datasets: [{
          data: PACK_CATEGORIES.map(c => c.pct),
          backgroundColor: PACK_CATEGORIES.map(c => c.color),
          borderColor: '#080c14',
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                const isMet = !window.UnitManager || window.UnitManager.isMetric();
                const cat = PACK_CATEGORIES[context.dataIndex];
                const weightStr = isMet ? `${cat.kg} kg` : `${(cat.kg * 2.20462).toFixed(1)} lbs`;
                return ` ${cat.pct}% (${weightStr})`;
              }
            }
          }
        },
        cutout: '72%'
      }
    });

    const inspectCard = document.getElementById('pack-category-detail');
    const categoryList = document.getElementById('pack-category-list');
    let activeCatIdx = 0;

    function renderPackCategoryList() {
      const isMet = !window.UnitManager || window.UnitManager.isMetric();
      if (categoryList) {
        categoryList.innerHTML = PACK_CATEGORIES.map((cat, idx) => `
          <div 
            class="pack-cat-item p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${idx === activeCatIdx ? 'border-[#d49b42]/60 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}"
            data-idx="${idx}"
          >
            <div class="flex items-center gap-2.5">
              <span class="w-3 h-3 rounded-full shrink-0" style="background-color: ${cat.color};"></span>
              <div>
                <div class="text-xs font-bold text-white">${cat.name}</div>
                <div class="text-[10px] text-[#8e867a] mt-0.5">${cat.pct}% of load</div>
              </div>
            </div>
            <div class="text-xs font-mono font-bold text-[#d49b42]">
              ${isMet ? `${cat.kg} kg` : `${(cat.kg * 2.20462).toFixed(1)} lbs`}
            </div>
          </div>
        `).join('');

        categoryList.querySelectorAll('.pack-cat-item').forEach(item => {
          item.addEventListener('mouseenter', () => {
            activeCatIdx = parseInt(item.getAttribute('data-idx'), 10);
            renderPackDetail();
            renderPackCategoryList();
          });
          item.addEventListener('click', () => {
            activeCatIdx = parseInt(item.getAttribute('data-idx'), 10);
            renderPackDetail();
            renderPackCategoryList();
          });
        });
      }
    }

    function renderPackDetail() {
      if (!inspectCard) return;
      const isMet = !window.UnitManager || window.UnitManager.isMetric();
      const cat = PACK_CATEGORIES[activeCatIdx] || PACK_CATEGORIES[0];
      inspectCard.innerHTML = `
        <div class="text-xs uppercase tracking-wider font-bold" style="color: ${cat.color};">${cat.name}</div>
        <div class="text-sm font-semibold text-white mt-1">Weight: ${isMet ? `${cat.kg} kg` : `${(cat.kg * 2.20462).toFixed(1)} lbs`} (${cat.pct}% of base pack)</div>
        <p class="mt-2 narrative-prose">${cat.items}</p>
      `;
    }

    renderPackCategoryList();
    renderPackDetail();

    window.addEventListener('tght:unitChange', () => {
      renderPackCategoryList();
      renderPackDetail();
    });
    window.addEventListener('tght:units-changed', () => {
      renderPackCategoryList();
      renderPackDetail();
    });
  }

  /* ==========================================================================
     6. ROUTE COMPARISON RADAR CHART: HIGH ROUTE VS. CULTURAL ROUTE
     ========================================================================== */
  function initRouteRadarChart() {
    const canvas = document.getElementById('route-radar-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');

    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          'Technical Mountaineering',
          'Max Altitude Exposure',
          'Wilderness Solitude',
          'Teahouse Comfort',
          'Expedition Cost / Permits',
          'Cultural Village Immersion'
        ],
        datasets: [
          {
            label: 'The High Route (MedOnMt 2028)',
            data: [9.8, 9.9, 9.6, 2.0, 9.2, 6.5],
            fill: true,
            backgroundColor: 'rgba(212, 155, 66, 0.25)',
            borderColor: '#d49b42',
            pointBackgroundColor: '#d49b42',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#d49b42',
            borderWidth: 2.5
          },
          {
            label: 'The Cultural Route (Mid-Hills)',
            data: [2.2, 4.5, 4.8, 8.8, 3.8, 9.8],
            fill: true,
            backgroundColor: 'rgba(96, 144, 212, 0.20)',
            borderColor: '#6090d4',
            pointBackgroundColor: '#6090d4',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#6090d4',
            borderWidth: 2.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: { tension: 0.1 }
        },
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
            grid: { color: 'rgba(255, 255, 255, 0.08)' },
            pointLabels: {
              color: '#d1c7b7',
              font: { size: 10, weight: 'bold' }
            },
            ticks: {
              display: false,
              min: 0,
              max: 10
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#f5f2eb',
              font: { size: 11, weight: 'bold' }
            }
          }
        }
      }
    });

    const btnBoth = document.getElementById('radar-btn-both');
    const btnHigh = document.getElementById('radar-btn-high');
    const btnCult = document.getElementById('radar-btn-cultural');

    if (btnBoth && btnHigh && btnCult) {
      btnBoth.addEventListener('click', () => {
        chart.data.datasets[0].hidden = false;
        chart.data.datasets[1].hidden = false;
        chart.update();
        setActiveRadarBtn(btnBoth);
      });

      btnHigh.addEventListener('click', () => {
        chart.data.datasets[0].hidden = false;
        chart.data.datasets[1].hidden = true;
        chart.update();
        setActiveRadarBtn(btnHigh);
      });

      btnCult.addEventListener('click', () => {
        chart.data.datasets[0].hidden = true;
        chart.data.datasets[1].hidden = false;
        chart.update();
        setActiveRadarBtn(btnCult);
      });

      function setActiveRadarBtn(activeBtn) {
        [btnBoth, btnHigh, btnCult].forEach(b => {
          b.classList.remove('bg-[#d49b42]', 'text-[#080c14]', 'border-[#d49b42]', 'font-bold');
          b.classList.add('bg-white/5', 'text-[#d1c7b7]', 'border-white/10');
        });
        activeBtn.classList.remove('bg-white/5', 'text-[#d1c7b7]', 'border-white/10');
        activeBtn.classList.add('bg-[#d49b42]', 'text-[#080c14]', 'border-[#d49b42]', 'font-bold');
      }
    }
  }

  /* ==========================================================================
     7. GLOBAL TRAIL BENCHMARK: GHT VS. ACT, PCT, JCT/JMT, AT, CDT & TA
     Interactive Duel Simulator, Multi-Trail Matrix, and Stratosphere Scale
     ========================================================================== */
  function initTrailBenchmarkModule() {
    const container = document.getElementById('trail-benchmarks');
    if (!container) return;

    // Comprehensive Trail Benchmark Dataset
    const TRAILS = {
      ght: {
        id: 'ght',
        name: 'Great Himalaya Trail (High Route)',
        shortName: 'GHT',
        region: 'Nepal Himalayas',
        sub: 'High Route · Kanchenjunga to Hilsa (Tibetan Border)',
        icon: '🏔️',
        distanceKm: 1700,
        gainM: 105000,
        steepnessMkm: 61.8,
        peakM: 6190,
        peakName: 'West Col',
        avgAltM: 4200,
        daysAbove4k: '85+ Days',
        resupplyDays: '10–14 Days',
        resupplyPct: 100,
        trailType: 'Glaciated cols, technical passes & loose moraine',
        gear: 'Ice axes, crampons, fixed ropes, high-altitude bivvy',
        permits: '6+ Restricted Area Permits + Liaison Officers',
        color: '#d49b42'
      },
      pct: {
        id: 'pct',
        name: 'Pacific Crest Trail (PCT)',
        shortName: 'PCT',
        region: 'US West Coast (CA / OR / WA)',
        sub: 'Campo (Mexico Border) to Manning Park (Canada)',
        icon: '🌲',
        distanceKm: 4265,
        gainM: 128000,
        steepnessMkm: 30.0,
        peakM: 4009,
        peakName: 'Forester Pass',
        avgAltM: 1500,
        daysAbove4k: '1–2 Days',
        resupplyDays: '3–6 Days',
        resupplyPct: 40,
        trailType: 'Graded equestrian singletrack (≤10% grade)',
        gear: 'Standard ultralight pack (microspikes/axe in Sierra snow)',
        permits: 'PCTA Long-Distance Permit',
        color: '#6090d4',
        insightTitle: 'GHT High Route vs. Pacific Crest Trail (PCT)',
        insightBadge: 'Alpine Mountaineering vs. Graded Singletrack',
        insightBody: 'While the Pacific Crest Trail traverses 2.5× the horizontal distance (4,265 km vs 1,700 km), the GHT demands almost identical total vertical climb (+105,000m vs +128,000m) at more than double the vertical steepness (61.8 m/km vs 30.0 m/km). Furthermore, the GHT\'s average elevation (~4,200m) is higher than the PCT\'s highest mountain pass (Forester Pass, 4,009m)—requiring crampons, fixed ropes, and self-supported survival over 6,000m glaciated cols rather than graded equestrian trail.'
      },
      act: {
        id: 'act',
        name: 'Annapurna Circuit Trail (ACT)',
        shortName: 'ACT',
        region: 'Nepal (Annapurna Himal)',
        sub: 'Besisahar to Jomsom/Pokhara Loop',
        icon: '☕',
        distanceKm: 210,
        gainM: 11000,
        steepnessMkm: 52.4,
        peakM: 5416,
        peakName: 'Thorong La Pass',
        avgAltM: 2800,
        daysAbove4k: '3–5 Days',
        resupplyDays: '0 Days (Teahouses Nightly)',
        resupplyPct: 15,
        trailType: 'Well-trodden stone steps & village pathways',
        gear: 'Trekking poles & thermal layers (no bivvy gear needed)',
        permits: 'ACAP Conservation Entry + TIMS Card',
        color: '#72b388',
        insightTitle: 'GHT High Route vs. Annapurna Circuit (ACT)',
        insightBadge: 'Remote Wilderness Traverse vs. Teahouse Trek',
        insightBody: 'The Annapurna Circuit is a world-class high-altitude teahouse trek where hikers enjoy hot meals, bakeries, and beds every night with only a single morning crossing of Thorong La (5,416m). By contrast, the GHT High Route links over 15 high glaciated passes like West Col (6,190m) and Sherpani Col (6,150m)—requiring technical ice rappels and multi-week autonomous wilderness bivvies under 8,000m giants with zero lodges or roads.'
      },
      jmt: {
        id: 'jmt',
        name: 'John Muir Trail (JCT / JMT)',
        shortName: 'JCT/JMT',
        region: 'California Sierra Nevada',
        sub: 'Happy Isles (Yosemite) to Mount Whitney Terminus',
        icon: '⛰️',
        distanceKm: 340,
        gainM: 14300,
        steepnessMkm: 42.1,
        peakM: 4421,
        peakName: 'Mount Whitney',
        avgAltM: 3000,
        daysAbove4k: '2–4 Days',
        resupplyDays: '7–10 Days',
        resupplyPct: 65,
        trailType: 'Maintained alpine granite singletrack',
        gear: 'Bear-resistant canister, microspikes (early season)',
        permits: 'Inyo / Yosemite Wilderness Permit with Whitney Stamp',
        color: '#8cb5f2',
        insightTitle: 'GHT High Route vs. John Muir Trail (JCT / JMT)',
        insightBadge: 'Multi-Month Himalayan Expedition vs. 3-Week High Sierra',
        insightBody: 'The John Muir Trail is America\'s premier high-altitude singletrack, cresting Mount Whitney at 4,421m. However, the JMT is completed in 2 to 3 weeks across 340 km. The GHT High Route sustains an average elevation ~1,200m HIGHER than the JMT for nearly 5 continuous months across 1,700 km of unmaintained glaciated terrain, requiring 8× the total vertical gain.'
      },
      at: {
        id: 'at',
        name: 'Appalachian Trail (AT)',
        shortName: 'AT',
        region: 'Eastern US (Georgia to Maine)',
        sub: 'Springer Mountain, GA to Mount Katahdin, ME',
        icon: '🥾',
        distanceKm: 3524,
        gainM: 141600,
        steepnessMkm: 40.2,
        peakM: 2025,
        peakName: 'Clingmans Dome',
        avgAltM: 760,
        daysAbove4k: '0 Days',
        resupplyDays: '2–4 Days',
        resupplyPct: 25,
        trailType: 'Steep, rooty & rocky unswitched singletrack ("Green Tunnel")',
        gear: 'Standard 3-season backpacking gear',
        permits: 'Smokies & Baxter State Park Registration',
        color: '#4e9166',
        insightTitle: 'GHT High Route vs. Appalachian Trail (AT)',
        insightBadge: 'Alpine Glaciers vs. Green Tunnel Roller Coaster',
        insightBody: 'The Appalachian Trail is celebrated for its relentless, unswitched physical roller coaster (+141,600m). However, the AT peaks at just 2,025m (79% sea-level oxygen) with three-sided shelters every 8 miles and trail towns every 3 days. The GHT is 50% steeper per kilometer, spends 85+ days above 4,000m in hypoxic air, and demands technical ice protection.'
      },
      cdt: {
        id: 'cdt',
        name: 'Continental Divide Trail (CDT)',
        shortName: 'CDT',
        region: 'US Rocky Mountains (NM to MT)',
        sub: 'Crazy Cook (Mexico Border) to Waterton Lakes (Canada)',
        icon: '🧭',
        distanceKm: 4989,
        gainM: 140000,
        steepnessMkm: 28.1,
        peakM: 4350,
        peakName: 'Grays Peak',
        avgAltM: 2400,
        daysAbove4k: '2–5 Days',
        resupplyDays: '4–7 Days',
        resupplyPct: 50,
        trailType: 'High arid plateaus, rugged divide ridges & dirt road connects',
        gear: 'GPS navigation, early-season ice axe & snow shoes',
        permits: 'Multiple USFS, BLM & National Park Permits',
        color: '#df7a57',
        insightTitle: 'GHT High Route vs. Continental Divide Trail (CDT)',
        insightBadge: 'Extreme Altitude vs. Arid Plateau & Route Finding',
        insightBody: 'The CDT is the longest and most remote leg of America\'s Triple Crown, testing navigational endurance across 4,989 km. Yet its highest pass barely matches the GHT\'s daily average altitude (~4,200m). Where the CDT traverses arid basins and high sage meadows, the GHT clings to hanging glaciers under 8,000m Himalayan giants with no road bailouts.'
      },
      ta: {
        id: 'ta',
        name: 'Te Araroa (TA)',
        shortName: 'TA',
        region: 'New Zealand (North & South Island)',
        sub: 'Cape Reinga (North) to Bluff (South)',
        icon: '🥝',
        distanceKm: 3000,
        gainM: 85000,
        steepnessMkm: 28.3,
        peakM: 1925,
        peakName: 'Stag Saddle',
        avgAltM: 400,
        daysAbove4k: '0 Days',
        resupplyDays: '3–6 Days',
        resupplyPct: 35,
        trailType: 'Ocean beaches, muddy forest tracks, river fords & tarmac',
        gear: 'Standard backpacking gear, water shoes for river crossings',
        permits: 'DOC Backcountry Hut Pass',
        color: '#b85c3c',
        insightTitle: 'GHT High Route vs. Te Araroa (TA)',
        insightBadge: 'Ocean-to-Ocean Island Trail vs. Himalayan High Spine',
        insightBody: 'Te Araroa links Cape Reinga to Bluff across 3,000 km of beaches, rivers, and subalpine saddles peaking at 1,925m. The GHT gains 20,000 meters more vertical climb in nearly half the distance, operating in permanent snow and sub-zero thin air rather than temperate maritime forests.'
      }
    };

    let activeChallenger = 'pct';
    let activeChartMetric = 'steepness';
    let benchmarkChart = null;

    // 1. Navigation / Mode Switcher
    const modeBtns = container.querySelectorAll('.benchmark-mode-btn');
    const viewDuel = document.getElementById('benchmark-view-duel');
    const viewCharts = document.getElementById('benchmark-view-charts');
    const viewStratosphere = document.getElementById('benchmark-view-stratosphere');

    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        
        modeBtns.forEach(b => {
          b.classList.remove('bg-[#d49b42]', 'text-[#080c14]', 'font-bold', 'shadow-sm');
          b.classList.add('text-[#d1c7b7]', 'font-medium');
        });
        btn.classList.remove('text-[#d1c7b7]', 'font-medium');
        btn.classList.add('bg-[#d49b42]', 'text-[#080c14]', 'font-bold', 'shadow-sm');

        if (viewDuel) viewDuel.classList.toggle('hidden', mode !== 'duel');
        if (viewCharts) viewCharts.classList.toggle('hidden', mode !== 'charts');
        if (viewStratosphere) viewStratosphere.classList.toggle('hidden', mode !== 'stratosphere');

        if (mode === 'charts') {
          setTimeout(() => {
            if (!benchmarkChart) {
              initBenchmarkChart();
            } else {
              benchmarkChart.resize();
              benchmarkChart.update();
            }
          }, 50);
        }
      });
    });

    // 2. Challenger Selector Buttons
    const challengerBtns = container.querySelectorAll('.challenger-select-btn');
    challengerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const trailId = btn.getAttribute('data-trail');
        if (!TRAILS[trailId]) return;
        
        challengerBtns.forEach(b => {
          b.classList.remove('bg-[#6090d4]', 'text-[#080c14]', 'border-[#6090d4]', 'font-bold');
          b.classList.add('bg-white/5', 'text-[#d1c7b7]', 'border-white/10', 'font-medium');
        });
        btn.classList.remove('bg-white/5', 'text-[#d1c7b7]', 'border-white/10', 'font-medium');
        btn.classList.add('bg-[#6090d4]', 'text-[#080c14]', 'border-[#6090d4]', 'font-bold');

        activeChallenger = trailId;
        updateDuelArena();
      });
    });

    // Helper: is Metric active?
    function isMetric() {
      return !window.UnitManager || window.UnitManager.isMetric();
    }

    // 3. Update Duel Arena DOM
    function updateDuelArena() {
      const ght = TRAILS.ght;
      const c = TRAILS[activeChallenger];
      if (!c) return;

      const met = isMetric();

      // Top Challenger Bio
      const elIcon = document.getElementById('duel-challenger-icon');
      const elRegion = document.getElementById('duel-challenger-region');
      const elName = document.getElementById('duel-challenger-name');
      const elSub = document.getElementById('duel-challenger-sub');

      if (elIcon) elIcon.innerText = c.icon;
      if (elRegion) elRegion.innerText = c.region;
      if (elName) elName.innerText = c.name;
      if (elSub) elSub.innerText = c.sub;

      // Labels
      for (let i = 1; i <= 4; i++) {
        const lbl = document.getElementById(`duel-label-challenger-${i}`);
        if (lbl) lbl.innerText = c.shortName;
      }

      // Metric 1: Steepness
      const elGhtSteep = document.getElementById('duel-ght-steepness');
      const elChallSteep = document.getElementById('duel-challenger-steepness');
      const elMeterSteep = document.getElementById('duel-meter-steepness');
      const elDeltaSteep = document.getElementById('duel-steepness-delta');

      const ghtSteepVal = met ? `${ght.steepnessMkm.toFixed(1)} m/km` : `${Math.round(ght.steepnessMkm * 5.28)} ft/mi`;
      const challSteepVal = met ? `${c.steepnessMkm.toFixed(1)} m/km` : `${Math.round(c.steepnessMkm * 5.28)} ft/mi`;
      const steepRatio = Math.round(((ght.steepnessMkm - c.steepnessMkm) / c.steepnessMkm) * 100);

      if (elGhtSteep) elGhtSteep.innerText = ghtSteepVal;
      if (elChallSteep) elChallSteep.innerText = challSteepVal;
      if (elMeterSteep) elMeterSteep.style.width = `${Math.min(100, Math.round((c.steepnessMkm / ght.steepnessMkm) * 100))}%`;
      if (elDeltaSteep) {
        if (steepRatio > 0) {
          elDeltaSteep.innerHTML = `GHT is <strong class="text-[#f1be6d] font-mono">+${steepRatio}% steeper</strong> per distance.`;
        } else {
          elDeltaSteep.innerHTML = `GHT is in the ultra-steepest high-altitude class.`;
        }
      }

      // Metric 2: Peak Altitude
      const elGhtPeak = document.getElementById('duel-ght-peak');
      const elChallPeak = document.getElementById('duel-challenger-peak');
      const elMeterPeak = document.getElementById('duel-meter-peak');
      const elDeltaPeak = document.getElementById('duel-peak-delta');

      const ghtPeakVal = met ? `${ght.peakM.toLocaleString()}m` : `${Math.round(ght.peakM * 3.28084).toLocaleString()} ft`;
      const challPeakVal = met ? `${c.peakM.toLocaleString()}m` : `${Math.round(c.peakM * 3.28084).toLocaleString()} ft`;
      const altDeltaM = ght.peakM - c.peakM;
      const altDeltaFormatted = met ? `+${altDeltaM.toLocaleString()}m` : `+${Math.round(altDeltaM * 3.28084).toLocaleString()} ft`;

      if (elGhtPeak) elGhtPeak.innerText = ghtPeakVal;
      if (elChallPeak) elChallPeak.innerText = challPeakVal;
      if (elMeterPeak) elMeterPeak.style.width = `${Math.min(100, Math.round((c.peakM / ght.peakM) * 100))}%`;
      if (elDeltaPeak) {
        elDeltaPeak.innerHTML = `GHT peak is <strong class="text-[#72b388] font-mono">${altDeltaFormatted} higher</strong> (47% vs hypoxia threshold).`;
      }

      // Metric 3: Total Gain / Everests
      const elGhtGain = document.getElementById('duel-ght-gain');
      const elChallGain = document.getElementById('duel-challenger-gain');
      const elMeterGain = document.getElementById('duel-meter-gain');
      const elDeltaGain = document.getElementById('duel-gain-delta');

      const ghtGainVal = met ? `+${ght.gainM.toLocaleString()}m` : `+${Math.round(ght.gainM * 3.28084).toLocaleString()} ft`;
      const challGainVal = met ? `+${c.gainM.toLocaleString()}m` : `+${Math.round(c.gainM * 3.28084).toLocaleString()} ft`;
      const ghtEverests = (ght.gainM / 8848).toFixed(1);
      const challEverests = (c.gainM / 8848).toFixed(1);

      if (elGhtGain) elGhtGain.innerText = ghtGainVal;
      if (elChallGain) elChallGain.innerText = challGainVal;
      if (elMeterGain) elMeterGain.style.width = `${Math.min(100, Math.round((c.gainM / 150000) * 100))}%`;
      if (elDeltaGain) {
        const ghtDist = met ? `${ght.distanceKm.toLocaleString()} km` : `${Math.round(ght.distanceKm * 0.621371).toLocaleString()} mi`;
        const challDist = met ? `${c.distanceKm.toLocaleString()} km` : `${Math.round(c.distanceKm * 0.621371).toLocaleString()} mi`;
        elDeltaGain.innerHTML = `GHT climbs ${ghtEverests} Everests in <strong>${ghtDist}</strong> vs ${c.shortName}'s ${challEverests} Everests in <strong>${challDist}</strong>.`;
      }

      // Metric 4: Resupply Gap
      const elChallResupply = document.getElementById('duel-challenger-resupply');
      const elMeterResupply = document.getElementById('duel-meter-resupply');
      const elDeltaResupply = document.getElementById('duel-resupply-delta');

      if (elChallResupply) elChallResupply.innerText = c.resupplyDays;
      if (elMeterResupply) elMeterResupply.style.width = `${c.resupplyPct}%`;
      if (elDeltaResupply) {
        elDeltaResupply.innerHTML = `GHT demands 10–14 days self-contained on remote glaciers with zero civilization.`;
      }

      // Insight Box
      const elInsightTitle = document.getElementById('duel-insight-title');
      const elBadgeCrux = document.getElementById('duel-badge-crux');
      const elInsightBody = document.getElementById('duel-insight-body');
      const elDetailTrail = document.getElementById('duel-detail-trail');
      const elDetailAlt = document.getElementById('duel-detail-altitude');
      const elDetailGear = document.getElementById('duel-detail-gear');
      const elDetailPermits = document.getElementById('duel-detail-permits');

      if (elInsightTitle) elInsightTitle.innerText = c.insightTitle || `GHT vs ${c.name}`;
      if (elBadgeCrux) elBadgeCrux.innerText = c.insightBadge || 'Alpine Traverse Comparison';
      if (elInsightBody) elInsightBody.innerText = c.insightBody || '';
      if (elDetailTrail) elDetailTrail.innerText = `${ght.trailType} vs ${c.trailType}`;
      if (elDetailAlt) elDetailAlt.innerText = `GHT: ${ght.daysAbove4k} vs ${c.shortName}: ${c.daysAbove4k}`;
      if (elDetailGear) elDetailGear.innerText = `${c.gear}`;
      if (elDetailPermits) elDetailPermits.innerText = `${c.permits}`;
    }

    // 4. Multi-Trail Benchmark Chart (Chart.js)
    function initBenchmarkChart() {
      const canvas = document.getElementById('trail-benchmark-chart');
      if (!canvas || typeof Chart === 'undefined') return;

      const metricNav = document.getElementById('chart-metric-nav');
      if (metricNav) {
        const btns = metricNav.querySelectorAll('.chart-metric-btn');
        btns.forEach(b => {
          b.addEventListener('click', () => {
            btns.forEach(btn => {
              btn.classList.remove('bg-[#d49b42]', 'text-[#080c14]', 'font-bold');
              btn.classList.add('bg-white/5', 'text-[#d1c7b7]', 'border', 'border-white/10');
            });
            b.classList.remove('bg-white/5', 'text-[#d1c7b7]', 'border', 'border-white/10');
            b.classList.add('bg-[#d49b42]', 'text-[#080c14]', 'font-bold');

            activeChartMetric = b.getAttribute('data-metric');
            updateChartData();
          });
        });
      }

      const ctx = canvas.getContext('2d');
      const trailKeys = ['ght', 'act', 'jmt', 'at', 'pct', 'ta', 'cdt'];

      function getChartData() {
        const met = isMetric();
        const labels = trailKeys.map(k => TRAILS[k].shortName);
        let data = [];
        let unitLabel = '';

        if (activeChartMetric === 'steepness') {
          unitLabel = met ? 'm / km' : 'ft / mi';
          data = trailKeys.map(k => met ? TRAILS[k].steepnessMkm : Math.round(TRAILS[k].steepnessMkm * 5.28));
        } else if (activeChartMetric === 'peak') {
          unitLabel = met ? 'meters' : 'feet';
          data = trailKeys.map(k => met ? TRAILS[k].peakM : Math.round(TRAILS[k].peakM * 3.28084));
        } else if (activeChartMetric === 'gain') {
          unitLabel = met ? 'meters gain' : 'feet gain';
          data = trailKeys.map(k => met ? TRAILS[k].gainM : Math.round(TRAILS[k].gainM * 3.28084));
        } else if (activeChartMetric === 'distance') {
          unitLabel = met ? 'km' : 'miles';
          data = trailKeys.map(k => met ? TRAILS[k].distanceKm : Math.round(TRAILS[k].distanceKm * 0.621371));
        }

        const backgroundColors = trailKeys.map(k => k === 'ght' ? 'rgba(212, 155, 66, 0.95)' : 'rgba(96, 144, 212, 0.65)');
        const borderColors = trailKeys.map(k => k === 'ght' ? '#f1be6d' : '#8cb5f2');

        return { labels, data, unitLabel, backgroundColors, borderColors };
      }

      const initial = getChartData();

      benchmarkChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: initial.labels,
          datasets: [{
            label: initial.unitLabel,
            data: initial.data,
            backgroundColor: initial.backgroundColors,
            borderColor: initial.borderColors,
            borderWidth: 1.5,
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0e1422',
              borderColor: 'rgba(255,255,255,0.15)',
              borderWidth: 1,
              titleFont: { family: 'Cinzel', size: 12, weight: 'bold' },
              titleColor: '#d49b42',
              bodyFont: { family: 'Plus Jakarta Sans', size: 11 },
              bodyColor: '#f5f2eb',
              callbacks: {
                title(items) {
                  const key = trailKeys[items[0].dataIndex];
                  return `${TRAILS[key].name}`;
                },
                label(context) {
                  const val = context.raw.toLocaleString();
                  return ` ${val} ${benchmarkChart.data.datasets[0].label}`;
                },
                afterLabel(context) {
                  const key = trailKeys[context.dataIndex];
                  const t = TRAILS[key];
                  return [
                    ` Region: ${t.region}`,
                    ` Peak: ${t.peakName} (${isMetric() ? t.peakM + 'm' : Math.round(t.peakM * 3.28084) + ' ft'})`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: {
                color: '#8e867a',
                font: { family: 'monospace', size: 10 }
              }
            },
            y: {
              grid: { display: false },
              ticks: {
                color: '#f5f2eb',
                font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' }
              }
            }
          }
        }
      });

      function updateChartData() {
        if (!benchmarkChart) return;
        const current = getChartData();
        benchmarkChart.data.datasets[0].data = current.data;
        benchmarkChart.data.datasets[0].label = current.unitLabel;
        benchmarkChart.data.datasets[0].backgroundColor = current.backgroundColors;
        benchmarkChart.data.datasets[0].borderColor = current.borderColors;
        benchmarkChart.update();
      }

      // Expose updater for unit changes
      window._updateBenchmarkChart = updateChartData;
    }

    // Initial duel arena render
    updateDuelArena();

    // Listen to unit switch events
    const onUnitChanged = () => {
      updateDuelArena();
      if (window._updateBenchmarkChart) {
        window._updateBenchmarkChart();
      }
    };

    window.addEventListener('tght:unitChange', onUnitChanged);
    window.addEventListener('tght:units-changed', onUnitChanged);
  }

})();

