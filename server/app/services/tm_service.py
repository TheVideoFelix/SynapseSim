from typing import List, Dict, Any
from app.core.tms import get_all_tm_name, get_copy_of_tm, TM_Type, init_tms
from pydantic import BaseModel
from fastapi import HTTPException
import random

class TMSelection(BaseModel):
	selectedTm: str
	isRandomInput: bool
	tmInput: str

class TMService:
	def __init__(self) -> None:
		init_tms()
		names = get_all_tm_name()
		self.selectedTm: str = names[0] if names else ""
		self.isRadomInput: bool = False
		self.tmInput: str = '1000101010'

	def get_effective_input(self) -> list[str]:
		if self.isRadomInput:
			length = random.randint(8, 32)
			random_str = ''.join(random.choice('10') for _ in range(length))
			return [random_str]
		return list(self.tmInput) if ',' in self.tmInput else self.tmInput.split(',')

	def get_tm_configuration(self) -> Dict[str, Any]:
		return {
			"selectedTm": self.selectedTm,
			"isRandomInput": self.isRadomInput,
			"tmInput": self.tmInput
		}

	def updated_tm_configuration(self, selection: TMSelection) -> Dict[str, Any]:
		if selection.selectedTm not in TMService.get_loaded_tms():
			raise HTTPException(status_code=404, detail=f"TM '{selection.selectedTm}' not found")

		changed = False
		if selection.selectedTm != self.selectedTm:
			self.selectedTm = selection.selectedTm
			changed = True
		if selection.isRandomInput != self.isRadomInput:
			self.isRadomInput = selection.isRandomInput
			changed = True
		if selection.tmInput != self.tmInput:
			self.tmInput = selection.tmInput
			changed = True

		status = "updated" if changed else "unchanged"
		return {
			"status": status,
			"selected": self.selectedTm,
			"isRandomInput": self.isRadomInput,
			"tmInput": self.tmInput
		}

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

		return {
			"currentState": tm.state,
			"tapes": [tape.get_tape_representation() for tape in tm.tapes],
			"lastMoveDirs": directions,
			"isHalted": tm.is_halted
		}