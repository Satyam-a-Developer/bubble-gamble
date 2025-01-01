'use client'
import React, { useEffect, useRef, useState } from 'react';

interface NumberPosition {
  number: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const RouletteTable: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  
  const drawTable = (ctx: CanvasRenderingContext2D): void => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set table background
    ctx.fillStyle = '#006400';
    ctx.fillRect(0, 0, width, height);
    
    // Draw 0 and 00
    const zeroWidth = width * 0.1;
    const numberHeight = height * 0.2;
    
    ctx.fillStyle = '#008000';
    ctx.strokeStyle = '#FFFFFF';
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
          height: numberHeight
        });
        
        // Set color based on number
        ctx.fillStyle = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(number) 
          ? '#FF0000' 
          : '#000000';
          
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
        
        // Draw number text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          number.toString(),
          zeroWidth + col * numberWidth + numberWidth / 2,
          row * numberHeight + numberHeight / 2
        );
      }
    }
    
    // Draw 0 text
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(
      '0',
      zeroWidth / 2,
      numberHeight / 2
    );
    
    // Draw betting areas
    const bettingHeight = height - (numberHeight * 3);
    const sections: string[] = ['1st 12', '2nd 12', '3rd 12'];
    const sectionWidth = (width - zeroWidth) / 3;
    
    sections.forEach((section, i) => {
      ctx.fillStyle = '#006400';
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
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(
        section,
        zeroWidth + i * sectionWidth + sectionWidth / 2,
        numberHeight * 3 + bettingHeight / 6
      );
    });
    
    // Draw bottom betting options
    const bottomOptions: string[] = [
      '1-18', 'EVEN', 'RED', 'BLACK', 'ODD', '19-36'
    ];
    
    const bottomWidth = (width - zeroWidth) / 6;
    bottomOptions.forEach((option, i) => {
      ctx.fillStyle = '#006400';
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
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(
        option,
        zeroWidth + i * bottomWidth + bottomWidth / 2,
        height - bettingHeight / 6
      );
    });
  };
  
  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>): void => {
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
      setSelectedBet('0');
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
    const bettingHeight = height - (numberHeight * 3);
    if (y > height - bettingHeight / 3) {
      const bottomWidth = (width - zeroWidth) / 6;
      const section = Math.floor((x - zeroWidth) / bottomWidth);
      const options = ['1-18', 'EVEN', 'RED', 'BLACK', 'ODD', '19-36'];
      if (section >= 0 && section < options.length) {
        setSelectedBet(options[section]);
        return;
      }
    }
    
    // Check dozen bets
    if (y > numberHeight * 3 && y < height - bettingHeight / 3) {
      const sectionWidth = (width - zeroWidth) / 3;
      const section = Math.floor((x - zeroWidth) / sectionWidth);
      const options = ['1st 12', '2nd 12', '3rd 12'];
      if (section >= 0 && section < options.length) {
        setSelectedBet(options[section]);
        return;
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;
    
    // Initial draw
    drawTable(ctx);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 h-screen justify-center">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="border rounded-lg cursor-pointer"
      />
      {selectedBet && (
        <div className="text-xl font-bold">
          Selected Bet: {selectedBet}
        </div>
      )}
    </div>
  );
};

export default RouletteTable;