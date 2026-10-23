import React, { useState, useEffect, useRef } from "react";
import { Vehicle, MoveAction, CTStage, QuizQuestion } from "@types";
import { LEVELS } from "@levels";
import { audio } from "@lib/audio";
import { QuizSection } from "./components/QuizSection";
import { Reflection } from "./components/Reflection";
import { GridPanel } from "./components/GridPanel";
import { SandboxPanel } from "./components/SandboxPanel";
import { AlgorithmPanel } from "./components/AlgorithmPanel";
import { DecompositionModal } from "./components/DecompositionModal";
import { Level1Tour } from "./components/Level1Tour";
import { CollisionModal } from "./components/CollisionModal";
import { AnalysisWorkspace } from "./components/AnalysisWorkspace";
import { Info, ChevronRight, Cpu, Flame, AlertCircle, RotateCcw, Play, Footprints } from "lucide-react";
import { syncQuizQuestionWithVehicles } from "@lib/vehicleHelpers";

export interface SimResult {
  success: boolean;
  totalSteps: number;
  scoreStars: number;
}

interface ArenaPageProps {
  activeLevelId: number;
  activeVehicles: Vehicle[];
  onChangeVehicles: (v: Vehicle[]) => void;
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string | null) => void;
  ctStage: CTStage;
  isSandboxMode: boolean;
  onSetSandboxMode: (v: boolean) => void;
  algorithmSteps: MoveAction[];
  onUpdateSteps: (steps: MoveAction[]) => void;
  isSimulating: boolean;
  currentStepIndex: number | null;
  simulationLogs: string[];
  simResult: SimResult | null;
  sandboxMoveCount: number;
  isQuizModalOpen: boolean;
  onOpenQuiz: () => void;
  onCloseQuiz: () => void;
  onStartSimulation: () => void;
  onResetLevel: () => void;
  onQuizComplete: (score: number) => void;
  onSandboxMoveRecorded: (vId: string, dir: string, dist: number) => void;
  onNextLevel: () => void;
  onSetCtStage: (stage: CTStage) => void;
  activeWalls: { row: number; col: number }[];
  onChangeWalls: (walls: { row: number; col: number }[]) => void;
  isDevMode: boolean;
  onToggleDevMode: () => void;
  collisionInfo?: { stepIndex: number; vehicleName: string; reason: string } | null;
  onDismissCollision?: () => void;
  onGoToDashboard?: () => void;
}

