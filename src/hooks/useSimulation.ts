import { useState, useEffect } from "react";
import { Vehicle, MoveAction } from "@types";
import { checkCollision, isLevelSolved } from "@pages/arena/components/ParkingGrid";
import { audio } from "@lib/audio";
import { getVehicleDisplayNamesMap, getVehicleBaseName } from "@lib/vehicleHelpers";

// ── Merge consecutive steps with same vehicleId + direction ──────────────────
function mergeConsecutiveSteps(steps: MoveAction[]): MoveAction[] {
  const merged: MoveAction[] = [];
  for (const step of steps) {
    const last = merged[merged.length - 1];
    if (last && last.vehicleId === step.vehicleId && last.direction === step.direction) {
      last.distance += step.distance;
    } else {
      merged.push({ ...step });
    }
  }
  return merged;
}

// ── How many cells a player vehicle needs to travel to fully exit the grid ───
function stepsToExit(
  vehicle: Vehicle,
  gridRows: number,
  gridCols: number,
  defaultExitRow: number,
  defaultExitCol: number
): { direction: "left" | "right" | "up" | "down"; distance: number } | null {
  if (!vehicle.isPlayer && vehicle.id !== "R") return null;

  if (vehicle.direction === "horizontal") {
    const row = vehicle.exitRow !== undefined ? vehicle.exitRow : defaultExitRow;
    if (vehicle.row !== row) return null;
    if (vehicle.col <= 0) {
      return { direction: "left", distance: vehicle.length + 1 };
    }
    // Add extra padding beyond vehicle.length for a clean off-screen exit
    const distToExit = gridCols - vehicle.col + vehicle.length + 2;
    return { direction: "right", distance: distToExit };
  } else {
    const col = vehicle.exitCol !== undefined ? vehicle.exitCol : defaultExitCol;
    if (vehicle.col !== col) return null;
    if (vehicle.row <= 0) {
      return { direction: "up", distance: vehicle.length + 1 };
    }
    // Add extra padding beyond vehicle.length for a clean off-screen exit
    const distToExit = gridRows - vehicle.row + vehicle.length + 2;
    return { direction: "down", distance: distToExit };
  }
}

// ── Check if a player vehicle is at the exit threshold ──────────────────────
function isVehicleAtExitEdge(
  vehicle: Vehicle,
  gridRows: number,
  gridCols: number,
  defaultExitRow: number,
  defaultExitCol: number
): boolean {
  if (!vehicle.isPlayer && vehicle.id !== "R") return false;
  if (vehicle.direction === "horizontal") {
    const row = vehicle.exitRow !== undefined ? vehicle.exitRow : defaultExitRow;
    return vehicle.row === row && (vehicle.col <= 0 || vehicle.col >= gridCols - vehicle.length);
  } else {
    const col = vehicle.exitCol !== undefined ? vehicle.exitCol : defaultExitCol;
    return vehicle.col === col && (vehicle.row <= 0 || vehicle.row >= gridRows - vehicle.length);
  }
}

// ── Phase enum ───────────────────────────────────────────────────────────────
type SimPhase = "steps" | "exit_anim" | "idle";

