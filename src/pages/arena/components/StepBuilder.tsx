import React, { useState, useEffect, useRef } from "react";
import { Vehicle, MoveAction } from "../../../types";
import { Plus, Trash2 } from "lucide-react";
import audio from "../../../lib/audio";
import { getVehicleDisplayNamesMap, getVehicleBaseName, getVehicleImagePath } from "../../../lib/vehicleHelpers";

const getStepVisuals = (matchedVehicle: Vehicle | undefined, isDragged: boolean, isOutside: boolean, vehicles?: Vehicle[]) => {
  if (isDragged && isOutside) {
    return {
      fill: "#EF4444",
      stroke: "#B91C1C",
      textColor: "text-white",
      badgeClass: "bg-white/20 border-white/25 text-red-100",
      numberClass: "bg-black/20 text-red-100"
    };
  }

  if (!matchedVehicle) {
    // Fallback (Slate)
    return {
      fill: "#94A3B8",
      stroke: "#64748B",
      textColor: "text-white",
      badgeClass: "bg-white text-slate-650 border-slate-200 shadow-xs",
      numberClass: "bg-black/15 text-white"
    };
  }

  const path = getVehicleImagePath(matchedVehicle, vehicles);
  const filename = path.split("/").pop() || "";

  let colorKey = "abu";
  if (filename.includes("taxi") || matchedVehicle.isPlayer || matchedVehicle.id === "R") {
    colorKey = "taxi";
  } else if (filename.includes("biru")) {
    colorKey = "biru";
  } else if (filename.includes("merah")) {
    colorKey = "merah";
  } else if (filename.includes("truck") && filename.includes("kuning")) {
    colorKey = "oren";
  } else if (filename.includes("kuning")) {
    colorKey = "kuning";
  } else if (filename.includes("hijau")) {
    colorKey = "hijau";
  } else if (filename.includes("cyan")) {
    colorKey = "cyan";
  } else if (filename.includes("cokelat")) {
    colorKey = "cokelat";
  } else if (filename.includes("putih")) {
    colorKey = "putih";
  } else if (filename.includes("abu")) {
    colorKey = "abu";
  }

  switch (colorKey) {
    case "taxi":
      return {
        fill: "#FFCF01",
        stroke: "#CA8A04",
        textColor: "text-black",
        badgeClass: "bg-white text-black border-yellow-500 shadow-xs",
        numberClass: "bg-black/10 text-black"
      };
    case "merah":
      return {
        fill: "#EF4444",
        stroke: "#B91C1C",
        textColor: "text-white",
        badgeClass: "bg-white text-red-600 border-red-200 shadow-xs",
        numberClass: "bg-black/15 text-white"
      };
    case "oren":
      return {
        fill: "#F97316",
        stroke: "#C2410C",
        textColor: "text-white",
        badgeClass: "bg-white text-orange-600 border-orange-200 shadow-xs",
        numberClass: "bg-black/15 text-white"
      };
    case "kuning":
      return {
        fill: "#F59E0B",
        stroke: "#B45309",
        textColor: "text-white",
        badgeClass: "bg-white text-amber-600 border-amber-200 shadow-xs",
        numberClass: "bg-black/15 text-white"
      };
    case "biru":
      return {
        fill: "#3B82F6",
        stroke: "#1D4ED8",
        textColor: "text-white",
        badgeClass: "bg-white text-blue-600 border-blue-200 shadow-xs",
        numberClass: "bg-black/15 text-white"
      };
    case "hijau":
      return {
        fill: "#10B981",
        stroke: "#047857",
        textColor: "text-white",
        badgeClass: "bg-white text-emerald-600 border-emerald-200 shadow-xs",
        numberClass: "bg-black/15 text-white"
      };
    case "cyan":
      return {
        fill: "#06B6D4",
        stroke: "#0E7490",
        textColor: "text-white",
        badgeClass: "bg-white text-cyan-600 border-cyan-200 shadow-xs",
        numberClass: "bg-black/15 text-white"
      };
    case "cokelat":
      return {
        fill: "#92400E",
        stroke: "#78350F",
        textColor: "text-white",
        badgeClass: "bg-white text-amber-800 border-amber-900/30 shadow-xs",
        numberClass: "bg-black/15 text-white"
      };
    case "putih":
      return {
        fill: "#F8FAFC",
        stroke: "#94A3B8",
        textColor: "text-slate-800",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-300 shadow-xs",
        numberClass: "bg-slate-200 text-slate-700"
      };
    case "abu":
    default:
      return {
        fill: "#94A3B8",
        stroke: "#64748B",
        textColor: "text-white",
        badgeClass: "bg-white text-slate-600 border-slate-200 shadow-xs",
        numberClass: "bg-black/15 text-white"
      };
  }
};

