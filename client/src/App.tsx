import Tape, { HeadMoveDir } from "./components/tm/Tabe"

function App() {



  return (
    <>
      <Tape leftTape={['h', 'a']} head="l" rightTape={['l', 'o', '!']} currentHeadMoveDir={HeadMoveDir.L} />
    </>
  )
}

export default App