export const ArenaPage: React.FC<ArenaPageProps> = (props) => {
  const activeLevel = LEVELS.find((l) => l.id === props.activeLevelId);
  const isDirectUrl = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("screen");
  const isLevel1 = props.activeLevelId === 1;
  const [isDecompositionModalOpen, setIsDecompositionModalOpen] = useState(!isDirectUrl && props.activeLevelId !== 1);
  const [showTour, setShowTour] = useState(false);
  const [lockedQuizAnswers, setLockedQuizAnswers] = useState<{ [questionIdx: number]: number }>({});

  // Auto-start the interactive Level 1 tour the first time the player reaches
  // Level 1 in Skenario BK mode (persisted in localStorage).
  useEffect(() => {
    if (isLevel1 && !props.isSandboxMode && !isDirectUrl) {
      let seen = false;
      try {
        seen = localStorage.getItem("ep_level1_tour_done") === "1";
      } catch {
        /* ignore storage errors */
      }
      if (!seen) setShowTour(true);
    }
  }, [isLevel1, props.isSandboxMode, isDirectUrl]);

  const handleCloseTour = () => {
    setShowTour(false);
    try {
      localStorage.setItem("ep_level1_tour_done", "1");
    } catch {
      /* ignore storage errors */
    }
  };

  // Adjust state inline during render when activeLevelId, ctStage or isSandboxMode changes, using Refs to avoid unnecessary re-renders
  const prevLevelIdRef = useRef(props.activeLevelId);
  const prevCtStageRef = useRef(props.ctStage);
  const prevIsSandboxModeRef = useRef(props.isSandboxMode);

  if (
    props.activeLevelId !== prevLevelIdRef.current ||
    props.ctStage !== prevCtStageRef.current ||
    props.isSandboxMode !== prevIsSandboxModeRef.current
  ) {
    const isNewLevel = props.activeLevelId !== prevLevelIdRef.current;
    prevLevelIdRef.current = props.activeLevelId;
    prevCtStageRef.current = props.ctStage;
    prevIsSandboxModeRef.current = props.isSandboxMode;
    if (isNewLevel || props.ctStage === "algorithm") {
      setLockedQuizAnswers({});
    }
    if (isNewLevel && props.activeLevelId !== 1 && !props.isSandboxMode && props.ctStage === "algorithm" && !isDirectUrl) {
      setIsDecompositionModalOpen(true);
    } else if (props.isSandboxMode) {
      setIsDecompositionModalOpen(false);
    }
  }

  // Open quiz automatically when stage transitions to 'analysis' or direct URL param
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("quiz") === "1") {
      props.onSetCtStage("analysis");
      props.onOpenQuiz();
    } else if (props.ctStage === "analysis") {
      props.onOpenQuiz();
    }
  }, [props.ctStage]);


  return (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0 h-full w-full p-0 relative">
      {/* Level Badge Fixed at Bottom Left of Arena */}
      <div className="absolute bottom-2 left-2 z-30 flex flex-col items-center pointer-events-none select-none drop-shadow-xl">
        <img
          src={`${import.meta.env.BASE_URL}img/level.webp`}
          alt="Level"
          className="w-12 sm:w-12 lg:w-20 object-contain mb-2"
        />
        <img
          src={`${import.meta.env.BASE_URL}img/level-${props.activeLevelId || 1}.svg`}
          alt={`Level ${props.activeLevelId || 1}`}
          className="w-10 sm:w-10 lg:w-16 object-contain"
        />
      </div>

      <div className="flex flex-row gap-0 items-stretch w-full flex-1 min-h-0 overflow-hidden">
        {/* Left/Main Column: Grid Panel (Fixed, not collapsible) */}
        <div className={`${
          activeLevel && activeLevel.gridCols > 6
            ? "w-[58%] sm:w-[65%] xl:w-[70%]"
            : "w-[50%] sm:w-[50%] xl:w-[60%]"
        } flex-shrink-0 flex flex-col min-h-0 p-1 md:p-4 gap-1.5 md:gap-3 arena-left-column`}>
          <GridPanel
            vehicles={props.activeVehicles}
            onChangeVehicles={props.onChangeVehicles}
            selectedVehicleId={props.selectedVehicleId}
            onSelectVehicle={props.onSelectVehicle}
            isSimulating={props.isSimulating}
            isSandboxMode={props.isSandboxMode}
            onMoveRecorded={props.onSandboxMoveRecorded}
            gridRows={activeLevel?.gridRows ?? 11}
            gridCols={activeLevel?.gridCols ?? 12}
            exitRow={activeLevel?.exitRow}
            levelId={props.activeLevelId}
            onSetSandboxMode={props.onSetSandboxMode}
            onResetLevel={props.onResetLevel}
            ctStage={props.ctStage}
            onOpenDecompositionModal={() => (isLevel1 ? setShowTour(true) : setIsDecompositionModalOpen(true))}
            onOpenQuiz={props.onOpenQuiz}
            activeWalls={props.activeWalls}
            onChangeWalls={props.onChangeWalls}
            isDevMode={props.isDevMode}
            onToggleDevMode={props.onToggleDevMode}
            onGoToDashboard={props.onGoToDashboard}
          />
        </div>

        {/* Right Column: Unified Workspace Panel (Modes, Algorithms, Analysis, Sandbox) */}
        <div className="flex-1 h-full w-full min-h-0 flex flex-col bg-white border-l border-slate-200 rounded-l-lg overflow-hidden shadow-sm">
          {/* Header tabs / Mode switcher */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-2 py-1.5 lg:p-4 flex-shrink-0">
            <div className="flex gap-1 sm:gap-1.5 items-center">
              <button
                id="tour-mode-bk"
                type="button"
                onClick={() => {
                  audio.playClick();
                  props.onSetSandboxMode(false);
                  props.onResetLevel();
                }}
                className={`w-8 h-8 lg:w-9.5 lg:h-9.5 flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
                  !props.isSandboxMode
                    ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800"
                }`}
                title="Skenario BK"
              >
                <Cpu size={15} />
              </button>
              <button
                id="tour-mode-bebas"
                type="button"
                onClick={() => {
                  audio.playClick();
                  props.onSetSandboxMode(true);
                  props.onResetLevel();
                }}
                className={`w-8 h-8 lg:w-9.5 lg:h-9.5 flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
                  props.isSandboxMode
                    ? "bg-amber-500 border-amber-500 text-white shadow-xs"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800"
                }`}
                title="Mode Bebas"
              >
                <Flame size={15} />
              </button>

              {/* Exclamation icon for game guide, visible only in analysis/algorithm stage and NOT in sandbox mode */}
              {!props.isSandboxMode && (props.ctStage === "analysis" || props.ctStage === "algorithm") && (
                <button
                  id="tour-guide-btn"
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    if (isLevel1) {
                      setShowTour(true);
                    } else {
                      setIsDecompositionModalOpen(true);
                    }
                  }}
                  className="w-8 h-8 lg:w-9.5 lg:h-9.5 flex items-center justify-center bg-blue-600 hover:bg-blue-700 border border-blue-600 text-white rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                  title="Lihat Panduan Game"
                >
                  <AlertCircle size={15} />
                </button>
              )}
            </div>

             {/* Ulangi & Jalankan Buttons on the Right */}
             {!props.isSandboxMode && (
               <div className="flex gap-1 sm:gap-1.5 items-center">
                 {/* Mobile-only Step Count Badge */}
                 <div className="h-8 lg:h-9.5 hidden mobile-landscape-flex items-center gap-1 text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 rounded-xl flex-shrink-0 select-none" title={`${props.algorithmSteps.length} Langkah`}>
                   <Footprints size={14} className="text-slate-500" />
                   <span className="text-xs font-bold font-mono">{props.algorithmSteps.length}</span>
                 </div>

                 <button
                   id="tour-reset-btn"
                   type="button"
                   onClick={() => {
                    audio.playClick();
                    props.onResetLevel();
                  }}
                  disabled={props.isSimulating}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 font-extrabold w-8 h-8 lg:w-auto lg:h-9.5 lg:px-3 text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs flex-shrink-0"
                  title="Ulangi simulasi dari awal"
                >
                  <RotateCcw size={15} />
                  <span className="hidden lg:inline text-xs">Ulangi</span>
                </button>

                <button
                  id="tour-run-btn"
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    props.onStartSimulation();
                  }}
                  disabled={props.isSimulating || props.algorithmSteps.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-105 disabled:text-slate-400 disabled:border-slate-100 text-white font-black w-8 h-8 lg:w-auto lg:h-9.5 lg:px-3 text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer border-none flex-shrink-0"
                  title="Jalankan algoritma langkah"
                >
                  <Play size={15} className="fill-current" />
                  <span className="hidden lg:inline text-xs">Jalankan</span>
                </button>
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="flex-1 min-h-0 2xl:pb-4 overflow-hidden">
            {props.isSandboxMode ? (
              <SandboxPanel onResetLevel={props.onResetLevel} />
            ) : (
              <AlgorithmPanel
                activeVehicles={props.activeVehicles}
                algorithmSteps={props.algorithmSteps}
                onUpdateSteps={props.onUpdateSteps}
                isSimulating={props.isSimulating}
                currentStepIndex={props.currentStepIndex}
                simulationLogs={props.simulationLogs}
                ctStage={props.ctStage}
                onStartSimulation={props.onStartSimulation}
                onResetLevel={props.onResetLevel}
                onSetCtStage={props.onSetCtStage}
                selectedVehicleId={props.selectedVehicleId}
                onSelectVehicle={props.onSelectVehicle}
                onOpenQuiz={props.onOpenQuiz}
              />
            )}
          </div>
        </div>
      </div>

      {/* Decomposition (Fase 1) Modal — levels 2+. Level 1 uses the interactive tour. */}
      <DecompositionModal
        isOpen={!isLevel1 && !props.isSandboxMode && (props.ctStage === "analysis" || props.ctStage === "algorithm") && isDecompositionModalOpen}
        onClose={() => setIsDecompositionModalOpen(false)}
        levelName={activeLevel?.name || ""}
      />

      {/* Interactive per-button tour — Level 1 only */}
      <Level1Tour isOpen={isLevel1 && !props.isSandboxMode && showTour} onClose={handleCloseTour} />

      {/* Quiz Modal */}
      {!props.isSandboxMode && props.ctStage === "analysis" && props.isQuizModalOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-xs p-4 select-none">
          <div className="relative max-w-xl w-full m-auto shadow-2xl rounded-3xl overflow-hidden max-h-modal flex flex-col bg-white">
            <button
              type="button"
              onClick={() => { audio.playClick(); props.onCloseQuiz(); }}
              className="absolute top-4 right-4 z-50 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-black text-xs shadow-xs transition-colors cursor-pointer"
            >
              ✕
            </button>
            <QuizSection
              questions={(activeLevel?.quizQuestions || []).map((q) =>
                syncQuizQuestionWithVehicles(q, props.activeVehicles)
              )}
              onQuizComplete={props.onQuizComplete}
              onPrevStage={props.onCloseQuiz}
              lockedAnswers={lockedQuizAnswers}
              onLockAnswer={(qIdx, ansIdx) =>
                setLockedQuizAnswers((prev) => ({ ...prev, [qIdx]: ansIdx }))
              }
            />
          </div>
        </div>
      )}

      {/* Reflection Modal */}
      {!props.isSandboxMode && props.ctStage === "evaluation" && props.simResult && (
        <div className="fixed inset-0 z-[1000] flex justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-xs p-4 select-none">
          <Reflection
            levelId={props.activeLevelId}
            levelName={activeLevel?.name || ""}
            playerStepsCount={props.simResult.totalSteps}
            optimalStepsCount={activeLevel?.optimalSteps || 1}
            starsEarned={props.simResult.scoreStars}
            onRestartLevel={props.onResetLevel}
            onNextLevel={props.onNextLevel}
            isLastLevel={props.activeLevelId === LEVELS.length}
          />
        </div>
      )}

      {/* Collision Alert Modal */}
      <CollisionModal
        isOpen={!!props.collisionInfo}
        onClose={props.onDismissCollision || (() => {})}
        collisionInfo={props.collisionInfo || null}
      />
    </div>
  );
};
