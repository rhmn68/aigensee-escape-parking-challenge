import { useState, useEffect } from "react";
import { PlayerProgress } from "@types";
import { LEVELS } from "@levels";

const STORAGE_KEY = "escape_parking_ct_progress_v1";

export function useProgress() {
  const [progress, setProgress] = useState<PlayerProgress>({
    unlockedLevel: 1,
    levelScores: {},
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setProgress(JSON.parse(saved)); }
      catch (e) { console.error("Failed to parse progress:", e); }
    }
  }, []);

  const saveProgress = (next: PlayerProgress) => {
    setProgress(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const computeLevelComplete = (
    activeLevelId: number,
    stepsCount: number
  ): { nextProgress: PlayerProgress; stars: number } => {
    const currentLvl = LEVELS.find((l) => l.id === activeLevelId)!;

    let stars = 1;
    if (stepsCount <= currentLvl.optimalSteps) stars = 3;
    else if (stepsCount <= currentLvl.optimalSteps + 2) stars = 2;

    const updatedLevelScores = { ...progress.levelScores };
    const prev = updatedLevelScores[activeLevelId];
    updatedLevelScores[activeLevelId] = {
      stars: Math.max(prev?.stars || 0, stars),
      bestSteps: Math.min(prev?.bestSteps || 999, stepsCount),
      completed: true,
    };

    let nextUnlockedLevel = progress.unlockedLevel;
    if (activeLevelId === progress.unlockedLevel && activeLevelId < LEVELS.length) {
      nextUnlockedLevel = activeLevelId + 1;
    }

    return {
      nextProgress: { unlockedLevel: nextUnlockedLevel, levelScores: updatedLevelScores },
      stars,
    };
  };

  return { progress, saveProgress, computeLevelComplete };
}
