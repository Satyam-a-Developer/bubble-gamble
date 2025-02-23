'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, ChevronsUpDown } from 'lucide-react';

interface NumberPosition {
  number: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Bet {
  type: string;
  amount: number;
}

const ROULETTE_NUMBERS = {
  standard: Array.from({ length: 36 }, (_, i) => i + 1),
  red: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
  black: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]
};

export default function RouletteGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wheelCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<string>('');
  const [balance, setBalance] = useState<number>(50000);
  const [activeBets, setActiveBets] = useState<Bet[]>([]);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [history, setHistory] = useState<Array<{ number: number; color: string }>>([]);
  const [winAmount, setWinAmount] = useState<number>(0);

  const drawWheel = (ctx: CanvasRenderingContext2D, rotation: number = 0) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    // Draw wheel segments
    const totalNumbers = 37; // 0-36
    const anglePerSegment = (2 * Math.PI) / totalNumbers;

    for (let i = 0; i < totalNumbers; i++) {
      const startAngle = i * anglePerSegment;
      const endAngle = (i + 1) * anglePerSegment;
      const number = (totalNumbers - i - 1) % totalNumbers;

      // Determine segment color
      let color = '#008000'; // Green for 0
      if (number !== 0) {
        color = ROULETTE_NUMBERS.red.includes(number) ? '#FF0000' : '#000000';
      }

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Draw numbers
      ctx.save();
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(number.toString(), radius * 0.75, 0);
      ctx.restore();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.restore();
  };

  const drawTable = (ctx: CanvasRenderingContext2D): void => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set table background
    ctx.fillStyle = "#006400";
    ctx.fillRect(0, 0, width, height);

    // Draw 0 and 00
    const zeroWidth = width * 0.1;
    const numberHeight = height * 0.2;

    ctx.fillStyle = "#008000";
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;

    // Draw 0
    ctx.fillRect(0, 0, zeroWidth, numberHeight);
    ctx.strokeRect(0, 0, zeroWidth, numberHeight);

    // Draw numbers 1-36
    const numberWidth = (width - zeroWidth) / 12;
    const numbers: NumberPosition[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 12; col++) {
        const number = col * 3 + (3 - row);
        numbers.push({
          number,
          x: zeroWidth + col * numberWidth,
          y: row * numberHeight,
          width: numberWidth,
          height: numberHeight,
        });

        ctx.fillStyle = ROULETTE_NUMBERS.red.includes(number) ? "#FF0000" : "#000000";
        ctx.fillRect(
          zeroWidth + col * numberWidth,
          row * numberHeight,
          numberWidth,
          numberHeight
        );

        ctx.strokeRect(
          zeroWidth + col * numberWidth,
          row * numberHeight,
          numberWidth,
          numberHeight
        );

        // Highlight selected bet
        if (selectedBet === number.toString()) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          ctx.fillRect(
            zeroWidth + col * numberWidth,
            row * numberHeight,
            numberWidth,
            numberHeight
          );
        }

        // Draw number text
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          number.toString(),
          zeroWidth + col * numberWidth + numberWidth / 2,
          row * numberHeight + numberHeight / 2
        );
      }
    }

    // Draw 0 text
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("0", zeroWidth / 2, numberHeight / 2);

    // Draw betting areas
    const bettingHeight = height - numberHeight * 3;
    const sections = ["1st 12", "2nd 12", "3rd 12"];
    const sectionWidth = (width - zeroWidth) / 3;

    sections.forEach((section, i) => {
      ctx.fillStyle = "#006400";
      if (selectedBet === section) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      }
      ctx.fillRect(
        zeroWidth + i * sectionWidth,
        numberHeight * 3,
        sectionWidth,
        bettingHeight / 3
      );
      ctx.strokeRect(
        zeroWidth + i * sectionWidth,
        numberHeight * 3,
        sectionWidth,
        bettingHeight / 3
      );

      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(
        section,
        zeroWidth + i * sectionWidth + sectionWidth / 2,
        numberHeight * 3 + bettingHeight / 6
      );
    });

    // Draw bottom betting options
    const bottomOptions = ["1-18", "EVEN", "RED", "BLACK", "ODD", "19-36"];
    const bottomWidth = (width - zeroWidth) / 6;

    bottomOptions.forEach((option, i) => {
      ctx.fillStyle = "#006400";
      if (selectedBet === option) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      }
      ctx.fillRect(
        zeroWidth + i * bottomWidth,
        height - bettingHeight / 3,
        bottomWidth,
        bettingHeight / 3
      );
      ctx.strokeRect(
        zeroWidth + i * bottomWidth,
        height - bettingHeight / 3,
        bottomWidth,
        bettingHeight / 3
      );

      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(
        option,
        zeroWidth + i * bottomWidth + bottomWidth / 2,
        height - bettingHeight / 6
      );
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (spinning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert click coordinates to table position and determine bet
    const width = canvas.width;
    const height = canvas.height;
    const zeroWidth = width * 0.1;
    const numberHeight = height * 0.2;

    if (x < zeroWidth && y < numberHeight) {
      setSelectedBet("0");
      return;
    }

    // Check number clicks
    const numberWidth = (width - zeroWidth) / 12;
    if (y < numberHeight * 3) {
      const col = Math.floor((x - zeroWidth) / numberWidth);
      const row = Math.floor(y / numberHeight);
      const number = col * 3 + (3 - row);
      if (number >= 1 && number <= 36) {
        setSelectedBet(number.toString());
        return;
      }
    }

    // Check bottom betting options
    const bettingHeight = height - numberHeight * 3;
    if (y > height - bettingHeight / 3) {
      const bottomWidth = (width - zeroWidth) / 6;
      const section = Math.floor((x - zeroWidth) / bottomWidth);
      const options = ["1-18", "EVEN", "RED", "BLACK", "ODD", "19-36"];
      if (section >= 0 && section < options.length) {
        setSelectedBet(options[section]);
        return;
      }
    }

    // Check dozen bets
    if (y > numberHeight * 3 && y < height - bettingHeight / 3) {
      const sectionWidth = (width - zeroWidth) / 3;
      const section = Math.floor((x - zeroWidth) / sectionWidth);
      const options = ["1st 12", "2nd 12", "3rd 12"];
      if (section >= 0 && section < options.length) {
        setSelectedBet(options[section]);
        return;
      }
    }
  };

  const placeBet = () => {
    if (!selectedBet || !betAmount || spinning) return;

    const amount = parseFloat(betAmount);
    if (amount <= 0 || amount > balance) return;

    setBalance(prev => prev - amount);
    setActiveBets(prev => [...prev, { type: selectedBet, amount }]);
    setBetAmount('');
  };

  const calculateWinnings = (result: number) => {
    let winnings = 0;

    activeBets.forEach(bet => {
      if (bet.type === result.toString()) {
        winnings += bet.amount * 35;
      } else if (bet.type === "RED" && ROULETTE_NUMBERS.red.includes(result)) {
        winnings += bet.amount * 2;
      } else if (bet.type === "BLACK" && ROULETTE_NUMBERS.black.includes(result)) {
        winnings += bet.amount * 2;
      } else if (bet.type === "EVEN" && result % 2 === 0 && result !== 0) {
        winnings += bet.amount * 2;
      } else if (bet.type === "ODD" && result % 2 === 1) {
        winnings += bet.amount * 2;
      } else if (bet.type === "1-18" && result >= 1 && result <= 18) {
        winnings += bet.amount * 2;
      } else if (bet.type === "19-36" && result >= 19 && result <= 36) {
        winnings += bet.amount * 2;
      } else if (bet.type === "1st 12" && result >= 1 && result <= 12) {
        winnings += bet.amount * 3;
      } else if (bet.type === "2nd 12" && result >= 13 && result <= 24) {
        winnings += bet.amount * 3;
      } else if (bet.type === "3rd 12" && result >= 25 && result <= 36) {
        winnings += bet.amount * 3;
      }
    });

    return winnings;
  };

  const spin = async () => {
    if (spinning || activeBets.length === 0) return;

    setSpinning(true);
    const wheelCanvas = wheelCanvasRef.current;
    if (!wheelCanvas) return;

    const ctx = wheelCanvas.getContext('2d');
    if (!ctx) return;

    let rotation = 0;
    const result = Math.floor(Math.random() * 37);
    const finalRotation = 10 * Math.PI + (result / 37) * 2 * Math.PI;
    const duration = 5000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth deceleration
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      rotation = finalRotation * easeOut(progress);

      drawWheel(ctx, rotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setLastResult(result);
        const winnings = calculateWinnings(result);
        setWinAmount(winnings);
        setBalance(prev => prev + winnings);
        setActiveBets([]);
        setSpinning(false);
        setHistory(prev => [
          {
            number: result,
            color: result === 0 ? 'green' : ROULETTE_NUMBERS.red.includes(result) ? 'red' : 'black'
          },
          ...prev.slice(0, 9)
        ]);
      }
    };

    animate();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wheelCanvas = wheelCanvasRef.current;
    if (!canvas || !wheelCanvas) return;

    const ctx = canvas.getContext('2d');
    const wheelCtx = wheelCanvas.getContext('2d');
    if (!ctx || !wheelCtx) return;

    // Set canvas sizes
    canvas.width = 800;
    canvas.height = 400;
    wheelCanvas.width = 400;
    wheelCanvas.height = 400;

    // Initial draws
    drawTable(ctx);
    drawWheel(wheelCtx);
  }, []);

  // Redraw table when selected bet changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawTable(ctx);
  }, [selectedBet]);

  const quickBets = [10, 50, 100, 500];

  return (
    <div className="min-h-screen bg-slate-900 p-8 mt-[100px]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white">Roulette</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <Wallet className="h-5 w-5" />
                <span className="text-xl">{balance.toFixed(2)} RS</span>
              </div>
              {spinning && (
                <div className="text-yellow-500 animate-pulse flex items-center gap-2">
                  <ChevronsUpDown className="h-5 w-5" />
                  Spinning...
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Wheel and History */}
          <div className="space-y-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <canvas
                  ref={wheelCanvasRef}
                  className="w-full rounded-lg"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {history.map((result, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-full w-10 h-10 flex items-center justify-center text-white
                        ${result.color === 'red' ? 'bg-red-600' :
                          result.color === 'black' ? 'bg-black' : 'bg-green-600'}`}
                    >
                      {result.number}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Table and Controls */}
          <div className="space-y-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <canvas
                  ref={canvasRef}
                  onClick={handleClick}
                  className="w-full rounded-lg cursor-pointer"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-white text-lg">Selected: {selectedBet || 'None'}</Label>
                    {winAmount > 0 && (
                      <div className="text-green-400 font-bold">
                        Won: {winAmount.toFixed(2)} RS
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Bet Amount</Label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      className="bg-slate-700 border-slate-600 text-white"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      placeholder="Enter bet amount"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      {quickBets.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                          onClick={() => setBetAmount(amount.toString())}
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                      onClick={placeBet}
                      disabled={!selectedBet || !betAmount || spinning || parseFloat(betAmount) > balance}
                    >
                      Place Bet
                    </Button>
                    <Button
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3"
                      onClick={spin}
                      disabled={spinning || activeBets.length === 0}
                    >
                      Spin
                    </Button>
                  </div>
                </div>

                {/* Active Bets */}
                {activeBets.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-white">Active Bets</Label>
                    <div className="space-y-2">
                      {activeBets.map((bet, index) => (
                        <div
                          key={index}
                          className="bg-slate-700 p-2 rounded flex justify-between items-center text-white"
                        >
                          <span>{bet.type}</span>
                          <span>{bet.amount} RS</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
