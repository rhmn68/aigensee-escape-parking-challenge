import React from "react";
import { Vehicle, MoveAction, CTStage } from "@types";
import { Compass } from "lucide-react";
import { audio } from "@lib/audio";
import { StepBuilder } from "./StepBuilder";

interface AlgorithmPanelProps {
  activeVehicles: Vehicle[];
  algorithmSteps: MoveAction[];
  onUpdateSteps: (steps: MoveAction[]) => void;
  isSimulating: boolean;
  currentStepIndex: number | null;
  simulationLogs: string[];
  ctStage: CTStage;
  onStartSimulation: () => void;
  onResetLevel: () => void;
  onSetCtStage: (stage: CTStage) => void;
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string | null) => void;
  onOpenQuiz?: () => void;
}

export const AlgorithmPanel: React.FC<AlgorithmPanelProps> = ({
  activeVehicles,
  algorithmSteps,
  onUpdateSteps,
  isSimulating,
  currentStepIndex,
  simulationLogs,
  ctStage,
  onStartSimulation,
  onResetLevel,
  onSetCtStage,
  selectedVehicleId,
  onSelectVehicle,
  onOpenQuiz,
}) => (
  <div className="h-full flex flex-col min-h-0 overflow-hidden space-y-2">
    {/* Step Builder */}
    <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
      <StepBuilder
        vehicles={activeVehicles}
        steps={algorithmSteps}
        onUpdateSteps={onUpdateSteps}
        isSimulating={isSimulating || ctStage === "analysis"}
        currentSimulatingStepIndex={currentStepIndex}
        selectedVehicleId={selectedVehicleId}
        onSelectVehicle={onSelectVehicle}
      />
    </div>

    {/* Mulai Kuis Button when simulation succeeded (analysis stage) */}
    {ctStage === "analysis" && onOpenQuiz && (
      <div className="px-1.5 lg:px-4 pb-1.5 lg:pb-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            audio.playClick();
            onOpenQuiz();
          }}
          className="flex items-center justify-center gap-2.5 p-2 md:p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 rounded-2xl text-center cursor-pointer transition-all hover:scale-[1.01] w-full font-black text-xs shadow-xs"
        >
          <Compass size={16} className="animate-pulse" />
          <span>Mulai Kuis Pemahaman</span>
        </button>
      </div>
    )}

    {/* Proceed to evaluation banner */}
    {algorithmSteps.length > 0 && !isSimulating && ctStage === "simulation" && (
      <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center justify-between text-xs text-blue-700 font-bold shadow-xs flex-shrink-0 animate-pulse">
        <span>Skenario berjalan sukses, silakan simpan atau revisi programmu.</span>
        <button
          onClick={() => onSetCtStage("evaluation")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
        >
          Buka Lembar Evaluasi →
        </button>
      </div>
    )}
  </div>
);
