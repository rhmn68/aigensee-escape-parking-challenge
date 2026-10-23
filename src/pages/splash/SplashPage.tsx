import React from "react";
import { audio } from "@lib/audio";
import { MuteButton } from "../../components/MuteButton";

interface SplashPageProps {
  onStart: () => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onStart }) => {
  return (
    <div
      className="fixed inset-0 w-screen h-screen z-40 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url('${import.meta.env.BASE_URL}img/background-judul.webp')` }}
      onClick={() => audio.startBgm()}
    >
      {/* Decorative gradient overlay to enhance visual depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/10 via-transparent to-slate-950/20 pointer-events-none" />

      {/* Mute/Unmute Audio Button — Top-Right on 2xl+, Bottom-Left on <2xl */}
      <div className="fixed z-50 bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-4 md:left-4 2xl:bottom-auto 2xl:left-auto 2xl:top-4 2xl:right-4">
        <MuteButton variant="floating" size="logo" />
      </div>

      {/* Safe layout boundary: max-w-7xl container centered on viewport, aligning content to side on desktop */}
      <div className="w-full h-full flex justify-end items-center">
        
        {/* Title and button stack: centered items inside this column container */}
        <div className="flex flex-col items-center max-w-[180px] sm:max-w-[180px]  md:max-w-[180px] lg:max-w-[320px] 2xl:max-w-[460px] w-full z-10 mr-12 sm:mr-14 xl:mr-24 2xl:mr-40">
          
          {/* Floating container for titles to create a smooth bobbing/wiggle effect */}
          <div className="w-full flex flex-col items-center animate-float-wiggle">
            {/* Title SVGs: judul-1 and judul-3 are equal (w-full), judul-2 is smaller (w-[65%]) */}
            <img
              src={`${import.meta.env.BASE_URL}img/judul-1.svg`}
              alt="Escape"
              className="w-full h-auto object-contain select-none pointer-events-none relative z-10 animate-title-1"
            />
            
            <img
              src={`${import.meta.env.BASE_URL}img/judul-2.svg`}
              alt="Parking"
              className="w-[35%] h-auto object-contain select-none pointer-events-none -mt-4 sm:-mt-4 md:-mt-4 lg:-mt-6 relative z-20 animate-title-2"
            />
            
            <img
              src={`${import.meta.env.BASE_URL}img/judul-3.svg`}
              alt="Challenge"
              className="w-full h-auto object-contain select-none pointer-events-none -mt-3 sm:-mt-4 md:-mt-3 lg:-mt-6 relative z-10 animate-title-3"
            />
          </div>

          {/* Centered forward button with pulse and hover grow effect */}
          <button
            onClick={() => {
              audio.playClick();
              audio.startBgm();
              onStart();
            }}
            className="mt-6 sm:mt-8 2xl:mt-10 cursor-pointer transform hover:scale-110 active:scale-95 transition-all duration-300 hover:brightness-110 focus:outline-none animate-[pulse_2s_infinite] drop-shadow-2xl"
            aria-label="Start Game"
          >
            <img
              src={`${import.meta.env.BASE_URL}img/forward.svg`}
              alt="Mulai"
              className="w-14 h-14 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 2xl:w-22 2xl:h-22 object-contain select-none pointer-events-none"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
