import React, { useEffect, useRef, useState } from "react";
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

    useEffect(() => {
        socketRef.current = new WebSocket("ws://localhost:8000/ws/tm");

        socketRef.current.onmessage = (event) => {
            const newState = JSON.parse(event.data);
            console.log(newState);
            const newMachine: TM = {
                ...newState,
                states: Array.from({ length: newState.statesLen }, (_, i) => `q${i}`),
            }
            setMachineState(newMachine);

        };

        socketRef.current.onopen = () => {
            console.log("Websocket is conne cted.");

            socketRef.current?.send(JSON.stringify({
                type: "init",
                data: {
                    input: "1110001",
                }
            }));
        };

        socketRef.current.onclose = (event) => {
            console.log("Socket closed");

        };

        socketRef.current.onerror = (error) => {
            console.log("Socket had an erroro: " +  error);
            
        };


        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

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

    return (
        <div className="tm">
            <div className="tm-label">
                <h1>M = &lang; Q, &Gamma;, b, &Sigma;, &delta;, q<sub>0</sub>, F &rang;</h1>
            </div>
            <button onClick={() => sendStepMessage()}>
            Press
            </button>
            <div className="tapes">
                {machineState?.tapes.map(([leftTape, head, rightTape], index) => (
                    
                    <div className="tape-section" key={`tape-${index}`}>
                        <h3 className="tape-label">Tape {index+1}</h3>
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
                <h1 className="current-state">q0</h1>
            </Container>

        </div>
    );
};

export default TM;
