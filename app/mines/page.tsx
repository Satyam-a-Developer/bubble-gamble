"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

export default function Page() {
  const [randombomb, setRandomBomb] = useState<number[]>([]);
  const [betvalue, setbetvalue] = useState(" ");
  const [bet, setBet] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<"Manual" | "Auto">("Manual");
  const [activeBoxes, setActiveBoxes] = useState<boolean[]>(
    Array(25).fill(false)
  );
  const [mines, setMines] = useState<number>(1);
  const handleClick = (button: "Manual" | "Auto") => {
    setActiveButton(button);
  };

  const handleBoxClick = (index: number) => {
    const newActiveBoxes = activeBoxes.map((box, i) =>
      i === index ? !box : box
    );
    setActiveBoxes(newActiveBoxes);
    if (randombomb.includes(index)) {
      let Betvalue:number=  Number (50000 - betvalue);
      console.log(Betvalue);
      alert(`'You hit a bomb! You lost.Currently u have ${kedk}'`);
    }
  };

  const handleBet = () => {
    const newRandomBomb: number[] = [];
    setBet(true);
    const bombCount = mines;

    while (newRandomBomb.length < bombCount) {
      const randomIndex = Math.floor(Math.random() * 25);
      if (!newRandomBomb.includes(randomIndex)) {
        newRandomBomb.push(randomIndex);
      }
    }
    setRandomBomb(newRandomBomb);
  };

  return (
    <div className="flex items-center justify-between p-24 m-[5px]">
      <div className="w-[1300px] h-[700px] bg-slate-50 flex flex-row">
        <div className="w-[350px] h-[700px] bg-slate-400 flex flex-col items-center justify-center">
          <div className="w-[300px] m-10 rounded-md flex justify-center">
            <button
              className="text-black rounded-s-lg p-3"
              style={{
                backgroundColor:
                  activeButton === "Manual" ? "#8d99ae" : "white",
              }}
              aria-pressed={activeButton === "Manual"}
              onClick={() => handleClick("Manual")}
            >
              Manual
            </button>
            <button
              dir="rtl"
              className="text-black rounded-s-lg p-5"
              style={{
                backgroundColor: activeButton === "Auto" ? "#8d99ae" : "white",
              }}
              aria-pressed={activeButton === "Auto"}
              onClick={() => handleClick("Auto")}
            >
              Auto
            </button>
          </div>
          <div className="w-[350px] h-[700px] overflow-hidden flex">
            <Card className="w-[350px] bg-slate-700 text-white h-[400px]">
              <CardContent>
                <form>
                  <div className="grid w-full h-full gap-4">
                    <div className="flex flex-col space-y-1.5 m-3">
                      <Label htmlFor="name">Your bet</Label>
                      <Input
                        id="name"
                        placeholder="Bet Amount"
                        type="number"
                        onChange={(e) => {
                          setbetvalue(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5 m-3 text-white">
                      <Label htmlFor="framework">Mines</Label>
                      <Select
                        onValueChange={(value) => setMines(Number(value))}
                      >
                        <SelectTrigger id="framework">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {[...Array(24).keys()].map((num) => (
                            <SelectItem key={num + 1} value={num + 1}>
                              {num + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </form>
                <CardFooter className="flex justify-center gap-3">
                  <Button variant="outline" onClick={handleBet}>
                    Bet
                  </Button>
                </CardFooter>
              </CardContent>
            </Card>
          </div>
        </div>
          
        {bet && (
          <div className="grid grid-cols-5 gap-4">
            {activeBoxes.map((isActive, index) => (
              <div
                key={index}
                className="w-40 h-30 shadow-2xl bg-no-repeat bg-center bg-cover resize"
                style={{
                  backgroundImage: isActive
                    ? randombomb.includes(index)
                      ? 'url("https://i.postimg.cc/dV2WHj8Z/new.jpg")'
                      : "url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2076.61%2070%22%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill%3A%23051d27%3B%7D.cls-2%7Bfill%3A%2306e403%3B%7D.cls-3%7Bfill%3A%2305a902%3B%7D.cls-4%7Bfill%3A%2301e501%3B%7D.cls-5%7Bfill%3A%2300d503%3B%7D.cls-6%7Bfill%3A%2309fd02%3B%7D.cls-7%7Bfill%3A%23019902%3B%7D.cls-8%7Bfill%3A%2301e300%3B%7D.cls-9%7Bfill%3A%2357fd7f%3B%7D.cls-10%7Bfill%3A%2303be02%3B%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Ctitle%3E3Artboard%20710%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_1%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20class%3D%22cls-1%22%20d%3D%22M38%2C70h0a2.75%2C2.75%2C0%2C0%2C1-2-.92L.7%2C29.62a2.76%2C2.76%2C0%2C0%2C1-.31-3.25L11%2C8.55a2.76%2C2.76%2C0%2C0%2C1%2C1.27-1.12L23.12%2C2.71a2.77%2C2.77%2C0%2C0%2C1%2C.62-.19L37.74%2C0a3.09%2C3.09%2C0%2C0%2C1%2C1%2C0L52.62%2C2.52a3.38%2C3.38%2C0%2C0%2C1%2C.62.18L64.42%2C7.58l.13%2C0h0a2.69%2C2.69%2C0%2C0%2C1%2C.65.45h0a3%2C3%2C0%2C0%2C1%2C.4.47h0l.09.14L76.23%2C26.6a2.73%2C2.73%2C0%2C0%2C1-.34%2C3.25L40.06%2C69.1A2.76%2C2.76%2C0%2C0%2C1%2C38%2C70Z%22%2F%3E%3Cpath%20class%3D%22cls-2%22%20d%3D%22M22.13%2C18.75c-2.64%2C7-1.74%2C13.65%2C2.09%2C20%2C6.74-3.1%2C11.83-8.4%2C14.44-17C33%2C18.93%2C27.49%2C17.74%2C22.13%2C18.75Z%22%2F%3E%3Cpath%20class%3D%22cls-3%22%20d%3D%22M73.86%2C28%2C63.33%2C10.1c-6.26%2C1.19-8.79%2C4.41-9%2C8.91C58.67%2C25.3%2C65.39%2C28%2C73.86%2C28Z%22%2F%3E%3Cpath%20class%3D%22cls-4%22%20d%3D%22M38.49%2C21.94c.15%2C7.77%2C4.2%2C13.31%2C12.19%2C16.57l.07%2C0c4.5-5.59%2C5.9-12%2C3.62-19.47C48.26%2C16.08%2C42.9%2C16.72%2C38.49%2C21.94Z%22%2F%3E%3Cpath%20class%3D%22cls-5%22%20d%3D%22M24.22%2C38.76q13.19%2C6.43%2C26.46-.25L38.49%2C21.94Z%22%2F%3E%3Cpath%20class%3D%22cls-6%22%20d%3D%22M24.22%2C38.76c1%2C9.17%2C6.29%2C18.72%2C13.81%2C28.49%2C7.4-9%2C12.5-18.4%2C12.72-28.77Z%22%2F%3E%3Cpath%20class%3D%22cls-7%22%20d%3D%22M50.75%2C38.48%2C38%2C67.25%2C73.86%2C28C64.47%2C28.32%2C56.19%2C30.75%2C50.75%2C38.48Z%22%2F%3E%3Cpath%20class%3D%22cls-8%22%20d%3D%22M2.75%2C27.79%2C38%2C67.25%2C24.22%2C38.76C20.11%2C31%2C11.89%2C28.8%2C2.75%2C27.79Z%22%2F%3E%3Cpath%20class%3D%22cls-9%22%20d%3D%22M13.39%2C10%2C2.75%2C27.79c9.33%2C1.22%2C16.19-1.21%2C19.54-8.88C24.57%2C13.79%2C21.22%2C11%2C13.39%2C10Z%22%2F%3E%3Cpolygon%20class%3D%22cls-6%22%20points%3D%222.75%2027.79%2024.22%2038.76%2022.29%2018.91%202.75%2027.79%22%2F%3E%3Cpolygon%20class%3D%22cls-6%22%20points%3D%2252.14%205.23%2038.22%202.75%2024.22%205.23%2013.39%209.96%2022.29%2018.91%2038.49%2021.94%2054.37%2019.01%2063.33%2010.1%2052.14%205.23%22%2F%3E%3Cpolygon%20class%3D%22cls-10%22%20points%3D%2250.74%2038.48%2073.86%2027.99%2054.37%2019.01%2050.74%2038.48%22%2F%3E%3Cpolygon%20class%3D%22cls-9%22%20points%3D%2213.89%2010.83%2024.37%205.43%2038.22%202.75%2024.22%205.23%2013.39%209.96%2013.89%2010.83%22%2F%3E%3Cpolygon%20class%3D%22cls-9%22%20points%3D%2222.29%2018.91%2024.22%2038.76%2021.1%2019.05%2022.29%2018.91%22%2F%3E%3Cpolygon%20class%3D%22cls-9%22%20points%3D%2222.29%2018.91%2038.49%2021.94%2038.03%2022.48%2022.29%2018.91%22%2F%3E%3Cpolygon%20class%3D%22cls-9%22%20points%3D%2263.33%2010.1%2053%2019.28%2054.37%2019.01%2063.33%2010.1%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E)"
                    : "bg-white",
                }}
                aria-pressed={isActive}
                onClick={() => handleBoxClick(index)}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
