import json
import math
import random

# Read sections and waypoints to extract anchored nodes
with open('data/ght-sections.json', 'r') as f:
    sections = json.load(f)

with open('data/ght-waypoints.json', 'r') as f:
    waypoints = json.load(f)

# Master anchor coordinates across the 10 sections from East (Kanchenjunga) to West (Hilsa/Humla)
section_anchors = {
    1: [
        {"name": "Taplejung / Suketar", "lat": 27.353, "lng": 87.669, "ele": 2420},
        {"name": "Mitlung", "lat": 27.420, "lng": 87.701, "ele": 921},
        {"name": "Chirwa", "lat": 27.495, "lng": 87.753, "ele": 1270},
        {"name": "Sekathum", "lat": 27.545, "lng": 87.801, "ele": 1660},
        {"name": "Amjilosa", "lat": 27.585, "lng": 87.852, "ele": 2510},
        {"name": "Gyabla", "lat": 27.625, "lng": 87.876, "ele": 2730},
        {"name": "Ghunsa", "lat": 27.662, "lng": 87.935, "ele": 3595},
        {"name": "Kambachen", "lat": 27.721, "lng": 87.994, "ele": 4050},
        {"name": "Lhonak", "lat": 27.778, "lng": 88.026, "ele": 4780},
        {"name": "Pangpema (North BC)", "lat": 27.798, "lng": 88.086, "ele": 5143},
        {"name": "Lhonak return", "lat": 27.778, "lng": 88.026, "ele": 4780},
        {"name": "Nango La", "lat": 27.695, "lng": 87.886, "ele": 4776},
        {"name": "Olangchung Gola", "lat": 27.689, "lng": 87.794, "ele": 3191},
        {"name": "Lumbha Sambha Phedi", "lat": 27.712, "lng": 87.682, "ele": 4220},
        {"name": "Lumbha Sambha Pass", "lat": 27.742, "lng": 87.568, "ele": 5159},
        {"name": "Thudam", "lat": 27.752, "lng": 87.452, "ele": 3556},
        {"name": "Chyamtang", "lat": 27.674, "lng": 87.382, "ele": 2229}
    ],
    2: [
        {"name": "Chyamtang", "lat": 27.674, "lng": 87.382, "ele": 2229},
        {"name": "Hongon", "lat": 27.712, "lng": 87.342, "ele": 2323},
        {"name": "Bakim Kharka", "lat": 27.734, "lng": 87.295, "ele": 3020},
        {"name": "Molun Pokhari", "lat": 27.758, "lng": 87.262, "ele": 3954},
        {"name": "Dhave Kharka", "lat": 27.765, "lng": 87.228, "ele": 3590},
        {"name": "Yangri Kharka", "lat": 27.728, "lng": 87.185, "ele": 3557},
        {"name": "Langmale Kharka", "lat": 27.762, "lng": 87.162, "ele": 4410},
        {"name": "Makalu Base Camp", "lat": 27.798, "lng": 87.148, "ele": 4870},
        {"name": "Sandy Camp", "lat": 27.802, "lng": 87.126, "ele": 5250},
        {"name": "Sherpani Col", "lat": 27.795, "lng": 87.112, "ele": 6150},
        {"name": "West Col", "lat": 27.791, "lng": 87.054, "ele": 6190},
        {"name": "Baruntse BC", "lat": 27.812, "lng": 87.012, "ele": 5400},
        {"name": "Honku Basin", "lat": 27.842, "lng": 86.962, "ele": 5450},
        {"name": "Amphu Labsta BC", "lat": 27.865, "lng": 86.932, "ele": 5500}
    ],
    3: [
        {"name": "Amphu Labsta", "lat": 27.876, "lng": 86.912, "ele": 5845},
        {"name": "Chhukung", "lat": 27.904, "lng": 86.872, "ele": 4730},
        {"name": "Lobuche", "lat": 27.948, "lng": 86.812, "ele": 4940},
        {"name": "Gorak Shep", "lat": 27.981, "lng": 86.828, "ele": 5164},
        {"name": "Everest Base Camp", "lat": 28.004, "lng": 86.852, "ele": 5364},
        {"name": "Dzongla", "lat": 27.945, "lng": 86.772, "ele": 4830},
        {"name": "Cho La Pass", "lat": 27.935, "lng": 86.789, "ele": 5420},
        {"name": "Gokyo Lakes", "lat": 27.954, "lng": 86.695, "ele": 4790},
        {"name": "Renjo La", "lat": 27.952, "lng": 86.654, "ele": 5360},
        {"name": "Lungden", "lat": 27.912, "lng": 86.621, "ele": 4380},
        {"name": "Thame", "lat": 27.834, "lng": 86.648, "ele": 3820},
        {"name": "Tashi Laptsa High Camp", "lat": 27.845, "lng": 86.612, "ele": 5100},
        {"name": "Tashi Laptsa Pass", "lat": 27.854, "lng": 86.586, "ele": 5755},
        {"name": "Drolambau Glacier", "lat": 27.862, "lng": 86.528, "ele": 4900},
        {"name": "Na (Rolwaling)", "lat": 27.871, "lng": 86.448, "ele": 4180},
        {"name": "Beding", "lat": 27.882, "lng": 86.378, "ele": 3740},
        {"name": "Simigaon", "lat": 27.845, "lng": 86.234, "ele": 2020},
        {"name": "Jagat", "lat": 27.818, "lng": 86.172, "ele": 1440}
    ],
    4: [
        {"name": "Syabrubesi", "lat": 28.161, "lng": 85.335, "ele": 1503},
        {"name": "Lama Hotel", "lat": 28.188, "lng": 85.421, "ele": 2480},
        {"name": "Langtang Village", "lat": 28.214, "lng": 85.502, "ele": 3430},
        {"name": "Kyanjin Gompa", "lat": 28.212, "lng": 85.568, "ele": 3870},
        {"name": "Langshisha Kharka", "lat": 28.225, "lng": 85.672, "ele": 4080},
        {"name": "Tilman Pass", "lat": 28.214, "lng": 85.642, "ele": 5308},
        {"name": "Tin Pokhari", "lat": 28.178, "lng": 85.675, "ele": 4200},
        {"name": "Panch Pokhari", "lat": 28.042, "lng": 85.714, "ele": 4060},
        {"name": "Tarke Ghyang", "lat": 27.994, "lng": 85.562, "ele": 2600},
        {"name": "Melamchi Gaon", "lat": 28.031, "lng": 85.508, "ele": 2530},
        {"name": "Tharepati", "lat": 28.058, "lng": 85.474, "ele": 3690},
        {"name": "Laurebina La", "lat": 28.075, "lng": 85.428, "ele": 4610},
        {"name": "Gosainkunda", "lat": 28.082, "lng": 85.412, "ele": 4380},
        {"name": "Dhunche", "lat": 28.112, "lng": 85.302, "ele": 1960}
    ],
    5: [
        {"name": "Syabrubesi", "lat": 28.161, "lng": 85.335, "ele": 1503},
        {"name": "Gatlang", "lat": 28.148, "lng": 85.258, "ele": 2238},
        {"name": "Somdang", "lat": 28.182, "lng": 85.201, "ele": 3271},
        {"name": "Pangsang Pass", "lat": 28.204, "lng": 85.162, "ele": 3830},
        {"name": "Tipling", "lat": 28.221, "lng": 85.112, "ele": 2078},
        {"name": "Kashigaon", "lat": 28.235, "lng": 84.992, "ele": 1780},
        {"name": "Jagat (Manaslu)", "lat": 28.362, "lng": 84.901, "ele": 1410},
        {"name": "Deng", "lat": 28.438, "lng": 84.845, "ele": 1804},
        {"name": "Namrung", "lat": 28.532, "lng": 84.778, "ele": 2660},
        {"name": "Lho", "lat": 28.562, "lng": 84.721, "ele": 3180},
        {"name": "Samagaon", "lat": 28.588, "lng": 84.638, "ele": 3530},
        {"name": "Manaslu BC", "lat": 28.582, "lng": 84.673, "ele": 4400},
        {"name": "Samdo", "lat": 28.648, "lng": 84.642, "ele": 3860},
        {"name": "Dharamsala", "lat": 28.654, "lng": 84.618, "ele": 4460},
        {"name": "Larkya La", "lat": 28.636, "lng": 84.622, "ele": 5106},
        {"name": "Bimthang", "lat": 28.638, "lng": 84.472, "ele": 3720},
        {"name": "Tilije", "lat": 28.542, "lng": 84.421, "ele": 2300},
        {"name": "Dharapani", "lat": 28.514, "lng": 84.382, "ele": 1860}
    ],
    6: [
        {"name": "Dharapani", "lat": 28.514, "lng": 84.382, "ele": 1860},
        {"name": "Koto", "lat": 28.535, "lng": 84.288, "ele": 2600},
        {"name": "Meta", "lat": 28.652, "lng": 84.262, "ele": 3560},
        {"name": "Chyako", "lat": 28.712, "lng": 84.271, "ele": 3720},
        {"name": "Kyang", "lat": 28.752, "lng": 84.282, "ele": 3820},
        {"name": "Phu Village", "lat": 28.784, "lng": 84.276, "ele": 4080},
        {"name": "Naar Phedi", "lat": 28.735, "lng": 84.218, "ele": 3490},
        {"name": "Naar Village", "lat": 28.682, "lng": 84.185, "ele": 4110},
        {"name": "Kang La", "lat": 28.718, "lng": 84.152, "ele": 5320},
        {"name": "Ngawal", "lat": 28.662, "lng": 84.095, "ele": 3660},
        {"name": "Manang", "lat": 28.665, "lng": 84.021, "ele": 3540},
        {"name": "Yak Kharka", "lat": 28.728, "lng": 83.985, "ele": 4050},
        {"name": "Thorong Phedi", "lat": 28.775, "lng": 83.955, "ele": 4540},
        {"name": "Thorong La", "lat": 28.793, "lng": 83.935, "ele": 5416},
        {"name": "Muktinath", "lat": 28.818, "lng": 83.871, "ele": 3800},
        {"name": "Kagbeni", "lat": 28.835, "lng": 83.784, "ele": 2810},
        {"name": "Jomsom", "lat": 28.782, "lng": 83.731, "ele": 2720}
    ],
    7: [
        {"name": "Naar", "lat": 28.682, "lng": 84.185, "ele": 4110},
        {"name": "Teri La High Camp", "lat": 28.812, "lng": 84.212, "ele": 4850},
        {"name": "Teri La", "lat": 28.874, "lng": 84.238, "ele": 5595},
        {"name": "Labse Kharka", "lat": 28.935, "lng": 84.182, "ele": 4020},
        {"name": "Tangge", "lat": 28.988, "lng": 83.995, "ele": 3240},
        {"name": "Chhusang", "lat": 28.922, "lng": 83.821, "ele": 2980},
        {"name": "Chele", "lat": 28.951, "lng": 83.805, "ele": 3050},
        {"name": "Samar", "lat": 28.995, "lng": 83.812, "ele": 3620},
        {"name": "Ghami", "lat": 29.085, "lng": 83.868, "ele": 3510},
        {"name": "Tsarang", "lat": 29.135, "lng": 83.921, "ele": 3560},
        {"name": "Lo Manthang", "lat": 29.182, "lng": 83.957, "ele": 3840},
        {"name": "Chhoser Caves", "lat": 29.232, "lng": 83.978, "ele": 3920},
        {"name": "Dhakmar", "lat": 29.112, "lng": 83.832, "ele": 3820},
        {"name": "Syangboche", "lat": 29.018, "lng": 83.792, "ele": 3800},
        {"name": "Kagbeni", "lat": 28.835, "lng": 83.784, "ele": 2810}
    ],
    8: [
        {"name": "Kagbeni", "lat": 28.835, "lng": 83.784, "ele": 2810},
        {"name": "Sangda Phedi", "lat": 28.868, "lng": 83.621, "ele": 4190},
        {"name": "Sangda La High Camp", "lat": 28.892, "lng": 83.562, "ele": 5035},
        {"name": "Sangda La", "lat": 28.912, "lng": 83.514, "ele": 5515},
        {"name": "Chharka Bhot", "lat": 28.956, "lng": 83.421, "ele": 4302},
        {"name": "Norbulung", "lat": 28.985, "lng": 83.332, "ele": 4750},
        {"name": "Niwas La", "lat": 29.012, "lng": 83.254, "ele": 5120},
        {"name": "Molasumdo", "lat": 29.038, "lng": 83.208, "ele": 4820},
        {"name": "Chan La", "lat": 29.062, "lng": 83.162, "ele": 5378},
        {"name": "Dho Tarap", "lat": 29.088, "lng": 83.092, "ele": 3944},
        {"name": "Numa La Base Camp", "lat": 29.122, "lng": 83.042, "ele": 4440},
        {"name": "Numa La", "lat": 29.145, "lng": 83.008, "ele": 5310},
        {"name": "Pelung Tang", "lat": 29.162, "lng": 82.982, "ele": 4465},
        {"name": "Baga La", "lat": 29.182, "lng": 82.965, "ele": 5190},
        {"name": "Dajok Tang", "lat": 29.195, "lng": 82.952, "ele": 4080},
        {"name": "Ringmo / Phoksundo", "lat": 29.206, "lng": 82.946, "ele": 3611},
        {"name": "Sehu La High Camp", "lat": 29.278, "lng": 82.924, "ele": 4710},
        {"name": "Kang La (Dolpo)", "lat": 29.312, "lng": 82.912, "ele": 5350},
        {"name": "Shey Gompa", "lat": 29.356, "lng": 82.918, "ele": 4160},
        {"name": "Saldang", "lat": 29.418, "lng": 82.982, "ele": 3770},
        {"name": "Ringmo return", "lat": 29.206, "lng": 82.946, "ele": 3611}
    ],
    9: [
        {"name": "Ringmo / Phoksundo", "lat": 29.206, "lng": 82.946, "ele": 3611},
        {"name": "Kagmara Phedi", "lat": 29.155, "lng": 82.682, "ele": 4000},
        {"name": "Kagmara La", "lat": 29.112, "lng": 82.521, "ele": 5115},
        {"name": "Lasa", "lat": 29.124, "lng": 82.448, "ele": 3950},
        {"name": "Kaigaon", "lat": 29.142, "lng": 82.362, "ele": 2610},
        {"name": "Chaurikot", "lat": 29.178, "lng": 82.312, "ele": 3060},
        {"name": "Mauria Lagna", "lat": 29.212, "lng": 82.268, "ele": 3820},
        {"name": "Gothichaur", "lat": 29.245, "lng": 82.221, "ele": 2820},
        {"name": "Jumla", "lat": 29.274, "lng": 82.184, "ele": 2514},
        {"name": "Danphe Lagna", "lat": 29.352, "lng": 82.162, "ele": 3691},
        {"name": "Chere Chaur", "lat": 29.421, "lng": 82.124, "ele": 3055},
        {"name": "Rara Lake", "lat": 29.533, "lng": 82.083, "ele": 2990},
        {"name": "Murma Top", "lat": 29.552, "lng": 82.048, "ele": 3630},
        {"name": "Gamgadhi", "lat": 29.568, "lng": 82.012, "ele": 2089}
    ],
    10: [
        {"name": "Gamgadhi", "lat": 29.568, "lng": 82.012, "ele": 2089},
        {"name": "Bam", "lat": 29.624, "lng": 81.954, "ele": 2700},
        {"name": "Changkheli La", "lat": 29.678, "lng": 81.912, "ele": 3594},
        {"name": "Darma", "lat": 29.721, "lng": 81.868, "ele": 2200},
        {"name": "Piplan", "lat": 29.765, "lng": 81.828, "ele": 1700},
        {"name": "Punakha", "lat": 29.845, "lng": 81.812, "ele": 2100},
        {"name": "Simikot", "lat": 29.971, "lng": 81.828, "ele": 2950},
        {"name": "Dharapuri", "lat": 30.012, "lng": 81.792, "ele": 2300},
        {"name": "Kermi", "lat": 30.052, "lng": 81.758, "ele": 2670},
        {"name": "Yalbang", "lat": 30.095, "lng": 81.721, "ele": 3020},
        {"name": "Muchu", "lat": 30.124, "lng": 81.682, "ele": 3120},
        {"name": "Yangar", "lat": 30.138, "lng": 81.662, "ele": 3270},
        {"name": "Sipsip", "lat": 30.148, "lng": 81.648, "ele": 4320},
        {"name": "Nara La", "lat": 30.158, "lng": 81.632, "ele": 4580},
        {"name": "Hilsa (Tibet Border)", "lat": 30.165, "lng": 81.595, "ele": 3720}
    ]
}

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0 # km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

