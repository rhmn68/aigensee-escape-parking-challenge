import React from "react";
import { AlertTriangle, RotateCcw, X } from "lucide-react";
import { audio } from "@lib/audio";

interface CollisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collisionInfo: {
    type?: "collision" | "incomplete";
    stepIndex: number;
    vehicleName: string;
    reason: string;
  } | null;
}

export const CollisionModal: React.FC<CollisionModalProps> = ({
  isOpen,
  onClose,
  collisionInfo,
}) => {
  if (!isOpen || !collisionInfo) return null;

  const isIncomplete = collisionInfo.type === "incomplete";

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center overflow-y-auto bg-slate-950/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className={`relative max-w-md w-full m-auto bg-slate-900 border-2 ${isIncomplete ? "border-amber-500/50" : "border-red-500/50"} shadow-2xl rounded-3xl p-6 sm:p-7 max-h-modal overflow-y-auto flex flex-col items-center text-center text-white animate-scaleIn`}>
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            audio.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-all cursor-pointer border-none"
        >
          <X size={20} />
        </button>

        {/* Warning Icon Badge */}
        <div className="relative flex items-center justify-center mb-5">
          <div className={`absolute w-20 h-20 ${isIncomplete ? "bg-amber-500/20" : "bg-red-500/20"} rounded-full animate-ping`} />
          <div className={`w-16 h-16 ${isIncomplete ? "bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-amber-500/20" : "bg-red-500/20 border-red-500/40 text-red-500 shadow-red-500/20"} border rounded-2xl flex items-center justify-center shadow-lg z-10`}>
            <AlertTriangle size={36} className="animate-bounce" />
          </div>
        </div>

        <h3 className={`text-xl sm:text-2xl font-black ${isIncomplete ? "text-amber-400" : "text-red-400"} tracking-tight mb-2`}>
          {isIncomplete ? "Program Belum Selesai! 🏁" : "Terjadi Tabrakan! 💥"}
        </h3>

        <div className={`${isIncomplete ? "bg-amber-950/40 border-amber-800/50" : "bg-red-950/40 border-red-800/50"} border rounded-2xl p-4 w-full my-4 text-center`}>
          <div className="text-sm font-medium text-slate-200">
            {isIncomplete ? (
              <span>Semua langkah selesai dijalankan, namun <span className="font-bold text-amber-400">Taxi</span> belum mencapai pintu keluar.</span>
            ) : (
              <span><span className="font-bold text-amber-400">{collisionInfo.vehicleName}</span> — {collisionInfo.reason}</span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            audio.playClick();
            onClose();
          }}
          className={`w-full bg-gradient-to-r ${isIncomplete ? "from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 shadow-amber-600/30" : "from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-red-600/30"} text-white font-black py-3 px-6 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer border-none flex items-center justify-center gap-2 text-sm tracking-wide`}
        >
          <RotateCcw size={16} />
          {isIncomplete ? "Tambah Langkah Program" : "Coba Perbaiki Algoritma"}
        </button>
      </div>
    </div>
  );
};
