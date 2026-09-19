import requests
import time
import random
import uuid
import datetime
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("EdgeSimulator")

SERVER_URL = "http://localhost:8000/api/v1/telemetry/events"

# Pune GPS Waypoints for Fleet Simulation
BUS_ROUTES = {
    "BUS-101": [
        {"name": "FC Road North", "lat": 18.5250, "lng": 73.8400},
        {"name": "FC Road Central", "lat": 18.5220, "lng": 73.8420},
        {"name": "Deccan Gymkhana", "lat": 18.5180, "lng": 73.8450},
        {"name": "Goodluck Chowk", "lat": 18.5150, "lng": 73.8470}
    ],
    "BUS-102": [
        {"name": "MG Road Corner", "lat": 18.5104, "lng": 73.8767},
        {"name": "Camp Cantonment", "lat": 18.5125, "lng": 73.8750},
        {"name": "East Street", "lat": 18.5150, "lng": 73.8720},
        {"name": "Pulgate Bus Stop", "lat": 18.5175, "lng": 73.8680}
    ],
    "BUS-103": [
        {"name": "Swargate Bus Stand", "lat": 18.5010, "lng": 73.8585},
        {"name": "Laxmi Road", "lat": 18.5130, "lng": 73.8550},
        {"name": "Shaniwar Wada", "lat": 18.5195, "lng": 73.8553},
        {"name": "Shivajinagar Station", "lat": 18.5300, "lng": 73.8450}
    ],
    "BUS-104": [
        {"name": "Koregaon Park North", "lat": 18.5380, "lng": 73.8920},
        {"name": "Bund Garden Road", "lat": 18.5320, "lng": 73.8810},
        {"name": "Pune Railway Station", "lat": 18.5280, "lng": 73.8730},
        {"name": "Ruby Hall Clinic", "lat": 18.5350, "lng": 73.8750}
    ],
    "BUS-105": [
        {"name": "Viman Nagar Highway", "lat": 18.5620, "lng": 73.9160},
        {"name": "Phoenix Mall Stop", "lat": 18.5600, "lng": 73.9110},
        {"name": "Kalyani Nagar Bridge", "lat": 18.5450, "lng": 73.9050},
        {"name": "Yerwada Chowk", "lat": 18.5520, "lng": 73.8890}
    ]
}

DEFECT_TYPES = [
    {
        "type": "Pothole",
        "severity": "High",
        "description": "Deep 15cm pothole detected in right lane",
        "imageUrl": "https://www.holcim.co.uk/sites/uk/files/styles/media_xl/public/img/ss_pothole_cold.webp?h=45c45d6d&itok=uFNFiGs1",
        "croppedImageUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=300&q=80"
    },
    {
        "type": "WaterLogging",
        "severity": "Medium",
        "description": "Drain overflow causing 10cm water logging",
        "imageUrl": "https://images.indianexpress.com/2024/07/Pune-waterlogging-1600.jpg",
        "croppedImageUrl": "https://images.indianexpress.com/2024/07/Pune-waterlogging-1600.jpg"
    },
    {
        "type": "MissingSign",
        "severity": "Medium",
        "description": "Damaged or missing speed limit signboard",
        "imageUrl": "https://tse1.mm.bing.net/th/id/OIP.u2uq3aMBBjvijwORL4PTowHaE7?r=0&w=2600&h=1733&rs=1&pid=ImgDetMain&o=7&rm=3",
        "croppedImageUrl": "https://tse1.mm.bing.net/th/id/OIP.u2uq3aMBBjvijwORL4PTowHaE7?r=0&w=2600&h=1733&rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
        "type": "MissingZebraCrossing",
        "severity": "Low",
        "description": "Severely faded zebra crossing lines near school zone",
        "imageUrl": "https://tse4.mm.bing.net/th/id/OIP.uDWlJkLvfUfkAFWrYSONwQHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        "croppedImageUrl": "https://cdn.shopify.com/s/files/1/0658/4523/1849/files/HIVIS-Faded-Pedestrian-Crossing.jpg?v=1750745110"
    },
    {
        "type": "ANPR_HitAndRun",
        "severity": "Critical",
        "description": "ANPR Camera flagged rash driving & hit-and-run incident",
        "imageUrl": "https://en.pimg.jp/114/682/637/1/114682637.jpg",
        "croppedImageUrl": "https://en.pimg.jp/114/682/637/1/114682637.jpg",
        "vehicleNo": "MH 12 L 8829"
    },
    {
        "type": "VulnerablePedestrian",
        "severity": "Critical",
        "description": "School children detected crossing road outside signal zone",
        "imageUrl": "https://images.unsplash.com/photo-1576722003889-1833d7b97374?auto=format&fit=crop&q=60&w=800",
        "croppedImageUrl": "https://images.unsplash.com/photo-1576722003889-1833d7b97374?auto=format&fit=crop&q=60&w=300"
    }
]

