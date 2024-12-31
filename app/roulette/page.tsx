"use client";
import React, { useState } from "react";

const RouletteBoard = () => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const numbers = [
    [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
    [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  ];

  const getNumberColor = (num: number) => {
    if (num === 0) return "bg-green-600";
    return [
      1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
    ].includes(num)
      ? "bg-red-600"
      : "bg-black";
  };

  return (
    <div className="max-w-4xl mx-auto p-4 grid mt-10 gap-0  items-center flex-col h-screen w-screen">
      <div className="flex">
        {/* Zero */}
        <button
          className={`w-16 h-32 ${getNumberColor(
            0
          )} text-white border border-white flex items-center justify-center hover:opacity-75 transition-opacity`}
          onClick={() => setSelectedNumber(0)}
        >
          0
        </button>

        {/* Main numbers grid */}
        <div className="flex-1">
          {numbers.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((num) => (
                <button
                  key={num}
                  className={`w-16 h-10 ${getNumberColor(
                    num
                  )} text-white border border-white flex items-center justify-center hover:opacity-75 transition-opacity`}
                  onClick={() => setSelectedNumber(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="mt-2 flex">
        <button className="flex-1 h-10 bg-gray-800 text-white border border-white hover:opacity-75 transition-opacity">
          1st 12
        </button>
        <button className="flex-1 h-10 bg-gray-800 text-white border border-white hover:opacity-75 transition-opacity">
          2nd 12
        </button>
        <button className="flex-1 h-10 bg-gray-800 text-white border border-white hover:opacity-75 transition-opacity">
          3rd 12
        </button>
      </div>

      <div className="mt-2 flex">
        <button className="flex-1 h-10 bg-gray-800 text-white border border-white hover:opacity-75 transition-opacity">
          1-18
        </button>
        <button className="flex-1 h-10 bg-gray-800 text-white border border-white hover:opacity-75 transition-opacity">
          EVEN
        </button>
        <button className="flex-1 h-10 bg-red-600 text-white border border-white hover:opacity-75 transition-opacity">
          RED
        </button>
        <button className="flex-1 h-10 bg-black text-white border border-white hover:opacity-75 transition-opacity">
          BLACK
        </button>
        <button className="flex-1 h-10 bg-gray-800 text-white border border-white hover:opacity-75 transition-opacity">
          ODD
        </button>
        <button className="flex-1 h-10 bg-gray-800 text-white border border-white hover:opacity-75 transition-opacity">
          19-36
        </button>
      </div>

      {selectedNumber !== null && (
        <div className="mt-4 text-center">Selected: {selectedNumber}</div>
      )}

      <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ">
        Spin
      </button>
    </div>
  );
};

export default RouletteBoard;
