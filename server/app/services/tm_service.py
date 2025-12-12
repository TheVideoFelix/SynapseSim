from typing import List, Dict, Any
from app.core.tms import get_all_tm_name, get_copy_of_tm, TM_Type

class TMService:

        @staticmethod
        def get_loaded_tms() -> list[str]:
                return get_all_tm_name()
        
        @staticmethod
        def get_tm_session(name: str):
                return get_copy_of_tm(name)
        
        @staticmethod
        def format_init_response(tm: TM_Type) -> Dict[str, Any]:
                return {
                    "statesLen": len(tm.states),
                    "alphabet": tm.alphabet,
                    "tapeAlphabet": tm.tape_alphabet,
                    "endState": tm.end_state,
                    "startState": tm.start_state,
                    "currentState": tm.state,
                    "tapes": [tape.get_tape_representation() for tape in tm.tapes],
                    "lastMoveDirs": ['N'] * len(tm.tapes),
                    "isHalted": tm.is_halted
                }
        
        @staticmethod
        def process_step(tm: TM_Type) -> Dict[str, Any]:
                directions = tm.step()
                if not tm.is_halted:
                    directions = [direction.value if hasattr(direction, 'value') else str(direction) for direction in directions]
                    print(directions)
                    
                return {
                    "currentState": tm.state,
                    "tapes": [tape.get_tape_representation() for tape in tm.tapes],
                    "lastMoveDirs": directions,
                    "isHalted": tm.is_halted
                }