export function useSimulation(
  originalVehicles: Vehicle[],
  algorithmSteps: MoveAction[],
  onComplete: (stepsCount: number) => void,
  gridRows = 11,
  gridCols = 12,
  walls: { row: number; col: number }[] = [],
  defaultExitRow = 4,
  defaultExitCol = 4
) {
  const [activeVehicles, setActiveVehicles] = useState<Vehicle[]>(originalVehicles);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [phase, setPhase] = useState<SimPhase>("idle");
  const [collisionInfo, setCollisionInfo] = useState<{
    type?: "collision" | "incomplete";
    stepIndex: number;
    vehicleName: string;
    reason: string;
  } | null>(null);

  // Keep active vehicles in sync with original vehicles when not simulating (e.g., when switching levels)
  useEffect(() => {
    if (!isSimulating) {
      setActiveVehicles(JSON.parse(JSON.stringify(originalVehicles)));
    }
  }, [originalVehicles, isSimulating]);

  // Merged steps computed once when simulation starts (stored in ref-like state)
  const [mergedSteps, setMergedSteps] = useState<MoveAction[]>([]);

  const start = (vehicles: Vehicle[]) => {
    if (algorithmSteps.length === 0 || isSimulating) return;
    audio.playClick();
    setCollisionInfo(null);
    const merged = mergeConsecutiveSteps(algorithmSteps);
    setMergedSteps(merged);
    setActiveVehicles(JSON.parse(JSON.stringify(originalVehicles)));
    setIsSimulating(true);
    setPhase("steps");
    setCurrentStepIndex(0);
    setSimulationLogs([
      "Menjalankan instruksi kompilasi algoritma...",
      `Total instruksi: ${algorithmSteps.length}${merged.length < algorithmSteps.length ? ` (dipadatkan menjadi ${merged.length} langkah)` : ""}`,
    ]);
  };

  const reset = (vehicles: Vehicle[]) => {
    setIsSimulating(false);
    setPhase("idle");
    setCurrentStepIndex(null);
    setMergedSteps([]);
    setCollisionInfo(null);
    setSimulationLogs(["Posisi dikembalikan ke awal tingkat."]);
    setActiveVehicles(JSON.parse(JSON.stringify(vehicles)));
  };

  const dismissCollision = () => {
    setCollisionInfo(null);
  };

  const appendLog = (msg: string) => setSimulationLogs((prev) => [...prev, msg]);

  // ── Phase: executing algorithm steps ────────────────────────────────────────
  useEffect(() => {
    if (!isSimulating || phase !== "steps" || currentStepIndex === null) return;

    // All steps done — check if we should play exit animation
    if (currentStepIndex >= mergedSteps.length) {
      const isSolved = isLevelSolved(activeVehicles, gridRows, gridCols, defaultExitRow, defaultExitCol);
      if (isSolved) {
        // Kick off exit animation for all player vehicles at edge
        appendLog("🚗 Kendaraan keluar dari parkir...");
        setPhase("exit_anim");
        setCurrentStepIndex(0);
      } else {
        appendLog("🏁 Semua langkah selesai. Namun, belum semua Taxi sampai pintu keluar!");
        appendLog("💡 Tips: Analisis kembali mobil yang menghalangi.");
        audio.playError();

        setCollisionInfo({
          type: "incomplete",
          stepIndex: mergedSteps.length,
          vehicleName: "Taxi",
          reason: "Semua langkah telah selesai dijalankan, namun Taxi belum mencapai pintu keluar!",
        });

        // Delay before resetting so the user can see the final vehicle positions
        setTimeout(() => {
          setIsSimulating(false);
          setPhase("idle");
          setCurrentStepIndex(null);
        }, 3000);
      }
      return;
    }

    const step = mergedSteps[currentStepIndex];
    const timer = setTimeout(() => {
      const target = activeVehicles.find((v) => v.id === step.vehicleId);
      if (!target) {
        appendLog(`⛔ Gagal pada Langkah #${currentStepIndex + 1}: Kendaraan tidak ditemukan!`);
        audio.playError();
        setTimeout(() => {
          setIsSimulating(false);
          setPhase("idle");
          setCurrentStepIndex(null);
        }, 3000);
        return;
      }

      const vehicleDisplayNames = getVehicleDisplayNamesMap(activeVehicles);
      const getVehicleDisplayName = (v: Vehicle) => vehicleDisplayNames[v.id] || getVehicleBaseName(v);

      const check = checkCollision(target, step.direction, step.distance, activeVehicles, gridRows, gridCols, walls);
      if (!check.valid) {
        // Move vehicle up to maximum possible distance before collision/wall
        const maxDist = check.maxAllowedSteps ?? 0;
        if (maxDist > 0) {
          const offset = step.direction === "right" || step.direction === "down" ? maxDist : -maxDist;
          setActiveVehicles((prev) =>
            prev.map((v) => {
              if (v.id !== target.id) return v;
              return v.direction === "horizontal" ? { ...v, col: v.col + offset } : { ...v, row: v.row + offset };
            })
          );
          audio.playSlide();
        }
        const vName = getVehicleDisplayName(target);
        const reason = check.reason || "Terjadi tabrakan!";
        appendLog(`💥 TABRAKAN pada Langkah #${currentStepIndex + 1}: ${vName} — "${reason}"!`);
        audio.playError();

        setCollisionInfo({
          type: "collision",
          stepIndex: currentStepIndex + 1,
          vehicleName: vName,
          reason,
        });

        setTimeout(() => {
          setIsSimulating(false);
          setPhase("idle");
          setCurrentStepIndex(null);
        }, 3000);
        return;
      }

      const offset = step.direction === "right" || step.direction === "down" ? step.distance : -step.distance;
      setActiveVehicles((prev) =>
        prev.map((v) => {
          if (v.id !== target.id) return v;
          return v.direction === "horizontal" ? { ...v, col: v.col + offset } : { ...v, row: v.row + offset };
        })
      );

      audio.playSlide();
      appendLog(`✓ Langkah #${currentStepIndex + 1}: ${getVehicleDisplayName(target)} [${step.direction.toUpperCase()}] sejauh ${step.distance} kotak.`);
      setCurrentStepIndex((i) => (i !== null ? i + 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSimulating, phase, currentStepIndex, activeVehicles, mergedSteps, gridRows, gridCols, walls, defaultExitRow, defaultExitCol]);

  // ── Phase: exit animation — slide player vehicles off the grid ───────────────
  useEffect(() => {
    if (!isSimulating || phase !== "exit_anim" || currentStepIndex === null) return;

    const playerVehicles = activeVehicles.filter(
      (v) => (v.isPlayer || v.id === "R") &&
        isVehicleAtExitEdge(v, gridRows, gridCols, defaultExitRow, defaultExitCol)
    );

    if (currentStepIndex >= playerVehicles.length) {
      // All players animated out — add delay before completing level so the exit moment is visible
      const timer = setTimeout(() => {
        setIsSimulating(false);
        setPhase("idle");
        setCurrentStepIndex(null);
        onComplete(algorithmSteps.length);
      }, 1200);
      return () => clearTimeout(timer);
    }

    const vehicle = playerVehicles[currentStepIndex];
    const exitMove = stepsToExit(vehicle, gridRows, gridCols, defaultExitRow, defaultExitCol);
    if (!exitMove) {
      setCurrentStepIndex((i) => (i !== null ? i + 1 : null));
      return;
    }

    const timer = setTimeout(() => {
      const offset = exitMove.direction === "right" || exitMove.direction === "down"
        ? exitMove.distance
        : -exitMove.distance;

      setActiveVehicles((prev) =>
        prev.map((v) => {
          if (v.id !== vehicle.id) return v;
          return v.direction === "horizontal"
            ? { ...v, col: v.col + offset }
            : { ...v, row: v.row + offset };
        })
      );

      audio.playSlide();
      setCurrentStepIndex((i) => (i !== null ? i + 1 : null));
    }, 600);

    return () => clearTimeout(timer);
  }, [isSimulating, phase, currentStepIndex, activeVehicles, gridRows, gridCols, defaultExitRow, defaultExitCol, onComplete, algorithmSteps.length]);

  return { activeVehicles, setActiveVehicles, isSimulating, currentStepIndex: phase === "steps" ? currentStepIndex : null, simulationLogs, collisionInfo, dismissCollision, start, reset };
}
