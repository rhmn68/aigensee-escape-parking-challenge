import React from "react";
import { Video } from "lucide-react";
import { PlayerProgress } from "@types";
import { LevelSelector } from "./components/LevelSelector";
import { MuteButton } from "../../components/MuteButton";
import { audio } from "@lib/audio";

interface DashboardPageProps {
  progress: PlayerProgress;
  onOpenTutorial: () => void;
  activeTooltipLevelId: number | null;
  setActiveTooltipLevelId: (id: number | null) => void;
  onGoToSplash: () => void;
  onLoadLevel: (levelId: number) => void;
  isDevMode?: boolean;
  onToggleDevMode?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  progress,
  onOpenTutorial,
  activeTooltipLevelId,
  setActiveTooltipLevelId,
  onGoToSplash,
  onLoadLevel,
  isDevMode = false,
  onToggleDevMode,
}) => (
  <div
    className="flex-1 overflow-hidden flex flex-col h-full min-h-0 w-full bg-cover bg-center bg-no-repeat relative"
    style={{ backgroundImage: `url('${import.meta.env.BASE_URL}img/background-level.webp')` }}
  >
    {/* Top Right Audio Controls (Matching Logo Size & Position) */}
    <div className="fixed top-3 right-3 md:top-4 md:right-4 z-50 flex items-center gap-2">
      <button
        type="button"
        onClick={() => { audio.playClick(); onOpenTutorial(); }}
        aria-label="Lihat video tutorial"
        title="Video tutorial"
        className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-2xl md:rounded-3xl bg-white border border-blue-200 text-blue-600 shadow-md flex items-center justify-center hover:bg-blue-50 active:scale-95 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
      >
        <Video className="w-1/2 h-1/2" />
      </button>
      <MuteButton variant="floating" size="logo" />
    </div>

    <LevelSelector
      progress={progress}
      onLoadLevel={onLoadLevel}
      activeTooltipLevelId={activeTooltipLevelId}
      setActiveTooltipLevelId={setActiveTooltipLevelId}
      isDevMode={isDevMode}
    />
  </div>
);

