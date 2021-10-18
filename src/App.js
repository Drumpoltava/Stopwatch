import React, {useState, useEffect} from 'react';
import './App.css';
import {timer} from './timer.service';
import {Subject, takeUntil} from 'rxjs';

function App() {
    const [time, setTime] = useState(0);
    const [timeInterval, setTimeInterval] = useState(0);
    const [dblClick, setDblClick] = useState(0);
    const destroy = new Subject();

    const start = (skipCheck) => {
        if (!timeInterval || skipCheck) {
            const interval = setInterval(() => {
                timer.next(timer.getValue() + 1);
            }, 1000);

            setTimeInterval(interval);
        }
    };

    const stop = () => {
        clearInterval(timeInterval);
        setTimeInterval(0);
        timer.next(0);
    };

    const reset = () => {
        if (time) {
            stop();
            start(true);
        }
    };

    const wait = () => {
            setDblClick(prev => prev + 1);
            if (dblClick === 1) {
                clearInterval(timeInterval);
                setTimeInterval(0);
                setDblClick(0);
            }
            setTimeout(() => {
                setDblClick(0);
            }, 300)
    };

    useEffect(() => {
        timer
            .pipe(takeUntil(destroy))
            .subscribe((data) => {
                setTime(data);
            });

        return () => {
            destroy.next();
            destroy.unsubscribe();
        };
    });
    return (
        <div className='App'>
            <h1>Stopwatch</h1>
            <div className='timer'>
                <span>{('0' + Math.floor((time / 3600) % 60)).slice(-2)}:</span>
                <span>{('0' + Math.floor((time / 60) % 60)).slice(-2)}:</span>
                <span>{('0' + Math.floor(time % 60)).slice(-2)}</span>
            </div>
            <div>
                <button className='button' onClick={start}>Start</button>
                <button className='button' onClick={stop}>Stop</button>
                <button className='button' onClick={reset}>Reset</button>
                <button className='button' onClick={wait}>Wait</button>
            </div>
        </div>
    )
}

export default App;