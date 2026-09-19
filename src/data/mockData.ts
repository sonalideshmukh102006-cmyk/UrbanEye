export interface BusLocation {
  id: string;
  route: string;
  longitude: number;
  latitude: number;
  delay: number; // minutes delayed
}

export interface Incident {
  id: string;
  type: 'Pothole' | 'Crash' | 'MissingSign' | 'WaterLogging' | 'MissingZebraCrossing' | 'BrokenDivider' | 'FallenTree' | 'RoadCaveIn';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  longitude: number;
  latitude: number;
  description: string;
  locationName?: string;
  status?: string;
  assignee?: string | null;
  source?: string;
  time?: string;
  imageUrl?: string;
  croppedImageUrl?: string;
  verifyingBusId?: string;
  resolvedImageUrl?: string;
  resolvedByBusId?: string;
  signLanguage?: string;
  originalText?: string;
  englishTranslation?: string;
  cameraQualityIssue?: boolean;
  cameraQualityReason?: string;
  resolutionScore?: number;
}

// Centered around Pune (18.5204, 73.8567) as an example
export const MOCK_BUSES: BusLocation[] = [
  { id: 'BUS-101', route: 'Swargate - Katraj', longitude: 73.8567, latitude: 18.5204, delay: 0 },
  { id: 'BUS-102', route: 'Pune Station - Kothrud', longitude: 73.8600, latitude: 18.5150, delay: 5 },
  { id: 'BUS-103', route: 'Shivajinagar - Hadapsar', longitude: 73.8450, latitude: 18.5250, delay: 12 },
  { id: 'BUS-104', route: 'Deccan - Viman Nagar', longitude: 73.9100, latitude: 18.5600, delay: 2 },
  { id: 'BUS-105', route: 'Wakad - Hinjewadi', longitude: 73.7500, latitude: 18.5900, delay: 8 },
];

