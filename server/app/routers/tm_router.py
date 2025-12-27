from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
import json, os
from tm_simulator import load_tm
from app.services.tm_service import TMService, TMSelection

router = APIRouter()
tmService = TMService();

@router.get('/tms')
def get_tems():
    return { "tms": TMService.get_loaded_tms()}

@router.get('/tm')
def get_tem():
    return tmService.get_tm_configuration()

@router.put('/tm')
def set_tem(selection: TMSelection):
    return tmService.updated_tm_configuration(selection)

@router.websocket('/ws/tm')
async def websocket_tm_endpoint(websocket: WebSocket):
    await websocket.accept()

    tm_name = tmService.selectedTm
    tm = TMService.get_tm_session(tm_name)
    print(f"Name: {tm_name}")

    if not tm:
        await websocket.send_json({ "error": "TM not found"})
        await websocket.close()
        return
    try:
        while True:
            text_data = await websocket.receive_text()
            data = json.loads(text_data)

            message_type = data.get("type")

            if message_type == "init":
                print(tmService.get_effective_input())
                tm.input(tmService.get_effective_input())
                response = TMService.format_init_response(tm)
                await websocket.send_json(response)
            elif message_type == "step":
                try:
                    response = TMService.process_step(tm)
                    await websocket.send_json(response)
                except ValueError as e:
                    await websocket.send_json({"error": str(e) or "Invalid step"})

    except WebSocketDisconnect:
        print(f'Client discconected from {tmService.selectedTm}')