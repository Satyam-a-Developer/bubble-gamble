import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
        <div className=" flex gap-8 flex-wrap ">
          <Link href="/crashgame">
            <div className="w-80 h-[400px] bg-white">
              <Image src="/crash.avif" alt={"image"}  width={1000} height={100}  />
            </div>
          </Link>
          <Link href='/mines'>
            <div className="w-80 h-[400px] bg-white">
              <Image src="/minies.avif" alt={"image"}  width={1000} height={100} />
            </div>
          </Link>
          <Link href='/plinko'>
            <div className="w-80 h-[400px] bg-white">
              <Image src="/plinko.avif" alt={"image"} width={1000} height={100}  />
            </div>
          </Link>
          <Link href='/roulette'>
            <div className="w-80 h-[400px] bg-white overflow-hidden mt-10 ">
              <Image src="/Spin Roulette.jpeg" alt={"image"} width={400} height={30}  />
            </div>
          </Link>

        </div>
      </div>
      <div className=" w-fit m-10">
        <h1 className="font-sans text-[100px]">Live Games </h1>
        <div className=" flex gap-8 ">
          <div className="w-80 h-[400px] bg-white">
            <Image src="/casino.gmaes.avif" alt={"image"} width={1000} height={100} />
          </div>
          <div className="w-80 h-[400px] bg-white">
            <Image src="/casinogmes2.avif" alt={"image"}  width={1000} height={100} />
          </div>
          <div className="w-80 h-[400px] bg-white">
            <Image src="/stake .avif" alt={"image"} width={1000} height={100}  />
          </div>
          <div className="w-80 h-[400px] bg-white">
            <Image src="/casinostake.avif" alt={"image"} width={1000} height={100}  />
          </div>
        </div>
      </div>
    </div>
  )
}
