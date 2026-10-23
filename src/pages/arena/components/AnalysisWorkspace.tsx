import React from "react";
import { Compass } from "lucide-react";
import { audio } from "@lib/audio";

interface AnalysisWorkspaceProps {
  levelName: string;
  onOpenDecompositionModal: () => void;
  onOpenQuiz: () => void;
}

export const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  levelName,
  onOpenDecompositionModal,
  onOpenQuiz,
}) => {
  return (
    <div className="flex flex-col justify-end h-full w-full p-1.5 md:p-4">
      {/* Mulai Kuis Button (Icon & Title only, positioned at the bottom, no subtext) */}
      <button
        type="button"
        onClick={() => {
          audio.playClick();
          onOpenQuiz();
        }}
        className="flex items-center justify-center gap-2.5 p-1.5 md:p-4 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 rounded-2xl text-center cursor-pointer transition-all hover:scale-[1.01] w-full font-black text-xs shadow-xs"
      >
        <Compass size={16} className="animate-pulse" />
        <span>Mulai Kuis Pemahaman</span>
      </button>
    </div>
  );
};
