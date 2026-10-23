import React, { useState } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { audio } from "../../../lib/audio";
import { PlayerProgress } from "../../../types";

interface DashboardHeaderProps {
  progress: PlayerProgress;
  onGoToSplash: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  progress,
  onGoToSplash
}) => {
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);

  return (
    <div className="flex justify-between items-center border-b border-slate-200 pb-3 flex-shrink-0 gap-2 w-full">
      <div className="min-w-0 flex-1">
        <h2 className="text-base sm:text-lg md:text-xl font-black font-sans text-slate-800 tracking-tight truncate">
          Dashboard Pembelajaran
        </h2>
        <p className="text-[10px] sm:text-xs text-slate-400 font-medium hidden xs:block truncate">
          Selesaikan kuis analisis untuk membuka editor algoritma dari tiap tantangan.
        </p>
      </div>

      {/* --- DESKTOP VIEW BUTTONS: Available on tablet, laptop, and desktop (sm and up) --- */}
      <div className="hidden sm:flex gap-2">
        <button
          onClick={() => {
            audio.playClick();
            onGoToSplash();
          }}
          className="bg-white hover:bg-slate-50 text-[10px] sm:text-xs font-bold px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 text-slate-700 shadow-xs cursor-pointer transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Menu Utama</span>
        </button>
      </div>

      {/* --- MOBILE VIEW: Elegant Dropdown Menu (below sm) --- */}
      <div className="relative sm:hidden flex-shrink-0">
        <button
          onClick={() => {
            audio.playClick();
            setIsNavDropdownOpen(!isNavDropdownOpen);
          }}
          className="bg-white hover:bg-slate-50 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 text-slate-700 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
        >
          <Menu size={14} className="text-blue-600" />
          <span>Menu</span>
          <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${isNavDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isNavDropdownOpen && (
          <>
            {/* Invisible Click-away Overlay backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-transparent" 
              onClick={() => setIsNavDropdownOpen(false)} 
            />
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-[fade-in_0.15s_ease-out]">
              <div className="py-1">
                <button
                  onClick={() => {
                    audio.playClick();
                    setIsNavDropdownOpen(false);
                    onGoToSplash();
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium border-t border-slate-100"
                >
                  <span>Menu Utama</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
