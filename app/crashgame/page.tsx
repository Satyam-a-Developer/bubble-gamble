'use client';
import React, { useEffect, useRef, useState } from 'react';

export default function CrashGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [betValue, setBetValue] = useState<string>("");
  const [stopValue, setStopValue] = useState<string>("");
  const crashThreshold = useRef<number>(0);

  useEffect(() => {
    if (running) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const xMax = canvas.width = canvas.height;
      ctx.transform(1, 0, 0, -1, 0, xMax);

      const drawGraph = (currentMultiplier: number) => {
        ctx.clearRect(0, 0, xMax, xMax);
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const endX = xMax * (currentMultiplier / 10);
        const endY = xMax * (currentMultiplier / 10);
        ctx.quadraticCurveTo(xMax / 2, endY / 2, endX, endY);
        ctx.stroke();
      };

      let frame: number;
      let startTime = Date.now();
      let alertShown = false;

      const updateGame = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const currentMultiplier = 1 + elapsed;

        setMultiplier(currentMultiplier);

        if (stopValue && currentMultiplier >= parseFloat(stopValue) && !alertShown) {
          const winValue = parseFloat(betValue) * parseFloat(stopValue);
          alert(`You won ${winValue} RS`);
          alertShown = true;
          setRunning(false);
        } else if (currentMultiplier >= crashThreshold.current && !alertShown) {
          alert(`You lost ${betValue} RS`);
          alertShown = true;
          setRunning(false);
        }

        if (running && !alertShown) {
          drawGraph(currentMultiplier);
          frame = requestAnimationFrame(updateGame);
        }
      };

      frame = requestAnimationFrame(updateGame);

      return () => cancelAnimationFrame(frame);
    }
  }, [running, stopValue, betValue]);

  const startGame = () => {
    crashThreshold.current = Math.random() * 9 + 1.5;
    setMultiplier(1);
    setRunning(true);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', backgroundColor: '#f3f4f6', color: '#1e293b' }}>
      <div className="flex justify-center items-center h-svh bg-blue-gray-500 mt-[50px] gap-10 overflow-scroll">
        <div className="bg-slate-600 p-11 rounded-lg">
          <h1>Multiplier: {multiplier.toFixed(2)}x</h1>
          <div className="flex flex-col gap-7 mb-10">
            <label>Bet Value</label>
            <input
              type="number"
              style={{ border: '3px solid black', width: '300px', height: '50px' }}
              onChange={(e) => setBetValue(e.target.value)}
            />
            <label>Stop Value</label>
            <input
              type="number"
              style={{ border: '3px solid black', width: '300px', height: '50px' }}
              value={stopValue}
              onChange={(e) => setStopValue(e.target.value)}
            />
          </div>
          <button
            onClick={startGame}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Game
          </button>
        </div>
        <canvas ref={canvasRef} width={500} height={500} style={{ backgroundColor: 'black' }} />
      </div>
    </div>
  );
}
