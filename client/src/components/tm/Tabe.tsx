import React, { useEffect, useState } from "react";
import '../../styles/components/tm/tape.scss'

export enum HeadMoveDir {
    R,
    N,
    L
}

interface TapeProps {
    leftTape: string[];
    head: string;
    rightTape: string[];
    currentHeadMoveDir: HeadMoveDir;
}

const TOTAL_CELLS = 16;
const CENTER_POS = 7;
const LEFT_BUFFER_LIMIT = 4;
const RIGHT_BUFFER_LIMIT = 10;

const Tape: React.FC<TapeProps> = ({ leftTape, head, rightTape, currentHeadMoveDir }) => {
    const [visualHeadPos, setvisualHeadPos] = useState<number>(CENTER_POS);

    useEffect(() => {
        if (currentHeadMoveDir === HeadMoveDir.R) {
            if (visualHeadPos < RIGHT_BUFFER_LIMIT) {
                setvisualHeadPos(pos => pos + 1);
            }
        } else if (currentHeadMoveDir === HeadMoveDir.L) {
            if (visualHeadPos > LEFT_BUFFER_LIMIT) {
                setvisualHeadPos(pos => pos - 1);
            }
        }
    }, [leftTape, head, rightTape, currentHeadMoveDir]);

    const cellsToTakeFromLeft = visualHeadPos;
    const cellsToTakeFromRight = TOTAL_CELLS - 1 - visualHeadPos;

    const displayLeft = [...leftTape].slice(0, cellsToTakeFromLeft).reverse();
    while (displayLeft.length < cellsToTakeFromLeft) {
      displayLeft.push("B");
    }

    displayLeft.reverse();
  
    const displayRight = [...rightTape].slice(0, cellsToTakeFromRight);
    while (displayRight.length < cellsToTakeFromRight) {
      displayRight.push("B");
    }

    return (
        <div className="tape">
            <div className="tape-container">
                {displayLeft.map((char, index) => (
                    <div className="tape-cell" key={`left-${index}`}>
                        {char}
                    </div>
                ))}
                <div className="tape-cell tape-head">
                    {head}
                </div>
                {displayRight.map((char, index) => (
                    <div className="tape-cell" key={`right-${index}`}>
                        {char}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tape;
