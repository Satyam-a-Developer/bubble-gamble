import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function CarouselDemo() {
  return (
    <main>
      <div className="flex min-h-screen flex-col items-center p-24">
        <Carousel className="w-[900px] ">
          <CarouselContent >
            <CarouselItem>
              <img src="/logo.png" className="rounded-lg w-[1200px] h-[600px]" alt="Image description" />
            </CarouselItem>
            <CarouselItem>
              <img src="/logo.png" className="rounded-lg w-[1200px] h-[600px]" alt="Image description" />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className=" w-fit m-10">
        <h1 className="font-sans text-[100px]">Live Events bet now</h1>
        <div className=" flex gap-8 ">
          <div className="w-80 h-[400px] bg-white">
            <img src="/crash.avif" />
          </div>
          <div className="w-80 h-[400px] bg-white">
            <img src="/minies.avif" />
          </div>
          <div className="w-80 h-[400px] bg-white">
            <img src="/plinko.avif" />
          </div>
        </div>
      </div>
      <div className=" w-fit m-10">
        <h1 className="font-sans text-[100px]">Upcoming Events</h1>
      </div>
    </main>
  )
}
