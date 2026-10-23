import React from "react";
import { PlayerProgress } from "@types";
import { LevelSelector } from "./components/LevelSelector";
import { MuteButton } from "../../components/MuteButton";
import { audio } from "@lib/audio";

interface DashboardPageProps {
  progress: PlayerProgress;
  activeTooltipLevelId: number | null;
  setActiveTooltipLevelId: (id: number | null) => void;
  onGoToSplash: () => void;
  onLoadLevel: (levelId: number) => void;
  isDevMode?: boolean;
  onToggleDevMode?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  progress,
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
    <div className="fixed top-3 right-3 md:top-4 md:right-4 z-50">
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

