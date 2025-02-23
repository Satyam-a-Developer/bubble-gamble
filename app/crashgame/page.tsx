'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function CrashGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [betValue, setBetValue] = useState<string>("");
  const [stopValue, setStopValue] = useState<string>("");
  const [history, setHistory] = useState<Array<{ multiplier: number; won: boolean }>>([]);
  const crashThreshold = useRef<number>(0);

  useEffect(() => {
    if (running) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const xMax = canvas.width = canvas.height = 400;
      ctx.transform(1, 0, 0, -1, 0, xMax);

      const drawGraph = (currentMultiplier: number) => {
        ctx.clearRect(0, 0, xMax, xMax);

        // Draw grid lines
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        for (let i = 0; i <= xMax; i += 50) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(xMax, i);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, xMax);
          ctx.stroke();
        }

        // Draw crash line
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
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
          setHistory(prev => [...prev, { multiplier: parseFloat(stopValue), won: true }]);
          alertShown = true;
          setRunning(false);
        } else if (currentMultiplier >= crashThreshold.current && !alertShown) {
          setHistory(prev => [...prev, { multiplier: crashThreshold.current, won: false }]);
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

  const isValidInput = Number(betValue) > 0 && Number(stopValue) > 0;

  return (
    <div className="min-h-screen bg-slate-900 p-8 mt-[100px]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Current Multiplier: <span className="text-green-500">{multiplier.toFixed(2)}x</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">Bet Amount (RS)</Label>
                <Input
                  type="number"
                  min="0"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={betValue}
                  onChange={(e) => setBetValue(e.target.value)}
                  placeholder="Enter bet amount"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Auto Cash Out (x)</Label>
                <Input
                  type="number"
                  min="1"
                  step="0.1"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={stopValue}
                  onChange={(e) => setStopValue(e.target.value)}
                  placeholder="Enter cash out multiplier"
                />
              </div>
              <Button
                className={`w-full ${running ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                onClick={startGame}
                disabled={!isValidInput || running}
              >
                {running ? 'Game in Progress' : 'Start Game'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <canvas
                ref={canvasRef}
                className="w-full h-full bg-slate-900 rounded-lg"
                style={{ aspectRatio: '1/1' }}
              />
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Game History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {history.slice(-5).reverse().map((game, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded ${
                      game.won ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    Crashed at {game.multiplier.toFixed(2)}x
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
