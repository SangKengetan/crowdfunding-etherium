import React from "react";
import bgImage from "../assets/bg-image.jpg"; // Ensure the image name is correct
import WalletConnectButton from "../components/WalletConnectButton";
import { useNavigate } from 'react-router-dom';



const LandingPage = () => {
 const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-4 sm:px-8 py-4 z-20">
        <h1 className="text-white text-lg sm:text-2xl font-bold">BaliPunia</h1>
        <WalletConnectButton />
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center min-h-screen px-4 bg-black/40 pt-20">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
          Happiness comes from <br />
          <span className="text-cyan-400">your action.</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base md:text-lg max-w-2xl text-white/90">
          Be a part of the breakthrough and make someone’s dream come true.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-3 rounded-full font-semibold w-full sm:w-auto">
            Donate now
          </button>
          <button 
          onClick={() => navigate('/create-campaign')}
          className="bg-white hover:bg-gray-100 text-cyan-500 px-6 py-3 rounded-full font-semibold w-full sm:w-auto">
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
