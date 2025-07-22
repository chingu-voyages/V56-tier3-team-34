'use client';
import React, { useState } from 'react';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="font-sans bg-gray-100">
      <main className="p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Real-Time Surgical Tracking for Peace of Mind.
        </h1>
        <p className="text-gray-600 mb-8">
          Stay informed about your loved ones' surgical status with our user-friendly interface. Experience peace of mind knowing that updates are provided in real-time.
        </p>
        <div className="flex justify-center space-x-4">
          <button onClick={() => setShowLogin(true)} className="bg-blue-500 text-white px-6 py-2 rounded">
            Login
          </button>
          <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded">
            Learn More
          </button>
        </div>
        {showLogin && (
          <div className="mt-8 max-w-sm mx-auto">
            <form className="bg-white p-6 rounded shadow-md">
              <h2 className="text-2xl mb-4">Login</h2>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                Submit
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
