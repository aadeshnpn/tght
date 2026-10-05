# The Great Himalayan Trail (GHT) & MedOnMt Archive
## Scholarly Bibliography, Field Cartography & Data Sources Dossier

**Project:** The Great Himalayan Trail (Nepal High Route) & MedOnMt 2028 Expedition  
**Compiled By:** MedOnMt Research Team & Aadesh Neupane  
**Last Updated:** Autumn 2026 / 2028 Expedition Planning Cycle  
**Repository:** `tght` (The Great Himalayan Trail Interactive Portal)

---

### Executive Overview

Every quantitative metric, geospatial elevation profile, atmospheric simulation, crux pass assessment, and metabolic model hosted within this portal is synthesized from authoritative field cartography, official Nepalese governmental charters, satellite-derived digital elevation models (DEM), and peer-reviewed clinical altitude medicine literature.

This document serves as the permanent scholarly appendix and provenance record for all data assets utilized throughout this project.

---

### 1. Official Trail Charters & Governmental Authorities

#### 1.1 The Great Himalaya Trail Official Organization
* **Entity:** The Great Himalaya Trail (GHT)
* **Website:** [greathimalayatrail.com](https://www.greathimalayatrail.com)
* **Key Role:** Definitive trail definitions, distinguishing the **High Route (~1,700 km, ~6,190m max elevation)** and the **Low Cultural Route (~1,500 km, ~4,519m max elevation)**. Established standard 10-section regional divisions across Nepal: Kanchenjunga, Makalu Barun, Everest & Rolwaling, Langtang & Helambu, Manaslu & Ganesh, Annapurna & Naar-Phu, Mustang, Dolpo, Rara & Jumla, and Far West (Humla & Darchula).

#### 1.2 Nepal Tourism Board (NTB)
* **Entity:** Government of Nepal, Ministry of Culture, Tourism and Civil Aviation
* **Website:** [ntb.gov.np](https://ntb.gov.np)
* **Key Role:** National tourism regulation, TIMS (Trekkers' Information Management System) regulatory architecture, the 2023 Mandatory Guide Policy for foreign independent trekkers, and sustainable Himalayan tourism guidelines.

#### 1.3 Department of Immigration, Nepal
* **Entity:** Ministry of Home Affairs, Government of Nepal (Kalikasthan, Kathmandu)
* **Website:** [nepalimmigration.gov.np](https://nepalimmigration.gov.np)
* **Key Role:** Restricted Area Permits (RAP) statutory schedule and group quota enforcement across frontier districts:
  * **Upper Mustang:** $500 USD per person for the first 10 days, $50/day thereafter (minimum group of 2).
  * **Upper Dolpo:** $500 USD per person for the first 10 days, $50/day thereafter (minimum group of 2).
  * **Manaslu & Tsum Valley:** $100 USD/week (Autumn peak) / $75 USD/week (Spring).
  * **Kanchenjunga & Naar-Phu:** Specialized border surveillance permits.

#### 1.4 SNV Netherlands Development Organisation
* **Program:** Great Himalaya Trail Development Programme (2008–2014)
* **Website:** [snv.org](https://snv.org)
* **Key Role:** Collaborative initiative with NTB, DFID/UK Aid, and local municipalities to pioneer pro-poor tourism, community-based micro-hospitality, trail infrastructure improvements, and environmental conservation along the GHT corridor.

---

### 2. Geospatial Datasets, Digital Elevation Models & Cartography

#### 2.1 Himalaya Map House (HMH)
* **Entity:** Himalaya Map House Pvt. Ltd., Kathmandu, Nepal
* **Publications:** GHT 1:100,000 and 1:50,000 Topographic Map Series (Series 100 to 109)
* **Cartographer / Field Survey:** Robin Boustead and Nepalese survey teams
* **Key Role:** The physical navigation benchmark for High Himalayan passes, high-camp coordinates, glaciated route changes, and regional river crossings.

#### 2.2 OpenStreetMap (OSM) & OpenAndroMaps
* **Dataset:** OSM Open Collaborative Geodatabase (`route=hiking`, `network=iwn` — International Walking Network)
* **Website:** [openstreetmap.org](https://www.openstreetmap.org)
* **Key Role:** Baseline vector coordinates for the full ~1,700 km traverse geometry and regional trail junctions. Refined and curated into GeoJSON format within this repository at `data/ght-full-route.geojson`.

#### 2.3 NASA Shuttle Radar Topography Mission (SRTM) & Copernicus Global DEM
* **Sensor / Dataset:** NASA SRTM 1 Arc-Second Global (30m) & ESA Copernicus 30m Global DEM (GLO-30)
* **Data Sources:** USGS EarthExplorer / European Space Agency
* **Coordinate Reference System:** WGS 84 (EPSG:4326) / EGM96 Geoid
* **Key Role:** Elevation profile extraction, slope gradient verification for the 28+ major alpine passes, and vertical cumulative gain calculation (~120,000m High Route ascent; official GHT materials often quote ~150,000m+ of ascent and descent combined).

#### 2.4 FarOut Navigation (formerly Guthook Guides)
* **Database:** Great Himalaya Trail GPS Waypoint & Water Source Index
* **Website:** [faroutguides.com](https://faroutguides.com)
* **Key Role:** Verification of seasonal alpine water sources, high-camp coordinates, cell connectivity corridors, and recent avalanche/rockfall trail detours logged by thru-hikers.

---

### 3. Atmospheric Physics, Metabolic Modeling & Altitude Medicine

#### 3.1 International Standard Atmosphere (ISA) Barometric Model
* **Mathematical Formulation:**
  $$\frac{P}{P_0} = \left( 1 - \frac{L \cdot h}{T_0} \right)^{\frac{g \cdot M}{R_0 \cdot L}}$$
  Where:
  * $P_0 = 1013.25\text{ hPa}$ (standard sea-level atmospheric pressure)
  * $L = 0.0065\text{ K/m}$ (temperature lapse rate)
  * $T_0 = 288.15\text{ K}$ (sea-level standard temperature)
  * $g = 9.80665\text{ m/s}^2$ (standard gravity)
  * $M = 0.0289644\text{ kg/mol}$ (molar mass of dry air)
  * $R_0 = 8.31447\text{ J/(mol}\cdot\text{K)}$ (universal gas constant)
* **Application in Project:** Powers the interactive altitude simulation widget on `index.html`, calculating effective barometric pressure ($P_{baro}$) and effective oxygen fraction relative to sea level across all elevations (from 800m valley floors to the 6,190m crux at West Col).

#### 3.2 Pandolf & Givoni-Goldman Metabolic Load Formulation
* **Mathematical Formulation:**
  $$M = 1.5\,W + 2.0\,(W + L)\left(\frac{L}{W}\right)^2 + \eta\,(W + L)\left[1.5\,V^2 + 0.35\,V\,G\right]$$
  Where:
  * $M$: Metabolic rate (Watts)
  * $W$: Athlete body mass ($\sim 74\text{ kg}$)
  * $L$: Expedition pack load ($\sim 18\text{--}24\text{ kg}$)
  * $V$: Hiking velocity ($\text{m/s}$)
  * $G$: Slope gradient ($\%$)
  * $\eta$: Terrain surface coefficient ($\eta = 1.0$ for paved, $\eta = 2.1$ for loose moraine/talus, $\eta = 2.5$ for hard-packed alpine snow/glacier)
* **Application in Project:** Accurately projects caloric expenditure ($\sim 4,800\text{--}6,200\text{ kcal/day}$) and physiological strain for human traverse modeling.

#### 3.3 Wilderness Medical Society (WMS) & International Society for Mountain Medicine (ISMM)
* **Publications:** *Clinical Practice Guidelines for the Prevention and Treatment of Acute Altitude Illness: 2024 Update*
* **Key Role:** Physiological thresholds for Acute Mountain Sickness (AMS), High Altitude Pulmonary Edema (HAPE), and High Altitude Cerebral Edema (HACE). Dictates expedition acclimatization pacing: maximum recommended net sleeping elevation gain of $\le 500\text{ m/day}$ above $3,000\text{m}$, with compulsory acclimatization rest days every 3–4 days.

#### 3.4 Historical Athletic Traverses & Fastest Known Time (FKT) Benchmarks
* **Ryan Sandes & Ryno Griesel (2018):** Continuous trail run traverse from Hilsa to Kanchenjunga covering 1,504 km in **25 days, 4 hours, 24 minutes** (Supported record).
* **Andrew Porter (2016):** Unsupported, solo continuous traverse of the High Route in **28 days, 13 hours, 36 minutes**.
* **Asimina Inglezou (2024):** First documented continuous solo female traverse during the Great Himal Race in **52 days, 6 hours, 23 minutes** (overall high route stages: 37 active crossing days).
* **Lizzy Hawker (2011/2013):** Multiple continuous traverses and ultrarunning surveys across Nepal's high trails.

---

### 4. Contemplative Philosophy, Cognitive Science & MedOnMt

#### 4.1 MedOnMt (Meditate On Mountain)
* **Founder:** Aadesh Neupane
* **Websites:** [medonmt.org](https://medonmt.org) | [medonmt.substack.com](https://medonmt.substack.com)
* **Key Focus:** Integrating elite alpine endurance with contemplative traditions (Vipassana, Zen somatic awareness, Dzogchen) and cognitive neuroscience. Framing extreme high-altitude mountain travel not as an egoic conquest, but as a crucible for psychological stillness, situational awareness, and deep ecological communion.

#### 4.2 Aadesh Neupane Academic Archive
* **Google Scholar Profile:** [Aadesh Neupane - Google Scholar](https://scholar.google.com/citations?user=HpOtkk4AAAAJ&hl=en&oi=ao)
* **Key Areas:** Machine learning, human-AI interaction, behavioral decision-making under stress, and cognitive state estimation. 100+ scholarly citations across peer-reviewed conferences and journals.

#### 4.3 Robin Boustead Foundational Literature
* **Monograph:** Boustead, R. (2011). *The Great Himalaya Trail: A Guide to the High Route of Nepal*. Trailblazer Publications. ISBN: 978-1905864430.
* **Monograph:** Boustead, R. (2008). *Trekking in the Nepal Himalaya*. Trailblazer Guides.
* **Key Role:** The foundational modern cartographic and descriptive compendium outlining the through-hiking corridor of Nepal.

#### 4.4 Technical Route Registries & Alpine Climbing Archives
* **The "Other" Northeast Couloir (Lone Peak, Wasatch Range, UT)**
  * **SummitPost Route Record:** [The *Other* Northeast Couloir (SP #1090620)](https://www.summitpost.org/the-other-northeast-couloir/1090620)
  * **Author & First Documented Ascent:** Aadesh Neupane (`aadeshnpn`) — April 2024
  * **Technical Specs:** Grade III, Class 4 mixed rock, sustained 48° to 60–70° snow/ice crux in middle third; 1,270 vertical feet of direct couloir climbing to Lone Peak summit ridge (11,253 ft / 3,430m) via Bells Canyon approach (+4,532 ft) and Heavens Halfpipe / Dry Creek descent (-5,473 ft). Includes route GPX, topo overlay, and ski descent documentation.
* **Kyhv Peak 7735 / Squawstruck (Rock Canyon, UT)**
  * **Mountain Project Route Record:** [Kyhv Peak | 7735 / Squawstruck (MP #106897735)](https://www.mountainproject.com/route/106897735/kyhv-peak-7735)
  * **Technical Specs:** 23 Pitches · 5.11b · ~2,500 vertical feet. Widely recognized as one of the longest continuous bolted sport climbing routes in North America.
* **Stairway to Heaven (Provo Canyon, UT)**
  * **Mountain Project Route Record:** [Stairway to Heaven (MP #105879622)](https://www.mountainproject.com/route/105879622/stairway-to-heaven)
  * **Technical Specs:** Grade WI5 R · 10 Pitches · ~1,000 ft frozen waterfall cascade. The defining multi-pitch winter water ice testpiece in Utah.
* **Mjölnir / Thor’s Hammer (Norwegian Cirque, Index / Skykomish, WA)**
  * **Mountain Project Route Record:** [Mjölnir (MP #201747800)](https://www.mountainproject.com/route/201747800/mjolnir)
  * **Technical Specs:** 23 Pitches · 5.11c (5.11a A0) · 2,200+ vertical feet; 14 pitches $\ge 5.10$ on South Norwegian Buttress via Lake Serene.

#### 4.5 Global Thru-Hiking Baseline Registries (Comparative Benchmarks)
* **Pacific Crest Trail Association (PCTA):** Official trail length (2,650 mi / 4,265 km), vertical elevation gain (+128,000m), and pass telemetry. [pcta.org](https://www.pcta.org)
* **Appalachian Trail Conservancy (ATC):** Official trail length (2,190 mi / 3,524 km), cumulative elevation gain (+141,600m), and shelter network. [appalachiantrail.org](https://appalachiantrail.org)
* **Continental Divide Trail Coalition (CDTC):** Official trail distance (3,100 mi / 4,989 km), elevation profiles, and highpoint telemetry (Grays Peak 4,350m). [continentaldividetrail.org](https://continentaldividetrail.org)
* **National Park Service (Yosemite & Sequoia-Kings Canyon) & USFS (Inyo):** John Muir Trail official corridor specs (211 mi / 340 km, +14,300m gain, Mount Whitney 4,421m terminus). [nps.gov/yose](https://www.nps.gov/yose)
* **National Trust for Nature Conservation (NTNC / ACAP):** Annapurna Circuit classic corridor mapping (210 km, Thorong La Pass 5,416m). [ntnc.org.np](https://ntnc.org.np)
* **Te Araroa Trust:** New Zealand long-distance pathway (3,000 km, +85,000m gain, Stag Saddle 1,925m). [teararoa.org.nz](https://www.teararoa.org.nz)

#### 4.6 Contemporary Peer Expeditions, Staged Fastpack Series & The Official Hiker Registry
* **Himalayan Adventure Labs (HAL) & The Great Himalayan Series (2026–2028):**
  * **Lead / Co-Founder:** Sudeep Kandel (collaborating with Robin Boustead)
  * **Website & Dossier:** [Himalayan Adventure Labs — Great Himalayan Series](https://www.himalayanadventurelabs.com/2025/07/12/greathimalayanseries/)
  * **Expedition Model:** A multi-season, 6-stage commercial fastpack and trekking expedition series traversing Nepal east-to-west across 2026–2028. Operates via temporary seasonal basecamps combining select teahouses and wild camps:
    * *2026:* Eastern Giants (Kanchenjunga to Makalu Barun) and Autumn Everest Three Passes Fastpack (Renjo La, Cho La, Kongma La >5,000m).
    * *2027:* Gaurishankar, Langtang Lollipop (May 16–30), Ruby Valley scouting (Spring); Manaslu & Tsum Valley, Annapurna Naar & Phu (Autumn).
    * *2028:* Manang to Mustang over Teri La (5,595m), Dolpo & Shey Phoksundo into Mugu (Spring 2028); Rara National Park, Limi/Dozam valleys of Humla, Saipal Base Camp, and Api Nampa (Autumn 2028).
  * **Key Overlap with MedOnMt:** In Spring 2028, HAL's Teri La and Dolpo stages directly coincide chronologically and geospatially with Phase 4 & Phase 5 of MedOnMt's continuous High Route thru-hike.
* **The Official GHT Thru-Hiker Database (HAL & Robin Boustead):**
  * **Curators:** Himalayan Adventure Labs in partnership with Robin Boustead
  * **Website:** [GHT Thru Hiker Database](https://www.himalayanadventurelabs.com/great-himalaya-trail/ght-hiker-database/)
  * **Key Role:** The authoritative, verified historical archive of human-powered, border-to-border crossings of the Great Himalaya Trail in Nepal. Documents 133 confirmed 'Full Nepal GHT' completions to date (as of late 2026) alongside notable unsupported expeditions and logistical support packages.
* **Alpine Fuzzies (Kristy & Mike) — 2025 Continuous High Route Thru-Hike:**
  * **Traverse Period:** April 23, 2025 – August 25, 2025 (~125 days)
  * **Website & Trip Portal:** [Alpine Fuzzies — Great Himalaya Trail](https://alpinefuzzies.com/trips/great-himalaya-trail/)
  * **Route Geometry:** Kanchenjunga Base Camp to Hilsa (Humla), timed to enter the trans-Himalayan rain shadow (Mustang and Dolpo) during the monsoon onset.
  * **Digital Architecture & Innovation:** Exemplary live expedition tracking model featuring Garmin inReach satellite text dispatches (`/ght-msg-updates/`), Strava API rolling elevation charts (`/ght-map-updates/` using custom CSS/widgets), embedded CalTopo route plans, and an interactive supporter message portal (`/message/`).
  * **Logistical & Gear Partners:** Guided logistics and permits coordinated by Ang's Himalayan Adventures (Ang Sherpa); ultralight gear sponsorship by Hyperlite Mountain Gear (SouthWest 70L Dyneema packs and Ultamid 4 pyramid shelter).
* **Dave Brophy (Wilderness Prime) — 2019 Traverse & Planning Collective:**
  * **Expedition Archive:** [Wilderness Prime — Great Himalaya Trail](https://www.wildernessprime.com/expeditions/great-himalaya-trail/)
  * **Key Role:** Completed a documented continuous GHT traverse in 2019; coordinates the global GHT thru-hike planning community and WhatsApp coordination group, providing vital intelligence on changing trail conditions and local bridge washouts.

---

### 5. Permitting & Regulatory Architecture Matrix

| Zone / District | Legal Authority | Required Permit(s) | Statutory Fee / Conditions |
| :--- | :--- | :--- | :--- |
| **Kanchenjunga** | Dept. of Immigration / KCA | Kanchenjunga Restricted Permit | $20 USD/week; minimum 2 trekkers + licensed guide |
| **Makalu Barun** | Dept. of National Parks (DNPWC) | Makalu Barun NP Entry Permit | ~3,000 NPR; conservation entry |
| **Everest & Rolwaling** | DNPWC / Khumbu Pasang Lhamu | Sagarmatha NP + Gaurishankar CA | Khumbu local entrance fee + National Park permit |
| **Langtang & Helambu** | DNPWC | Langtang National Park Permit | ~3,000 NPR |
| **Manaslu & Tsum** | Dept. of Immigration | Manaslu RAP + Tsum RAP + MCAP | $100 USD/week (Sept-Nov); licensed guide mandatory |
| **Naar-Phu & Mustang** | Dept. of Immigration / ACAP | Upper Mustang RAP + Nar-Phu RAP | Mustang: $500 USD / 10 days; Nar-Phu: $100 USD/week |
| **Dolpo** | Dept. of Immigration / DNPWC | Upper Dolpo RAP + Shey Phoksundo | $500 USD / 10 days; liaison regulations |
| **Rara & Jumla** | DNPWC | Rara National Park Entry | ~3,000 NPR |
| **Humla & Far West** | Dept. of Immigration / ANCA | Simikot-Yari-Hilsa Border RAP | $50 USD / week; remote frontier corridor |

---

### 6. Formal Bibliographic Citations (BibTeX & APA)

#### BibTeX Format

```bibtex
@book{boustead2011ght,
  author    = {Robin Boustead},
  title     = {The Great Himalaya Trail: A Guide to the High Route of Nepal},
  publisher = {Trailblazer Publications},
  year      = {2011},
  address   = {Hindhead, Surrey, UK},
  isbn      = {978-1905864430}
}

@article{luks2024wms,
  author    = {Andrew M. Luks and Colin K. Grissom and Linda E. Keyes and Peter H. Hackett},
  title     = {Wilderness Medical Society Clinical Practice Guidelines for the Prevention and Treatment of Acute Altitude Illness: 2024 Update},
  journal   = {Wilderness \& Environmental Medicine},
  volume    = {35},
  number    = {2\_suppl},
  pages     = {22S--42S},
  year      = {2024},
  doi       = {10.1177/10806032241240000}
}

@misc{ghtofficial2026,
  author    = {{The Great Himalaya Trail}},
  title     = {Official Trail Information and High Route Topographic Surveys},
  year      = {2026},
  url       = {https://www.greathimalayatrail.com},
  note      = {Accessed Autumn 2026}
}

@misc{ntb2026regulations,
  author    = {{Nepal Tourism Board}},
  title     = {Trekking Regulations, TIMS Architecture, and Mandatory Guide Directives},
  year      = {2026},
  url       = {https://ntb.gov.np},
  note      = {Government of Nepal}
}

@misc{medonmt2026,
  author    = {Aadesh Neupane},
  title     = {MedOnMt: Contemplative Practice and High-Altitude Alpine Endurance},
  year      = {2026},
  url       = {https://medonmt.org},
  note      = {Salt Lake City / Kathmandu}
}

@misc{hal2026ghtseries,
  author    = {{Himalayan Adventure Labs} and Sudeep Kandel},
  title     = {Great Himalayan Series 2026–2028: Multi-Season Expedition Programme and GHT Support Architecture},
  year      = {2026},
  url       = {https://www.himalayanadventurelabs.com/2025/07/12/greathimalayanseries/},
  note      = {Accessed Autumn 2026}
}

@misc{ghtdatabase2026,
  author    = {Robin Boustead and {Himalayan Adventure Labs}},
  title     = {The Official Great Himalaya Trail Thru-Hiker Database (133 Verified Completions)},
  year      = {2026},
  url       = {https://www.himalayanadventurelabs.com/great-himalaya-trail/ght-hiker-database/},
  note      = {Verified Human-Powered Full Nepal GHT Crossings}
}

@misc{alpinefuzzies2025,
  author    = {Kristy and Mike},
  title     = {Great Himalaya Trail: The World's Highest Thru-Hike (April–August 2025 Continuous Traverse)},
  year      = {2025},
  url       = {https://alpinefuzzies.com/trips/great-himalaya-trail/},
  note      = {Traversing Nepal East-to-West, Kanchenjunga to Hilsa}
}
```

#### APA 7th Edition Format

1. **Boustead, R.** (2011). *The Great Himalaya Trail: A Guide to the High Route of Nepal*. Trailblazer Publications.
2. **Boustead, R., & Himalayan Adventure Labs.** (2026). *The Official Great Himalaya Trail Thru-Hiker Database*. https://www.himalayanadventurelabs.com/great-himalaya-trail/ght-hiker-database/
3. **Government of Nepal, Department of Immigration.** (2026). *Trekking in Restricted Areas: Statutory Schedules, Fees, and Liaison Requirements*. Ministry of Home Affairs. https://nepalimmigration.gov.np
4. **Himalayan Adventure Labs & Kandel, S.** (2026). *Great Himalayan Series 2026–2028: Multi-Season Expedition Programme*. https://www.himalayanadventurelabs.com/2025/07/12/greathimalayanseries/
5. **Kristy & Mike (Alpine Fuzzies).** (2025). *Great Himalaya Trail: Traversing the Nepal High Route*. Alpine Fuzzies. https://alpinefuzzies.com/trips/great-himalaya-trail/
6. **Luks, A. M., Grissom, C. K., Keyes, L. E., & Hackett, P. H.** (2024). Wilderness Medical Society clinical practice guidelines for the prevention and treatment of acute altitude illness: 2024 update. *Wilderness & Environmental Medicine*, 35(2_suppl), 22S–42S. https://doi.org/10.1177/10806032241240000
7. **Nepal Tourism Board.** (2026). *Sustainable Himalayan Trekking and Safety Protocols*. Ministry of Culture, Tourism and Civil Aviation. https://ntb.gov.np
8. **Neupane, A.** (2026). *MedOnMt: Contemplative Cognitive Resilience in Extreme Alpine Environments*. MedOnMt Press. https://medonmt.org
9. **Pandolf, K. B., Givoni, B., & Goldman, R. F.** (1977). Predicting energy expenditure with loads while standing or walking very slowly. *Journal of Applied Physiology*, 43(4), 577–581. https://doi.org/10.1152/jappl.1977.43.4.577
10. **The Great Himalaya Trail.** (2026). *The High Route Traverse: Topography, Waypoints, and Regional Sections*. https://www.greathimalayatrail.com

---
*Maintained under Open Geospatial & Educational Fair Use by MedOnMt.*
