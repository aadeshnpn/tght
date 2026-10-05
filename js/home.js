/**
 * Home Page Contemplative Interactive Engine for TGHT & MedOnMt 2028 Expedition
 * Inspired by MedOnMt ("Ascend Into Stillness")
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Spring 2028 Countdown Timer
  initCountdown();

  // 2. Mobile Menu Navigation
  initMobileMenu();

  // 3. Practice Vitals Circular Arc Gauges
  initVitalGauges();

  // 4. Interactive Section Explorer
  initSectionExplorer();

  // 5. Interactive Accordions / Curiosity FAQ
  initAccordions();

  // 6. Route Comparison Tabs
  initRouteComparison();

  // 7. Ambient Mountain Soundscape (Web Audio API)
  initSoundscape();

  // 8. Newsletter / Dispatch Form
  initNewsletterForm();

  // 9. BibTeX Citation Copier
  initBibtexCopy();
});

/**
 * Practice Vitals Animated Circular Arc Gauges
 */
function initVitalGauges() {
  const vitals = document.querySelectorAll('.vital');
  if (!vitals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
      }
    });
  }, { threshold: 0.25 });

  vitals.forEach(v => observer.observe(v));
}

/**
 * Live Countdown to Spring 2028 (March 15, 2028 06:00:00 NPT)
 */
function initCountdown() {
  const targetDate = new Date('2028-03-15T06:00:00+05:45').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!daysEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.innerText = '00';
      hoursEl.innerText = '00';
      minutesEl.innerText = '00';
      secondsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = days.toString().padStart(3, '0');
    hoursEl.innerText = hours.toString().padStart(2, '0');
    minutesEl.innerText = minutes.toString().padStart(2, '0');
    secondsEl.innerText = seconds.toString().padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/**
 * Mobile Drawer Menu
 */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });
}

/**
 * Interactive Section Explorer on Home Page
 */
