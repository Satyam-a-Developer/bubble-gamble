import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const SectionProfitOverlay = ({ results, multipliers }) => {
  const [isVisible, setIsVisible] = useState(false);

  const sectionData = useMemo(() => {
    const sectionStats = {
      1: [], 2: [], 3: [], 4: [], 
      5: [], 6: [], 7: [], 8: []
    };

    let runningTotals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };

    results.forEach((result, index) => {
      const sectionNum = parseInt(result.result.split(' ')[1]);
      runningTotals[sectionNum] += result.winAmount;

      Object.keys(sectionStats).forEach(section => {
        if (section === sectionNum.toString()) {
          sectionStats[section].push({
            index: index + 1,
            profit: runningTotals[section],
            multiplier: multipliers[section]
          });
        } else {
          sectionStats[section].push({
            index: index + 1,
            profit: runningTotals[section],
            multiplier: multipliers[section]
          });
        }
      });
    });

    return Object.entries(sectionStats).flatMap(([section, data]) => 
      data.map(point => ({
        ...point,
        section: `Section ${section}`
      }))
    );
  }, [results, multipliers]);

  const toggleOverlay = () => setIsVisible(!isVisible);

  if (!isVisible) {
    return (
      <button 
        onClick={toggleOverlay} 
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full z-50"
      >
        Show Profit Chart
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg relative">
        <button 
          onClick={toggleOverlay} 
          className="absolute top-2 right-2 text-white bg-red-500 p-2 rounded-full"
        >
          Close
        </button>
        <LineChart width={800} height={500} data={sectionData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="index" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#333', color: '#fff' }}
            formatter={(value, name) => [
              value.toFixed(2), 
              name === 'profit' ? 'Cumulative Profit' : 
              name === 'multiplier' ? 'Multiplier' : name
            ]}
          />
          <Legend />
          {Object.keys(multipliers).map((section, index) => (
            <Line
              key={section}
              type="monotone"
              dataKey="profit"
              data={sectionData.filter(d => d.section === `Section ${section}`)}
              stroke={`hsl(${index * 45}, 70%, 50%)`}
              name={`Section ${section}`}
            />
          ))}
        </LineChart>
      </div>
    </div>
  );
};

export default SectionProfitOverlay;