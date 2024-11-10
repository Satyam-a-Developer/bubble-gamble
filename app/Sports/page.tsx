import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function CarouselDemo() {
  fetch('https://api.cricapi.com/v1/currentMatches?apikey=0bbf226d-47b9-41b1-bde1-5b98eb0b0758&offset=0')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // Parse JSON data from the response
    })
    .then(data => {
      console.log(data.name); // Handle the JSON data
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  return (
    <main>
      <div className="flex min-h-screen flex-col items-center p-24">
        <Carousel className="w-[900px] ">
          <CarouselContent >
            <CarouselItem>
              <Image src="/logo.png" className="rounded-lg w-[1200px] h-[600px]" alt="Image description" />
            </CarouselItem>
            <CarouselItem>
              <Image src="/logo.png" className="rounded-lg w-[1200px] h-[600px]" alt="Image description" />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className=" w-fit m-10">
        <h1 className="font-sans text-[100px]">Upcoming Events</h1>
      </div>
    </main>
  )
}