const sectionData = [
  {
    id: 1,
    name: "Kanchenjunga",
    region: "Eastern Border / Sikkim Frontier",
    distanceKm: 182,
    highestM: 5160,
    highestName: "Lapsang La",
    days: "16 days",
    accent: "#d49b42",
    description: "The untouched far east. Traverses ancient rhododendron rainforests into high glaciated basins beneath the towering South & North faces of Kanchenjunga (8,586m), the world's 3rd highest peak. In local Rai and Limbu lore, these peaks are sacred abodes of mountain deities.",
    crux: "Lumbha Sambha Pass wilderness bridge to the Arun river valley."
  },
  {
    id: 2,
    name: "Makalu Barun",
    region: "Eastern-Central Himalaya",
    distanceKm: 148,
    highestM: 6190,
    highestName: "West Col",
    days: "14 days",
    accent: "#b85c3c",
    description: "The absolute mountaineering crux of the GHT High Route. Crosses isolated wilderness from the deep Arun gorge into the glaciated Barun and Hongu valleys. Described by Padmasambhava as a sacred Beyul (hidden sanctuary).",
    crux: "The 'Three Cols': Sherpani Col (6,150m), West Col (6,190m), and Amphu Labsta (5,845m)."
  },
  {
    id: 3,
    name: "Everest & Rolwaling",
    region: "Khumbu / Rolwaling Sacred Sanctuary",
    distanceKm: 168,
    highestM: 5845,
    highestName: "Amphu Labsta",
    days: "15 days",
    accent: "#6090d4",
    description: "Connects the turquoise Gokyo lakes and iconic Everest Base Camp to the spiritual Buddhist sanctuary of Rolwaling via high glaciated ice shelves and ancient Sherpa monasteries where butter lamps burn eternally.",
    crux: "Tashi Laptsa Pass (5,755m) and Cho La (5,420m)."
  },
  {
    id: 4,
    name: "Langtang & Helambu",
    region: "Central Himalaya",
    distanceKm: 138,
    highestM: 5308,
    highestName: "Tilman Pass",
    days: "12 days",
    accent: "#4e9166",
    description: "Traversing resilient Tamang villages into wild moraines, crossing Bill Tilman's legendary 1949 pass to the holy pilgrimage lakes of Gosainkunda, sacred to Shiva and mountain pilgrims for millennia.",
    crux: "Tilman Pass (5,308m) and Laurebina La."
  },
  {
    id: 5,
    name: "Manaslu & Ganesh Himal",
    region: "Tibetan Borderlands",
    distanceKm: 164,
    highestM: 5106,
    highestName: "Larkya La",
    days: "14 days",
    accent: "#d49b42",
    description: "Circumnavigates Mt. Manaslu (8,163m), 'Mountain of the Spirit'. Ancient monasteries, stone mani walls carved with Om Mani Padme Hum, and windswept alpine passes under Himalayan skies.",
    crux: "Larkya La (5,106m) snowy divide."
  },
  {
    id: 6,
    name: "Annapurna & Naar-Phu",
    region: "Trans-Himalayan Gorges",
    distanceKm: 158,
    highestM: 5416,
    highestName: "Thorong La",
    days: "13 days",
    accent: "#6090d4",
    description: "Ventures into the hidden Tibetan medieval villages of Naar and Phu, crossing the sharp Kang La before traversing the high Thorong La into the wind-sculpted Mustang desert.",
    crux: "Kang La (5,320m) & Thorong La (5,416m)."
  },
  {
    id: 7,
    name: "Mustang",
    region: "The Walled Kingdom of Lo",
    distanceKm: 142,
    highestM: 5595,
    highestName: "Teri La",
    days: "12 days",
    accent: "#b85c3c",
    description: "Red sandstone canyons, cliffside ancient sky-caves, wind-carved desert plateaus, and the 6-day uninhabited wilderness expedition over Teri La into remote Nar.",
    crux: "Teri La (5,595m) - zero human settlements for 6 consecutive days."
  },
  {
    id: 8,
    name: "Dolpo",
    region: "Land of the Snow Leopard & Bon",
    distanceKm: 215,
    highestM: 5550,
    highestName: "Jungben La",
    days: "18 days",
    accent: "#4e9166",
    description: "The most mystical, isolated expanse of the entire Himalayas. Ancient pre-Buddhist Bon culture, Shey Gompa, Crystal Mountain, and the impossibly turquoise waters of Phoksundo Lake.",
    crux: "Consecutive 5,000m+ passes: Sangda La, Numa La, Baga La."
  },
  {
    id: 9,
    name: "Rara & Jumla",
    region: "Mid-Western Lakes & Ancient Kingdoms",
    distanceKm: 152,
    highestM: 5115,
    highestName: "Kagmara La",
    days: "11 days",
    accent: "#6090d4",
    description: "Shifting from harsh alpine crags into virgin blue pine, juniper, and spruce forests, encircling Rara Lake, Nepal's largest mirror lake, and the ancient 12th-century Khas kingdom valley.",
    crux: "Kagmara La (5,115m) glacial divide."
  },
  {
    id: 10,
    name: "Far West (Humla & Darchula)",
    region: "The Remote Karnali Frontier",
    distanceKm: 224,
    highestM: 5400,
    highestName: "Nyalu La",
    days: "17 days",
    accent: "#d49b42",
    description: "The wild western terminus. Cliff-hanging mule paths along the roaring Karnali River to the Tibetan border post at Hilsa and the immense, lonely glaciers of Mt. Saipal.",
    crux: "Nyalu La (4,990m) and Nara La border divide."
  }
];

let currentSectionIdx = 0;

