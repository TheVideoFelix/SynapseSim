from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json, os
from tm_simulator import load_tm

router = APIRouter()


tm = load_tm(os.path.join(os.path.dirname(__file__), "../core/tms/fibonacci.MTTM"))


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
                    "statesLen": len(tm.states),
                    "alphabet": tm.alphabet,
                    "tapeAlphabet": tm.tape_alphabet,
                    "endState": tm.end_state,
                    "startState": tm.start_state,
                    "currentState": tm.state,
                    "tapes": [tape.get_tape_representation() for tape in tm.tapes],
                    "lastMoveDirs": ['N'] * len(tm.tapes),
                    "isHalted": tm.is_halted
                })
            elif message_type == "step":
                directions = tm.step()
                if not tm.is_halted:
                    directions = [direction.value if hasattr(direction, 'value') else str(direction) for direction in directions]
                    print(directions)
                await websocket.send_json({
                    "currentState": tm.state,
                    "tapes": [tape.get_tape_representation() for tape in tm.tapes],
                    "lastMoveDirs": directions,
                    "isHalted": tm.is_halted
                })
            
    except WebSocketDisconnect:
        print("Client disconnected")
        tm.clear()
