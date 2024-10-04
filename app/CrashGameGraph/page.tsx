import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  time: number;
  multiplier: number;
}

const CrashGameGraph = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [crashed, setCrashed] = useState(false);
  const [multiplier, setMultiplier] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {  
      if (!crashed) {
        setMultiplier(prev => {
          const newMultiplier = prev * 1.01;
          if (Math.random() < 0.02 || newMultiplier > 10) {
            setCrashed(true);
            clearInterval(interval);
            return prev;
          }
          return newMultiplier;
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [crashed]);

  useEffect(() => {
    setData(prevData => [...prevData, { time: prevData.length, multiplier }]);
  }, [multiplier]);

  const handleRestart = () => {
    setData([]);
    setCrashed(false);
    setMultiplier(1);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="mb-4 text-center">
        <span className="text-2xl font-bold">{multiplier.toFixed(2)}x</span>
      </div>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[1, 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="multiplier" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {crashed && (
        <div className="mt-4 text-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleRestart}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default CrashGameGraph;