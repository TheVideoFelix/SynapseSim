from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json, os
from tm_simulator import load_tm, Tape

router = APIRouter()


tm = load_tm(os.path.join(os.path.dirname(__file__), "../core/tms/invert.TM"))


@router.websocket("/ws/tm")
async def websocket_tm_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            text_data = await websocket.receive_text()
            data = json.loads(text_data)
            print(data)

            message_type = data.get("type")
            message_data = data.get("data")

            if message_type == "init" and message_data is not None:
                tm.input(message_data.get("input").split(','))
                await websocket.send_json({
                    "tapes": [tape.get_tape_representation() for tape in tm.tapes],
                    "lastMoveDirs": ['N'] * len(tm.tapes)
                })
            elif message_type == "step":
                directions = None
                if not tm.state == tm.end_state:
                    directions = [direction.value if hasattr(direction, 'value') else str(direction) for direction in tm.step()]
                    print(directions)
                await websocket.send_json({
                    "tapes": [tape.get_tape_representation() for tape in tm.tapes],
                    "lastMoveDirs": directions
                })
            
    except WebSocketDisconnect:
        print("Client disconnected")
        tm.clear()
