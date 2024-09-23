import { useEffect, useState } from "react";
import { Modal,Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";

export default function TimerSetting({open,onClose,saveFocusTime,saveBreakTime,saveLongBreakTime,restartTimer,snackbarCallback})
{
    // Time are in minutes
    const [focusTime, setFocusTime] = useState({
        hours: 0,
        minutes: 25,
        seconds: 0
    });
    const [breakTime, setBreakTime] = useState({
        hours: 0,
        minutes: 5,
        seconds: 0
    });
    const [longBreakTime, setLongBreakTime] = useState({
        hours: 0,
        minutes: 15,
        seconds: 0
    });

    useEffect(() => {
        const storedFocusTime = JSON.parse(localStorage.getItem("focus-time"));
        const storedBreakTime = JSON.parse(localStorage.getItem("break-time"));
        const storedLongBreakTime = JSON.parse(localStorage.getItem("long-break-time"));
        if (storedFocusTime) setFocusTime(storedFocusTime);
        if (storedBreakTime) setBreakTime(storedBreakTime);
        if (storedLongBreakTime) setLongBreakTime(storedLongBreakTime);
    },[]);

    const HandleInputHours = (e,state,setState) => {
        const numOnly = /^[0-9]+$/;
        if (e.target.value === "" || (numOnly.test(e.target.value) && Number(e.target.value) <= 24)) {
            setState({...state, hours: Number(e.target.value)});
        }
    }

    const HandleInputMinutes = (e,state,setState) => {
        const numOnly = /^[0-9]+$/;
        
        if (e.target.value === "" || (numOnly.test(e.target.value) && (Number(e.target.value) <= 60 && state.hours < 24) || (Number(e.target.value) <= 59 && state.hours === 24))) {
            if (Number(e.target.value) === 60 && focusTime.hours < 24) {
                setState({...state, hours: state.hours + 1, minutes: 0});
            } else {
                setState({...state, minutes: Number(e.target.value)});
            }
        }
    }

    const HandleInputSeconds = (e,state,setState) => {
        const numOnly = /^[0-9]+$/;
        if (e.target.value === "" || (numOnly.test(e.target.value) && (Number(e.target.value) <= 60 && state.minutes < 60) || (Number(e.target.value) <= 59 && state.minutes === 60))) {
            if (Number(e.target.value) === 60 && state.minutes === 59 && state.hours < 24) {
                setState({...state, hours: state.hours + 1, minutes: 0, seconds: 0});
            }
            else if (Number(e.target.value) === 60 && state.minutes === 59 && state.hours === 24) {
                setState({...state, hours: 0, minutes: 0, seconds: 0});
            }
            else if (Number(e.target.value) === 60 && state.minutes < 60) {
                setState({...state, minutes: state.minutes + 1, seconds: 0});
            } 
             else {
                setState({...state, seconds: Number(e.target.value)});
            }
        }
    }
    const convertTimetoTimeStamp = (timeState) => {
        const timeInSeconds = timeState.hours * 3600 + timeState.minutes * 60 + timeState.seconds;
        const time = new Date();
        time.setSeconds(time.getSeconds() + timeInSeconds);
        return time;
      }

    const HandleInputFocusOnClick = (e) => {
        e.target.focus();
        // e.target.setSelectionRange(e.target.value.length, e.target.value.length);
    }

    const HandleInputKeydown = (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
        }
        e.stopPropagation();
    }

    const save = () => {
        saveFocusTime(focusTime);
        saveBreakTime(breakTime);
        saveLongBreakTime(longBreakTime);
        // restartTimer(convertTimetoTimeStamp(focusTime),false);
        snackbarCallback({open:true,message:"Timer Saved",type:"success"});
        localStorage.setItem("focus-time", JSON.stringify(focusTime));
        localStorage.setItem("break-time", JSON.stringify(breakTime));
        localStorage.setItem("long-break-time", JSON.stringify(longBreakTime));
        onClose();
    }

    const resetFocustime = () => {
        setFocusTime({
            hours: 0,
            minutes: 25,
            seconds: 0
        });
    }

    const resetBreaktime = () => {
        setBreakTime({
            hours: 0,
            minutes: 5,
            seconds: 0
        });
    }

    const resetLongBreaktime = () => {
        setLongBreakTime({
            hours: 0,
            minutes: 15,
            seconds: 0
        });
    }

    const resetAll = () => {
        setFocusTime({
            hours: 0,
            minutes: 25,
            seconds: 0
        });
        setBreakTime({
            hours: 0,
            minutes: 5,
            seconds: 0
        });
        setLongBreakTime({
            hours: 0,
            minutes: 15,
            seconds: 0
        });
    }   

    return(
        <Modal open={open} onClose={onClose}>
            <div className="absolute min-w-[480px] w-full h-full md:w-1/4 md:h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white md:rounded-lg p-5">
                {/* Header */}
                <div>
                    <h1 className="text-gray-700 text-2xl font-bold text-center">Pomodoro Timer Setting</h1>
                </div>

                {/* Body */}
                <div className="px-10 mt-10">
                    <h1 className="text-gray-700 text-xl font-bold text-center">Focus Time</h1>
                    <div className="w-full h-full flex items-center gap-5 mt-5">
                        <div className="w-full flex justify-between items-center">
                            <div className="w-1/4">
                                <input type="number" onClick={HandleInputFocusOnClick} onKeyDown={HandleInputKeydown} onChange={(e)=>HandleInputHours(e,focusTime,setFocusTime)} value={focusTime.hours.toString().padStart(2, "0")} className="w-full h-full border-2 border-gray-500 rounded text-center text-3xl font-bold text-gray-800 caret-transparent" placeholder="00" />
                            </div>
                            <span className="text-3xl text-gray-800">:</span>
                            <div className="w-1/4">
                                <input type="number" onClick={HandleInputFocusOnClick} onKeyDown={HandleInputKeydown} onChange={(e)=>HandleInputMinutes(e,focusTime,setFocusTime)} value={focusTime.minutes.toString().padStart(2, "0")} className="w-full h-full border-2 border-gray-500 rounded text-center text-3xl font-bold text-gray-800 caret-transparent" placeholder="00" />
                            </div>
                            <span className="text-3xl text-gray-800">:</span>
                            <div className="w-1/4">
                                <input type="number" onClick={HandleInputFocusOnClick} onKeyDown={HandleInputKeydown} onChange={(e)=>HandleInputSeconds(e,focusTime,setFocusTime)} value={focusTime.seconds.toString().padStart(2, "0")} className="w-full h-full border-2 border-gray-500 rounded text-center text-3xl font-bold text-gray-800 caret-transparent" placeholder="00" />
                            </div>
                        </div>
                        <button onClick={resetFocustime} className="bg-gray-800 py-2 px-4 rounded-lg shadow-lg hover:bg-gray-700">
                            <FontAwesomeIcon icon={faRotateLeft} className="text-3xl text-white" />
                        </button>
                    </div>

                    <h1 className="text-gray-700 text-xl font-bold text-center mt-10">Break Time</h1>
                    <div className="w-full h-full flex items-center gap-5 mt-5">
                        <div className="w-full flex justify-between items-center">
                            <div className="w-1/4">
                                <input type="number" onClick={HandleInputFocusOnClick} onKeyDown={HandleInputKeydown} onChange={(e)=>HandleInputHours(e,breakTime,setBreakTime)} value={breakTime.hours.toString().padStart(2, "0")} className="w-full h-full border-2 border-gray-500 rounded text-center text-3xl font-bold text-gray-800 caret-transparent" placeholder="00" />
                            </div>
                            <span className="text-3xl text-gray-800">:</span>
                            <div className="w-1/4">
                                <input type="number" onClick={HandleInputFocusOnClick} onKeyDown={HandleInputKeydown} onChange={(e)=>HandleInputMinutes(e,breakTime,setBreakTime)} value={breakTime.minutes.toString().padStart(2, "0")} className="w-full h-full border-2 border-gray-500 rounded text-center text-3xl font-bold text-gray-800 caret-transparent" placeholder="00" />
                            </div>
                            <span className="text-3xl text-gray-800">:</span>
                            <div className="w-1/4">
                                <input type="number" onClick={HandleInputFocusOnClick} onKeyDown={HandleInputKeydown} onChange={(e)=>HandleInputSeconds(e,breakTime,setBreakTime)} value={breakTime.seconds.toString().padStart(2, "0")} className="w-full h-full border-2 border-gray-500 rounded text-center text-3xl font-bold text-gray-800 caret-transparent" placeholder="00" />
                            </div>
                        </div>
                        <button onClick={resetBreaktime} className="bg-gray-800 py-2 px-4 rounded-lg shadow-lg hover:bg-gray-700">
                            <FontAwesomeIcon icon={faRotateLeft} className="text-3xl text-white" />
                        </button>
                    </div>
                    {/* <div className="w-full h-full flex justify-between items-center mt-5">
                        <div className="w-1/4">
                            <input type="number" onClick={HandleInputFocusOnClick} onKeyDown={HandleInputKeydown} onChange={(e)=>HandleInputHours(e,breakTime,setBreakTime)} value={breakTime.hours.toString().padStart(2, "0")} className="w-full h-full border-2 border-gray-500 rounded text-center text-3xl font-bold text-gray-800 caret-transparent" placeholder="00" />
                        </div>
                        <span className="text-3xl text-gray-800">:</span>
                        <div className="w-1/4">
                            <input type="number" onClick={HandleInputFocusOnClick} onKeyDown={HandleInputKeydown} onChange={(e)=>HandleInputMinutes(e,breakTime,setBreakTime)} value={breakTime.minutes.toString().padStart(2, "0")} className="w-full h-full border-2 border-gray-500 rounded text-center text-3xl font-bold text-gray-800 caret-transparent" placeholder="00" />
                        </div>
                        <span className="text-3xl text-gray-800">:</span>
                        <div className="w-1/4">
                            <input type="number" onClick={HandleInputFocusOnClick} onKeyDown={HandleInputKeydown} onChange={(e)=>HandleInputSeconds(e,breakTime,setBreakTime)} value={breakTime.seconds.toString().padStart(2, "0")} className="w-full h-full border-2 border-gray-500 rounded text-center text-3xl font-bold text-gray-800 caret-transparent" placeholder="00" />
                        </div>
                    </div> */}

                    <h1 className="text-gray-700 text-xl font-bold text-center mt-10">Long Break Time</h1>
                    <div className="w-full h-full flex items-center gap-5 mt-5">
                        <div className="w-full flex justify-between items-center">
                            <div className="w-1/4">
                                <input type="number" onClick={HandleInputFocusOnClick} onKeyDown={HandleInputKeydown} onChange={(e)=>HandleInputHours(e,longBreakTime,setLongBreakTime)} value={longBreakTime.hours.toString().padStart(2, "0")} className="w-full h-full border-2 border-gray-500 rounded text-center text-3xl font-bold text-gray-800 caret-transparent" placeholder="00" />
                            </div>
                            <span className="text-3xl text-gray-800">:</span>
                            <div className="w-1/4">
                                <input type="number" onClick={HandleInputFocusOnClick} onKeyDown={HandleInputKeydown} onChange={(e)=>HandleInputMinutes(e,longBreakTime,setLongBreakTime)} value={longBreakTime.minutes.toString().padStart(2, "0")} className="w-full h-full border-2 border-gray-500 rounded text-center text-3xl font-bold text-gray-800 caret-transparent" placeholder="00" />
                            </div>
                            <span className="text-3xl text-gray-800">:</span>
                            <div className="w-1/4">
                                <input type="number" onClick={HandleInputFocusOnClick} onKeyDown={HandleInputKeydown} onChange={(e)=>HandleInputSeconds(e,longBreakTime,setLongBreakTime)} value={longBreakTime.seconds.toString().padStart(2, "0")} className="w-full h-full border-2 border-gray-500 rounded text-center text-3xl font-bold text-gray-800 caret-transparent" placeholder="00" />
                            </div>
                        </div>
                        <button onClick={resetLongBreaktime} className="bg-gray-800 py-2 px-4 rounded-lg shadow-lg hover:bg-gray-700">
                            <FontAwesomeIcon icon={faRotateLeft} className="text-3xl text-white" />
                        </button>
                    </div>
                    {/* <div className="w-full h-full flex justify-between items-center mt-5">
                        <div className="w-1/4">
                            <input type="number" onClick={HandleInputFocusOnClick} onKeyDown={HandleInputKeydown} onChange={(e)=>HandleInputHours(e,longBreakTime,setLongBreakTime)} value={longBreakTime.hours.toString().padStart(2, "0")} className="w-full h-full border-2 border-gray-500 rounded text-center text-3xl font-bold text-gray-800 caret-transparent" placeholder="00" />
                        </div>
                        <span className="text-3xl text-gray-800">:</span>
                        <div className="w-1/4">
                            <input type="number" onClick={HandleInputFocusOnClick} onKeyDown={HandleInputKeydown} onChange={(e)=>HandleInputMinutes(e,longBreakTime,setLongBreakTime)} value={longBreakTime.minutes.toString().padStart(2, "0")} className="w-full h-full border-2 border-gray-500 rounded text-center text-3xl font-bold text-gray-800 caret-transparent" placeholder="00" />
                        </div>
                        <span className="text-3xl text-gray-800">:</span>
                        <div className="w-1/4">
                            <input type="number" onClick={HandleInputFocusOnClick} onKeyDown={HandleInputKeydown} onChange={(e)=>HandleInputSeconds(e,longBreakTime,setLongBreakTime)} value={longBreakTime.seconds.toString().padStart(2, "0")} className="w-full h-full border-2 border-gray-500 rounded text-center text-3xl font-bold text-gray-800 caret-transparent" placeholder="00" />
                        </div>
                    </div> */}
                </div>
                {/* Footer */}
                <div className="mt-10">
                    <button onClick={resetAll} className="w-full bg-gray-800 text-white py-2 rounded-lg">
                        Reset all to default
                    </button>
                    <div className="flex gap-5 mt-5">
                        <button onClick={save} className="w-full bg-gray-800 text-white py-2 rounded-lg">Save</button>
                        <button onClick={()=>onClose()} className="w-full bg-gray-800 text-white py-2 rounded-lg">Close</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}