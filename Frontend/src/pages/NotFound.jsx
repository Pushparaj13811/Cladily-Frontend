import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#285c3f] px-4">
      <h1 className="text-6xl md:text-8xl font-bold font-heading mb-4">404</h1>
      <p className="text-lg md:text-2xl text-center mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="bg-[#c8f1d9] text-[#285c3f] hover:bg-[#b7e1c1] py-3 px-8 md:px-12 rounded-lg font-semibold text-lg"
      >
        Go to Homepage
      </Link>
    </div>
  );
}

export default NotFound;
