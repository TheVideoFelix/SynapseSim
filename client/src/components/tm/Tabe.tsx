import React, { useEffect, useState } from "react";
import '../../styles/components/tm/tape.scss'
import Container from "../ui/Container";

export enum HeadMoveDir {
    R = 'R',
    N = 'N',
    L = 'L'
}

interface TapeProps {
    leftTape: string[];
    head: string;
    rightTape: string[];
    currentHeadMoveDir: HeadMoveDir;
}

const TOTAL_CELLS = 17;
const CENTER_POS =  Math.floor(TOTAL_CELLS / 2);
const LEFT_BUFFER_LIMIT = 4;
const RIGHT_BUFFER_LIMIT = 12;
const BLANK_SYMBOL = "B";

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

    const leftPart = leftTape.slice(-cellsToTakeFromLeft);
    const displayLeft = Array(cellsToTakeFromLeft - leftPart.length)
        .fill(BLANK_SYMBOL)
        .concat(leftPart);
  
    const rightPart = rightTape.slice(0, cellsToTakeFromRight);
    const displayRight = rightPart.concat(
        Array(cellsToTakeFromRight - rightPart.length).fill(BLANK_SYMBOL)
    );


    return (
        <Container className="tape-conatiner" padding="13px 0">
            <div className="tape">
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
        </Container>
    );
};

export default Tape;
