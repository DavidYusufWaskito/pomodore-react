
import { useTimer } from "react-timer-hook";
import { useDeferredValue, useEffect, useState } from "react";
import BuzzerSound from "./sound/buzzer.mp3";
import Tomato from "./img/tomato.png";
import TimerSetting from "./layouts/TimerSetting";
function App() {
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
  const [Pomodoros, setPomodoros] = useState(0);
  const [LongBreakInterval, setLongBreakInterval] = useState(4);
  const [modes, setMode] = useState("focus");
  const [Paused, setPaused] = useState(false);

  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const convertTimetoTimeStamp = (timeState) => {
    const timeInSeconds = timeState.hours * 3600 + timeState.minutes * 60 + timeState.seconds;
    const time = new Date();
    time.setSeconds(time.getSeconds() + timeInSeconds);
    return time;
  }

  const HandleTimeout = () => {
    if (modes === "focus") {
      setMode("break");
      setPomodoros(Pomodoros + 1);
      restart(convertTimetoTimeStamp(breakTime),false);
      return;
    } 
    if (modes === "break") {
      setMode("focus");
      restart(convertTimetoTimeStamp(focusTime),false);
      return;
    }
    if (modes === "longbreak") {
      setMode("focus");
      restart(convertTimetoTimeStamp(focusTime),false);
      return;
    }
  }

  const { seconds, minutes, hours,totalSeconds, start, pause, resume, restart,isRunning } = useTimer({
    // Set the initial time using the following format:
    // autoStart: true, 
    // defaultTitle: '25 minutes focus time',
    // duration 1500000 // 25 minutes

    onExpire: () => {
      console.log("onExpire called");
      const sound = new Audio(BuzzerSound);
      sound.play();
      HandleTimeout();
      
      console.log(modes);
    },
    autoStart: false,
    expiryTimestamp: convertTimetoTimeStamp(focusTime)
  })

  useEffect(() => {
    const time = new Date();
    console.log(time.getMinutes());
    console.log(totalSeconds);
  }, []);
  useEffect(() => {
    if (Pomodoros !== 0 && Pomodoros % LongBreakInterval === 0 && modes !== "longbreak") {
      setMode("longbreak");
      restart(convertTimetoTimeStamp(longBreakTime),false);
      return;
    }
  }, [Pomodoros]);

  const HandleStart = () => {
    if (isRunning) {
      console.log("Pausing");
      setPaused(true);
      pause();
    } else if (!isRunning && Paused) {
      console.log("Resuming");
      setPaused(false);
      resume();
    } else {
      console.log("Starting");
      start();
    }
  }


  return (
    <div className="w-screen h-screen bg-gray-300">
      {/* Settings */}
      <button onClick={() => setIsSettingOpen(!isSettingOpen)} className="absolute top-2 right-2 md:top-5 md:right-5 select-none flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-10 h-10">
          <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
        </svg>
      </button>
      <TimerSetting open={isSettingOpen} onClose={() => setIsSettingOpen(false)} saveFocusTime={setFocusTime} saveBreakTime={setBreakTime} saveLongBreakTime={setLongBreakTime} restartTimer={restart}/>
      {/* Content */}
      <div className="absolute md:w-1/4 max-w-fit min-w-fit h-auto p-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
        <div className="w-full flex border-b-2 border-t-2 border-gray-800">
          <div className={`w-1/3 text-gray-800 text-xl font-bold px-4 py-2 text-center text-balance top-1/2 border-l-2 border-gray-800 ${(modes === 'focus'? 'bg-gray-800 text-white' : '')}`}>Focus Time</div>
          <div className={`w-1/3 text-gray-800 text-xl font-bold px-4 py-2 text-center text-balance top-1/2 border-l-2 border-r-2 border-gray-800 ${(modes === 'break'? 'bg-gray-800 text-white' : '')}`}>Break Time</div>
          <div className={`w-1/3 text-gray-800 text-xl font-bold px-4 py-2 text-center text-balance top-1/2 border-r-2 border-gray-800 ${(modes === 'longbreak'? 'bg-gray-800 text-white' : '')}`}>Long Break Time</div>
        </div>
        {/* Time */}
        <div className="w-full mt-10 flex">
          <div className="w-1/3 text-center">
            <h1 className="text-7xl font-bold text-gray-800">{hours.toString().padStart(2, '0')}</h1>
          </div>
          <span className="text-7xl text-gray-800">:</span>
          <div className="w-1/3 text-center">
            <h1 className="text-7xl font-bold text-gray-800">{minutes.toString().padStart(2, '0')}</h1>
          </div>
          <span className="text-7xl text-gray-800">:</span>
          <div className="w-1/3 text-center">
            <h1 className="text-7xl font-bold text-gray-800">{seconds.toString().padStart(2, '0')}</h1>
          </div>
        </div>
        <div className="flex items-center mt-5">
          <p className="text-gray-800 text-3xl font-bold px-4 py-2">Pomodoros: </p>
          <div className="text-gray-800 w-1/2 text-3xl font-bold px-4 py-2 border-2 rounded-lg border-gray-800 flex justify-center gap-2">
            {Pomodoros}
            <img src={Tomato} alt="Tomato" className="w-[32px] h-[32px]" />
          </div>
        </div>
        <div className="w-full flex border-b-2 border-t-2 border-gray-800 mt-5">
        <button onClick={HandleStart} className="w-1/2 text-gray-800 text-xl text-center font-bold px-4 py-2 hover:bg-gray-700 hover:text-white border-l-2 border-r-2 border-gray-800 flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32px" height="32px">
            {
              !isRunning
                ? <path d="M8 5v14l11-7L8 5z"/>
                : <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
            }
          </svg>
        </button>
        
          {/* <button onClick={pause} className={`w-1/3 text-gray-800 text-xl font-bold px-4 py-2 hover:bg-gray-700 hover:text-white border-l-2 border-r-2 border-gray-800`}>Pause</button> */}
          <button onClick={() => {
            setMode("focus");
            setPomodoros(0);
            setPaused(false);
            const time = convertTimetoTimeStamp(focusTime);
            restart(time, false);
          }} className="w-1/2 text-gray-800 text-xl text-center font-bold px-4 py-2 hover:bg-gray-700 hover:text-white border-r-2 border-gray-800 flex justify-center items-center">
            
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32px" height="32px">
              <path d="M4 4h16v16H4z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
