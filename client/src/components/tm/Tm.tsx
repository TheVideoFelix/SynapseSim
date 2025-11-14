import React, { use, useEffect, useRef, useState } from "react";
import Tape, { HeadMoveDir } from "./Tabe";
import '../../styles/components/tm/tm.scss'
import Container from "../ui/Container";

interface TM {
    states: string[];
    alphabet: string[];
    tapeAlphabet: string[];
    endState: string;
    startState: string;
    currentState: string;
    tapes: Array<[Array<string>, string, Array<string>]>;
    lastMoveDirs: HeadMoveDir[];
    isHalted: boolean;
}

interface TMProps { }

const TM: React.FC<TMProps> = () => {
    const [machineState, setMachineState] = useState<TM>();
    const socketRef = useRef<WebSocket>(null);
    const autoStepTimeout = useRef<number>(0);

    useEffect(() => {
        socketRef.current = new WebSocket("ws://localhost:8000/ws/tm");

        socketRef.current.onmessage = (event) => {
            const update = JSON.parse(event.data);
            setMachineState((prev) => {
                const base: TM =
                    prev ?? {
                        states: [],
                        alphabet: [],
                        tapeAlphabet: [],
                        endState: '',
                        startState: '',
                        currentState: '',
                        tapes: [],
                        lastMoveDirs: [],
                        isHalted: false,
                    };

                const next: TM = {
                    ...base,
                    ...update,
                    states:
                        update.statesLen !== undefined
                            ? Array.from({ length: update.statesLen }, (_, i) => `${i + 1}`)
                            : base.states,
                };

                return next;
            });

        };

        socketRef.current.onopen = () => {
            console.log("Websocket is conne cted.");

            socketRef.current?.send(JSON.stringify({
                type: "init",
                data: {
                    input: "1110110010101010010101000111101100101010100101010001111011001010101001010100011110110010101010010101000111101100101010100101010001111011001010101001010100011110110010101010010101000111101100101010100101010001",
                }
            }));
        };

        socketRef.current.onclose = (event) => {
            console.log("Socket closed");

        };

        socketRef.current.onerror = (error) => {
            console.log("Socket had an erroro: " + error);

        };


        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    useEffect(() => {

        if (!machineState || machineState.isHalted) {
            return;
        }

        autoStepTimeout.current = window.setTimeout(()=> {
            sendStepMessage();
        }, 700);

        return () => {
            if (autoStepTimeout.current) {
                clearTimeout(autoStepTimeout.current);
            }
        }
    }, [machineState]);

    const sendStepMessage = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: "step",
            }));
        } else {
            console.log("Socket not open");
        }
    };

    if (!machineState) {
        return <div>Loding turing machine ...</div>
    }


    //const statesStr = `{${}}`;

    return (
        <div className="tm">
            <div className="tm-label">
                <h1>M = &lang; {machineState?.states ? (
                    <>
                        {'{'}
                        {machineState.states.map((s, i) => (
                            <span key={i}>
                                q<sub>{s}</sub>
                                {i < machineState.states.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                        {'}'}
                    </>
                ) : '{}'}, {machineState?.alphabet ? `{${machineState.alphabet.join(', ')}}` : '{}'}, {machineState?.tapeAlphabet ? `{${machineState.tapeAlphabet.join(', ')}}` : '{}'}, B, q<sub>{machineState?.startState}</sub>, q<sub>{machineState?.endState}</sub>, &delta; &rang;</h1>
            </div>
            <div className="tapes">
                {machineState?.tapes.map(([leftTape, head, rightTape], index) => (

                    <div className="tape-section" key={`tape-${index}`}>
                        <h3 className="tape-label">Tape {index + 1}</h3>
                        <Tape
                            leftTape={leftTape}
                            head={head}
                            rightTape={rightTape}
                            currentHeadMoveDir={machineState?.lastMoveDirs?.[index] ?? HeadMoveDir.N}
                        />
                    </div>

                ))}
            </div>
            <Container className="state-container">
                <h3 className="label">Current State</h3>
                <h1 className="current-state">q<sub>{machineState?.currentState}</sub></h1>
            </Container>

        </div>
    );
};

export default TM;