function initSectionExplorer() {
  const tabsContainer = document.getElementById('section-explorer-tabs');
  const displayContainer = document.getElementById('section-explorer-display');

  if (!tabsContainer || !displayContainer) return;

  function render(index) {
    currentSectionIdx = index;
    const s = sectionData[index];

    const distFormatted = window.UnitManager ? window.UnitManager.formatDistance(s.distanceKm) : `${s.distanceKm} km`;
    const eleFormatted = window.UnitManager ? window.UnitManager.formatElevation(s.highestM) : `${s.highestM}m`;

    displayContainer.innerHTML = `
      <div class="bento-card relative overflow-hidden transition-all duration-300">
        <div class="bento-accent-tl" style="background: linear-gradient(90deg, ${s.accent}, transparent);"></div>
        <div class="absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl opacity-15" style="background-color: ${s.accent};"></div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded text-white" style="background-color: ${s.accent}22; border: 1px solid ${s.accent}66;">
                Section ${s.id} of 10
              </span>
              <span class="text-xs text-[#d1c7b7] font-medium">${s.region}</span>
            </div>
            <h3 class="text-2xl md:text-3xl font-serif font-bold text-white">${s.name}</h3>
          </div>

          <div class="flex items-center gap-3 text-xs font-sans">
            <div class="bg-black/30 px-3 py-2 rounded-lg border border-white/10">
              <div class="text-[10px] text-[#8e867a] uppercase tracking-wider font-semibold">Distance</div>
              <div class="font-bold text-[#f5f2eb]"><span data-km="${s.distanceKm}">${distFormatted}</span></div>
            </div>
            <div class="bg-black/30 px-3 py-2 rounded-lg border border-white/10">
              <div class="text-[10px] text-[#8e867a] uppercase tracking-wider font-semibold">Max Alt</div>
              <div class="font-bold text-[#d49b42]"><span data-m="${s.highestM}">${eleFormatted}</span> (${s.highestName})</div>
            </div>
            <div class="bg-black/30 px-3 py-2 rounded-lg border border-white/10">
              <div class="text-[10px] text-[#8e867a] uppercase tracking-wider font-semibold">Duration</div>
              <div class="font-bold text-[#72b388]">${s.days}</div>
            </div>
          </div>
        </div>

        <p class="mt-4 text-[#d1c7b7] text-sm md:text-base leading-relaxed">
          ${s.description}
        </p>

        <div class="mt-4 p-3 rounded-xl bg-black/25 border border-white/10 flex items-start gap-3">
          <span class="text-lg">🏔️</span>
          <div>
            <span class="text-xs font-bold text-[#d49b42] uppercase tracking-wider">Crux Landmark:</span>
            <p class="card-prose mt-0.5">${s.crux}</p>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div class="text-xs text-[#8e867a]">
            Detailed stage logs, water sources & permits on the dedicated section page.
          </div>
          <a href="sections.html" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#d49b42] hover:text-[#f1be6d] transition">
            Explore Full ${s.name} Dossier →
          </a>
        </div>
      </div>
    `;

    // Re-run unit manager on dynamically inserted node
    if (window.UnitManager && typeof window.UnitManager.applyUnitsToElement === 'function') {
      window.UnitManager.applyUnitsToElement(displayContainer);
    }

    // Update active tab buttons
    const tabBtns = tabsContainer.querySelectorAll('button');
    tabBtns.forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add('bg-white/10', 'border-[#d49b42]', 'text-white');
        btn.classList.remove('text-[#8e867a]', 'border-transparent');
      } else {
        btn.classList.remove('bg-white/10', 'border-[#d49b42]', 'text-white');
        btn.classList.add('text-[#8e867a]', 'border-transparent');
      }
    });
  }

  // Render tab buttons
  tabsContainer.innerHTML = sectionData.map((s, idx) => `
    <button 
      class="px-3.5 py-2 text-xs font-bold rounded-lg border transition whitespace-nowrap flex items-center gap-2 ${idx === 0 ? 'bg-white/10 border-[#d49b42] text-white' : 'text-[#8e867a] border-transparent hover:text-white'}"
      data-idx="${idx}"
    >
      <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${s.accent};"></span>
      <span>${s.id}. ${s.name}</span>
    </button>
  `).join('');

  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-idx]');
    if (btn) {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      render(idx);
    }
  });

  render(0);

  // Listen to unit switch events
  window.addEventListener('tght:unitChange', () => {
    render(currentSectionIdx);
  });
  window.addEventListener('tght:units-changed', () => {
    render(currentSectionIdx);
  });
}

/**
 * Route Comparison Tabs (High Route vs Cultural Route)
 */
function initRouteComparison() {
  const tabs = document.querySelectorAll('[data-route-tab]');
  const highContent = document.getElementById('route-content-high');
  const cultContent = document.getElementById('route-content-cultural');

  if (!tabs.length || !highContent || !cultContent) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-route-tab');

      tabs.forEach(t => {
        t.classList.remove('active', 'border-[#d49b42]', 'text-white', 'bg-white/10');
        t.classList.add('text-[#8e867a]');
      });

      tab.classList.add('active', 'border-[#d49b42]', 'text-white', 'bg-white/10');
      tab.classList.remove('text-[#8e867a]');

      if (target === 'high') {
        highContent.classList.remove('hidden');
        cultContent.classList.add('hidden');
      } else {
        highContent.classList.add('hidden');
        cultContent.classList.remove('hidden');
      }
    });
  });
}

