from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import asyncio
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("UrbanEyeServer")

app = FastAPI(title="UrbanEye Central Ingest Server", version="1.0.0")

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket client connected. Total clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket client disconnected. Total clients: {len(self.active_connections)}")

    async def broadcast(self, message: Dict[str, Any]):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error sending message to client: {e}")
                disconnected.append(connection)
        for conn in disconnected:
            self.disconnect(conn)

manager = ConnectionManager()

# Idempotency / Deduplication Registry (UUID -> timestamp)
PROCESSED_UUIDS: Dict[str, float] = {}
RECENT_EVENTS: List[Dict[str, Any]] = []

# Payload Models
class TelemetryEvent(BaseModel):
    uuid: str = Field(..., description="Unique event identifier generated at the edge")
    bus_id: str = Field(..., description="Bus identifier, e.g., BUS-101")
    event_type: str = Field(..., description="Pothole, WaterLogging, MissingSign, MissingZebraCrossing, ANPR_HitAndRun, VulnerablePedestrian, TrafficUpdate, BusLocationUpdate")
    severity: Optional[str] = Field("Medium", description="Critical, High, Medium, Low")
    latitude: float
    longitude: float
    timestamp: str
    location_name: Optional[str] = "Pune Central"
    description: Optional[str] = ""
    image_url: Optional[str] = None
    cropped_image_url: Optional[str] = None
    vehicle_no: Optional[str] = None
    confidence_score: Optional[float] = 0.95
    verifying_bus_id: Optional[str] = None
    speed_kmh: Optional[float] = 35.0
    density_percentage: Optional[int] = None
    raw_payload: Optional[Dict[str, Any]] = None

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "online",
        "service": "UrbanEye Central Ingest Server",
        "connected_clients": len(manager.active_connections),
        "total_events_ingested": len(RECENT_EVENTS)
    }

@app.get("/api/v1/telemetry/events")
def get_recent_events():
    return {"events": RECENT_EVENTS[-50:]}

@app.post("/api/v1/telemetry/events")
async def ingest_telemetry_event(event: TelemetryEvent):
    current_time = time.time()
    
    # Check for duplicate UUID (Idempotency / Deduplication)
    if event.uuid in PROCESSED_UUIDS:
        logger.warning(f"[DEDUPLICATED] Event UUID {event.uuid} already processed. Skipping duplicate payload.")
        return {
            "status": "ignored",
            "reason": "duplicate_uuid",
            "uuid": event.uuid,
            "timestamp": current_time
        }
    
    # Store in processed UUID registry
    PROCESSED_UUIDS[event.uuid] = current_time
    
    # Cleanup old UUIDs after 10 minutes
    for uuid_key, ts in list(PROCESSED_UUIDS.items()):
        if current_time - ts > 600:
            del PROCESSED_UUIDS[uuid_key]
            
    event_data = event.dict()
    RECENT_EVENTS.append(event_data)
    
    # Broadcast to all connected WebSockets
    await manager.broadcast({
        "type": "TELEMETRY_EVENT",
        "data": event_data
    })
    
    logger.info(f"[INGESTED] {event.event_type} from {event.bus_id} at ({event.latitude}, {event.longitude})")
    
    return {
        "status": "success",
        "uuid": event.uuid,
        "action": "ingested_and_broadcasted"
    }

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial welcome and state payload
        await websocket.send_json({
            "type": "CONNECTED",
            "message": "Connected to UrbanEye Live Central Server",
            "recent_events": RECENT_EVENTS[-10:]
        })
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            # Echo or process client ping
            if data == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