full_route = []
cum_dist = 0.0

random.seed(42)

for sec_id in sorted(section_anchors.keys()):
    anchors = section_anchors[sec_id]
    sec_name = [s['name'] for s in sections if s['id'] == sec_id][0]

    for i in range(len(anchors) - 1):
        p1 = anchors[i]
        p2 = anchors[i + 1]

        leg_dist = haversine(p1['lat'], p1['lng'], p2['lat'], p2['lng'])
        # Determine number of interpolated steps (approx every 1.5 to 2.5 km)
        steps = max(3, int(round(leg_dist / 2.0)))

        for s in range(steps if i < len(anchors) - 2 else steps + 1):
            t = s / float(steps)

            # Cosine interpolation for natural mountain grade
            t_smooth = (1 - math.cos(t * math.pi)) / 2.0

            # Slight meandering/terrain jitter to simulate realistic Himalayan trail switchbacks
            jitter_factor = math.sin(t * math.pi) * 0.003
            jitter_lat = (random.random() - 0.5) * jitter_factor
            jitter_lng = (random.random() - 0.5) * jitter_factor

            lat = p1['lat'] + (p2['lat'] - p1['lat']) * t + jitter_lat
            lng = p1['lng'] + (p2['lng'] - p1['lng']) * t + jitter_lng

            # Elevation interpolation with realistic ridge/valley noise
            ele_base = p1['ele'] + (p2['ele'] - p1['ele']) * t_smooth
            ele_noise = math.sin(t * math.pi * 3) * 35.0
            ele = round(ele_base + ele_noise)

            # Name designation
            pt_name = ""
            if s == 0:
                pt_name = p1['name']
            elif s == steps and i == len(anchors) - 2:
                pt_name = p2['name']

            # Calculate distance increment
            if len(full_route) > 0:
                prev = full_route[-1]
                inc = haversine(prev['lat'], prev['lng'], lat, lng)
                cum_dist += inc

            full_route.append({
                "lat": round(lat, 5),
                "lng": round(lng, 5),
                "ele": int(ele),
                "distKm": round(cum_dist, 1),
                "secId": sec_id,
                "secName": sec_name,
                "name": pt_name
            })

with open('data/ght-high-route.json', 'w') as f:
    json.dump(full_route, f, indent=2)

print(f"Generated {len(full_route)} trackpoints across 10 sections, total distance {cum_dist:.1f} km")
