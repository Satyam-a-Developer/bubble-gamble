import React from 'react'
import Image from 'next/image'


export default function Casino() {
  return (
    <div className='flex  flex-col items-center justify-between p-24'>
      <h1 className='text-[50px] text-white p-10'>Welcome to the Casino</h1>
      <div className='flex'>
        <div className='w-[70rem] h-[30rem] bg-blue-500 rounded-lg'>
          <Image src="/casino2.png" alt="casino" width={1000} height={100} className=' w-[70rem] h-[30rem] bg-blue-500 rounded-lg' />
        </div>
      </div>
      <div className=" w-fit m-10">
        <h1 className="font-sans text-[100px]">Live Games play and earn</h1>
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
        <h1 className="font-sans text-[100px]">Live Games </h1>
        <div className=" flex gap-8 ">
          <div className="w-80 h-[400px] bg-white">
            <img src="/casino.gmaes.avif" />
          </div>
          <div className="w-80 h-[400px] bg-white">
            <img src="/casinogmes2.avif" />
          </div>
          <div className="w-80 h-[400px] bg-white">
            <img src="/stake .avif" />
          </div>
          <div className="w-80 h-[400px] bg-white">
            <img src="/casinostake.avif" />
          </div>
        </div>
      </div>
    </div>
  )
}
