'use client';
import { useEffect, useRef, useState } from 'react';
import Matter, { Engine, World, Render, Bodies, Events, Runner, Body } from 'matter-js';

interface BallResult {
  ballId: number;
  result: string;
}

const MatterScene = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [betValue, setBetValue] = useState<string>('');
  const [stopValue, setStopValue] = useState<string>('');
  const [dropCount, setDropCount] = useState<number>(0);
  const [results, setResults] = useState<BallResult[]>([]);
  const [engine, setEngine] = useState<Engine | null>(null);
  const loggedBallIds = useRef<Set<number>>(new Set()); // Track processed balls

  useEffect(() => {
    // Create an engine and a renderer
    const newEngine = Matter.Engine.create();
    setEngine(newEngine);
    const { world } = newEngine;

    if (sceneRef.current) {
      const render = Matter.Render.create({
        element: sceneRef.current,
        engine: newEngine,
        options: {
          width: 800,
          height: 600,
          wireframes: false,
          background: 'black',
        },
      });

      // Create the ground sections
      const groundSections: Matter.Body[] = [];
      const sectionWidth = 800 / 7; // Divide the width into 7 parts

      for (let i = 0; i < 7; i++) {
        const section = Matter.Bodies.rectangle(
          sectionWidth / 2 + i * sectionWidth, // X position
          580, // Y position
          sectionWidth, // Width
          20, // Height
          {
            isStatic: false,
            friction: 0,
            label: `Section ${i + 1}`,
            render: { fillStyle: '#95a5a6' },
            restitution: 0,
          }
        );
        groundSections.push(section);
      }

      // Create a function to generate a Plinko-style grid of pegs
      const createPlinkoPegs = () => {
        const pegs: Matter.Body[] = [];
        const rows = 10; // Number of rows in the triangle
        const pegRadius = 5; // Radius of each peg
        const spacing = 60; // Space between pegs

        // Generate the pegs in a triangular pattern
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col <= row; col++) {
            const x = 400 - (row * spacing) / 2 + col * spacing;
            const y = 100 + row * spacing;
            const peg = Matter.Bodies.circle(x, y, pegRadius, {
              isStatic: true,
              render: { fillStyle: '#3498db' },
            });
            pegs.push(peg);
          }
        }

        return pegs;
      };

      // Create the Plinko pegs
      const pegs = createPlinkoPegs();

      // Add all bodies to the world
      Matter.World.add(world, [...pegs, ...groundSections]);

      // Run the engine
      const runner = Matter.Runner.create();
      Matter.Runner.run(runner, newEngine);

      // Animation loop for smooth rendering
      const animate = () => {
        Matter.Engine.update(newEngine);
        render.canvas.width = render.canvas.width; // Clear the canvas
        Matter.Render.world(render); // Render the updated world
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);

      // Cleanup on component unmount
      return () => {
        Matter.Render.stop(render);
        Matter.Runner.stop(runner);
        Matter.World.clear(world, true); // Clear all bodies and constraints
        Matter.Engine.clear(newEngine);
        render.canvas.remove();
        render.textures = {};
      };
    }
  }, []);

  // Function to create and drop a new ball
  const dropBall = () => {
    if (!engine) return;

    const { world } = engine;
    const randomX = Math.floor(Math.random() * (410 - 390 + 1)) + 390; // Random X position between 390 and 410
    const ball = Matter.Bodies.circle(randomX, 50, 10, {
      restitution: 0.8, // Bounciness
      render: { fillStyle: '#e74c3c' },
    });

    Matter.World.add(world, ball);
    setDropCount((prev) => prev + 1);

    // Collision detection for the new ball
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        if (bodyA.label.startsWith('Section') || bodyB.label.startsWith('Section')) {
          const sectionLabel = bodyA.label.startsWith('Section') ? bodyA.label : bodyB.label;

          // Track the ball's result only if it hasn't been processed before
          if (bodyA === ball || bodyB === ball) {
            if (!loggedBallIds.current.has(ball.id)) {
              const ballResult: BallResult = {
                ballId: ball.id, // Ball's unique ID
                result: sectionLabel,
              };

              setResults((prev) => [...prev, ballResult]); // Update results with the ball's final section
              loggedBallIds.current.add(ball.id); // Mark ball as processed
            }
          }
        }
      });
    });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', backgroundColor: 'black', color: '#fff' }}>
      <div className="flex justify-center items-center h-svh bg-blue-gray-500 mt-[50px] gap-10 overflow-scroll">
        <div className="bg-slate-600 p-11 rounded-lg">
          <div className="flex flex-col gap-7 mb-10">
            <label>Bet Value</label>
            <input
              type="number"
              style={{ border: '3px solid black', width: '300px', height: '50px', color: 'red' }}
              onChange={(e) => setBetValue(e.target.value)}
            />
            <label>Stop Value</label>
            <input
              type="number"
              style={{ border: '3px solid black', width: '300px', height: '50px' , color: 'red' }}
              value={stopValue}
              onChange={(e) => setStopValue(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={dropBall}
          >
            Start Game
          </button>
        </div>
        <div style={{ marginTop: '20px', color: '#fff', overflow: 'scroll', width: '100%', height: '500px' }}>
          <h3>Results:</h3>
          {results.map((result, index) => (
            <div key={index}>
              Ball {result.ballId} landed in {result.result}
            </div>
          ))}
        </div>
        <div ref={sceneRef} />
      </div>
    </div>
  );
};

export default MatterScene;
