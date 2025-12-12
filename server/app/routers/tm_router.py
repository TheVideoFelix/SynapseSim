from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json, os
from tm_simulator import load_tm
from app.services.tm_service import TMService

router = APIRouter()

@router.get('/tm')
def get_tems():
    return { "tms": TMService.get_loaded_tms()}

@router.websocket('/ws/tm/{tm_name}')
async def websocket_tm_endpoint(websocket: WebSocket, tm_name: str):
    await websocket.accept()
    tm = TMService.get_tm_session(tm_name)
    print(tm)

    if not tm:
        await websocket.send_json({ "error": "TM not found"})
        await websocket.close()
        return
    try:
        while True:
            text_data = await websocket.receive_text()
            data = json.loads(text_data)

            message_type = data.get("type")
            message_data = data.get("data")

            if message_type == "init" and message_data:
                input_str = message_data.get("input", "")
                print(input_str)
                tm.input(input_str.split(','))
                response = TMService.format_init_response(tm)
                await websocket.send_json(response)
            elif message_type == "step":
                response = TMService.process_step(tm)
                await websocket.send_json(response)

    except WebSocketDisconnect:
        print(f'Client discconected from {tm_name}')