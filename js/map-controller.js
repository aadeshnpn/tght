/**
 * Map Controller for TGHT (Great Himalayan Trail)
 * Leaflet.js integration with Topo & Satellite layers, interactive sections, pass badges, and crosshair sync.
 */

class MapController {
  constructor(mapContainerId, options = {}) {
    this.containerId = mapContainerId;
    this.options = Object.assign({
      onPassClick: null,
      onSectionClick: null
    }, options);

    this.map = null;
    this.routePolylines = [];
    this.waypointMarkers = [];
    this.passMarkers = [];
    this.hoverMarker = null;

    this.initMap();
  }

  initMap() {
    // Center of the Nepal Himalaya
    this.map = L.map(this.containerId, {
      center: [28.3949, 84.4240],
      zoom: 7,
      minZoom: 6,
      maxZoom: 16,
      zoomControl: false
    });

    // Custom positioned zoom control
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Basemaps
    const topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 16,
      attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)'
    });

    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    const esriTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, METI, NRCAN'
    });

    const darkCarto = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 16,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    });

    // Default to Topo Map for high alpine terrain visibility
    topoMap.addTo(this.map);

    const baseLayers = {
      "Topographic (OpenTopo)": topoMap,
      "Satellite (Esri Imagery)": satellite,
      "Esri Topo": esriTopo,
      "Dark Mode (Carto)": darkCarto
    };

    L.control.layers(baseLayers, null, { position: 'topright' }).addTo(this.map);

    // Scale bar in km
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(this.map);

    // Create pulsating hover marker
    const hoverIcon = L.divIcon({
      className: 'tght-hover-marker',
      html: '<div class="w-4 h-4 bg-sky-400 rounded-full border-2 border-white shadow-lg animate-ping"></div><div class="w-3 h-3 bg-sky-500 rounded-full border-2 border-white -mt-3.5 ml-0.5"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
    this.hoverMarker = L.marker([0, 0], { icon: hoverIcon, opacity: 0 }).addTo(this.map);
  }

  /**
   * Render route polylines color-coded by section
   */
  renderRoute(routePoints, sections) {
    // Clear existing lines
    this.routePolylines.forEach(l => this.map.removeLayer(l));
    this.routePolylines = [];

    const sectionMap = {};
    sections.forEach(s => { sectionMap[s.id] = s; });

    // Group points by section
    const secPoints = {};
    routePoints.forEach((pt) => {
      if (!secPoints[pt.secId]) secPoints[pt.secId] = [];
      secPoints[pt.secId].push([pt.lat, pt.lng]);
    });

    // Draw connecting polylines
    Object.keys(secPoints).forEach((secId) => {
      const pts = secPoints[secId];
      const section = sectionMap[secId] || { name: `Section ${secId}`, color: '#38bdf8' };

      const polyline = L.polyline(pts, {
        color: section.color || '#38bdf8',
        weight: 3.5,
        opacity: 0.9,
        lineJoin: 'round',
        lineCap: 'round',
        smoothFactor: 1.0
      }).addTo(this.map);

      polyline.bindTooltip(`<b>${section.name}</b><br/>High Route Section ${secId}<br/>Highest: ${section.highestPointName || ''}`, {
        sticky: true,
        className: 'bg-slate-900 text-white text-xs border border-slate-700 shadow-md p-2 rounded'
      });

      polyline.on('click', () => {
        if (typeof this.options.onSectionClick === 'function') {
          this.options.onSectionClick(section);
        }
      });

      this.routePolylines.push({ secId: parseInt(secId), line: polyline });
    });
  }

  /**
   * Render pass markers & waypoints
   */
  renderWaypoints(waypoints, cruxPasses) {
    this.waypointMarkers.forEach(m => this.map.removeLayer(m));
    this.waypointMarkers = [];

    const cruxPassMap = {};
    cruxPasses.forEach(c => { cruxPassMap[c.id] = c; });

    waypoints.forEach((wpt) => {
      const isCrux = wpt.type === 'crux_pass';
      const isPass = wpt.type === 'pass';
      const isBasecamp = wpt.type === 'basecamp';

      let bgClass = isCrux ? 'bg-red-500 border-white text-white' :
                    isPass ? 'bg-amber-500 border-white text-white' :
                    isBasecamp ? 'bg-sky-500 border-white text-white' :
                    'bg-emerald-600 border-white text-white';

      let iconHtml = `<div class="flex items-center justify-center w-6 h-6 rounded-full border-2 shadow-lg font-bold text-[10px] ${bgClass}">`;
      if (isCrux) iconHtml += '▲!';
      else if (isPass) iconHtml += '▲';
      else if (isBasecamp) iconHtml += '⛺';
      else iconHtml += '●';
      iconHtml += '</div>';

      const customIcon = L.divIcon({
        className: 'tght-custom-pin',
        html: iconHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([wpt.lat, wpt.lng], { icon: customIcon }).addTo(this.map);

      let popupContent = `
        <div class="p-1 max-w-xs">
          <div class="font-bold text-sm text-slate-900">${wpt.name}</div>
          <div class="text-xs text-slate-600 font-semibold mb-1">Elevation: ${wpt.elevationM}m</div>
          <div class="text-xs text-slate-700 leading-snug">${wpt.desc || ''}</div>
      `;

      if (isCrux) {
        popupContent += `
          <button class="mt-2 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold px-2 py-1 rounded w-full cursor-pointer crux-view-btn" data-pass-id="${wpt.id.replace('wpt-', '')}">
            View Technical Climbing Dossier
          </button>
        `;
      }

      popupContent += `</div>`;
      marker.bindPopup(popupContent);

      marker.on('popupopen', (e) => {
        const btn = e.popup.getElement().querySelector('.crux-view-btn');
        if (btn) {
          btn.addEventListener('click', () => {
            const passId = btn.getAttribute('data-pass-id');
            const pass = cruxPasses.find(p => p.id === passId || p.id === passId.replace('wpt-', ''));
            if (pass && typeof this.options.onPassClick === 'function') {
              this.options.onPassClick(pass);
            }
          });
        }
      });

      this.waypointMarkers.push(marker);
    });
  }

  /**
   * Focus camera onto a section
   */
  focusSection(secId) {
    const match = this.routePolylines.find(p => p.secId === secId);
    if (match) {
      this.map.fitBounds(match.line.getBounds(), { padding: [40, 40], maxZoom: 11, animate: true, duration: 1.2 });
    }
  }

  /**
   * Reset camera to full Nepal view
   */
  resetView() {
    if (this.routePolylines.length > 0) {
      const group = new L.featureGroup(this.routePolylines.map(p => p.line));
      this.map.fitBounds(group.getBounds(), { padding: [30, 30], animate: true, duration: 1.2 });
    } else {
      this.map.setView([28.3949, 84.4240], 7);
    }
  }

  /**
   * Pan to specific coordinate
   */
  panTo(lat, lng, zoom = 11) {
    this.map.flyTo([lat, lng], zoom, { duration: 1.0 });
  }

  /**
   * Move hover marker corresponding to elevation chart sync
   */
  setHoverCoordinate(lat, lng) {
    if (this.hoverMarker) {
      this.hoverMarker.setLatLng([lat, lng]);
      this.hoverMarker.setOpacity(1);
    }
  }

  clearHover() {
    if (this.hoverMarker) {
      this.hoverMarker.setOpacity(0);
    }
  }
}

window.MapController = MapController;
