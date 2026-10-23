import { useState } from "react";
import { CTStage } from "@types";
import { LEVELS } from "@levels";
import { audio } from "@lib/audio";
import { useProgress } from "@hooks/useProgress";
import { useLevelManager } from "@hooks/useLevelManager";
import { useSimulation } from "@hooks/useSimulation";
import { isLevelSolved } from "@pages/arena/components/ParkingGrid";

export interface SimResult {
  success: boolean;
  totalSteps: number;
  scoreStars: number;
}

export function useGameState(initialLevelId: number = 1, initialStage: CTStage = "algorithm") {
  const { progress, saveProgress, computeLevelComplete } = useProgress();
  const level = useLevelManager(initialLevelId, initialStage);
  const [simResult, setSimResult] = useState<SimResult | null>(null);

  const activeLevel = LEVELS.find((l) => l.id === level.activeLevelId);
  const gridRows = activeLevel?.gridRows ?? 11;
  const gridCols = activeLevel?.gridCols ?? 12;
  const defaultExitRow = activeLevel?.exitRow ?? 4;
  const playerCar = level.activeVehicles.find((v) => v.isPlayer || v.id === "R");
  const defaultExitCol = playerCar ? playerCar.col : 4;

  const handleCompleteLevel = (stepsCount: number) => {
    if (level.isSandboxMode) {
      audio.playLevelComplete();
      const { nextProgress, stars } = computeLevelComplete(level.activeLevelId, stepsCount);
      saveProgress(nextProgress);
      setSimResult({ success: true, totalSteps: stepsCount, scoreStars: stars });
      level.setCtStage("evaluation");
    } else {
      audio.playSuccess();
      const { stars } = computeLevelComplete(level.activeLevelId, stepsCount);
      setSimResult({ success: true, totalSteps: stepsCount, scoreStars: stars });
      level.setCtStage("analysis");
    }
  };

  const sim = useSimulation(
    level.originalVehicles,
    level.algorithmSteps,
    handleCompleteLevel,
    gridRows,
    gridCols,
    level.activeWalls,
    defaultExitRow,
    defaultExitCol
  );

  const handleLoadLevel = (levelId: number) => {
    audio.playClick();
    const l = LEVELS.find((lv) => lv.id === levelId);
    level.loadLevel(levelId);
    if (l) {
      sim.reset(JSON.parse(JSON.stringify(l.vehicles)));
    } else {
      sim.reset(level.originalVehicles);
    }
    setSimResult(null);
  };

  const handleResetLevel = () => {
    level.resetLevel(level.originalVehicles);
    sim.reset(level.originalVehicles);
    level.setAlgorithmSteps([]);
    level.setCtStage("algorithm");
    setSimResult(null);
  };

  const handleQuizComplete = (scorePercentage: number) => {
    audio.playLevelComplete();
    if (simResult) {
      const { nextProgress } = computeLevelComplete(level.activeLevelId, simResult.totalSteps);
      saveProgress(nextProgress);
    }
    level.setCtStage("evaluation");
  };

  const handleSandboxMoveRecorded = () => {
    level.setSandboxMoveCount((prev) => prev + 1);
    const isSolved = isLevelSolved(level.activeVehicles, gridRows, gridCols, defaultExitRow, defaultExitCol);
    if (isSolved) {
      setTimeout(() => handleCompleteLevel(level.sandboxMoveCount + 1), 350);
    }
  };

  // In sandbox mode use level's vehicles (direct drag), in CT mode use sim's vehicles
  const activeVehicles = level.isSandboxMode ? level.activeVehicles : sim.activeVehicles;
  const setActiveVehicles = level.isSandboxMode ? level.setActiveVehicles : sim.setActiveVehicles;

  return {
    progress,
    activeLevelId: level.activeLevelId,
    activeVehicles,
    setActiveVehicles,
    originalVehicles: level.originalVehicles,
    activeWalls: level.activeWalls,
    setActiveWalls: level.setActiveWalls,
    selectedVehicleId: level.selectedVehicleId,
    setSelectedVehicleId: level.setSelectedVehicleId,
    ctStage: level.ctStage,
    setCtStage: level.setCtStage,
    isSandboxMode: level.isSandboxMode,
    setIsSandboxMode: level.setIsSandboxMode,
    algorithmSteps: level.algorithmSteps,
    setAlgorithmSteps: level.setAlgorithmSteps,
    isSimulating: sim.isSimulating,
    currentStepIndex: sim.currentStepIndex,
    simulationLogs: sim.simulationLogs,
    collisionInfo: sim.collisionInfo,
    dismissCollision: sim.dismissCollision,
    simResult,
    sandboxMoveCount: level.sandboxMoveCount,
    isDevMode: level.isDevMode,
    setIsDevMode: level.setIsDevMode,
    handleLoadLevel,
    handleResetLevel,
    handleQuizComplete,
    startSimulation: () => {
      level.setSelectedVehicleId(null);
      sim.start(level.activeVehicles);
    },
    handleSandboxMoveRecorded,
  };
}