/**
 * Interactive Accordions
 */
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion-header');

  accordions.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.accordion-icon');

      const isHidden = content.classList.contains('hidden');

      // Close all in this group if desired, or toggle individually
      content.classList.toggle('hidden');

      if (icon) {
        icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });
  });
}

/**
 * Contemplative Himalayan Ambient Soundscape (Web Audio API)
 * Subtle alpine wind & singing bowl tone
 */
function initSoundscape() {
  const soundBtn = document.getElementById('soundscape-btn');
  if (!soundBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let windGain = null;

  soundBtn.addEventListener('click', () => {
    if (!isPlaying) {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        setupAmbientAudio(audioCtx);
      } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      isPlaying = true;
      soundBtn.classList.add('bg-[#d49b42]', 'text-[#080c14]');
      soundBtn.classList.remove('bg-white/5', 'text-[#d1c7b7]');
      soundBtn.innerHTML = `
        <svg class="w-3.5 h-3.5 animate-pulse text-[#080c14]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.76l-4.22-3.166A1 1 0 003.546 13H2a1 1 0 01-1-1V8a1 1 0 011-1h1.546a1 1 0 00.617-.234l4.22-3.166a1 1 0 011.0-.524zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z"/></svg>
        <span>Atmosphere: On</span>
      `;

      // Trigger singing bowl chime on initial start
      playBowlChime(audioCtx);
    } else {
      if (audioCtx) {
        audioCtx.suspend();
      }
      isPlaying = false;
      soundBtn.classList.remove('bg-[#d49b42]', 'text-[#080c14]');
      soundBtn.classList.add('bg-white/5', 'text-[#d1c7b7]');
      soundBtn.innerHTML = `
        <svg class="w-3.5 h-3.5 text-[#d49b42]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
        <span>Atmosphere: Off</span>
      `;
    }
  });

  function setupAmbientAudio(ctx) {
    // White/Pink noise buffer for gentle mountain wind
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.96 * b1 + white * 0.11;
      b2 = 0.86 * b2 + white * 0.25;
      output[i] = (b0 + b1 + b2) * 0.12;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Bandpass filter for hollow wind sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(420, ctx.currentTime);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.12, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(windGain);
    windGain.connect(ctx.destination);
    whiteNoise.start(0);

    // Subtle gentle LFO modulation for wind gusts
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(150, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(0);
  }

  function playBowlChime(ctx) {
    if (!ctx) return;
    const freqs = [216, 432, 648];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime);

      const amp = (0.08 / (idx + 1));
      gain.gain.setValueAtTime(amp, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 6.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 6.2);
    });
  }
}

/**
 * Dispatch & Sangha Newsletter Form
 */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  const msg = document.getElementById('newsletter-msg');

  if (!form || !msg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input || !input.value) return;

    msg.classList.remove('hidden');
    msg.innerText = `Namaste. You are now subscribed for MedOnMt Spring 2028 dispatches and reflections.`;
    input.value = '';
  });
}

/**
 * Academic Citation & BibTeX Clipboard Copier
 */
function initBibtexCopy() {
  const btn = document.getElementById('btn-copy-bibtex');
  const textEl = document.getElementById('copy-bibtex-text');
  const pre = document.getElementById('bibtex-block');

  if (!btn || !textEl || !pre) return;

  btn.addEventListener('click', async () => {
    const bibtex = pre.innerText.trim();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(bibtex);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = bibtex;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      textEl.innerText = 'Copied to Clipboard!';
      btn.classList.add('bg-emerald-600', 'border-emerald-500');
      setTimeout(() => {
        textEl.innerText = 'Copy BibTeX';
        btn.classList.remove('bg-emerald-600', 'border-emerald-500');
      }, 2500);
    } catch (err) {
      console.warn('Clipboard write failed, trying execCommand fallback:', err);
      const textarea = document.createElement('textarea');
      textarea.value = bibtex;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      textEl.innerText = 'Copied!';
      setTimeout(() => {
        textEl.innerText = 'Copy BibTeX';
      }, 2500);
    }
  });
}
