import React from "react";

export default function Payment() {
  return (
    <div className="flex justify-center items-center h-svh bg-blue-gray-500 mt-[50px] gap-10 overflow-scroll ">
      <div className="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96 h-[500px] ">
        <div className="relative h-56 mx-4 -mt-6 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="/logo.png"
            alt="card-image"
          />
        </div>
        <div className="p-6">
          <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
            Monthly Payment Plan
          </h5>
          <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
            Monthly you will get a free access to the sports Betting and
            Gaming 500₹ per month with 630 free Scoins
          </p>
        </div>
        <div className="p-6 pt-0 ">
          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-lg py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            type="button"
          >
          <a href="https://buy.stripe.com/test_dR615dg1FdpQaVqeUU">
            500₹ Buy Now
          </a>
          
          </button>
        </div>
      </div>
      <div className="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96 h-[500px] ">
        <div className="relative h-56 mx-4 -mt-6 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="/logo.png"
            alt="card-image"
          />
        </div>
        <div className="p-6">
          <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
            yearly Payment Plan
          </h5>
          <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
            yearly you will get a free access to the sports Betting and
            Gaming 500₹ per month with 12,000 free Scoins
          </p>
        </div>
        <div className="p-6 pt-0 ">
          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-lg py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            type="button"
          >
            <a href="price_1P7v3uSFX6saOeCsxw3bbUjD">
            6000₹ Buy Now
            </a>
         
          </button>
        </div>
      </div>
    </div>
  );
}
