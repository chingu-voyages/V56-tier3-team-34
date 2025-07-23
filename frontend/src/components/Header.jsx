'use client';
import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white text-black">
      <div className="flex items-center">
        <div className="mr-4 font-bold text-xl">
          <Link href="/">Logo</Link>
        </div>
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="hover:underline">Home Page</Link>
          <Link href="/patient-info" className="hover:underline">Patient Info</Link>
          <Link href="/status-update" className="hover:underline">Status Update</Link>
          <Link href="/more-options" className="hover:underline">More Options</Link>
        </nav>
      </div>
      <div className="flex items-center">
        <button className="hidden md:block bg-blue-500 text-white px-4 py-2 rounded mr-2">Login</button>
        <button className="md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;