export const MOCK_INCIDENTS = [
  // --- POTHOLES ---
  {
    id: 'INC-001', type: 'Pothole', description: 'Deep pothole detected in right lane', locationName: 'FC Road', latitude: 18.5180, longitude: 73.8580, severity: 'Medium',
    imageUrl: 'https://www.holcim.co.uk/sites/uk/files/styles/media_xl/public/img/ss_pothole_cold.webp?h=45c45d6d&itok=uFNFiGs1',
    croppedImageUrl: 'https://www.omag.org/news/2024/1/1/potholes-how-they-form-and-how-they-can-be-prevented://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=300&q=80',
    status: 'Unverified', assignee: 'PWD Team Alpha', source: 'BUS-103 Cam', time: '1 hr ago'
  },
  {
    id: 'INC-004', type: 'Pothole', description: 'Series of small potholes', locationName: 'JM Road', latitude: 18.5150, longitude: 73.8500, severity: 'Low',
    imageUrl: 'https://media.drive.com.au/obj/tx_q:50,rs:auto:1920:1080:1/driveau/upload/cms/uploads/59d9763b-48b2-516f-ae5b-ee2922250000',
    croppedImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTMo526AlCdjirqk8KhIk3wVsNyTIdOPmqWOdXwM35fSEN252OGTcsg5w&s=10',
    status: 'Verified', assignee: null, source: 'BUS-103 Cam', time: '2 hrs ago',
    verifyingBusId: 'BUS-205'
  },
  {
    id: 'INC-006', type: 'Pothole', description: 'Large crater in middle of junction', locationName: 'Swargate Junction', latitude: 18.5000, longitude: 73.8600, severity: 'High',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRMa1yFW9zIfpfoCS-Og26qG8d_fxkPHvelS8Lll2Zou9pTzmDfmUo1AA&s=10',
    croppedImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgDd0zL7LYBjYFp2fl42M4UWK4W_Z3IUra-JeXf2O2D80Oi-NA2mPPQHvd&s=10',
    status: 'Resolved', assignee: 'Traffic Unit 4', source: 'BUS-103 Cam', time: '10 hrs ago',
    verifyingBusId: 'BUS-105 & BUS-201',
    resolvedImageUrl: 'https://thumbs.dreamstime.com/b/road-jungle-224466622.jpg',
    resolvedByBusId: 'BUS-108',
    resolutionScore: 94
  },

  // --- WATER LOGGING ---
  {
    id: 'INC-003', type: 'WaterLogging', description: 'Severe water logging blocking left lane', locationName: 'Pune Station Area', latitude: 18.5300, longitude: 73.8550, severity: 'Medium',
    imageUrl: 'https://images.indianexpress.com/2024/07/Pune-waterlogging-1600.jpg',
    croppedImageUrl: 'https://images.indianexpress.com/2024/07/Pune-waterlogging-1600.jpg',
    status: 'Verified', assignee: 'Drainage Dept', source: 'BUS-203 Cam', time: '2 hrs ago',
    verifyingBusId: 'BUS-110'
  },
  {
    id: 'INC-009', type: 'WaterLogging', description: 'Drain overflowing, moderate logging', locationName: 'Camp Area', latitude: 18.5150, longitude: 73.8750, severity: 'High',
    imageUrl: 'https://fastdrains.co.uk/wp-content/uploads/2023/05/Drain-Overflowing.jpg',
    croppedImageUrl: 'https://assets.thehansindia.com/h-upload/2025/06/16/1560047-dra.webp',
    status: 'Unverified', assignee: null, source: 'BUS-123 Cam', time: '30 mins ago'
  },

  // --- MISSING ZEBRA CROSSING ---
  {
    id: 'INC-011', type: 'MissingZebraCrossing', description: 'Faded zebra crossing at school zone', locationName: 'Law College Road', latitude: 18.5155, longitude: 73.8250, severity: 'Low',
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.uDWlJkLvfUfkAFWrYSONwQHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    croppedImageUrl: 'https://cdn.shopify.com/s/files/1/0658/4523/1849/files/HIVIS-Faded-Pedestrian-Crossing.jpg?v=1750745110',
    status: 'Resolved', assignee: 'Road Safety Unit', source: 'BUS-100 Cam', time: '5 hrs ago',
    verifyingBusId: 'BUS-109',
    resolvedImageUrl: 'https://tse4.mm.bing.net/th/id/OIP.QcLOOR22nB296H3ZivTlEAHaLE?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    resolvedByBusId: 'BUS-112',
    resolutionScore: 88
  },
  {
    id: 'INC-012', type: 'FallenTree', description: 'Massive tree fallen across both lanes blocking traffic completely', locationName: 'Ruby Hall Clinic Road', latitude: 18.5350, longitude: 73.8750, severity: 'Critical',
    imageUrl: 'https://wjla.com/resources/media2/16x9/2048/986/0x192/90/2c63a0ce-6951-4a0e-a22d-f98a206719d6-slackimgs.jpg',
    croppedImageUrl: 'https://wjla.com/resources/media2/16x9/2048/986/0x192/90/2c63a0ce-6951-4a0e-a22d-f98a206719d6-slackimgs.jpg',
    status: 'Resolved', assignee: 'Disaster Management', source: 'BUS-102 Cam', time: '10 mins ago',
    verifyingBusId: 'BUS-105',
    resolvedImageUrl: 'https://tse4.mm.bing.net/th/id/OIP.TMVf1shQ2pLSAA_FwiTS1AHaFW?r=0&w=1600&h=1157&rs=1&pid=ImgDetMain&o=7&rm=3',
    resolvedByBusId: 'BUS-108',
    resolutionScore: 98
  },

  // --- MISSING SIGN BOARD ---
  {
    id: 'INC-002', type: 'MissingSign', description: 'Stop sign missing at intersection', locationName: 'Senapati Bapat Road', latitude: 18.5250, longitude: 73.8600, severity: 'Medium',
    imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.u2uq3aMBBjvijwORL4PTowHaE7?r=0&w=2600&h=1733&rs=1&pid=ImgDetMain&o=7&rm=3',
    croppedImageUrl: 'https://tse1.mm.bing.net/th/id/OIP.u2uq3aMBBjvijwORL4PTowHaE7?r=0&w=2600&h=1733&rs=1&pid=ImgDetMain&o=7&rm=3',
    status: 'Verified', assignee: null, source: 'BUS-102 Cam', time: '45 mins ago',
    verifyingBusId: 'BUS-107'
  },
  {
    id: 'INC-013', type: 'MissingSign', description: 'Speed limit sign damaged', locationName: 'Koregaon Park', latitude: 18.5350, longitude: 73.8950, severity: 'Medium',
    imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.6AtMStWvUL1LAVcdxLA8VgHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    croppedImageUrl: 'https://thumbs.dreamstime.com/b/km-speed-limit-construction-site-sign-damaged-time-asphalt-km-speed-limit-construction-site-sign-damaged-time-asphalt-209808994.jpg?w=768',
    status: 'Detected Unverified', assignee: 'Maintenance Crew', source: 'BUS-113 Cam', time: '2 hrs ago'
  },
  {
    id: 'INC-016', type: 'MissingSign', description: 'Multilingual stop sign verification', locationName: 'ShivajiNagar', latitude: 63.7467, longitude: -68.5170, severity: 'Low',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4arldGTQ0ZUw3kQF23HTpKWsM45zr8CEAuRpV7dl-UUWbU4UYoDDB8Qo&s=10',
    croppedImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4arldGTQ0ZUw3kQF23HTpKWsM45zr8CEAuRpV7dl-UUWbU4UYoDDB8Qo&s=10',
    status: 'Unverified', assignee: null, source: 'BUS-105 Cam', time: '1 hr ago',
    signLanguage: 'Hindi',
    originalText: 'रुकिए',
    englishTranslation: 'STOP'
  },
  {
    id: 'INC-017', type: 'MissingSign', description: 'Unrecognized data due to poor camera quality', locationName: 'Kalyani Nagar Bridge', latitude: 18.5450, longitude: 73.9050, severity: 'Low',
    imageUrl: 'https://images.unsplash.com/photo-1517409240424-9b5ccbc6013a?auto=format&fit=crop&q=60&w=800',
    croppedImageUrl: 'https://images.unsplash.com/photo-1517409240424-9b5ccbc6013a?auto=format&fit=crop&q=60&w=300',
    status: 'Unverified', assignee: 'Manual Review Team', source: 'BUS-112 Cam', time: '10 mins ago',
    cameraQualityIssue: true,
    cameraQualityReason: 'Motion blur and low light conditions prevented AI confidence.'
  },

  // --- CRITICAL EMERGENCIES ---
  {
    id: 'INC-014', type: 'RoadCaveIn', description: 'Massive road cave-in (sinkhole) opening in center lane', locationName: 'Pune-Mumbai Highway', latitude: 18.5600, longitude: 73.8200, severity: 'Critical',
    imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.ZmLAb7kKUfDMq-4wKBHD6AHaEP?r=0&w=510&h=292&rs=1&pid=ImgDetMain&o=7&rm=3',
    croppedImageUrl: 'https://tse3.mm.bing.net/th/id/OIP.ZmLAb7kKUfDMq-4wKBHD6AHaEP?r=0&w=510&h=292&rs=1&pid=ImgDetMain&o=7&rm=3',
    status: 'Verified', assignee: null, source: 'BUS-205 Cam', time: 'Just now',
    verifyingBusId: 'BUS-201'
  },
  {
    id: 'INC-015', type: 'BrokenDivider', description: 'Metal barricades missing from median', locationName: 'Viman Nagar', latitude: 18.5650, longitude: 73.9100, severity: 'High',
    imageUrl: 'https://c8.alamy.com/comp/AA7J1E/crash-damage-to-a-safety-barrier-on-the-roadside-AA7J1E.jpg',
    croppedImageUrl: 'https://c8.alamy.com/comp/AA7J1E/crash-damage-to-a-safety-barrier-on-the-roadside-AA7J1E.jpg',
    status: 'Detected unverified', assignee: 'Traffic Unit 2', source: 'BUS-103 Cam', time: '3 hrs ago'
  },

  // --- VULNERABLE PEDESTRIANS ---
  {
    id: 'INC-018', type: 'VulnerablePedestrian', description: 'School children crossing outside of designated crosswalk during high traffic', locationName: 'Fergusson College Road', latitude: 18.5240, longitude: 73.8400, severity: 'Critical',
    imageUrl: 'https://media.istockphoto.com/id/1152655666/photo/school-children-cross-the-street-on-the-way-home.jpg?s=612x612&w=is&k=20&c=y9Bv-QQJdvJ6E1WIHy4JtrwCZ5tv9PjYajFwGK3S-ig=',
    croppedImageUrl: 'https://media.istockphoto.com/id/1152655666/photo/school-children-cross-the-street-on-the-way-home.jpg?s=612x612&w=is&k=20&c=y9Bv-QQJdvJ6E1WIHy4JtrwCZ5tv9PjYajFwGK3S-ig=',
    status: 'Unverified', assignee: 'Local Traffic Police', source: 'BUS-110 Cam', time: '2 mins ago'
  },
  {
    id: 'INC-019', type: 'VulnerablePedestrian', description: 'Elderly pedestrians struggling to cross wide intersection without signal', locationName: 'Kothrud Stand', latitude: 18.5020, longitude: 73.8150, severity: 'High',
    imageUrl: "/Gemini_Generated_Image_steuansteuansteu.png",
    croppedImageUrl: "/Gemini_Generated_Image_steuansteuansteu.png",
    status: 'Verified', assignee: 'Ward Marshal', source: 'BUS-203 Cam', time: '15 mins ago'
  }
];

