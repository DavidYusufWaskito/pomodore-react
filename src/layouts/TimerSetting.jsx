import { useState } from "react";
import { Modal,Box } from "@mui/material";
export default function TimerSetting({open,onClose,saveFocusTime,saveBreakTime,saveLongBreakTime,restartTimer})
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

    const save = () => {
        saveFocusTime(focusTime);
        saveBreakTime(breakTime);
        saveLongBreakTime(longBreakTime);
        restartTimer(convertTimetoTimeStamp(focusTime),false);
        onClose();
    }

    return(
        <Modal open={open} onClose={onClose}>
            <div className="absolute w-full md:w-1/4 h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-5">
                {/* Header */}
                <div>
                    <h1 className="text-gray-700 text-2xl font-bold text-center">Pomodoro Timer Setting</h1>
                </div>

                {/* Body */}
                <div className="mt-10">
                    <h1 className="text-gray-700 text-xl font-bold text-center">Focus Time</h1>
                    <div className="w-full h-full flex mt-5">
                        <div className="w-1/3 text-center">
                            <input onChange={(e)=>HandleInputHours(e,focusTime,setFocusTime)} value={focusTime.hours.toString().padStart(2, "0")} className="w-full text-center text-3xl font-bold text-gray-800" placeholder="00" />
                        </div>
                        <span className="text-3xl text-gray-800">:</span>
                        <div className="w-1/3">
                            <input onChange={(e)=>HandleInputMinutes(e,focusTime,setFocusTime)} value={focusTime.minutes.toString().padStart(2, "0")} className="w-full text-center text-3xl font-bold text-gray-800" placeholder="00" />
                        </div>
                        <span className="text-3xl text-gray-800">:</span>
                        <div className="w-1/3 text-center">
                            <input onChange={(e)=>HandleInputSeconds(e,focusTime,setFocusTime)} value={focusTime.seconds.toString().padStart(2, "0")} className="w-full text-center text-3xl font-bold text-gray-800" placeholder="00" />
                        </div>
                    </div>

                    <h1 className="text-gray-700 text-xl font-bold text-center mt-10">Break Time</h1>
                    <div className="w-full h-full flex mt-5">
                        <div className="w-1/3 text-center">
                            <input onChange={(e)=>HandleInputHours(e,breakTime,setBreakTime)} value={breakTime.hours.toString().padStart(2, "0")} className="w-full text-center text-3xl font-bold text-gray-800" placeholder="00" />
                        </div>
                        <span className="text-3xl text-gray-800">:</span>
                        <div className="w-1/3">
                            <input onChange={(e)=>HandleInputMinutes(e,breakTime,setBreakTime)} value={breakTime.minutes.toString().padStart(2, "0")} className="w-full text-center text-3xl font-bold text-gray-800" placeholder="00" />
                        </div>
                        <span className="text-3xl text-gray-800">:</span>
                        <div className="w-1/3 text-center">
                            <input onChange={(e)=>HandleInputSeconds(e,breakTime,setBreakTime)} value={breakTime.seconds.toString().padStart(2, "0")} className="w-full text-center text-3xl font-bold text-gray-800" placeholder="00" />
                        </div>
                    </div>

                    <h1 className="text-gray-700 text-xl font-bold text-center mt-10">Long Break Time</h1>
                    <div className="w-full h-full flex mt-5">
                        <div className="w-1/3 text-center">
                            <input onChange={(e)=>HandleInputHours(e,longBreakTime,setLongBreakTime)} value={longBreakTime.hours.toString().padStart(2, "0")} className="w-full text-center text-3xl font-bold text-gray-800" placeholder="00" />
                        </div>
                        <span className="text-3xl text-gray-800">:</span>
                        <div className="w-1/3">
                            <input onChange={(e)=>HandleInputMinutes(e,longBreakTime,setLongBreakTime)} value={longBreakTime.minutes.toString().padStart(2, "0")} className="w-full text-center text-3xl font-bold text-gray-800" placeholder="00" />
                        </div>
                        <span className="text-3xl text-gray-800">:</span>
                        <div className="w-1/3 text-center">
                            <input onChange={(e)=>HandleInputSeconds(e,longBreakTime,setLongBreakTime)} value={longBreakTime.seconds.toString().padStart(2, "0")} className="w-full text-center text-3xl font-bold text-gray-800" placeholder="00" />
                        </div>
                    </div>
                </div>
                {/* Footer */}
                <div className="flex gap-5 mt-10">
                    <button onClick={save} className="w-full bg-gray-800 text-white py-2 rounded-lg">Save</button>
                    <button onClick={()=>onClose()} className="w-full bg-gray-800 text-white py-2 rounded-lg">Close</button>
                </div>
            </div>
        </Modal>
    );
}