interface StepBuilderProps {
  vehicles: Vehicle[];
  steps: MoveAction[];
  onUpdateSteps: (updated: MoveAction[]) => void;
  isSimulating: boolean;
  currentSimulatingStepIndex: number | null;
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string | null) => void;
}

export const StepBuilder: React.FC<StepBuilderProps> = ({
  vehicles,
  steps,
  onUpdateSteps,
  isSimulating,
  currentSimulatingStepIndex,
  selectedVehicleId,
  onSelectVehicle
}) => {
  const vehicleDisplayNames = getVehicleDisplayNamesMap(vehicles);

  const getVehicleDisplayName = (v: Vehicle) => {
    return vehicleDisplayNames[v.id] || getVehicleBaseName(v);
  };

  const [direction, setDirection] = useState<"left" | "right" | "up" | "down" | "">("");
  const [stepMultiplier, setStepMultiplier] = useState<number>(1);

  // ── DRAG & DROP ────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  itemRefs.current = []; // reset each render; repopulated by ref callbacks

  const stepKeys = useRef<WeakMap<MoveAction, string> | null>(null);
  if (!stepKeys.current) stepKeys.current = new WeakMap();

  const getStepKey = (step: MoveAction) => {
    if (!stepKeys.current!.has(step))
      stepKeys.current!.set(step, Math.random().toString(36).slice(2, 9));
    return stepKeys.current!.get(step)!;
  };

  // Hot-path refs — mutated imperatively, never cause re-renders
  const dragIdxRef      = useRef<number | null>(null);
  const hoverIdxRef     = useRef<number | null>(null);
  const pointerIdRef    = useRef<number | null>(null);
  const isOutsideRef    = useRef(false);
  const dragStartY      = useRef(0);
  const dragScrollStart = useRef(0);
  // Rects snapshotted ONCE at drag-start (stable throughout entire drag)
  const snapRects = useRef<{ top: number; height: number }[]>([]);

  // React state — only className / child changes, minimal re-renders
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoverIndex,   setHoverIndex]   = useState<number | null>(null);
  const [isOutside,    setIsOutside]    = useState(false);

  // ── helpers ──
  // Use CSS custom property so React's style reconciler never touches transform
  const applyDragY = (idx: number, y: number) => {
    const el = itemRefs.current[idx];
    if (el) { el.style.setProperty('--drag-y', `${y}px`); el.style.zIndex = '50'; }
  };

  const clearDragEl = (idx: number) => {
    const el = itemRefs.current[idx];
    if (el) { el.style.removeProperty('--drag-y'); el.style.zIndex = ''; }
  };

  const resetAllDrag = (dragIdx: number | null) => {
    if (dragIdx !== null) clearDragEl(dragIdx);
    dragIdxRef.current   = null;
    hoverIdxRef.current  = null;
    pointerIdRef.current = null;
    isOutsideRef.current = false;
    setDraggedIndex(null);
    setHoverIndex(null);
    setIsOutside(false);
  };

  // Slot height = distance between adjacent item tops from snapshot
  const getSlotH = () => {
    const s = snapRects.current;
    if (!s || s.length === 0) return 40;
    return s.length > 1 ? Math.abs(s[1].top - s[0].top) : (s[0]?.height ?? 40);
  };

  // Per-item inline style during drag
  const getDragItemStyle = (idx: number): React.CSSProperties => {
    if (draggedIndex === null || hoverIndex === null) return {};
    if (idx === draggedIndex) {
      // Position driven by CSS var; React never writes transform here
      return { transform: 'translate3d(0, var(--drag-y, 0px), 0)', transition: 'none', zIndex: 50 };
    }
    const slotH = getSlotH();
    let shift = 0;
    if (draggedIndex < hoverIndex && idx > draggedIndex && idx <= hoverIndex) shift = -slotH;
    if (draggedIndex > hoverIndex && idx >= hoverIndex && idx < draggedIndex)  shift =  slotH;
    return shift !== 0
      ? { transform: `translateY(${shift}px)`, transition: 'transform 150ms ease' }
      : { transition: 'transform 150ms ease' };
  };

  // ── pointer handlers ──
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, index: number) => {
    if (isSimulating || e.button !== 0) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }

    // Snapshot all item rects BEFORE any visual change (layout still pristine)
    const rects: { top: number; height: number }[] = [];
    for (let i = 0; i < steps.length; i++) {
      const el = itemRefs.current[i];
      if (el) {
        const r = el.getBoundingClientRect();
        rects.push({ top: r.top, height: r.height });
      } else {
        rects.push({ top: 0, height: 40 });
      }
    }
    snapRects.current = rects;

    dragIdxRef.current      = index;
    hoverIdxRef.current     = index;
    pointerIdRef.current    = e.pointerId;
    dragStartY.current      = e.clientY;
    dragScrollStart.current = containerRef.current?.scrollTop ?? 0;
    isOutsideRef.current    = false;

    applyDragY(index, 0);
    setDraggedIndex(index);
    setHoverIndex(index);
    setIsOutside(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const dragIdx = dragIdxRef.current;
    if (dragIdx === null || e.pointerId !== pointerIdRef.current) return;

    const scrollDiff = (containerRef.current?.scrollTop ?? 0) - dragScrollStart.current;
    const deltaY = (e.clientY - dragStartY.current) + scrollDiff;

    // Move dragged item — pure DOM mutation, zero React re-render
    applyDragY(dragIdx, deltaY);

    // Outside detection — re-render only when state changes
    if (containerRef.current) {
      const cr = containerRef.current.getBoundingClientRect();
      const margin = 44;
      const outside = e.clientY < cr.top - margin || e.clientY > cr.bottom + margin
        || e.clientX < cr.left - margin || e.clientX > cr.right + margin;
      if (outside !== isOutsideRef.current) {
        isOutsideRef.current = outside;
        setIsOutside(outside);
      }
    }

    // Hover-slot from stable snapshots — no getBoundingClientRect during move
    const snap = snapRects.current;
    if (!snap || !snap[dragIdx]) return;
    const draggedCenterY = snap[dragIdx].top + snap[dragIdx].height / 2 + deltaY;
    let count = 0;
    for (let i = 0; i < snap.length; i++) {
      if (i === dragIdx) continue;
      if (snap[i].top + snap[i].height / 2 < draggedCenterY) count++;
    }
    const newHover = Math.max(0, Math.min(steps.length - 1, count));
    if (newHover !== hoverIdxRef.current) {
      hoverIdxRef.current = newHover;
      setHoverIndex(newHover); // re-render only when slot changes
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const dragIdx = dragIdxRef.current;
    if (dragIdx === null) return;

    // Snapshot BEFORE releasePointerCapture — releasing can fire
    // handleLostPointerCapture synchronously, which would null out hoverIdxRef
    const hover   = hoverIdxRef.current ?? dragIdx;
    const outside = isOutsideRef.current;

    // Null dragIdxRef first so handleLostPointerCapture becomes a no-op
    dragIdxRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }

    clearDragEl(dragIdx);

    if (outside) {
      audio.playClick();
      const updated = [...steps];
      updated.splice(dragIdx, 1);
      onUpdateSteps(updated);
    } else if (hover !== dragIdx) {
      const updated = [...steps];
      const [item] = updated.splice(dragIdx, 1);
      updated.splice(hover, 0, item);
      onUpdateSteps(updated);
    }

    hoverIdxRef.current  = null;
    pointerIdRef.current = null;
    isOutsideRef.current = false;
    setDraggedIndex(null);
    setHoverIndex(null);
    setIsOutside(false);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    resetAllDrag(dragIdxRef.current);
  };

  const handleLostPointerCapture = () => resetAllDrag(dragIdxRef.current);


  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  // Sync available directions when selected vehicle changes
  useEffect(() => {
    if (selectedVehicle) {
      if (selectedVehicle.direction === "horizontal") {
        setDirection("right");
      } else {
        setDirection("down");
      }
    } else {
      setDirection("");
    }
  }, [selectedVehicleId, vehicles]);

  // Handle adding step (supports adding multiple steps at once via stepMultiplier)
  const handleAddStep = () => {
    if (!selectedVehicleId || !direction) return;

    const count = Math.max(1, stepMultiplier);
    const newSteps: MoveAction[] = Array.from({ length: count }, () => ({
      vehicleId: selectedVehicleId,
      direction: direction as any,
      distance: 1
    }));

    audio.playClick();
    onUpdateSteps([...steps, ...newSteps]);
    setStepMultiplier(1);
  };

  const getDirectionText = (dir: string) => {
    switch (dir) {
      case "left":
        return "Maju Kiri";
      case "right":
        return "Maju Kanan";
      case "up":
        return "Geser Atas";
      case "down":
        return "Geser Bawah";
      default:
        return dir;
    }
  };

  const getDirectionSymbol = (dir: string) => {
    switch (dir) {
      case "left": return "◀";
      case "right": return "▶";
      case "up": return "▲";
      case "down": return "▼";
      default: return "";
    }
  };

  return (
    <div id="step-builder-root" className="flex flex-col h-full min-h-0 justify-between text-slate-800 p-1.5 lg:p-4">
      <div id="step-builder-panel" className="flex-1 min-h-0 flex flex-col justify-between">
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Builder Panel Form */}
          <div id="builder-form-panel" className="bg-slate-50 border border-slate-200 rounded-xl p-1.5 lg:p-4 space-y-1 sm:space-y-3 flex-shrink-0 mb-1 sm:mb-2">
            <div className="grid grid-cols-[1.3fr_1fr_0.7fr] gap-1 sm:gap-2.5">
              {/* Pick Vehicle */}
              <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                <label className="text-[7px] sm:text-[10px] uppercase font-mono font-black text-slate-400">
                  Mobil
                </label>
                <select
                  id="select-vehicle-input"
                  value={selectedVehicleId || ""}
                  onChange={(e) => {
                    audio.playClick();
                    onSelectVehicle(e.target.value || null);
                  }}
                  disabled={isSimulating}
                  className="bg-white text-[9px] sm:text-xs text-slate-700 border border-slate-300 rounded-lg p-0.5 sm:p-2 focus:ring-1 focus:ring-blue-500 outline-none w-full truncate"
                >
                  <option value="">-- Pilih --</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {getVehicleDisplayName(v)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pick Direction */}
              <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                <label className="text-[7px] sm:text-[10px] uppercase font-mono font-black text-slate-400">
                  Arah
                </label>
                <select
                  id="select-direction-input"
                  value={direction}
                  onChange={(e) => {
                    audio.playClick();
                    setDirection(e.target.value as any);
                  }}
                  disabled={isSimulating || !selectedVehicleId}
                  className="bg-white text-[9px] sm:text-xs text-slate-700 border border-slate-300 rounded-lg p-0.5 sm:p-2 focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-50 w-full truncate"
                >
                  {!selectedVehicleId && <option value="">Pilih mobil</option>}
                  {selectedVehicle?.direction === "horizontal" && (
                    <>
                      <option value="left">◀ Kiri</option>
                      <option value="right">▶ Kanan</option>
                    </>
                  )}
                  {selectedVehicle?.direction === "vertical" && (
                    <>
                      <option value="up">▲ Ke Atas</option>
                      <option value="down">▼ Ke Bawah</option>
                    </>
                  )}
                </select>
              </div>

              {/* Pick Step Multiplier (Perkalian Langkah) */}
              <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                <label className="text-[7px] sm:text-[10px] uppercase font-mono font-black text-slate-400">
                  Langkah
                </label>
                <select
                  id="select-multiplier-input"
                  value={stepMultiplier}
                  onChange={(e) => {
                    audio.playClick();
                    setStepMultiplier(Number(e.target.value));
                  }}
                  disabled={isSimulating || !selectedVehicleId}
                  className="bg-white text-[9px] sm:text-xs font-bold text-slate-700 border border-slate-300 rounded-lg p-0.5 sm:p-2 focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-50 w-full"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}x
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              id="add-step-btn"
              onClick={handleAddStep}
              disabled={isSimulating || !selectedVehicleId || !direction}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-extrabold text-[9px] sm:text-xs py-1 px-2.5 sm:py-2 sm:px-3 rounded-lg flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer border-none"
            >
              <Plus size={12} />
              <span>{stepMultiplier > 1 ? `Tambah ${stepMultiplier} Langkah (${stepMultiplier}x)` : "Tambah Langkah"}</span>
            </button>
          </div>

          {/* Header Title */}
          <div className="flex mobile-landscape-hidden flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-200 p-2 sm:p-3 md:p-4 mb-1 sm:mb-2 flex-shrink-0">
            <div className="flex flex-col gap-0.5 min-w-0">
              <h4 className="text-[10px] sm:text-xs md:text-sm font-black text-slate-800 uppercase tracking-wider font-display">
                Algoritma
              </h4>
              {steps.length > 0 && (
                <ul className="text-[9px] sm:text-[10px] md:text-xs text-slate-800 font-medium leading-snug break-words space-y-0.5 list-disc pl-4">
                  <li>Seret langkah untuk mengurutkan</li>
                  <li>Tarik ke luar untuk menghapus</li>
                </ul>
              )}
            </div>
            <span className="shrink-0 self-start sm:self-auto text-[8px] sm:text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-full text-slate-600 font-mono whitespace-nowrap">
              {steps.length} Langkah
            </span>
          </div>

          {/* Algorithm List Block Container */}
          <div 
            id="step-list-container"
            ref={containerRef}
            className={`space-y-[-3px] sm:space-y-[-6px] flex-1 min-h-0 overflow-y-auto pr-1 mb-2 sm:mb-3 transition-all duration-200 ${
              draggedIndex !== null && isOutside
                ? "bg-red-50/20 border border-dashed border-red-350 rounded-2xl p-1"
                : ""
            }`}
          >
            {steps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-2 md:py-4 px-1 md:px-2 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                  Belum ada langkah terancang.
                </p>
              </div>
            ) : (
              steps.map((step, idx) => {
                const matchedVehicle = vehicles.find((v) => v.id === step.vehicleId);
                const isCurrentlyRunning = currentSimulatingStepIndex === idx;
                const isDragged = draggedIndex === idx;
                const isSelected = selectedVehicleId === step.vehicleId;
                const visuals = getStepVisuals(matchedVehicle, isDragged, isOutside, vehicles);

                const opacityClass = selectedVehicleId && !isSelected ? "opacity-45" : "opacity-100";
                const ringClass = isCurrentlyRunning
                  ? ""
                  : isSelected
                  ? ""
                  : isDragged
                  ? isOutside
                    ? "scale-[0.98] rotate-2 opacity-80"
                    : "scale-[1.03]"
                  : "";

                return (
                  <div
                    key={getStepKey(step)}
                    id={`step-item-${idx}`}
                    ref={(el) => {
                      if (el) itemRefs.current[idx] = el;
                    }}
                    onPointerDown={(e) => handlePointerDown(e, idx)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                    onLostPointerCapture={handleLostPointerCapture}
                    onDragStart={(e) => e.preventDefault()}
                    onClick={() => {
                      if (!isSimulating) {
                        audio.playClick();
                        onSelectVehicle(step.vehicleId);
                      }
                    }}
                    className={`relative z-0 flex items-center justify-between pb-1.5 pl-3 pr-7  sm:pl-5 sm:pr-11 h-8 sm:h-12 w-full bg-transparent hover:bg-transparent text-[8px] sm:text-xs font-mono select-none touch-none cursor-grab active:cursor-grabbing hover:brightness-90 ${isDragged ? 'opacity-50' : 'opacity-100'} ${opacityClass} ${ringClass}`}
                    style={getDragItemStyle(idx)}
                  >
                    {/* SVG Bubble Background (3-slice scaled to prevent distortion) */}
                    <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none flex select-none overflow-hidden">
                      {/* Left Cap */}
                      <svg
                        className="h-full aspect-[20/112.65] flex-shrink-0"
                        viewBox="0 0 20 112.65"
                        preserveAspectRatio="none"
                      >
                        <path
                          fill={visuals.fill}
                          d="M265.02,110.65c-5.37,0-9.74-4.37-9.74-9.74v-4.6c0-2.42-1.97-4.4-4.4-4.4H13c-6.07,0-11-4.93-11-11V13C2,6.93,6.93,2,13,2h236.74c.11,0,.19.09.19.19v2.84c0,8.27,6.73,15,15,15h10.07c8.27,0,15-6.73,15-15v-2.84c0-.11.09-.19.19-.19h7.63c6.07,0,11,4.93,11,11v67.91c0,6.07-4.93,11-11,11h-8.77c-2.42,0-4.4,1.97-4.4,4.4v4.6c0,5.37-4.37,9.74-9.74,9.74h-9.89Z"
                        />
                        <path
                          fill={visuals.stroke}
                          d="M297.82,4c4.96,0,9,4.04,9,9v67.91c0,4.96-4.04,9-9,9h-8.77c-3.53,0-6.4,2.87-6.4,6.4v4.6c0,4.27-3.47,7.74-7.74,7.74h-9.89c-4.27,0-7.74-3.47-7.74-7.74v-4.6c0-3.53-2.87-6.4-6.4-6.4H13c-4.96,0-9-4.04-9-9V13c0-4.96,4.04-9,9-9h234.93v1.03c0,9.37,7.63,17,17,17h10.07c9.37,0,17-7.63,17-17v-1.03h5.82M297.82,0h-7.63c-1.21,0-2.19.98-2.19,2.19v2.84c0,7.18-5.82,13-13,13h-10.07c-7.18,0-13-5.82-13-13v-2.84c0-1.21-.98-2.19-2.19-2.19H13C5.82,0,0,5.82,0,13v67.91c0,7.18,5.82,13,13,13h237.88c1.32,0,2.4,1.07,2.4,2.4v4.6c0,6.48,5.26,11.74,11.74,11.74h9.89c6.48,0,11.74-5.26,11.74-11.74v-4.6c0-1.32,1.07-2.4,2.4-2.4h8.77c7.18,0,13-5.82,13-13V13c0-7.18-5.82-13-13-13h0Z"
                        />
                      </svg>

                      {/* Middle Slice */}
                      <svg
                        className="h-full flex-1"
                        viewBox="20 0 220 112.65"
                        preserveAspectRatio="none"
                      >
                        <path
                          fill={visuals.fill}
                          d="M265.02,110.65c-5.37,0-9.74-4.37-9.74-9.74v-4.6c0-2.42-1.97-4.4-4.4-4.4H13c-6.07,0-11-4.93-11-11V13C2,6.93,6.93,2,13,2h236.74c.11,0,.19.09.19.19v2.84c0,8.27,6.73,15,15,15h10.07c8.27,0,15-6.73,15-15v-2.84c0-.11.09-.19.19-.19h7.63c6.07,0,11,4.93,11,11v67.91c0,6.07-4.93,11-11,11h-8.77c-2.42,0-4.4,1.97-4.4,4.4v4.6c0,5.37-4.37,9.74-9.74,9.74h-9.89Z"
                        />
                        <path
                          fill={visuals.stroke}
                          d="M297.82,4c4.96,0,9,4.04,9,9v67.91c0,4.96-4.04,9-9,9h-8.77c-3.53,0-6.4,2.87-6.4,6.4v4.6c0,4.27-3.47,7.74-7.74,7.74h-9.89c-4.27,0-7.74-3.47-7.74-7.74v-4.6c0-3.53-2.87-6.4-6.4-6.4H13c-4.96,0-9-4.04-9-9V13c0-4.96,4.04-9,9-9h234.93v1.03c0,9.37,7.63,17,17,17h10.07c9.37,0,17-7.63,17-17v-1.03h5.82M297.82,0h-7.63c-1.21,0-2.19.98-2.19,2.19v2.84c0,7.18-5.82,13-13,13h-10.07c-7.18,0-13-5.82-13-13v-2.84c0-1.21-.98-2.19-2.19-2.19H13C5.82,0,0,5.82,0,13v67.91c0,7.18,5.82,13,13,13h237.88c1.32,0,2.4,1.07,2.4,2.4v4.6c0,6.48,5.26,11.74,11.74,11.74h9.89c6.48,0,11.74-5.26,11.74-11.74v-4.6c0-1.32,1.07-2.4,2.4-2.4h8.77c7.18,0,13-5.82,13-13V13c0-7.18-5.82-13-13-13h0Z"
                        />
                      </svg>

                      {/* Right Cap */}
                      <svg
                        className="h-full aspect-[70.82/112.65] flex-shrink-0"
                        viewBox="240 0 70.82 112.65"
                        preserveAspectRatio="none"
                      >
                        <path
                          fill={visuals.fill}
                          d="M265.02,110.65c-5.37,0-9.74-4.37-9.74-9.74v-4.6c0-2.42-1.97-4.4-4.4-4.4H13c-6.07,0-11-4.93-11-11V13C2,6.93,6.93,2,13,2h236.74c.11,0,.19.09.19.19v2.84c0,8.27,6.73,15,15,15h10.07c8.27,0,15-6.73,15-15v-2.84c0-.11.09-.19.19-.19h7.63c6.07,0,11,4.93,11,11v67.91c0,6.07-4.93,11-11,11h-8.77c-2.42,0-4.4,1.97-4.4,4.4v4.6c0,5.37-4.37,9.74-9.74,9.74h-9.89Z"
                        />
                        <path
                          fill={visuals.stroke}
                          d="M297.82,4c4.96,0,9,4.04,9,9v67.91c0,4.96-4.04,9-9,9h-8.77c-3.53,0-6.4,2.87-6.4,6.4v4.6c0,4.27-3.47,7.74-7.74,7.74h-9.89c-4.27,0-7.74-3.47-7.74-7.74v-4.6c0-3.53-2.87-6.4-6.4-6.4H13c-4.96,0-9-4.04-9-9V13c0-4.96,4.04-9,9-9h234.93v1.03c0,9.37,7.63,17,17,17h10.07c9.37,0,17-7.63,17-17v-1.03h5.82M297.82,0h-7.63c-1.21,0-2.19.98-2.19,2.19v2.84c0,7.18-5.82,13-13,13h-10.07c-7.18,0-13-5.82-13-13v-2.84c0-1.21-.98-2.19-2.19-2.19H13C5.82,0,0,5.82,0,13v67.91c0,7.18,5.82,13,13,13h237.88c1.32,0,2.4,1.07,2.4,2.4v4.6c0,6.48,5.26,11.74,11.74,11.74h9.89c6.48,0,11.74-5.26,11.74-11.74v-4.6c0-1.32,1.07-2.4,2.4-2.4h8.77c7.18,0,13-5.82,13-13V13c0-7.18-5.82-13-13-13h0Z"
                        />
                      </svg>
                    </div>


                    <div className={`flex items-center justify-between w-full z-10 ${visuals.textColor}`}>
                      <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                        <span className={`text-[8px] sm:text-[9px] font-sans font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${visuals.numberClass}`}>
                          #{idx + 1}
                        </span>
                        <strong className="font-extrabold text-[9px] sm:text-xs truncate min-w-0 flex-1">
                          {matchedVehicle ? getVehicleDisplayName(matchedVehicle) : "Mobil"}
                        </strong>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 h-5 sm:h-6">
                        <span className={`inline-flex items-center justify-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 rounded border text-[7px] sm:text-[9px] font-bold ${visuals.badgeClass} whitespace-nowrap h-full`}>
                          <span>{getDirectionSymbol(step.direction)}</span>
                          <span className="hidden lg:inline">{getDirectionText(step.direction)}</span>
                        </span>
                        <button
                          type="button"
                          disabled={isSimulating}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isSimulating) {
                              audio.playClick();
                              const updated = steps.filter((_, i) => i !== idx);
                              onUpdateSteps(updated);
                            }
                          }}
                          className={`aspect-square rounded border ${visuals.badgeClass} flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none active:scale-95 hover:brightness-110 h-full p-0`}
                          title="Hapus langkah"
                        >
                          <Trash2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isDragged && isOutside && (
                      <span className="text-[7px] sm:text-[9px] font-sans font-bold bg-red-150 text-red-650 px-1.5 py-0.5 rounded animate-pulse z-10 whitespace-nowrap flex-shrink-0">
                        Lepas untuk Hapus
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
