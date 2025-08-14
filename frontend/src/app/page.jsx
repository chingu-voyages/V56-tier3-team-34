'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="font-sans bg-gray-50">
      <main className="p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Real-Time Surgical Tracking for Peace of Mind.
        </h1>
        <p className="text-gray-600 mb-8">
          Stay informed about your loved ones' surgical status with our user-friendly interface. Experience peace of mind knowing that updates are provided in real-time.
        </p>
        <div className="flex justify-center space-x-4">
          <button onClick={() => router.push('/login')} className="bg-blue-500 text-white px-6 py-2 rounded">
            Staff Login
          </button>
          <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded">
            View Status Board
          </button>
        </div>
      </main>
    </div>
  );
}