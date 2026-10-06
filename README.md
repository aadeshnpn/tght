# TGHT • The Great Himalayan Trail (Nepal High Route) Tracker

An interactive geospatial application, elevation profiler, and technical mountaineering tracker for the **Great Himalayan Trail (Nepal High Route)**.

---

## 🏔️ About The Great Himalayan Trail

The Great Himalayan Trail (GHT) in Nepal spans approximately **1,700 kilometers** across the crest of the world's highest mountain range. The **High Route (Alpine/Mountain Route)** traverses remote, glaciated terrain exceeding 6,000 meters, linking ancient trade paths, Buddhist holy valleys, and demanding mountaineering cols from **Mt. Kanchenjunga** in the far east to **Humla/Hilsa** on the north-western border with Tibet.

### Key Statistics
- **Total Distance:** ~1,700 km (~1,050 miles)
- **Cumulative Ascent:** ~120,000 meters (~393,701 ft) — High Route elevation *gain*; Boustead / greathimalayatrail.com often quote ~150,000m+ of *ascent and descent* combined
- **Highest Point:** 6,190m (*West Col*, Makalu Barun)
- **Estimated Duration:** 120 – 160 days (or segmented across multi-year stages)
- **Alpine Sections:** 10 distinct geographic regions

---

## 🚀 Features

1. **Interactive Topographic & Satellite Map:**
   - Multi-layer basemap support (**OpenTopoMap** with elevation contours, **Esri World Satellite Imagery**, and Dark Mode).
   - Continuous color-coded polyline traversing all 10 high-altitude sections.
   - Interactive pins for **Technical Crux Passes (▲!)**, **Alpine Passes (▲)**, **8,000m Base Camps (⛺)**, and **Settlements (●)**.

2. **Dynamic Canvas Elevation Profiler:**
   - Real-time profile rendering with altitude guidelines at **5,000m** (Alpine zone) and **6,000m** (Extreme Mountaineering crux).
   - **Interactive Map Sync:** Hovering over the elevation profile moves a pulsating location crosshair directly onto the corresponding geographic coordinates on the map.

3. **10-Section Stage-by-Stage Explorer:**
   - Complete itineraries, day-by-day distances, elevation gains, and pass listings for all 10 sections:
     1. *Kanchenjunga* (182 km, Lapsang La, Lumbha Sambha Pass)
     2. *Makalu Barun* (148 km, Sherpani Col, West Col)
     3. *Everest & Rolwaling* (168 km, Amphu Labsta, Cho La, Tashi Laptsa)
     4. *Langtang & Helambu* (138 km, Tilman Pass, Laurebina La)
     5. *Manaslu & Ganesh Himal* (164 km, Larkya La, Pangsang Pass)
     6. *Annapurna & Naar-Phu* (158 km, Kang La, Thorong La)
     7. *Mustang* (142 km, Teri La, Saribung La)
     8. *Dolpo* (215 km, Sangda La, Numa La, Baga La, Phoksundo)
     9. *Rara & Jumla* (152 km, Kagmara La, Danphe Lagna)
     10. *Far West - Humla & Darchula* (224 km, Changkheli La, Nara La, Hilsa)

4. **Technical Crux Pass Dossiers:**
   - In-depth mountaineering breakdown for extreme passes: **Sherpani Col (6,150m)**, **West Col (6,190m)**, **Amphu Labsta (5,845m)**, **Tashi Laptsa (5,755m)**, **Tilman Pass (5,308m)**, and **Teri La (5,595m)**.
   - Includes Alpine Grade, fixed rope lengths, mandatory gear checklists (crampons, ascenders, snow pickets), objective hazards, and tactical crossing advice.

5. **GPX Track & Waypoint Exporter:**
   - Client-side generator producing standard **GPX 1.1** XML files.
   - 1-click download options for:
     - The complete High Route continuous track
     - Currently selected individual section
     - Waypoints & POIs for handheld GPS units (Garmin, Coros, Suunto, Gaia GPS, CalTopo).

6. **Instant Landmark Search:**
   - Search bar with autocomplete for finding any pass, village, base camp, or section across Nepal.

---

## 💻 Running the Application

Because this application is built with modern, zero-dependency client-side architecture (ESM JavaScript, Tailwind CSS, Leaflet, and standard Canvas APIs), it requires no package compilation or node_modules setup.

### Quick Start with Python 3:
Run this command from inside the `tght` project directory:

```bash
python3 -m http.server 3000
```

Then open your browser and navigate to:
```
http://localhost:3000
```

Alternatively, you can open `index.html` directly in any modern web browser.

---

## 📁 Project Architecture

```
tght/
├── index.html                  # Interactive home page with 6 data visualization engines & countdown
├── sections.html               # 10 Geographic Frontiers dossier & stage-by-stage itineraries
├── map.html                    # Geospatial hub with interactive Leaflet map & dynamic elevation profiler
├── passes.html                 # Technical Crux Passes Dossier (fixed lines, rappels, grades)
├── expedition.html             # MedOnMt Spring 2028 Mindful Alpine Traverse blueprint
├── aadesh.html                 # Aadesh Neupane: Athlete profile, solo ascents, and research portfolio
├── css/
│   └── styles.css              # MedOnMt design system (Cosmic Obsidian, Sacred Gold, Sage, Sky)
├── js/
│   ├── units.js                # Auto-location & dynamic Metric (km/m) vs Imperial (mi/ft) switcher
│   ├── interactive-charts.js   # 6 mountain physics modules (Everest Multiplier, Thin Air, Radar, Donut)
│   ├── home.js                 # Section explorer tabs, Web Audio soundscape, and countdown
│   ├── map-controller.js       # Leaflet integration, topo/satellite layer toggles, and coordinate tracking
│   ├── elevation-chart.js      # Canvas elevation profile and crosshair sync for map.html
│   └── gpx-exporter.js         # GPX 1.1 compliant XML generator and browser file downloader
├── data/
│   ├── ght-sections.json       # Metadata & daily stages for the 10 Nepal sections
│   ├── ght-crux-passes.json    # Technical climbing dossiers and gear requirements
│   ├── ght-waypoints.json      # Key POIs, passes, base camps, and cultural landmarks
│   └── ght-high-route.json     # Continuous polyline track with lat, lng, ele, and distance
└── README.md                   # Documentation and field reference
```

