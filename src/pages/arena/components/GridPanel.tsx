import React from "react";
import { Vehicle, CTStage } from "@types";
import { ParkingGrid } from "@pages/arena/components/ParkingGrid";
import { Cpu, Flame, AlertCircle, Compass } from "lucide-react";
import { audio } from "@lib/audio";

interface GridPanelProps {
  vehicles: Vehicle[];
  onChangeVehicles: (v: Vehicle[]) => void;
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string | null) => void;
  isSimulating: boolean;
  isSandboxMode: boolean;
  onMoveRecorded: (vId: string, dir: string, dist: number) => void;
  gridRows?: number;
  gridCols?: number;
  exitRow?: number;
  levelId?: number;
  onSetSandboxMode: (v: boolean) => void;
  onResetLevel: () => void;
  ctStage: CTStage;
  onOpenDecompositionModal: () => void;
  onOpenQuiz: () => void;
  activeWalls?: { row: number; col: number }[];
  onChangeWalls?: (walls: { row: number; col: number }[]) => void;
  isDevMode?: boolean;
  onToggleDevMode?: () => void;
  onGoToDashboard?: () => void;
}

export const GridPanel: React.FC<GridPanelProps> = ({
  vehicles,
  onChangeVehicles,
  selectedVehicleId,
  onSelectVehicle,
  isSimulating,
  isSandboxMode,
  onMoveRecorded,
  gridRows = 11,
  gridCols = 12,
  exitRow = 4,
  levelId,
  onSetSandboxMode,
  onResetLevel,
  ctStage,
  onOpenDecompositionModal,
  onOpenQuiz,
  activeWalls = [],
  onChangeWalls,
  isDevMode = false,
  onToggleDevMode,
  onGoToDashboard,
}) => {
  return (
    <div>
      {/* Grid Canvas (No wrapping card borders) */}
      <div className="flex-1 w-full flex items-center justify-center flex-row">
        <ParkingGrid
          vehicles={vehicles}
          onChangeVehicles={onChangeVehicles}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={onSelectVehicle}
          disabled={isSimulating || !isSandboxMode}
          onMoveRecorded={onMoveRecorded}
          gridRows={gridRows}
          gridCols={gridCols}
          exitRow={exitRow}
          levelId={levelId}
          activeWalls={activeWalls}
          onChangeWalls={onChangeWalls}
          isDevMode={isDevMode}
          onToggleDevMode={onToggleDevMode}
          onGoToDashboard={onGoToDashboard}
        />
      <div className="flex flex-col gap-2 p-1.5 bg-slate-100/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xs w-fit flex-shrink-0">
        <button
          type="button"
          onClick={() => { audio.playClick(); onSetSandboxMode(false); onResetLevel(); }}
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer border-none ${
            !isSandboxMode
              ? "bg-blue-600 text-white shadow-sm scale-105"
              : "bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200"
          }`}
          title="Skenario BK"
        >
          <Cpu size={14} />
        </button>
        <button
          type="button"
          onClick={() => { audio.playClick(); onSetSandboxMode(true); onResetLevel(); }}
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer border-none ${
            isSandboxMode
              ? "bg-amber-500 text-white shadow-sm scale-105"
              : "bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200"
          }`}
          title="Mode Bebas"
        >
          <Flame size={14} />
        </button>

        {/* Panduan Game (Exclamation Icon) */}
        {!isSandboxMode && (ctStage === "analysis" || ctStage === "algorithm") && (
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              onOpenDecompositionModal();
            }}
            className="w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 border border-blue-600 text-white rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Lihat Panduan Game"
          >
            <AlertCircle size={14} />
          </button>
        )}

        {/* Mulai Kuis Button (Compass Icon) */}
        {!isSandboxMode && ctStage === "analysis" && (
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              onOpenQuiz();
            }}
            className="w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all cursor-pointer border border-blue-700 shadow-sm scale-105"
            title="Mulai Kuis"
          >
            <Compass size={14} className="animate-pulse" />
          </button>
        )}
      </div>
      </div>

      {/* Dev Mode Wall Coordinates Exporter */}
      {isDevMode && (
        <div className="mt-3 p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl w-full max-w-[520px] mx-auto shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black text-amber-400">📋 Koordinat Dinding (Walls JSON)</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(activeWalls));
                audio.playClick();
              }}
              className="text-[10px] bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-2 py-0.5 rounded transition-all cursor-pointer border-none"
            >
              Salin JSON
            </button>
          </div>
          <pre className="text-[10px] font-mono bg-slate-950 p-2.5 rounded-lg max-h-20 overflow-y-auto whitespace-pre-wrap select-all text-emerald-400">
            {JSON.stringify(activeWalls)}
          </pre>
          <div className="text-[9px] text-slate-400 mt-2 leading-relaxed">
            * Klik slot kosong pada area parkir di atas untuk meletakkan atau menghapus dinding.
            Anda bisa menyalin JSON di atas lalu menempelkannya ke properti <code>walls</code> pada <code>levels.ts</code>.
          </div>
        </div>
      )}
    </div>
  );
};
