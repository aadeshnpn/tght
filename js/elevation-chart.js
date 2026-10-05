/**
 * Interactive Elevation Profile Visualizer for TGHT
 * Renders smooth high-performance Canvas elevation profiles with pass annotations and map synching.
 */

class ElevationChart {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`ElevationChart container #${containerId} not found`);
      return;
    }

    this.options = Object.assign({
      onHover: null,
      onLeave: null
    }, options);

    this.points = [];
    this.allPoints = [];
    this.selectedSectionId = null;
    this.hoverIndex = -1;

    this.initCanvas();
    this.bindEvents();
  }

  initCanvas() {
    this.container.innerHTML = '';
    this.container.style.position = 'relative';

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'w-full h-full block cursor-crosshair';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // Create floating tooltip element
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'absolute hidden pointer-events-none z-30 bg-slate-900/90 text-white text-xs px-2.5 py-1.5 rounded-md shadow-lg border border-slate-700/80 backdrop-blur-sm transition-opacity duration-150';
    this.container.appendChild(this.tooltip);

    this.handleResize();
  }

  handleResize() {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width || 800;
    this.height = rect.height || 180;

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);

    this.padding = { top: 24, right: 30, bottom: 26, left: 52 };
    this.plotWidth = Math.max(10, this.width - this.padding.left - this.padding.right);
    this.plotHeight = Math.max(10, this.height - this.padding.top - this.padding.bottom);

    this.draw();
  }

  setData(points, selectedSectionId = null) {
    this.allPoints = points;
    this.selectedSectionId = selectedSectionId;

    if (selectedSectionId) {
      this.points = points.filter(p => p.secId === selectedSectionId);
    } else {
      this.points = points;
    }

    if (this.points.length === 0) return;

    this.minDist = this.points[0].distKm;
    this.maxDist = this.points[this.points.length - 1].distKm;
    if (this.minDist === this.maxDist) this.maxDist += 1;

    this.minEle = 800;
    this.maxEle = 6500;

    this.draw();
  }

  bindEvents() {
    window.addEventListener('resize', () => this.handleResize());

    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.points || this.points.length === 0) return;
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;

      if (mouseX < this.padding.left || mouseX > this.width - this.padding.right) {
        this.clearHover();
        return;
      }

      const ratio = (mouseX - this.padding.left) / this.plotWidth;
      const targetDist = this.minDist + ratio * (this.maxDist - this.minDist);

      // Find closest point by binary search or direct scan
      let closestIdx = 0;
      let minDiff = Infinity;
      for (let i = 0; i < this.points.length; i++) {
        const diff = Math.abs(this.points[i].distKm - targetDist);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      }

      this.hoverIndex = closestIdx;
      const pt = this.points[closestIdx];
      this.draw();

      // Position tooltip
      const ptX = this.padding.left + ((pt.distKm - this.minDist) / (this.maxDist - this.minDist)) * this.plotWidth;
      const ptY = this.padding.top + this.plotHeight - ((pt.ele - this.minEle) / (this.maxEle - this.minEle)) * this.plotHeight;

      this.tooltip.classList.remove('hidden');
      this.tooltip.style.left = `${Math.min(this.width - 150, Math.max(10, ptX - 60))}px`;
      this.tooltip.style.top = `${Math.max(10, ptY - 50)}px`;

      const altText = window.UnitManager ? window.UnitManager.formatElevation(pt.ele) : `${pt.ele.toLocaleString()}m`;
      const distText = window.UnitManager ? window.UnitManager.formatDistance(pt.distKm) : `${pt.distKm} km`;

      this.tooltip.innerHTML = `
        <div class="font-bold text-sky-400">${pt.name || pt.secName}</div>
        <div class="text-slate-300">Alt: <span class="font-semibold text-white">${altText}</span> | Dist: <span class="font-semibold text-white">${distText}</span></div>
      `;

      if (typeof this.options.onHover === 'function') {
        this.options.onHover(pt);
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.clearHover();
    });

    // Redraw on unit change
    window.addEventListener('tght:unitChange', () => {
      this.draw();
    });
    window.addEventListener('tght:units-changed', () => {
      this.draw();
    });
  }

  clearHover() {
    this.hoverIndex = -1;
    this.tooltip.classList.add('hidden');
    this.draw();
    if (typeof this.options.onLeave === 'function') {
      this.options.onLeave();
    }
  }

  draw() {
    if (!this.ctx || !this.points || this.points.length === 0) return;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Background
    ctx.fillStyle = '#0e1422';
    ctx.fillRect(0, 0, this.width, this.height);

    // Grid lines for Elevation
    const eleLines = [2000, 3500, 5000, 6000];
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif';

    eleLines.forEach((ele) => {
      const y = this.padding.top + this.plotHeight - ((ele - this.minEle) / (this.maxEle - this.minEle)) * this.plotHeight;

      ctx.beginPath();
      ctx.strokeStyle = ele >= 6000 ? 'rgba(184, 92, 60, 0.45)' : ele >= 5000 ? 'rgba(212, 155, 66, 0.35)' : 'rgba(255, 255, 255, 0.08)';
      ctx.setLineDash(ele >= 5000 ? [4, 4] : [2, 4]);
      ctx.lineWidth = 1;
      ctx.moveTo(this.padding.left, y);
      ctx.lineTo(this.width - this.padding.right, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = ele >= 6000 ? '#df7a57' : ele >= 5000 ? '#f1be6d' : '#8e867a';
      const eleLabel = window.UnitManager ? window.UnitManager.formatElevation(ele) : `${ele}m`;
      ctx.fillText(eleLabel, this.padding.left - 6, y);
    });

    // Distance Axis Labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#8e867a';
    const numDistSteps = 5;
    for (let i = 0; i <= numDistSteps; i++) {
      const d = this.minDist + (i / numDistSteps) * (this.maxDist - this.minDist);
      const x = this.padding.left + (i / numDistSteps) * this.plotWidth;
      const distLabel = window.UnitManager ? window.UnitManager.formatDistance(d, { short: true }) : `${Math.round(d)} km`;
      ctx.fillText(distLabel, x, this.padding.top + this.plotHeight + 8);
    }

    // Path Coordinates
    const coords = this.points.map((p) => {
      const x = this.padding.left + ((p.distKm - this.minDist) / (this.maxDist - this.minDist)) * this.plotWidth;
      const y = this.padding.top + this.plotHeight - ((p.ele - this.minEle) / (this.maxEle - this.minEle)) * this.plotHeight;
      return { x, y, p };
    });

    if (coords.length < 2) return;

    // Gradient Fill under mountain curve
    const gradient = ctx.createLinearGradient(0, this.padding.top, 0, this.padding.top + this.plotHeight);
    gradient.addColorStop(0, 'rgba(212, 155, 66, 0.45)');
    gradient.addColorStop(0.5, 'rgba(96, 144, 212, 0.2)');
    gradient.addColorStop(1, 'rgba(14, 20, 34, 0.05)');

    ctx.beginPath();
    ctx.moveTo(coords[0].x, this.padding.top + this.plotHeight);
    coords.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.lineTo(coords[coords.length - 1].x, this.padding.top + this.plotHeight);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Outline curve
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 1; i < coords.length; i++) {
      ctx.lineTo(coords[i].x, coords[i].y);
    }
    ctx.strokeStyle = '#d49b42';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Render major peak / pass markers directly on profile
    coords.forEach(({ x, y, p }) => {
      if (p.name && (p.ele >= 5000 || p.name.includes('Pass') || p.name.includes('Col') || p.name.includes('La'))) {
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = p.ele >= 6000 ? '#ef4444' : p.ele >= 5500 ? '#f97316' : '#eab308';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Highlight hovered point
    if (this.hoverIndex >= 0 && this.hoverIndex < coords.length) {
      const h = coords[this.hoverIndex];

      // Vertical guideline
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      ctx.moveTo(h.x, this.padding.top);
      ctx.lineTo(h.x, this.padding.top + this.plotHeight);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point circle
      ctx.beginPath();
      ctx.arc(h.x, h.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}

window.ElevationChart = ElevationChart;