---

## 🏃 About Aadesh Neupane & MedOnMt

The 2028 Great Himalayan Trail expedition is founded and led by **Aadesh Neupane**, high-altitude endurance athlete, machine learning researcher, and founder of **MedOnMt (Meditate On Mountain)**.

- **Proven High-Altitude Thru-Hikes:** Completed the **Manaslu Circuit** (177 km, Larkya La 5,106m), **Tilicho Lake via Mesokanta Pass** (160 km, alpine crossing at 5,121m), **Upper Mustang Circuit** (140 km, high plateau rain shadow passes up to 4,280m), **Gosaikunda Circuit** (120 km, Laurebina Pass 4,610m), and the remote **Wind River Range Continental Divide Thru-Hike** (90+ miles off-trail alpine traverse).
- **Remote Wilderness Solos:** Soloed **Gannett Peak** (Wyoming State Highpoint, 13,804 ft) and **Fremont Peak** (13,745 ft) in the Wind River Range; soloed **Grand Teton** (13,775 ft) and **Middle Teton** (12,804 ft).
- **First Ascents & Winter Alpinism:** Established and documented [The *Other* Northeast Couloir on Lone Peak](https://www.summitpost.org/the-other-northeast-couloir/1090620) (Grade III, Class 4, 60–70° crux, 11,253 ft); winter ascents of **Everest Ridge** (Timpanogos, 6,300 ft gain front-pointing) and the 50° **Hypodermic Needle** (North Thunder).
- **The Utah Valley 7 Summits (All-Season):** Summited all 7 prominent Utah Valley peaks (Timpanogos, Lone Peak, Cascade, Provo Peak, Spanish Fork Peak, Santaquin, Mount Nebo) in **all four seasons** (Winter, Spring, Summer, Autumn).
- **Big-Wall Sport & Ice Climbing:** Climbed [Squawstruck / Kyhv Peak 7735](https://www.mountainproject.com/route/106897735/kyhv-peak-7735) (23 pitches, 5.11b, ~2,500 ft) in Rock Canyon, Utah — one of the longest continuous sport climbing routes in the United States; active technical water ice climber (including Provo Canyon's 10-pitch [Stairway to Heaven](https://www.mountainproject.com/route/105879622/stairway-to-heaven)).
- **Extreme Ridge Linkups & Mountain Ultras:** Completed the **Snow Peaks 50 (Snow50) Ultra Marathon** (50 miles, 14,000 ft gain in 14h 44m), **Provo Ultimate Ridge Linkup (PURL)** (~26+ miles, 14,000+ ft gain), **Alpine Ridge Traverse (ART)**, and **WURL Horseshoe** (36 miles, 21,000+ ft gain).
- **La Sal Alpinism & Mountain Bike Endurance:** High-altitude summits and skyline linkups in Utah's **La Sal Mountains** (Mount Peale 12,721 ft, Mount Mellenthin 12,645 ft, Mount Tukuhnikivatz 12,482 ft; La Sal Triple Crown); completed **The Whole Enchilada (TWE)** MTB trail in Moab (34 miles, -7,000 ft technical descent from 11,150 ft Burro Pass to the Colorado River).
- **Milestones:** Century of unique mountain tops (**100+ summits**), unbroken **300+ day streak** of 10,000+ steps/day, and **100+ academic citations** in machine learning and human behavior research.
- **Verified Profiles & Route Guides:**
  - [SummitPost Author Profile / Lone Peak Route](https://www.summitpost.org/the-other-northeast-couloir/1090620)
  - [Strava](https://www.strava.com/athletes/40837261) (Athlete #40837261)
  - [UltraSignup](https://ultrasignup.com/results_participant.aspx?fname=Aadesh&lname=Neupane) (Snow Peaks 50 Finisher)
  - [Peakbagger](https://www.peakbagger.com/climber/ClimbListC.aspx?cid=23336&sort=VertPeakFt&u=m&j=-1&y=9999) (Climber ID #23336)
  - [Google Scholar](https://scholar.google.com/citations?user=HpOtkk4AAAAJ&hl=en&oi=ao)
  - [Substack](https://medonmt.substack.com/)
  - [Instagram](https://www.instagram.com/medonmt/)
  - [LinkedIn](https://www.linkedin.com/in/aadeshnpn/)
  - [Goodreads](https://www.goodreads.com/user/show/65278991-aadesh)
  - [Twitter / X](https://twitter.com/aadeshnpn)
  - [MedOnMt Website](https://medonmt.org/) & [Retreats](https://medonmt.org/retreats.html)

---

## 📜 Regulatory Notice & Permitting

- **Mandatory Guide Policy:** The Nepal Tourism Board requires all foreign trekkers in national parks and conservation areas to be accompanied by a licensed Nepali guide booked through a government-registered trekking agency.
- **Restricted Area Permits (RAP):** Required for Upper Mustang ($500/10 days), Upper Dolpo ($500/10 days), Manaslu, Nar-Phu, Kanchenjunga, and Humla.