export const MOCK_TRAFFIC_CORRIDORS = [
  { id: 'TC-1', name: 'MG Road Corridor', density: 85, status: 'High Congestion', delay: '12 min', lastUpdatedMinutesAgo: 5, sourceBus: 'BUS-102', coordinates: [[73.8767, 18.5104], [73.8750, 18.5125], [73.8720, 18.5150], [73.8680, 18.5175], [73.8640, 18.5200], [73.8600, 18.5220]], vehicleStats: { heavy: 24, fourWheeler: 145, twoWheeler: 210 } },
  { id: 'TC-2', name: 'FC Road', density: 60, status: 'Moderate', delay: '5 min', lastUpdatedMinutesAgo: 12, sourceBus: 'BUS-105', coordinates: [[73.8400, 18.5250], [73.8410, 18.5220], [73.8430, 18.5180], [73.8450, 18.5150], [73.8470, 18.5120], [73.8480, 18.5100]], vehicleStats: { heavy: 5, fourWheeler: 85, twoWheeler: 190 } },
  { id: 'TC-3', name: 'JM Road', density: 30, status: 'Clear', delay: '0 min', lastUpdatedMinutesAgo: 45, sourceBus: 'BUS-108', coordinates: [[73.8500, 18.5300], [73.8510, 18.5270], [73.8530, 18.5230], [73.8550, 18.5200], [73.8555, 18.5170], [73.8560, 18.5150]], vehicleStats: { heavy: 2, fourWheeler: 40, twoWheeler: 80 } },
  { id: 'TC-4', name: 'Swargate Junction', density: 95, status: 'Gridlock', delay: '25 min', lastUpdatedMinutesAgo: 2, sourceBus: 'BUS-201', coordinates: [[73.8585, 18.5010]], vehicleStats: { heavy: 45, fourWheeler: 210, twoWheeler: 350 }, bottleneckReason: 'Accident blocking two lanes and heavy water logging near the intersection.', proofImageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?auto=format&fit=crop&q=80&w=800' },
  { id: 'TC-5', name: 'Koregaon Park Road', density: 75, status: 'High Congestion', delay: '10 min', lastUpdatedMinutesAgo: 35, sourceBus: 'BUS-112', coordinates: [[73.8950, 18.5350]], vehicleStats: { heavy: 12, fourWheeler: 160, twoWheeler: 120 } },
  { id: 'TC-6', name: 'Viman Nagar Highway', density: 45, status: 'Moderate', delay: '2 min', lastUpdatedMinutesAgo: 8, sourceBus: 'BUS-110', coordinates: [[73.9160, 18.5620]], vehicleStats: { heavy: 30, fourWheeler: 110, twoWheeler: 85 } },
  { id: 'TC-7', name: 'Pune Station Road', density: 88, status: 'High Congestion', delay: '15 min', lastUpdatedMinutesAgo: 50, sourceBus: 'BUS-103', coordinates: [[73.8730, 18.5280]], vehicleStats: { heavy: 28, fourWheeler: 175, twoWheeler: 220 }, bottleneckReason: 'Unexpected road construction work taking up left lane.', proofImageUrl: '/public/Gemini_Generated_Image_acwufiacwufiacwu' },
  { id: 'TC-8', name: 'Kothrud Stand Road', density: 55, status: 'Moderate', delay: '4 min', lastUpdatedMinutesAgo: 15, sourceBus: 'BUS-115', coordinates: [[73.8100, 18.5050]], vehicleStats: { heavy: 8, fourWheeler: 90, twoWheeler: 150 } },
];

export const MOCK_VIOLATIONS = [
  { id: 'V-102', type: 'Wrong Way', bus: 'ANPR-Unregistered', vehicleNo: 'MH 14 XY 9876', location: 'FC Road', longitude: 73.8420, latitude: 18.5220, time: '14:21', severity: 'Low', status: 'Verified', confidenceScore: 94.7, imageUrl: 'https://en.pimg.jp/114/682/637/1/114682637.jpg', croppedImageUrl: 'https://en.pimg.jp/114/682/637/1/114682637.jpg', anprImageUrl: 'https://tse2.mm.bing.net/th/id/OIP.j9aU7Qf1D9O_R-vG1wE7_QHaEK?rs=1&pid=ImgDetMain' },
  { id: 'V-103', type: 'Hit and Run', bus: 'BUS-205', vehicleNo: 'MH 12 L 1934', location: 'MG Road Junction', longitude: 73.8760, latitude: 18.5130, time: '14:18', severity: 'Critical', status: 'Verified', confidenceScore: 89.5, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCy17wMVt-D51lrfJYqgZU7Mru74IRh3ll6irlw9Z8YA&s', croppedImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCy17wMVt-D51lrfJYqgZU7Mru74IRh3ll6irlw9Z8YA&s', anprImageUrl: 'https://tse2.mm.bing.net/th/id/OIP.j9aU7Qf1D9O_R-vG1wE7_QHaEK?rs=1&pid=ImgDetMain' },
  { id: 'V-107', type: 'Hit and Run', bus: 'Traffic Cam 2', vehicleNo: 'MH 12 QK 8822', location: 'Pune Station', longitude: 73.8730, latitude: 18.5280, time: '14:12', severity: 'Critical', status: 'Unverified', confidenceScore: 91.2, imageUrl: 'https://ewscripps.brightspotcdn.com/dims4/default/f028308/2147483647/strip/true/crop/4032x3024+0+0/resize/1280x960!/quality/90/?url=http:%2F%2Fewscripps-brightspot.s3.amazonaws.com%2Ffc%2F94%2F9cea0b3f4a8c8881396fded90763%2F82d-st-hit-and-run.jpeg', croppedImageUrl: 'https://ewscripps.brightspotcdn.com/dims4/default/f028308/2147483647/strip/true/crop/4032x3024+0+0/resize/1280x960!/quality/90/?url=http:%2F%2Fewscripps-brightspot.s3.amazonaws.com%2Ffc%2F94%2F9cea0b3f4a8c8881396fded90763%2F82d-st-hit-and-run.jpeg', anprImageUrl: 'https://tse2.mm.bing.net/th/id/OIP.j9aU7Qf1D9O_R-vG1wE7_QHaEK?rs=1&pid=ImgDetMain' },
  { id: 'V-108', type: 'Lane Violation', bus: 'BUS-108', vehicleNo: 'MH 14 RZ 1199', location: 'Swargate', longitude: 73.8585, latitude: 18.5010, time: '14:04', severity: 'High', status: 'Unverified', confidenceScore: 98.1, imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.BGDalyLzB05eC9CQCcjvLQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', croppedImageUrl: 'https://tse3.mm.bing.net/th/id/OIP.BGDalyLzB05eC9CQCcjvLQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', anprImageUrl: 'https://tse2.mm.bing.net/th/id/OIP.j9aU7Qf1D9O_R-vG1wE7_QHaEK?rs=1&pid=ImgDetMain' },
];

export const MOCK_ACTION_QUEUE = [
  { id: 'TKT-991', type: 'Critical Crash', source: 'BUS-103 Cam', status: 'Unverified', severity: 'Critical', time: 'Just now', imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?auto=format&fit=crop&q=80&w=800', croppedImageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?auto=format&fit=crop&q=80&w=300' },
  { id: 'TKT-992', type: 'Deep Pothole', source: 'Fleet AI', status: 'Assigned', assignee: 'PWD Team Alpha', severity: 'Medium', time: '1 hr ago', imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80', croppedImageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=300&q=80' },
  { id: 'TKT-993', type: 'Wrong Way Driver', source: 'ANPR System', status: 'Alerted', assignee: 'Traffic Unit 4', severity: 'High', time: '10 mins ago', imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800', croppedImageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=300' },
  { id: 'TKT-994', type: 'Missing Stop Sign', source: 'BUS-101 Cam', status: 'Resolved', severity: 'Low', time: '2 days ago', imageUrl: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&q=80&w=800', croppedImageUrl: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&q=80&w=300' },
];

export interface CrowdHotspot {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  density: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  count: number;
  lastUpdatedMinutesAgo?: number;
  sourceBus?: string;
}

export const MOCK_CROWD_HOTSPOTS: CrowdHotspot[] = [
  { id: 'CH-1', name: 'FC Road', longitude: 73.8420, latitude: 18.5220, density: 92, trend: 'increasing', count: 1245, lastUpdatedMinutesAgo: 10, sourceBus: 'BUS-105' },
  { id: 'CH-2', name: 'Swargate Bus Stand', longitude: 73.8585, latitude: 18.5010, density: 88, trend: 'stable', count: 980, lastUpdatedMinutesAgo: 2, sourceBus: 'BUS-201' },
  { id: 'CH-3', name: 'MG Road', longitude: 73.8760, latitude: 18.5130, density: 75, trend: 'decreasing', count: 540, lastUpdatedMinutesAgo: 50, sourceBus: 'BUS-102' },
  { id: 'CH-4', name: 'Pune Railway Station', longitude: 73.8730, latitude: 18.5280, density: 95, trend: 'increasing', count: 1820, lastUpdatedMinutesAgo: 15, sourceBus: 'BUS-103' },
  { id: 'CH-5', name: 'Phoenix Mall, Viman Nagar', longitude: 73.9160, latitude: 18.5620, density: 82, trend: 'increasing', count: 710, lastUpdatedMinutesAgo: 40, sourceBus: 'BUS-110' },
  { id: 'CH-6', name: 'JM Road Area', longitude: 73.8550, latitude: 18.5200, density: 65, trend: 'decreasing', count: 420, lastUpdatedMinutesAgo: 8, sourceBus: 'BUS-108' },
  { id: 'CH-7', name: 'Koregaon Park Plaza', longitude: 73.8950, latitude: 18.5350, density: 89, trend: 'increasing', count: 950, lastUpdatedMinutesAgo: 20, sourceBus: 'BUS-112' },
  { id: 'CH-8', name: 'Camp Area', longitude: 73.8750, latitude: 18.5150, density: 50, trend: 'stable', count: 300, lastUpdatedMinutesAgo: 5, sourceBus: 'BUS-202' },
  { id: 'CH-9', name: 'Kothrud Stand', longitude: 73.8100, latitude: 18.5050, density: 78, trend: 'increasing', count: 850, lastUpdatedMinutesAgo: 45, sourceBus: 'BUS-115' },
  { id: 'CH-10', name: 'Shivajinagar Station', longitude: 73.8450, latitude: 18.5300, density: 98, trend: 'stable', count: 2100, lastUpdatedMinutesAgo: 12, sourceBus: 'BUS-120' },
];

export interface ODFlow {
  id: string;
  origin: string;
  destination: string;
  volume: number;
  peakTime: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  primaryMode: 'Bus' | 'Private' | 'Mixed';
}

export const MOCK_OD_FLOWS: ODFlow[] = [
  { id: 'OD-1', origin: 'Kothrud Stand', destination: 'Shivajinagar Station', volume: 4500, peakTime: '08:00 AM - 10:00 AM', trend: 'increasing', primaryMode: 'Mixed' },
  { id: 'OD-2', origin: 'Swargate Junction', destination: 'Pune Station', volume: 3800, peakTime: '08:30 AM - 10:30 AM', trend: 'stable', primaryMode: 'Bus' },
  { id: 'OD-3', origin: 'Viman Nagar', destination: 'Koregaon Park', volume: 2900, peakTime: '09:00 AM - 11:00 AM', trend: 'increasing', primaryMode: 'Private' },
  { id: 'OD-4', origin: 'FC Road', destination: 'Camp Area', volume: 2100, peakTime: '05:00 PM - 07:00 PM', trend: 'decreasing', primaryMode: 'Mixed' },
  { id: 'OD-5', origin: 'Wakad', destination: 'Hinjewadi IT Park', volume: 5200, peakTime: '08:00 AM - 10:30 AM', trend: 'increasing', primaryMode: 'Private' },
];
