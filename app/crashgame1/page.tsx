'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from 'react';
import CrashGameGraph from '../crashgame1/page';  // Adjust the path as necessary
export default function page() {

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
        <div className='flex  items-center justify-between p-24 m-[5px] '>
            <div className="h-[670px] w-[1300px] bg-white flex">
                <div className="h-[500px] w-[290px] bg-cyan-200 m-[40px]">

                </div>
                <div className="h-[650px] m-[10px] w-[800px]  ">
                    <>
                        <CrashGameGraph />
                    </>

                </div>``


            </div>
        </div>
    )
}
