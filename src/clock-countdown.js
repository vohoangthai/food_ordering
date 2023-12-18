import React, { Component } from "react";
import { useState, useRef, useEffect } from 'react'
function ClockCountdown(props) {
    const Ref = useRef(null);
 
    // The state for our timer
    const [timer, setTimer] = useState('00:00:00');
 
    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        return {
            total, hours, minutes, seconds
        };
    }
 
    const startTimer = (e) => {
        let { total, hours, minutes, seconds }
                    = getTimeRemaining(e);
        if (total >= 0) {
 
            // update the timer
            // check if less than 10 then we need to
            // add '0' at the beginning of the variable
            setTimer(
                (hours > 9 ? hours : '0' + hours) + ':' +
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
    }
    function checkTime(i) 
    {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    const clearTimer = (e) => {
 
        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next  
        let deadline = new Date();
 
        // Giờ, phút, giây hiện tại
        var h = 24 - deadline.getHours();
        var m = 60 - deadline.getMinutes();
        var s = 60 - deadline.getSeconds();
        h = checkTime(h);
        m = checkTime(m);
        s = checkTime(s); 
        setTimer(`${h}:${m}:${s}`);
 
        // If you try to remove this line the
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    }
 
    const getDeadTime = () => {
        let deadline = new Date();
 
        // Giờ, phút, giây hiện tại
        var h = 24 - deadline.getHours();
        var m = 60 - deadline.getMinutes();
        var s = 60 - deadline.getSeconds();
        var sumsecond = (h*3600)+(m*60)+s;
 
        // This is where you need to adjust if
        // you entend to add more time
        deadline.setSeconds(deadline.getSeconds() + sumsecond);
        return deadline;
    }
 
    // We can use useEffect so that when the component
    // mount the timer will start as soon as possible
 
    // We put empty array to act as componentDid
    // mount only
    
    
    useEffect(() => {
        
        clearTimer(getDeadTime());
    }, []);
 
    // Another way to call the clearTimer() to start
    // the countdown is via action event from the
    // button first we create function to be called
    // by the button
    return (
        <div>
            <h2 className="text-center text-5xl font-bold text-red-600"><span className="text-3xl pr-2">Kết thúc sau</span>{timer}</h2>
           
        </div>
    )
}


export default ClockCountdown;