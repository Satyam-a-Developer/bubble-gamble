'use client';
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex-direction-row">
        <p>
          A gambling warning list, also known as a self-exclusion list, is a
          voluntary program offered by casinos and gambling establishments that
          allows individuals to restrict their access to gambling facilities and
          activities. The purpose of such a list is to help people who struggle
          with problem gambling or gambling addiction to avoid the temptation to
          gamble and to prevent them from entering designated gambling areas.
          Here are some key points about gambling warning lists:
          Self-enrollment: Individuals must voluntarily enroll themselves on the
          gambling warning list. This typically involves submitting an
          application and providing personal information, such as their name,
          address, and a recent photograph. Exclusion period: When enrolling,
          individuals can choose the duration of their exclusion from gambling
          facilities, which can range from a few months to several years or even
          a lifetime ban, depending on the program&apos;s policies. Enforcement: Once
          enrolled, the gambling establishment is responsible for enforcing the
          ban and preventing the listed individuals from entering their premises
          or participating in gambling activities. This can involve denying
          entry, removing the individual from the premises, or revoking player
          loyalty programs or other gambling-related privileges. Legal
          consequences: In some jurisdictions, if a self-excluded individual
          attempts to gamble at a regulated casino or venue, they may face legal
          consequences, such as fines or trespassing charges. Support services:
          Many gambling warning list programs also provide information and
          resources for problem gambling treatment, counseling, and support
          services to help individuals overcome their addiction.
          Confidentiality: The personal information of individuals on the
          gambling warning list is typically kept confidential and not shared
          with third parties, except as required by law enforcement or
          regulatory authorities. It&apos;s important to note that while gambling
          warning lists can be an effective tool for some individuals, they rely
          on self-discipline and the cooperation of gambling establishments.
          Professional help and support from counselors or addiction treatment
          programs may also be necessary for those struggling with severe
          gambling problems.
        </p>
        <div className="flex justify-center gap-4">
          <button className="dark:hover:bg-white bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 p-4 m-10 rounded-lg text-black">
            <Link href="/Payment">Get Scoins</Link>
          </button>
          <button className="dark:hover:bg-gray-700 p-5 rounded-lg m-9 bg-gradient-to-r from-gray-600 to-indigo-400 text-black">
            <Link href="/Login">Login</Link>
          </button>
        </div>
      </div>
    </main>
  );
}
