'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'

export default function Page() {
  const [MoneyinvestedINR, setMoneyinvestedINR] = useState(0);

  const fetchNumber = async () => {
    try {
      const response = await axios.get("http://localhost:3000/number");
      setMoneyinvestedINR(response.data.number);
      console.log("Received number:", response.data.number);
    } catch (error) {
      console.error("Error fetching the number:", error);
    }
  };

  // Fetch the number when the component mounts
  useEffect(() => {
    fetchNumber();
  }, []); // Empty dependency array ensures it runs only once

  return (
    <div>
      <nav className="bg-gray-900 dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="http://localhost:3000" className="flex items-center space-x-3 rtl:space-x-reverse">
            <Image
              src="/logo.png"
              className="h-8"
              alt="Flowbite Logo"
              width={100}
              height={100}
            />
            <span className="self-center text-[20px] font-semibold whitespace-nowrap dark:text-white">
              Bubble Gamble
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              className="text-black bg-cyan-50   m-3 font-medium rounded-lg text-sm px-4 py-2 text-center"
            >
              <Link href="/Login">Login</Link>
            </button>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none m-3 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <Link href="/Payment">Get Scoins</Link>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  href="/Casino"
                  className="block py-2 px-3 text-gray-900 rounded bg-slate-500 hover:bg-slate-600"
                  aria-current="page"
                >
                  Casino
                </Link>
              </li>
              <li className="block py-2 px-3 text-gray-900 rounded bg-white">
                <select>
                  <option>{MoneyinvestedINR} ₹</option>
                  <option>0.00﹩</option>
                  <option>0.00 Scoins</option>
                  <option>0.00BTC</option>
                </select>
              </li>
              <li>
                <Link
                  href="/Sports"
                  className="block py-2 px-3 text-gray-900 rounded bg-slate-500 hover:bg-slate-600"
                >
                  Sports
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
