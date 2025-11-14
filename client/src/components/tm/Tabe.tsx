import React, { useEffect, useRef, useState } from "react";
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

const CENTER_POS =  8;
const LEFT_BUFFER_LIMIT = 4;
const RIGHT_BUFFER_LIMIT = 12;

const Tape: React.FC<TapeProps> = ({ leftTape, head, rightTape, currentHeadMoveDir }) => {
    const [visualHeadPos, setvisualHeadPos] = useState<number>(CENTER_POS);
    
    const viewportRef = useRef<HTMLDivElement>(null);
    const tapeRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (viewportRef.current && tapeRef.current && headRef.current) {
            const viewport = viewportRef.current;
            const tape = tapeRef.current;
            const headCell = headRef.current;

            const viewportCenter = viewport.offsetWidth / 2;
            const headCellCenter = headCell.offsetLeft + (headCell.offsetWidth / 2);

            const cellStep = headCell.offsetWidth - 2;
            const pixelOffset = (visualHeadPos -  CENTER_POS) * cellStep;

            const targetX = viewportCenter + pixelOffset;
            const transformX = targetX - headCellCenter;

            tape.style.transform = `translateX(${transformX}px)`;
        }
    }, [visualHeadPos, leftTape, head, rightTape]);

    const displayLeft = leftTape.slice();
    const displayRight = rightTape;


    return (
        <div className="tape-viewport" ref={viewportRef}>
            <Container className="tape-conatiner" padding="13px 0">
                <div className="tape" ref={tapeRef}>
                    {displayLeft.map((char, index) => (
                        <div className="tape-cell" key={`left-${index}`}>
                            {char}
                        </div>
                    ))}
                    <div className="tape-cell tape-head" ref={headRef}>
                        {head}
                    </div>
                    {displayRight.map((char, index) => (
                        <div className="tape-cell" key={`right-${index}`}>
                            {char}
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default Tape;
