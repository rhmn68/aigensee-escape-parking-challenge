import React from "react";
import { RefreshCcw } from "lucide-react";
import { audio } from "../../../lib/audio";

interface SandboxPanelProps {
  onResetLevel: () => void;
}

export const SandboxPanel: React.FC<SandboxPanelProps> = ({ onResetLevel }) => {
  return (
    <div className="space-y-4 h-full flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-3 mb-4">
          <span className="p-1 px-2 bg-amber-50 text-amber-700 border border-amber-200 font-mono text-[9px] font-black rounded uppercase">
            AREA BERMAIN BEBAS
          </span>
          <h4 className="text-sm font-black text-slate-800">Eksperimen Bebas (Coba & Salah)</h4>
        </div>
      </div>

      <div className="pt-4 flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            audio.playClick();
            onResetLevel();
          }}
          className="w-full bg-slate-850 hover:bg-slate-900 border-none text-white py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCcw size={13} />
          <span>Reset Papan Parkir</span>
        </button>
      </div>
    </div>
  );
};
