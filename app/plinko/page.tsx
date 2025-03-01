'use client';
import { useMemo, useRef, useState } from 'react';
import Matter, { Engine, World, Bodies, Events, IEventCollision } from 'matter-js';

interface BallResult {
  ballId: number;
  result: string;
  winAmount: number;
  isWin: boolean;
}

interface Multipliers {
  [key: number]: number;
}

const MatterScene = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [autoStopValue, setAutoStopValue] = useState<string>('');
  const [activeButton, setActiveButton] = useState<"Manual" | "Auto">("Manual");
  const engineRef = useRef<Matter.Engine | null>(null);
  const [betValue, setBetValue] = useState<string>('');
  const [results, setResults] = useState<BallResult[]>([]);
  const [totalWinLoss, setTotalWinLoss] = useState<number>(0);
  const loggedBallIds = useRef<Set<number>>(new Set());
  const [ballsDropped, setBallsDropped] = useState<number>(0);
  const autoDropTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const multipliers: Multipliers = {
    1: 0.5,
    2: 0.75,
    3: 0.9,
    4: 1.5,
    5: 0.9,
    6: 0.75,
    7: 0.5,
    8: 1.2
  };

  const calculateWinLoss = (section: string, betAmount: number): { winAmount: number; isWin: boolean; multiplier: number } => {
    const sectionNumber = parseInt(section.split(' ')[1]);
    const multiplier = multipliers[sectionNumber] || 1;
    const winAmount = betAmount * multiplier - betAmount;

    return {
      winAmount,
      isWin: winAmount > 0,
      multiplier
    };
  };

  useMemo(() => {
    // Clear any existing render or scene
    if (renderRef.current) {
      Matter.Render.stop(renderRef.current);
      renderRef.current.canvas.remove();
    }

    if (!sceneRef.current) return;

    const engine = Engine.create({
      enableSleeping: false,
      gravity: { x: 0, y: 2, scale: 0.002 } // Reduced gravity scale
    });
    engineRef.current = engine;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: 'black',
      },
    });
    renderRef.current = render;

    const sectionWidth = 800 / 8;
    const sectionColors = [
      '#FF0000', '#FFA500', '#FFFF00', '#00FF00',
      '#0000FF', '#4B0082', '#8B00FF', '#FF69B4'
    ];

    const groundSections = sectionColors.map((color, i) =>
      Bodies.rectangle(
        sectionWidth / 2 + i * sectionWidth,
        580,
        sectionWidth,
        20,
        {
          isStatic: true,
          friction: 0.5,
          label: `Section ${i + 1}`,
          render: { fillStyle: color },
          restitution: 0.3,
        }
      )
    );

    const createPlinkoPegs = (): Matter.Body[] => {
      const pegs: Matter.Body[] = [];
      const rows = 10;
      const pegRadius = 5;
      const spacing = 60;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= row; col++) {
          pegs.push(
            Bodies.circle(
              400 - (row * spacing) / 2 + col * spacing,
              100 + row * spacing,
              pegRadius,
              {

                isStatic: true,
                render: { fillStyle: '#3498db' },
                friction: 0.3, // Increased friction
                restitution: 0.4, // Reduced bounciness
              }
            )
          );
        }
      }

      return pegs;
    };

    World.add(engine.world, [...createPlinkoPegs(), ...groundSections]);

    const handleCollision = (event: IEventCollision<Matter.Engine>): void => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const sectionBody = bodyA.label.startsWith('Section') ? bodyA :
          bodyB.label.startsWith('Section') ? bodyB : null;

        const ball = bodyA.label.startsWith('Section') ? bodyB : bodyA;

        if (sectionBody && !loggedBallIds.current.has(ball.id)) {
          const { winAmount, isWin } = calculateWinLoss(sectionBody.label, Number(betValue));

          setResults(prev => [...prev, {
            ballId: ball.id,
            result: sectionBody.label,
            winAmount,
            isWin
          }]);

          setTotalWinLoss(prev => prev + winAmount);
          loggedBallIds.current.add(ball.id);

          setTimeout(() => {
            World.remove(engine.world, ball);
          }, 1000);
        }
      });
    };

    Events.on(engine, 'collisionStart', handleCollision);

    const handleRender = (): void => {
      const ctx = render.context;
      if (!ctx) return;

      ctx.textAlign = 'center';
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = 'white';

      Object.entries(multipliers).forEach(([section, multiplier]) => {
        const sectionIndex = parseInt(section) - 1;
        const x = sectionWidth / 2 + sectionIndex * sectionWidth;
        ctx.fillText(`${multiplier}x`, x, 550);
      });

      ctx.font = 'bold 24px Arial';
      ctx.fillText('PLINKO', 400, 40);
    };

    Events.on(render, 'afterRender', handleRender);

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    return () => {
      if (autoDropTimeoutRef.current) {
        clearTimeout(autoDropTimeoutRef.current);
      }
      Events.off(engine, 'collisionStart', handleCollision);
      Events.off(render, 'afterRender', handleRender);

      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        renderRef.current.canvas.remove();
      }

      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }

      World.clear(engine.world, true);
      Engine.clear(engine);
    };
  }, [betValue]);

  const handleClick = (button: "Manual" | "Auto"): void => {
    if (autoDropTimeoutRef.current) {
      clearTimeout(autoDropTimeoutRef.current);
    }
    setActiveButton(button);
  };

  const createSlowerBall = () => {
    if (!engineRef.current) return null;

    return Bodies.circle(
      Math.floor(Math.random() * (410 - 390 + 1)) + 390,
      50,
      10,
      {
        restitution: 0.3, // Reduced bounciness
        friction: 0.005, // Increased friction
        density: 0.003, // Slightly increased density
        render: { fillStyle: '#FFFFFF' },
        collisionFilter: {
          category: 0x0002,
        },
      }
    );
  };

  const autoDropBallsStop = async (): Promise<void> => {
    if (!engineRef.current) return;

    const count = parseInt(autoStopValue);
    if (isNaN(count) || count <= 0) return;

    let ballsLeft = count;

    const dropNextBall = () => {
      if (ballsLeft <= 0) {
        if (autoDropTimeoutRef.current) {
          clearTimeout(autoDropTimeoutRef.current);
        }
        return;
      }

      const ball = createSlowerBall();
      if (!ball || !engineRef.current) return;

      Matter.Body.setVelocity(ball, {
        x: 0,
        y: 3 // Reduced initial velocity
      });

      World.add(engineRef.current.world, ball);
      setBallsDropped(prev => prev + 1);
      ballsLeft--;

      // Schedule next ball drop with longer delay
      autoDropTimeoutRef.current = setTimeout(dropNextBall, 2000); // 2 second delay between balls
    };

    dropNextBall();
  };

  const dropBall = (): void => {
    if (!engineRef.current || !betValue) return;

    const currentBet = Number(betValue);
    if (isNaN(currentBet) || currentBet <= 0) return;

    const ball = createSlowerBall();
    if (!ball) return;

    Matter.Body.setVelocity(ball, {
      x: 0,
      y: 3
    });

    World.add(engineRef.current.world, ball);
    setBallsDropped(prev => prev + 1);

    if (activeButton === "Auto" && autoStopValue) {
      const count = parseInt(autoStopValue);
      if (ballsDropped + 1 >= count) {
        setBallsDropped(0);
      }
    }
  };

  const resetGame = (): void => {
    if (autoDropTimeoutRef.current) {
      clearTimeout(autoDropTimeoutRef.current);
    }
    setResults([]);
    setTotalWinLoss(0);
    setBallsDropped(0);
    loggedBallIds.current.clear();
  };

  return (
    <div className="flex justify-center items-center h-svh bg-blue-gray-500 mt-[50px] gap-10 overflow-scroll">
      <div className="bg-slate-600 p-11 rounded-lg">
        <div className="flex flex-col gap-7 mb-10">
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${activeButton === "Manual"
                  ? "bg-red-300 text-white"
                  : "bg-white text-black"
                  }`}
                onClick={() => handleClick("Manual")}
              >
                Manual
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${activeButton === "Auto"
                  ? "bg-red-300 text-white"
                  : "bg-white text-black"
                  }`}
                onClick={() => handleClick("Auto")}
              >
                Auto
              </button>
            </div>
          </div>

          <label>Bet Value</label>
          <input
            type="number"
            className="border-3 border-black w-[300px] h-[50px] text-red-500"
            value={betValue}
            onChange={(e) => setBetValue(e.target.value)}
          />
        </div>

        {activeButton === "Auto" && (
          <>
            <label>Stop value:</label>
            <br />
            (It will stop when the ball hits the stop value)
            <br />
            <input
              type="number"
              className="border-3 border-black w-[300px] h-[50px] text-red-500"
              value={autoStopValue}
              onChange={(e) => setAutoStopValue(e.target.value)}
            />
          </>
        )}
        <div className="mb-5">
          Total Win/Loss: {totalWinLoss >= 0 ? '+' : ''}{totalWinLoss.toFixed(2)}
        </div>
        <div className="flex gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={dropBall}
          >
            Start Game
          </button>
          {activeButton === "Auto" && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={autoDropBallsStop}
            >
              Start Auto Game
            </button>
          )}
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={resetGame}
          >
            Reset
          </button>
        </div>

        <div className="mt-5">
          <h3 className="font-bold">Recent Results:</h3>
          <div className="max-h-[200px] overflow-y-auto w-[100]">
            {results.slice(-10).map((result, index) => (
              <div
                key={index}
                className={`p-2 ${result.isWin ? 'bg-green-900' : 'bg-red-900'}`}
              >
                {result.result} - {result.isWin ? '+' : ''}{result.winAmount.toFixed(2)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div ref={sceneRef} />
    </div>
  );
};

export default MatterScene;
