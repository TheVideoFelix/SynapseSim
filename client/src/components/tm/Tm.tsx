import React, { useEffect, useRef, useState } from "react";
import Tape, { HeadMoveDir } from "./Tabe";

interface TM {
    tapes: Array<[Array<string>, string, Array<string>]>
    lastMoveDirs: HeadMoveDir[]
}

interface TMProps { }

const TM: React.FC<TMProps> = () => {
    const [machineState, setMachineState] = useState<TM>();
    const socketRef = useRef<WebSocket>(null);

    useEffect(() => {
        socketRef.current = new WebSocket("ws://localhost:8000/ws/tm");

        socketRef.current.onmessage = (event) => {
            const newSate = JSON.parse(event.data);
            console.log(newSate);
            setMachineState(newSate);
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

    return (
        <div className="tm">
            <button onClick={() => sendStepMessage()}>
                Press
            </button>
            {machineState?.tapes.map(([leftTape, head, rightTape], index) => (
                <Tape 
                    leftTape={leftTape} 
                    head={head} 
                    rightTape={rightTape} 
                    currentHeadMoveDir={machineState?.lastMoveDirs[index]} 
                    key={index} 
                />
            ))}
        </div>
    );
};

export default TM;
