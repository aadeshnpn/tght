/**
 * Main Application Logic for TGHT (The Great Himalayan Trail Tracker)
 */

document.addEventListener('DOMContentLoaded', async () => {
  // State
  const state = {
    sections: [],
    cruxPasses: [],
    waypoints: [],
    highRoute: [],
    selectedSectionId: null,
    activeTab: 'sections', // 'sections' | 'passes' | 'permits'
    mapController: null,
    elevationChart: null
  };

  // Elements
  const el = {
    sectionList: document.getElementById('section-list'),
    passList: document.getElementById('pass-list'),
    stagesContainer: document.getElementById('stages-container'),
    stagesList: document.getElementById('stages-list'),
    selectedSectionTitle: document.getElementById('selected-section-title'),
    selectedSectionSubtitle: document.getElementById('selected-section-subtitle'),
    sectionPermitsText: document.getElementById('section-permits-text'),
    passModal: document.getElementById('pass-modal'),
    passModalContent: document.getElementById('pass-modal-content'),
    closePassModal: document.getElementById('close-pass-modal'),
    gpxModal: document.getElementById('gpx-modal'),
    closeGpxModal: document.getElementById('close-gpx-modal'),
    openGpxModalBtn: document.getElementById('open-gpx-modal-btn'),
    btnExportFullGpx: document.getElementById('btn-export-full-gpx'),
    btnExportSecGpx: document.getElementById('btn-export-sec-gpx'),
    btnExportWptGpx: document.getElementById('btn-export-wpt-gpx'),
    searchInput: document.getElementById('search-input'),
    searchResults: document.getElementById('search-results'),
    tabSections: document.getElementById('tab-sections'),
    tabPasses: document.getElementById('tab-passes'),
    tabPermits: document.getElementById('tab-permits'),
    panelSections: document.getElementById('panel-sections'),
    panelPasses: document.getElementById('panel-passes'),
    panelPermits: document.getElementById('panel-permits'),
    btnResetView: document.getElementById('btn-reset-view'),
    activeSectionSummary: document.getElementById('active-section-summary'),
    statDistance: document.getElementById('stat-distance'),
    statElevation: document.getElementById('stat-elevation'),
    statDays: document.getElementById('stat-days'),
    statPasses: document.getElementById('stat-passes')
  };

  // Fetch Datasets
  try {
    const [resSec, resPasses, resWpt, resRoute] = await Promise.all([
      fetch('data/ght-sections.json').then(r => r.json()),
      fetch('data/ght-crux-passes.json').then(r => r.json()),
      fetch('data/ght-waypoints.json').then(r => r.json()),
      fetch('data/ght-high-route.json').then(r => r.json())
    ]);

    state.sections = resSec;
    state.cruxPasses = resPasses;
    state.waypoints = resWpt;
    state.highRoute = resRoute;
  } catch (err) {
    console.error('Failed to load GHT data files:', err);
    return;
  }

  // Initialize Map
  state.mapController = new MapController('map-container', {
    onPassClick: (pass) => openPassModal(pass),
    onSectionClick: (section) => selectSection(section.id)
  });

  state.mapController.renderRoute(state.highRoute, state.sections);
  state.mapController.renderWaypoints(state.waypoints, state.cruxPasses);

  // Initialize Elevation Chart
  state.elevationChart = new ElevationChart('elevation-container', {
    onHover: (pt) => {
      state.mapController.setHoverCoordinate(pt.lat, pt.lng);
    },
    onLeave: () => {
      state.mapController.clearHover();
    }
  });

  state.elevationChart.setData(state.highRoute);

  // Render UI Components
  renderSectionsList();
  renderPassesList();
  renderPermitsList();
  bindEventHandlers();

  // Helper Functions
  function renderSectionsList() {
    el.sectionList.innerHTML = '';

    state.sections.forEach((sec) => {
      const card = document.createElement('div');
      card.className = `glass-card p-3 rounded-lg cursor-pointer ${state.selectedSectionId === sec.id ? 'active' : ''}`;
      card.setAttribute('data-sec-id', sec.id);

      const highestFormatted = window.UnitManager ? window.UnitManager.formatElevation(sec.highestPoint) : `${sec.highestPoint}m`;
      const distFormatted = window.UnitManager ? window.UnitManager.formatDistance(sec.distanceKm) : `${sec.distanceKm} km`;
      const ascentFormatted = window.UnitManager ? window.UnitManager.formatAscent(sec.ascentM) : `+${sec.ascentM.toLocaleString()}m`;

      card.innerHTML = `
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${sec.color};"></span>
            <span class="font-bold text-sm text-white">${sec.id}. ${sec.name}</span>
          </div>
          <span class="text-xs px-2 py-0.5 rounded font-mono ${sec.highestPoint >= 6000 ? 'badge-extreme' : 'badge-alpine'}">
            ${highestFormatted}
          </span>
        </div>
        <div class="mt-2 text-xs text-slate-400 line-clamp-2">${sec.summary}</div>
        <div class="mt-2.5 pt-2 border-t border-slate-700/50 flex justify-between text-[11px] text-slate-300">
          <span><b>${distFormatted}</b></span>
          <span><b>~${sec.estDays} days</b></span>
          <span><b>${ascentFormatted}</b></span>
        </div>
      `;

      card.addEventListener('click', () => selectSection(sec.id));
      el.sectionList.appendChild(card);
    });
  }

  function renderPassesList() {
    el.passList.innerHTML = '';

    state.cruxPasses.forEach((pass) => {
      const card = document.createElement('div');
      card.className = 'glass-card p-3 rounded-lg cursor-pointer border-l-4 border-l-red-500';

      const eleFormatted = window.UnitManager ? window.UnitManager.formatElevation(pass.elevationM) : `${pass.elevationM}m`;

      card.innerHTML = `
        <div class="flex items-start justify-between">
          <div>
            <div class="font-bold text-sm text-white flex items-center gap-1.5">
              <span>${pass.name}</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-800">Crux</span>
            </div>
            <div class="text-xs text-slate-400">Sec ${pass.sectionId}: ${pass.sectionName}</div>
          </div>
          <div class="text-right">
            <div class="text-xs font-mono font-bold text-red-400">${eleFormatted}</div>
            <div class="text-[10px] text-slate-400">${pass.grade}</div>
          </div>
        </div>
        <div class="mt-2 text-xs text-slate-300 leading-snug">
          <b>Key Hazard:</b> ${pass.objectiveHazards[0]}
        </div>
        <div class="mt-2 text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold">
          <span>Inspect Mountaineering Dossier</span> →
        </div>
      `;

      card.addEventListener('click', () => {
        state.mapController.panTo(pass.coordinates[0], pass.coordinates[1], 12);
        openPassModal(pass);
      });

      el.passList.appendChild(card);
    });
  }

  function renderPermitsList() {
    el.panelPermits.innerHTML = `
      <div class="space-y-4 text-xs text-slate-300">
        <div class="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60">
          <div class="font-bold text-amber-300 text-sm mb-1">Mandatory Licensed Guide Rule</div>
          <p>Since 2023, the Nepal Tourism Board (NTB) mandates that all foreign trekkers in national parks and conservation areas must hike accompanied by a licensed Nepali guide through a government-registered trekking agency.</p>
        </div>

        <div class="glass-card p-3 rounded-lg">
          <div class="font-bold text-white text-sm mb-2">Restricted Area Permits (RAP)</div>
          <div class="space-y-2">
            <div class="flex justify-between border-b border-slate-700/50 pb-1">
              <span>Upper Mustang (Sec 7)</span>
              <span class="font-mono text-emerald-400">$500 / 10 days ($50/day after)</span>
            </div>
            <div class="flex justify-between border-b border-slate-700/50 pb-1">
              <span>Upper Dolpo (Sec 8)</span>
              <span class="font-mono text-emerald-400">$500 / 10 days ($50/day after)</span>
            </div>
            <div class="flex justify-between border-b border-slate-700/50 pb-1">
              <span>Manaslu (Sec 5 - Autumn)</span>
              <span class="font-mono text-emerald-400">$100 / week ($15/day after)</span>
            </div>
            <div class="flex justify-between border-b border-slate-700/50 pb-1">
              <span>Naar-Phu (Sec 6 - Autumn)</span>
              <span class="font-mono text-emerald-400">$100 / week ($15/day after)</span>
            </div>
            <div class="flex justify-between border-b border-slate-700/50 pb-1">
              <span>Kanchenjunga (Sec 1)</span>
              <span class="font-mono text-emerald-400">$20 / week</span>
            </div>
            <div class="flex justify-between pb-1">
              <span>Humla Simikot-Hilsa (Sec 10)</span>
              <span class="font-mono text-emerald-400">$50 / week</span>
            </div>
          </div>
        </div>

        <div class="glass-card p-3 rounded-lg">
          <div class="font-bold text-white text-sm mb-2">National Park & Conservation Entry Fees</div>
          <ul class="list-disc list-inside space-y-1 text-slate-300">
            <li>Sagarmatha (Everest) NP: NPR 3,000 (~$23) + Khumbu Rural Municipality (NPR 2,000)</li>
            <li>Annapurna Conservation Area (ACAP): NPR 3,000 (~$23)</li>
            <li>Makalu-Barun National Park: NPR 3,000 (~$23)</li>
            <li>Langtang National Park: NPR 3,000 (~$23)</li>
            <li>Shey Phoksundo National Park: NPR 3,000 (~$23)</li>
            <li>Rara National Park: NPR 3,000 (~$23)</li>
          </ul>
        </div>
      </div>
    `;
  }

  function selectSection(secId) {
    if (state.selectedSectionId === secId) {
      // Toggle back to full route
      resetToFullRoute();
      return;
    }

    state.selectedSectionId = secId;
    const sec = state.sections.find(s => s.id === secId);
    if (!sec) return;

    // Update active highlight in section cards
    document.querySelectorAll('#section-list .glass-card').forEach(c => {
      if (parseInt(c.getAttribute('data-sec-id')) === secId) {
        c.classList.add('active');
        c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        c.classList.remove('active');
      }
    });

    // Update summary text
    const distFormatted = window.UnitManager ? window.UnitManager.formatDistance(sec.distanceKm) : `${sec.distanceKm} km`;
    const eleFormatted = window.UnitManager ? window.UnitManager.formatElevation(sec.highestPoint) : `${sec.highestPoint}m`;

    el.selectedSectionTitle.innerText = `Section ${sec.id}: ${sec.name}`;
    el.selectedSectionSubtitle.innerText = `${sec.region} • ${distFormatted} • ~${sec.estDays} days • Max: ${sec.highestPointName}`;
    el.sectionPermitsText.innerText = sec.permits.join(' • ');

    // Update Header Quick Stats for this section
    el.statDistance.innerText = distFormatted;
    el.statElevation.innerText = eleFormatted;
    el.statDays.innerText = `~${sec.estDays} d`;
    el.statPasses.innerText = sec.keyPasses.length;

    // Render daily stages
    el.stagesContainer.classList.remove('hidden');
    el.stagesList.innerHTML = '';
    sec.stages.forEach(st => {
      const stageRow = document.createElement('div');
      stageRow.className = 'flex items-center justify-between text-xs py-1.5 border-b border-slate-700/40 text-slate-300 hover:text-white';
      const stageDist = window.UnitManager ? window.UnitManager.formatDistance(st.distKm) : `${st.distKm} km`;
      const stageEle = window.UnitManager ? window.UnitManager.formatElevation(st.eleM) : `${st.eleM}m`;

      stageRow.innerHTML = `
        <div class="flex items-center space-x-2">
          <span class="w-5 text-slate-500 font-mono">D${st.day}</span>
          <span class="font-medium">${st.from} → ${st.to}</span>
        </div>
        <div class="flex items-center space-x-3 text-[11px] font-mono">
          <span class="text-slate-400">${stageDist}</span>
          <span class="text-sky-400 font-bold">${stageEle}</span>
        </div>
      `;
      el.stagesList.appendChild(stageRow);
    });

    // Zoom Map and Elevation Chart
    state.mapController.focusSection(secId);
    state.elevationChart.setData(state.highRoute, secId);
  }

  function resetToFullRoute() {
    state.selectedSectionId = null;
    document.querySelectorAll('#section-list .glass-card').forEach(c => c.classList.remove('active'));

    const fullDist = window.UnitManager ? window.UnitManager.formatDistance(1700) : "1,700 km";
    const fullEle = window.UnitManager ? window.UnitManager.formatElevation(6190) : "6,190m";

    el.selectedSectionTitle.innerText = "Great Himalayan Trail - Nepal High Route";
    el.selectedSectionSubtitle.innerText = `Full Continuous Traverse • 10 Sections • ~${fullDist} • ~140 Days`;
    el.sectionPermitsText.innerText = "Multiple RAPs & National Park Conservation Permits";
    el.stagesContainer.classList.add('hidden');

    // Reset Header Quick Stats
    el.statDistance.innerText = fullDist;
    el.statElevation.innerText = fullEle;
    el.statDays.innerText = "120-150";
    el.statPasses.innerText = "28+";

    state.mapController.resetView();
    state.elevationChart.setData(state.highRoute, null);
  }

  function openPassModal(pass) {
    const passEle = window.UnitManager ? window.UnitManager.formatElevation(pass.elevationM) : `${pass.elevationM}m`;

    el.passModalContent.innerHTML = `
      <div class="flex items-start justify-between border-b border-slate-700 pb-3">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-xl font-black text-white">${pass.name}</h3>
            <span class="text-xs px-2 py-0.5 rounded font-mono font-bold bg-red-950 text-red-400 border border-red-700">
              ${passEle}
            </span>
          </div>
          <div class="text-xs text-slate-400 mt-1">Section ${pass.sectionId}: ${pass.sectionName} • ${pass.technicalLevel}</div>
        </div>
        <span class="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-sky-400 border border-slate-700">
          ${pass.grade}
        </span>
      </div>

      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Hazards & Tactics -->
        <div class="space-y-3">
          <div class="p-3 rounded-lg bg-red-950/30 border border-red-900/60">
            <div class="font-bold text-red-400 text-xs uppercase tracking-wider mb-2">Objective Hazards</div>
            <ul class="list-disc list-inside space-y-1 text-xs text-slate-300">
              ${pass.objectiveHazards.map(h => `<li>${h}</li>`).join('')}
            </ul>
          </div>

          <div class="p-3 rounded-lg bg-sky-950/30 border border-sky-900/60">
            <div class="font-bold text-sky-400 text-xs uppercase tracking-wider mb-1">Alpine Tactical Advice</div>
            <p class="text-xs text-slate-300 leading-relaxed">${pass.tacticalAdvice}</p>
          </div>
        </div>

        <!-- Gear List & Rope Specs -->
        <div class="space-y-3">
          <div class="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div class="font-bold text-amber-400 text-xs uppercase tracking-wider mb-1">Fixed Rope Logistics</div>
            <div class="text-xs text-white font-medium mb-3">${pass.fixedRopesRequired}</div>

            <div class="font-bold text-white text-xs uppercase tracking-wider mb-2">Mandatory Technical Gear</div>
            <ul class="space-y-1 text-xs text-slate-300">
              ${pass.gearList.map(g => `<li class="flex items-center gap-1.5"><span class="text-sky-400">✓</span> ${g}</li>`).join('')}
            </ul>
          </div>

          <div class="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
            <div class="font-bold text-slate-400 text-xs uppercase tracking-wider mb-1">Historical Context</div>
            <p class="text-xs text-slate-400 leading-relaxed italic">${pass.historicalNote}</p>
          </div>
        </div>
      </div>

      <div class="mt-5 pt-3 border-t border-slate-700 flex justify-end">
        <button id="modal-pan-pass-btn" class="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold cursor-pointer">
          Locate on Map
        </button>
      </div>
    `;

    document.getElementById('modal-pan-pass-btn').addEventListener('click', () => {
      state.mapController.panTo(pass.coordinates[0], pass.coordinates[1], 12);
      el.passModal.classList.add('hidden');
    });

    el.passModal.classList.remove('hidden');
  }

  function bindEventHandlers() {
    // Tab Switching
    el.tabSections.addEventListener('click', () => switchTab('sections'));
    el.tabPasses.addEventListener('click', () => switchTab('passes'));
    el.tabPermits.addEventListener('click', () => switchTab('permits'));

    // Modal Close
    el.closePassModal.addEventListener('click', () => el.passModal.classList.add('hidden'));
    el.passModal.addEventListener('click', (e) => {
      if (e.target === el.passModal) el.passModal.classList.add('hidden');
    });

    // Reset View
    el.btnResetView.addEventListener('click', () => resetToFullRoute());

    // GPX Modal
    el.openGpxModalBtn.addEventListener('click', () => el.gpxModal.classList.remove('hidden'));
    el.closeGpxModal.addEventListener('click', () => el.gpxModal.classList.add('hidden'));
    // Unit change listener
    const handleUnitUpdate = () => {
      renderSectionsList();
      renderPassesList();
      if (state.selectedSectionId) {
        selectSection(state.selectedSectionId);
      } else {
        resetToFullRoute();
      }
    };
    window.addEventListener('tght:unitChange', handleUnitUpdate);
    window.addEventListener('tght:units-changed', handleUnitUpdate);

    // GPX Actions
    el.btnExportFullGpx.addEventListener('click', () => {
      GPXExporter.exportFullRoute(state.highRoute, state.waypoints);
    });

    el.btnExportSecGpx.addEventListener('click', () => {
      if (state.selectedSectionId) {
        const sec = state.sections.find(s => s.id === state.selectedSectionId);
        GPXExporter.exportSection(sec, state.highRoute, state.waypoints);
      } else {
        alert('Please select a specific section first, or download the full route.');
      }
    });

    el.btnExportWptGpx.addEventListener('click', () => {
      GPXExporter.exportWaypointsOnly(state.waypoints);
    });

    // Search bar functionality
    el.searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        el.searchResults.classList.add('hidden');
        return;
      }

      const matchedWpts = state.waypoints.filter(w => w.name.toLowerCase().includes(q) || (w.desc && w.desc.toLowerCase().includes(q))).slice(0, 5);
      const matchedPasses = state.cruxPasses.filter(p => p.name.toLowerCase().includes(q)).slice(0, 3);
      const matchedSections = state.sections.filter(s => s.name.toLowerCase().includes(q)).slice(0, 3);

      if (matchedWpts.length === 0 && matchedPasses.length === 0 && matchedSections.length === 0) {
        el.searchResults.innerHTML = '<div class="p-2 text-xs text-slate-500">No matching landmarks found.</div>';
        el.searchResults.classList.remove('hidden');
        return;
      }

      let html = '';
      matchedSections.forEach(s => {
        html += `<div class="search-item p-2 hover:bg-slate-800 cursor-pointer text-xs border-b border-slate-700/50" data-type="sec" data-id="${s.id}">
          <span class="text-sky-400 font-bold">[Section]</span> ${s.name} (${s.distanceKm} km)
        </div>`;
      });

      matchedPasses.forEach(p => {
        html += `<div class="search-item p-2 hover:bg-slate-800 cursor-pointer text-xs border-b border-slate-700/50" data-type="pass" data-id="${p.id}">
          <span class="text-red-400 font-bold">[Crux Pass]</span> ${p.name} (${p.elevationM}m)
        </div>`;
      });

      matchedWpts.forEach(w => {
        html += `<div class="search-item p-2 hover:bg-slate-800 cursor-pointer text-xs border-b border-slate-700/50" data-type="wpt" data-lat="${w.lat}" data-lng="${w.lng}">
          <span class="text-amber-400 font-bold">[POI]</span> ${w.name} (${w.elevationM}m)
        </div>`;
      });

      el.searchResults.innerHTML = html;
      el.searchResults.classList.remove('hidden');

      el.searchResults.querySelectorAll('.search-item').forEach(item => {
        item.addEventListener('click', () => {
          const type = item.getAttribute('data-type');
          if (type === 'sec') {
            selectSection(parseInt(item.getAttribute('data-id')));
          } else if (type === 'pass') {
            const pass = state.cruxPasses.find(p => p.id === item.getAttribute('data-id'));
            if (pass) {
              state.mapController.panTo(pass.coordinates[0], pass.coordinates[1], 12);
              openPassModal(pass);
            }
          } else if (type === 'wpt') {
            const lat = parseFloat(item.getAttribute('data-lat'));
            const lng = parseFloat(item.getAttribute('data-lng'));
            state.mapController.panTo(lat, lng, 12);
          }
          el.searchResults.classList.add('hidden');
          el.searchInput.value = '';
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!el.searchInput.contains(e.target) && !el.searchResults.contains(e.target)) {
        el.searchResults.classList.add('hidden');
      }
    });
  }

  function switchTab(tab) {
    state.activeTab = tab;
    [el.tabSections, el.tabPasses, el.tabPermits].forEach(t => t.classList.remove('text-sky-400', 'border-b-2', 'border-sky-400'));
    [el.panelSections, el.panelPasses, el.panelPermits].forEach(p => p.classList.add('hidden'));

    if (tab === 'sections') {
      el.tabSections.classList.add('text-sky-400', 'border-b-2', 'border-sky-400');
      el.panelSections.classList.remove('hidden');
    } else if (tab === 'passes') {
      el.tabPasses.classList.add('text-sky-400', 'border-b-2', 'border-sky-400');
      el.panelPasses.classList.remove('hidden');
    } else if (tab === 'permits') {
      el.tabPermits.classList.add('text-sky-400', 'border-b-2', 'border-sky-400');
      el.panelPermits.classList.remove('hidden');
    }
  }
});
