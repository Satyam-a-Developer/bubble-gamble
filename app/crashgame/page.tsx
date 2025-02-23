'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, TrendingUp, Wallet } from 'lucide-react';

export default function CrashGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [betValue, setBetValue] = useState<string>("");
  const [stopValue, setStopValue] = useState<string>("");
  const [history, setHistory] = useState<Array<{ multiplier: number; won: boolean; amount?: number }>>([]);
  const [balance, setBalance] = useState<number>(1000); // Starting balance
  const [error, setError] = useState<string>("");
  const crashThreshold = useRef<number>(0);
  const [lastWin, setLastWin] = useState<number>(0);

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

          // Add grid labels
          ctx.save();
          ctx.transform(1, 0, 0, -1, 0, xMax);
          ctx.fillStyle = '#64748b';
          ctx.font = '12px Arial';
          ctx.fillText(`${(i / 40).toFixed(1)}x`, i + 5, xMax - 5);
          ctx.fillText(`${(i / 40).toFixed(1)}x`, 5, xMax - i - 5);
          ctx.restore();
        }

        // Draw crash line with gradient
        const endX:number = xMax * (currentMultiplier / 10);
        const endY:number = xMax * (currentMultiplier / 10);
        const gradient = ctx.createLinearGradient(0, 0, endX, endY);
        gradient.addColorStop(0, '#22c55e');
        gradient.addColorStop(1, '#eab308');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
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
          setLastWin(winValue);
          setBalance(prev => prev + winValue);
          setHistory(prev => [...prev, {
            multiplier: parseFloat(stopValue),
            won: true,
            amount: winValue
          }]);
          alertShown = true;
          setRunning(false);
        } else if (currentMultiplier >= crashThreshold.current && !alertShown) {
          setHistory(prev => [...prev, {
            multiplier: crashThreshold.current,
            won: false,
            amount: parseFloat(betValue)
          }]);
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

  const validateGame = (): boolean => {
    if (parseFloat(betValue) > balance) {
      setError("Insufficient balance");
      return false;
    }
    if (parseFloat(stopValue) < 1.01) {
      setError("Minimum cash out is 1.01x");
      return false;
    }
    return true;
  };

  const startGame = () => {
    setError("");
    if (!validateGame()) return;

    setBalance(prev => prev - parseFloat(betValue));
    crashThreshold.current = Math.random() * 9 + 1.5;
    setMultiplier(1);
    setLastWin(0);
    setRunning(true);
  };

  const isValidInput = Number(betValue) > 0 && Number(stopValue) > 0;

  return (
    <div className="min-h-screen bg-slate-900 p-8 mt-[100px]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Multiplier: <span className="text-green-500">{multiplier.toFixed(2)}x</span>
              </CardTitle>
              <div className="flex items-center gap-2 text-white">
                <Wallet className="h-5 w-5" />
                <span>{balance.toFixed(2)} RS</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {error && (
                  <div className="bg-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                  </div>
                )}
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
                  <div className="flex gap-2">
                    {[10, 50, 100, 500].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                        onClick={() => setBetValue(amount.toString())}
                      >
                        {amount}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Auto Cash Out (x)</Label>
                  <Input
                    type="number"
                    min="1.01"
                    step="0.01"
                    className="bg-slate-700 border-slate-600 text-white"
                    value={stopValue}
                    onChange={(e) => setStopValue(e.target.value)}
                    placeholder="Enter cash out multiplier"
                  />
                  <div className="flex gap-2">
                    {[1.5, 2, 5, 10].map((mult) => (
                      <Button
                        key={mult}
                        variant="outline"
                        className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                        onClick={() => setStopValue(mult.toString())}
                      >
                        {mult}x
                      </Button>
                    ))}
                  </div>
                </div>
                <Button
                  className={`w-full h-12 text-lg font-bold ${
                    running
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                  onClick={startGame}
                  disabled={!isValidInput || running}
                >
                  {running ? 'Game in Progress' : 'Start Game'}
                </Button>
                {lastWin > 0 && (
                  <div className="bg-green-500/20 text-green-400 p-3 rounded-lg text-center">
                    Won {lastWin.toFixed(2)} RS!
                  </div>
                )}
              </div>
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
                    className={`p-3 rounded flex justify-between items-center ${
                      game.won ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    <span>Crashed at {game.multiplier.toFixed(2)}x</span>
                    <span>{game.won ? `+${game.amount?.toFixed(2)}` : `-${game.amount?.toFixed(2)}`} RS</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <canvas
              ref={canvasRef}
              className="w-full h-full bg-slate-900 rounded-lg"
              style={{ aspectRatio: '1/1' }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
