import React from "react";
import { RefreshCcw, ArrowRight } from "lucide-react";

interface ReflectionProps {
  levelId: number;
  levelName: string;
  playerStepsCount: number;
  optimalStepsCount: number;
  starsEarned: number;
  onRestartLevel: () => void;
  onNextLevel: () => void;
  isLastLevel: boolean;
}

export const Reflection: React.FC<ReflectionProps> = ({
  levelName,
  playerStepsCount,
  optimalStepsCount,
  starsEarned,
  onRestartLevel,
  onNextLevel,
  isLastLevel
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 ld:p-6 shadow-sm relative max-h-modal overflow-y-auto max-w-[500px] w-full m-auto select-none text-slate-800">
      {/* Decorative Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />

      <div className="text-center">
        <span className="text-4xl mb-2 inline-block animate-bounce">🏆</span>
        <h2 className="text-lg font-black font-sans text-slate-800 tracking-tight">
          Skenario Simulasi Berhasil!
        </h2>
      </div>

      {/* Step Comparison Metrics */}
      <div className="bg-slate-50 rounded-xl p-1.5 lg:p-4 border border-slate-200 mb-2 text-center">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1 font-bold">
          Evaluasi Efisiensi Solusi
        </span>

        {/* Big Stars Rating */}
        <div className="flex justify-center gap-2 mb-3">
          {[1, 2, 3].map((star) => (
            <span
              key={star}
              className={`text-3xl transition-transform duration-300 ${
                star <= starsEarned
                  ? "text-amber-500 scale-110 drop-shadow-[0_2px_8px_rgba(250,204,21,0.35)]"
                  : "text-slate-350 select-none opacity-40"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center mt-2 border-t border-slate-200 pt-3">
          <div>
            <span className="text-[10px] text-slate-500 font-bold block">Langkahmu:</span>
            <span className="text-lg font-black font-mono text-slate-800">{playerStepsCount}</span>
          </div>
          <div className="border-x border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold block">Optimal:</span>
            <span className="text-lg font-black font-mono text-emerald-600">{optimalStepsCount}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block">Selisih:</span>
            <span className={`text-lg font-black font-mono ${
              playerStepsCount - optimalStepsCount === 0 ? "text-emerald-600" : "text-amber-600"
            }`}>
              {playerStepsCount - optimalStepsCount === 0 
                ? "Sempurna!" 
                : `+${playerStepsCount - optimalStepsCount}`
              }
            </span>
          </div>
        </div>


      </div>

      {/* Stage footer controls */}
      <div className="flex gap-2.5">
        <button
          onClick={onRestartLevel}
          className="flex-1 border border-slate-300 text-slate-700 bg-white rounded-xl px-3 py-2.5 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <RefreshCcw size={12} />
          <span>Ulangi (Cari Optimal)</span>
        </button>

        <button
          onClick={onNextLevel}
          className="flex-1 font-extrabold rounded-xl px-4 py-2.5 text-xs flex items-center justify-center gap-1.5 max-h-11 transition-all shadow-md focus:scale-[0.98] bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:scale-105 active:scale-95 shadow border-none"
        >
          <span>{isLastLevel ? "Selesai & Ke Dashboard" : "Skenario Berikutnya"}</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
