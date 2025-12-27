import React, { useEffect, useRef, useState } from "react";
import Tape, { HeadMoveDir } from "./Tabe";
import '../../styles/components/tm/tm.scss'
import Container from "../ui/Container";
import { toast } from "react-toastify";

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
    const reconnectTimeout = useRef<number>(0);

    const connectWebSocket = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.close();
        }
        const ws = new WebSocket("ws://localhost:8000/ws/tm");
        socketRef.current = ws;

        socketRef.current.onmessage = (event) => {
            const update = JSON.parse(event.data);
            console.log(update);
            if ('error' in update) {
                toast.error(update.error);
                return;
            }
            
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
            
            if (update.isHalted) {
                socketRef.current?.close();
            }
        };

        socketRef.current.onopen = () => {
            if (ws !== socketRef.current) return;
            socketRef.current?.send(JSON.stringify({
                type: "init",
                data: {
                    input: '10001010',
                }
            }));
        };

        socketRef.current.onclose = (event) => {
            if (ws !== socketRef.current) return;
            //toast.warning("Socket closed");

            reconnectTimeout.current = window.setTimeout(() => {
                connectWebSocket();
            }, 5000);
        };

        socketRef.current.onerror = (error) => {
            if (ws !== socketRef.current) return;
            toast.error(`Socket has an error: ${error}`);

            reconnectTimeout.current = window.setTimeout(() => {
                connectWebSocket();
            }, 5000);
        };
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
            if (autoStepTimeout.current) {
                clearTimeout(autoStepTimeout.current);
            }
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
            toast.error("Socket is not open.");
        }
    };

    if (!machineState) {
        return <div>Loding turing machine ...</div>
    }

    return (
        <div className="tm">
            <div className="tm-label">
                <h1 className={machineState?.isHalted ? 'halted' : ''}>M = &lang; {machineState?.states ? (
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
