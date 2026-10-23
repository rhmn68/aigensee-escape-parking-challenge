import React from "react";
import { PlayerProgress } from "../../../types";
import { LEVELS } from "../../../levels";
import { audio } from "../../../lib/audio";

interface LevelSelectorProps {
  progress: PlayerProgress;
  onLoadLevel: (levelId: number) => void;
  activeTooltipLevelId: number | null;
  setActiveTooltipLevelId: (id: number | null) => void;
  isDevMode?: boolean;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  progress,
  onLoadLevel,
  isDevMode = false,
}) => {
  return (
    <div className="flex flex-col flex-1 min-h-0 justify-center items-center overflow-hidden px-4 py-2 gap-2">

      {/* Title banner — lebih besar dari level cards */}
      <div className="flex justify-center flex-shrink-0">
        <img
          src={`${import.meta.env.BASE_URL}img/pilih-level.webp`}
          alt="Pilih Tingkat"
          style={{ height: "clamp(65px, 26vh, 170px)" }}
          className="w-auto object-contain select-none pointer-events-none drop-shadow-lg"
        />
      </div>

      {/* Horizontal row of levels — mengisi sisa ruang */}
      <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-none flex-shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div
          className="flex flex-row items-center gap-3 sm:gap-5 md:gap-7 lg:gap-9 snap-x scroll-smooth py-2"
          style={{ justifyContent: "safe center" }}
        >
          {/* Left spacer for perfect scroll boundaries */}
          <div className="w-2 flex-shrink-0 pointer-events-none" />

          {LEVELS.map((level) => {
            const isUnlocked = isDevMode || level.id <= progress.unlockedLevel;
            const levelImage = isUnlocked
              ? `${import.meta.env.BASE_URL}img/level-${level.id}.svg`
              : `${import.meta.env.BASE_URL}img/level-gembok.svg`;

            return (
              <div
                key={level.id}
                onClick={() => {
                  if (isUnlocked) {
                    onLoadLevel(level.id);
                  } else {
                    audio.playError();
                  }
                }}
                className={`flex-shrink-0 snap-start select-none ${
                  isUnlocked ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              >
                {/* Level card — tinggi diperkecil */}
                <div
                  className="relative aspect-[4/5] transition-transform duration-300 hover:scale-105 active:scale-95"
                  style={{ height: "clamp(70px, 42vh, 260px)" }}
                >
                  <img
                    src={levelImage}
                    alt={level.name}
                    className="w-full h-full object-contain drop-shadow-xl select-none pointer-events-none"
                    style={!isUnlocked ? { filter: "brightness(0.6) contrast(0.9)" } : undefined}
                  />
                </div>
              </div>
            );
          })}

          {/* Right spacer for perfect scroll boundaries */}
          <div className="w-2 flex-shrink-0 pointer-events-none" />
        </div>
      </div>

    </div>
  );
};
