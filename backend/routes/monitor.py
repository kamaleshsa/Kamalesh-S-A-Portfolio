from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import random
import json
from datetime import datetime

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                # Handle broken connections gracefully
                pass


manager = ConnectionManager()


async def system_stats_generator():
    """Generates simulated system statistics."""
    while True:
        # Simulate stats (replace with psutil in real prod if needed, but risky on some hosting)
        stats = {
            "type": "stats",
            "timestamp": datetime.now().isoformat(),
            "cpu": round(random.uniform(10, 40), 1),
            "memory": round(random.uniform(30, 60), 1),
            "requests_per_sec": random.randint(5, 50),
            "active_connections": len(manager.active_connections),
            "status": "healthy",
        }

        # Occasionally send a "log"
        if random.random() < 0.3:
            methods = ["GET", "POST", "PUT", "DELETE"]
            paths = ["/api/chat", "/api/projects", "/api/contact", "/api/auth"]
            status_codes = [200, 201, 200, 200, 200, 400, 500]

            log = {
                "type": "log",
                "id": str(random.randint(1000, 9999)),
                "method": random.choice(methods),
                "path": random.choice(paths),
                "status": random.choice(status_codes),
                "latency": f"{random.randint(10, 500)}ms",
            }
            await manager.broadcast(json.dumps(log))

        await manager.broadcast(json.dumps(stats))
        await asyncio.sleep(2)  # Update every 2 seconds


# Startup event moved to main.py lifespan


@router.websocket("/ws/system")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and listen for "commands" from frontend
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
            elif data == "status":
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "terminal_response",
                            "content": "All systems operational. AI Core: ONLINE. Database: CONNECTED.",
                        }
                    )
                )
            elif data.startswith("echo"):
                await websocket.send_text(
                    json.dumps(
                        {"type": "terminal_response", "content": f"Echo: {data[5:]}"}
                    )
                )
            else:
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "terminal_response",
                            "content": f"Unknown command: {data}",
                        }
                    )
                )

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)
