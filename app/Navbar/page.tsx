'use client'

import React from 'react'
import Link from 'next/link'
import { useState } from 'react'

export default function page() {
  const [MoneyinvestedINR,setMoneyinvestedINR] = useState(500000)
  
  return (
    <div>
        <nav className="bg-gray-900 dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="http://localhost:3000" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img
                src="/logo.png"
                className="h-8"
                alt="Flowbite Logo"
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
                <Link href="/Login"> Login</Link>
              </button>
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none m-3 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <Link href="/Payment"> Get Scoins</Link>
              </button>
              <button
                data-collapse-toggle="navbar-sticky"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-sticky"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>
            <div
              className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
              id="navbar-sticky"
            >
              <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border   rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <Link
                    href="/Casino"
                    className="block py-2 px-3 text-gray-900 rounded  bg-slate-500 hover:bg-slate-600 "
                    aria-current="page"
                  >
                    Casino
                  </Link>
                </li>
                <li className="block py-2 px-3 text-gray-900 rounded  bg-white  ">

                  <select >
                    <option>{MoneyinvestedINR}₹</option>
                    <option>0.00﹩</option>
                    <option>0.00 Scoins</option>
                    <option>0.00BTC</option>
                  </select>
                </li>
                <li>
                  <Link
                    href="/Sports"
                    className="block py-2 px-3 text-gray-900 rounded  bg-slate-500 hover:bg-slate-600  "
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