def send_event_to_central(event_payload):
    try:
        res = requests.post(SERVER_URL, json=event_payload, timeout=3)
        if res.status_code == 200:
            data = res.json()
            if data.get("status") == "ignored":
                logger.warning(f"Central Server [IDEMPOTENT / DUP]: {data.get('reason')} for UUID {data.get('uuid')}")
            else:
                logger.info(f"Central Server [ACCEPTED]: {event_payload['event_type']} from {event_payload['bus_id']}")
            return True
        else:
            logger.error(f"Central Server Error HTTP {res.status_code}: {res.text}")
            return False
    except Exception as e:
        logger.error(f"Network Connection Failed (Offline Mode / Dead Zone): {e}")
        return False

def run_edge_simulation():
    logger.info("Starting UrbanEye Edge Hardware Simulator (Raspberry Pi 5 + ESP32)...")
    logger.info(f"Target Central Server: {SERVER_URL}")
    
    # State tracking
    bus_route_indices = {bus_id: 0 for bus_id in BUS_ROUTES}
    offline_buffer = []
    cycle_counter = 0

    while True:
        cycle_counter += 1
        is_dead_zone_active = (cycle_counter >= 8 and cycle_counter <= 10)
        
        if is_dead_zone_active:
            logger.warning("!!! SIMULATING 4G NETWORK DEAD ZONE FOR BUS-103 (Tunnel Mode) !!!")

        for bus_id, waypoints in BUS_ROUTES.items():
            idx = bus_route_indices[bus_id]
            wp = waypoints[idx]
            
            # Add small random jitter to emulate GPS motion
            lat = wp["lat"] + random.uniform(-0.0005, 0.0005)
            lng = wp["lng"] + random.uniform(-0.0005, 0.0005)
            
            # Advance route index
            bus_route_indices[bus_id] = (idx + 1) % len(waypoints)
            
            now_iso = datetime.datetime.now().isoformat()
            
            # 1. Bus Location Update Telemetry
            loc_event = {
                "uuid": str(uuid.uuid4()),
                "bus_id": bus_id,
                "event_type": "BusLocationUpdate",
                "severity": "Low",
                "latitude": round(lat, 5),
                "longitude": round(lng, 5),
                "timestamp": now_iso,
                "location_name": wp["name"],
                "speed_kmh": round(random.uniform(20.0, 45.0), 1),
                "verifying_bus_id": bus_id
            }
            
            if bus_id == "BUS-103" and is_dead_zone_active:
                logger.info(f"[EDGE SQLITE BUFFER] Bus BUS-103 buffered location event offline ({wp['name']})")
                offline_buffer.append(loc_event)
            else:
                send_event_to_central(loc_event)

            # 2. Random Edge Defect Detection (20% chance per cycle)
            if random.random() < 0.25:
                defect = random.choice(DEFECT_TYPES)
                event_uuid = str(uuid.uuid4())
                
                defect_event = {
                    "uuid": event_uuid,
                    "bus_id": bus_id,
                    "event_type": defect["type"],
                    "severity": defect["severity"],
                    "latitude": round(lat, 5),
                    "longitude": round(lng, 5),
                    "timestamp": now_iso,
                    "location_name": wp["name"],
                    "description": defect["description"],
                    "image_url": defect.get("imageUrl"),
                    "cropped_image_url": defect.get("croppedImageUrl"),
                    "vehicle_no": defect.get("vehicleNo"),
                    "confidence_score": round(random.uniform(0.88, 0.99), 2),
                    "verifying_bus_id": bus_id
                }
                
                if bus_id == "BUS-103" and is_dead_zone_active:
                    logger.info(f"[EDGE SQLITE BUFFER] Bus BUS-103 buffered DEFECT alert offline: {defect['type']}")
                    offline_buffer.append(defect_event)
                else:
                    send_event_to_central(defect_event)

        # Handle exiting dead zone (Flush buffer + retry duplicate UUID flush to test idempotency)
        if cycle_counter == 11 and offline_buffer:
            logger.info(f"=== NETWORK RESTORED! FLUSHING {len(offline_buffer)} BUFFERED EVENTS FROM BUS-103 ===")
            for b_event in offline_buffer:
                send_event_to_central(b_event)
            
            # Send one duplicate payload intentionally to demonstrate deduplication
            if offline_buffer:
                logger.info("=== RETRYING DUPLICATE UUID PAYLOAD TO TEST CENTRAL IDEMPOTENCY ===")
                send_event_to_central(offline_buffer[0])
                
            offline_buffer.clear()
            cycle_counter = 0

        time.sleep(3)

if __name__ == "__main__":
    run_edge_simulation()
