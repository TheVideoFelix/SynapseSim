import os
from pathlib import Path
import typing
import copy
from tm_simulator import load_tm, TuringMachine as TM, MultiTapeTuringMachine as MTTM

TM_Type = typing.Union[MTTM, TM]
_tm_registry: typing.Dict[str, TM_Type] = {}

CONFIG_DIR = Path(__file__).parent / 'tms'

def init_tms():
    path = Path(CONFIG_DIR)
    print(path)

    if not path.exists():
        raise FileNotFoundError(f'The dirctory ${CONFIG_DIR} does not exist.')
    

    for file_path in path.iterdir():
        if file_path.is_file() and file_path.suffix in ['.TM', '.MTTM']:
            try: 
                tm_instance = load_tm(str(file_path))
                tm_name = file_path.stem

                _tm_registry[tm_name] = tm_instance
            
            except Exception as e:
                print(f'Error loading {file_path.name}: {e}')

def get_all_tm_name():
    return list(_tm_registry.keys())

def get_tm(tm_id: str) -> typing.Optional[TM_Type]:
    return _tm_registry.get(tm_id)

def get_copy_of_tm(tm_id: str) -> typing.Optional[TM_Type]:
    tm = _tm_registry.get(tm_id)
    if tm:
        return copy.deepcopy(tm)
    return None