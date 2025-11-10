import Tape, { HeadMoveDir } from "./components/tm/Tabe"
import TM from "./components/tm/Tm"

function App() {



  return (
    <>
      <Tape leftTape={['h', 'a']} head="l" rightTape={['l', 'o', '!']} currentHeadMoveDir={HeadMoveDir.L} />
      <TM />
    </>
  )
}

export default App
