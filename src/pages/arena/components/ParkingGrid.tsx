import React, { useState, useRef, useEffect } from "react";
import { Vehicle } from "../../../types";
import { ArrowLeft, HelpCircle } from "lucide-react";
import audio from "../../../lib/audio";
import { MuteButton } from "../../../components/MuteButton";
import { getVehicleImagePath, getVehicleDisplayNamesMap, getVehicleBaseName, getVehicleNumbersMap } from "../../../lib/vehicleHelpers";

// Computes which cells are occupied around the board
export function getOccupiedCells(
  vehicles: Vehicle[],
  excludeId?: string,
  gridRows = 11,
  gridCols = 12,
  walls: { row: number; col: number }[] = []
) {
  const grid = Array(gridRows)
    .fill(null)
    .map(() => Array(gridCols).fill(null) as (string | null)[]);

  // Mark walls first
  walls.forEach((w) => {
    if (w.row >= 0 && w.row < gridRows && w.col >= 0 && w.col < gridCols) {
      grid[w.row][w.col] = "WALL";
    }
  });

  vehicles.forEach((v) => {
    if (v.id === excludeId) return;
    for (let i = 0; i < v.length; i++) {
      if (v.direction === "horizontal") {
        const c = v.col + i;
        if (v.row >= 0 && v.row < gridRows && c >= 0 && c < gridCols) {
          grid[v.row][c] = v.id;
        }
      } else {
        const r = v.row + i;
        if (r >= 0 && r < gridRows && v.col >= 0 && v.col < gridCols) {
          grid[r][v.col] = v.id;
        }
      }
    }
  });
  return grid;
}

// Check if a specific single-cell move is valid
export function checkCollision(
  vehicle: Vehicle,
  dir: "left" | "right" | "up" | "down",
  steps: number,
  vehicles: Vehicle[],
  gridRows = 11,
  gridCols = 12,
  walls: { row: number; col: number }[] = []
): { valid: boolean; reason?: string; maxAllowedSteps?: number } {
  const occupied = getOccupiedCells(vehicles, vehicle.id, gridRows, gridCols, walls);
  const nameMap = getVehicleDisplayNamesMap(vehicles);
  const getBlockerName = (b?: Vehicle) => b ? (nameMap[b.id] || getVehicleBaseName(b)) : "kendaraan lain";
  const isPlayerVehicle = vehicle.isPlayer || vehicle.id === "R";

  if (vehicle.direction === "horizontal") {
    if (dir === "up" || dir === "down") {
      return { valid: false, reason: "Arah gerakan tidak sesuai dengan orientasi mobil mendatar.", maxAllowedSteps: 0 };
    }

    let allowedSteps = 0;
    const stepSign = dir === "right" ? 1 : -1;

    for (let s = 1; s <= steps; s++) {
      const targetCol = vehicle.col + stepSign * s;

      // Boundary check
      if (!isPlayerVehicle && (targetCol < 0 || targetCol + vehicle.length > gridCols)) {
        return { valid: false, reason: "Gerakan keluar dari area parkir (batas grid).", maxAllowedSteps: allowedSteps };
      }

      // Check cell occupied
      if (dir === "right") {
        const c = targetCol + vehicle.length - 1;
        if (c < gridCols) {
          const blockerId = occupied[vehicle.row][c];
          if (blockerId !== null) {
            if (blockerId === "WALL") {
              return { valid: false, reason: "Menabrak dinding pembatas!", maxAllowedSteps: allowedSteps };
            }
            const blocker = vehicles.find((v) => v.id === blockerId);
            return { valid: false, reason: `Menabrak ${getBlockerName(blocker)}!`, maxAllowedSteps: allowedSteps };
          }
        }
      } else {
        const c = targetCol;
        if (c >= 0) {
          const blockerId = occupied[vehicle.row][c];
          if (blockerId !== null) {
            if (blockerId === "WALL") {
              return { valid: false, reason: "Menabrak dinding pembatas!", maxAllowedSteps: allowedSteps };
            }
            const blocker = vehicles.find((v) => v.id === blockerId);
            return { valid: false, reason: `Menabrak ${getBlockerName(blocker)}!`, maxAllowedSteps: allowedSteps };
          }
        }
      }

      allowedSteps = s;
    }
  } else {
    // vertical
    if (dir === "left" || dir === "right") {
      return { valid: false, reason: "Arah gerakan tidak sesuai dengan orientasi mobil tegak.", maxAllowedSteps: 0 };
    }

    let allowedSteps = 0;
    const stepSign = dir === "down" ? 1 : -1;

    for (let s = 1; s <= steps; s++) {
      const targetRow = vehicle.row + stepSign * s;

      // Boundary check
      if (!isPlayerVehicle && (targetRow < 0 || targetRow + vehicle.length > gridRows)) {
        return { valid: false, reason: "Gerakan keluar dari area parkir (batas grid).", maxAllowedSteps: allowedSteps };
      }

      // Check cell occupied
      if (dir === "down") {
        const r = targetRow + vehicle.length - 1;
        if (r < gridRows) {
          const blockerId = occupied[r][vehicle.col];
          if (blockerId !== null) {
            if (blockerId === "WALL") {
              return { valid: false, reason: "Menabrak dinding pembatas!", maxAllowedSteps: allowedSteps };
            }
            const blocker = vehicles.find((v) => v.id === blockerId);
            return { valid: false, reason: `Menabrak ${getBlockerName(blocker)}!`, maxAllowedSteps: allowedSteps };
          }
        }
      } else {
        const r = targetRow;
        if (r >= 0) {
          const blockerId = occupied[r][vehicle.col];
          if (blockerId !== null) {
            if (blockerId === "WALL") {
              return { valid: false, reason: "Menabrak dinding pembatas!", maxAllowedSteps: allowedSteps };
            }
            const blocker = vehicles.find((v) => v.id === blockerId);
            return { valid: false, reason: `Menabrak ${getBlockerName(blocker)}!`, maxAllowedSteps: allowedSteps };
          }
        }
      }

      allowedSteps = s;
    }
  }

  return { valid: true, maxAllowedSteps: steps };
}

export function isLevelSolved(
  vehicles: Vehicle[],
  gridRows = 11,
  gridCols = 12,
  defaultExitRow = 4,
  defaultExitCol = 4
): boolean {
  const playerCars = vehicles.filter((v) => v.isPlayer || v.id === "R");
  if (playerCars.length === 0) return false;

  return playerCars.every((v) => {
    if (v.direction === "vertical") {
      const col = v.exitCol !== undefined ? v.exitCol : defaultExitCol;
      const isAtExitCol = v.col === col;
      const isAtTopOrBottom = v.row <= 0 || v.row >= gridRows - v.length;
      return isAtExitCol && isAtTopOrBottom;
    } else {
      const row = v.exitRow !== undefined ? v.exitRow : defaultExitRow;
      const isAtExitRow = v.row === row;
      const isAtLeftOrRight = v.col <= 0 || v.col >= gridCols - v.length;
      return isAtExitRow && isAtLeftOrRight;
    }
  });
}

interface ParkingGridProps {
  vehicles: Vehicle[];
  onChangeVehicles: (updated: Vehicle[]) => void;
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string | null) => void;
  disabled?: boolean;
  onMoveRecorded?: (vehicleId: string, dir: "left" | "right" | "up" | "down", dist: number) => void;
  gridRows?: number;
  gridCols?: number;
  exitRow?: number;
  levelId?: number;
  activeWalls?: { row: number; col: number }[];
  onChangeWalls?: (walls: { row: number; col: number }[]) => void;
  isDevMode?: boolean;
  onToggleDevMode?: () => void;
  onGoToDashboard?: () => void;
}

export const ParkingGrid: React.FC<ParkingGridProps> = ({
  vehicles,
  onChangeVehicles,
  selectedVehicleId,
  onSelectVehicle,
  disabled = false,
  onMoveRecorded,
  gridRows = 11,
  gridCols = 12,
  exitRow = 4,
  levelId,
  activeWalls = [],
  onChangeWalls,
  isDevMode = false,
  onToggleDevMode,
  onGoToDashboard,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [dragState, setDragState] = useState<any | null>(null);

  // Tooltip state (supports both desktop hover & mobile tap)
  const [tooltipInfo, setTooltipInfo] = useState<{ id: string; name: string; x: number; y: number } | null>(null);
  const hoveredVehicleRef = useRef<string | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper: compute a vehicle's center position (px) relative to the canvas container
  const getVehicleCenterOnCanvas = (v: Vehicle) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const padLeft = 28;
    const padTop = 28;
    const cellSize = Math.min((rect.width - padLeft) / gridCols, (rect.height - padTop) / gridRows);
    const xOffset = (rect.width - padLeft - gridCols * cellSize) / 2 + padLeft;
    const yOffset = (rect.height - padTop - gridRows * cellSize) / 2 + padTop;
    const vw = (v.direction === "horizontal" ? v.length : 1) * cellSize;
    const vh = (v.direction === "vertical" ? v.length : 1) * cellSize;
    return {
      x: xOffset + v.col * cellSize + vw / 2,
      y: yOffset + v.row * cellSize,  // top edge of vehicle
    };
  };

  // Show tooltip for a vehicle (used by both hover and tap)
  const showTooltip = (v: Vehicle, x: number, y: number, autoHide = false) => {
    const nameMap = getVehicleDisplayNamesMap(vehiclesRef.current);
    const displayName = nameMap[v.id] || getVehicleBaseName(v);
    // Clamp position within canvas bounds
    const canvas = canvasRef.current;
    const cw = canvas ? canvas.getBoundingClientRect().width : 999;
    const ch = canvas ? canvas.getBoundingClientRect().height : 999;
    const clampedX = Math.max(50, Math.min(cw - 50, x));
    const clampedY = Math.max(30, Math.min(ch - 10, y));
    setTooltipInfo({ id: v.id, name: displayName, x: clampedX, y: clampedY });

    // Auto-hide for touch interactions
    if (autoHide) {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = setTimeout(() => {
        setTooltipInfo(null);
        hoveredVehicleRef.current = null;
        tooltipTimerRef.current = null;
      }, 2000);
    }
  };

  const hideTooltip = () => {
    hoveredVehicleRef.current = null;
    setTooltipInfo(null);
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    };
  }, []);

  // Image caches to avoid reloading on each frame
  const imageCacheRef = useRef<{ [key: string]: HTMLImageElement }>({});
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  // Keep tracking values in refs for zero-lag drag/pan
  const vehiclesRef = useRef<Vehicle[]>(vehicles);
  const selectedVehicleIdRef = useRef<string | null>(selectedVehicleId);
  const activeWallsRef = useRef<{ row: number; col: number }[]>(activeWalls);
  const isDevModeRef = useRef<boolean>(isDevMode);

  vehiclesRef.current = vehicles;
  selectedVehicleIdRef.current = selectedVehicleId;
  activeWallsRef.current = activeWalls;
  isDevModeRef.current = isDevMode;

  // Keep track of visual positions for smooth sliding animation
  const visualPositionsRef = useRef<{ [id: string]: { col: number; row: number } }>({});
  const animationFrameIdRef = useRef<number | null>(null);

  // Smooth sliding animation loop using requestAnimationFrame
  const animatePositions = () => {
    let needsMoreFrames = false;
    const lerpSpeed = 0.15; // Speed of slide (higher = faster)
    const threshold = 0.01;

    vehiclesRef.current.forEach((v) => {
      const current = visualPositionsRef.current[v.id];
      if (!current) {
        visualPositionsRef.current[v.id] = { col: v.col, row: v.row };
        return;
      }

      // If being dragged, keep in sync with visual pos of drag
      if (dragInfoRef.current && dragInfoRef.current.vehicleId === v.id) {
        current.col = v.direction === "horizontal" ? dragInfoRef.current.visualPos : v.col;
        current.row = v.direction === "vertical" ? dragInfoRef.current.visualPos : v.row;
        return;
      }

      // Smoothly slide col
      if (Math.abs(current.col - v.col) > threshold) {
        current.col += (v.col - current.col) * lerpSpeed;
        needsMoreFrames = true;
      } else {
        current.col = v.col;
      }

      // Smoothly slide row
      if (Math.abs(current.row - v.row) > threshold) {
        current.row += (v.row - current.row) * lerpSpeed;
        needsMoreFrames = true;
      } else {
        current.row = v.row;
      }
    });

    requestRedraw();

    if (needsMoreFrames) {
      animationFrameIdRef.current = requestAnimationFrame(animatePositions);
    } else {
      animationFrameIdRef.current = null;
    }
  };

  // Start animation loop when vehicles prop changes
  useEffect(() => {
    // Initialize any missing vehicles
    vehicles.forEach((v) => {
      if (!visualPositionsRef.current[v.id]) {
        visualPositionsRef.current[v.id] = { col: v.col, row: v.row };
      }
    });

    // Check if any position differs
    const hasDifference = vehicles.some((v) => {
      const current = visualPositionsRef.current[v.id];
      return current && (Math.abs(current.col - v.col) > 0.01 || Math.abs(current.row - v.row) > 0.01);
    });

    if (hasDifference && !animationFrameIdRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(animatePositions);
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [vehicles]);

  // Drag visual offsets and boundaries ref
  const dragInfoRef = useRef<{
    vehicleId: string;
    startCol: number;
    startRow: number;
    startX: number;
    startY: number;
    minVal: number;
    maxVal: number;
    visualPos: number;
    direction: "horizontal" | "vertical";
  } | null>(null);

  // Lazy loads background grid image based on levelId
  const prevLevelIdRef = useRef<number | undefined>(levelId);
  const getBgImage = () => {
    if (prevLevelIdRef.current !== levelId) {
      bgImageRef.current = null;
      prevLevelIdRef.current = levelId;
    }
    if (bgImageRef.current) {
      return bgImageRef.current;
    }
    const img = new Image();
    const bgFile = (levelId === 4 || levelId === 5) ? "maps-level-2.webp" : "maps-level-1.svg";
    img.src = `${import.meta.env.BASE_URL}img/${bgFile}`;
    img.onload = () => {
      requestRedraw();
    };
    bgImageRef.current = img;
    return img;
  };

  // Lazy loads a vehicle image
  const getVehicleImage = (v: Vehicle) => {
    const src = getVehicleImagePath(v, vehiclesRef.current);
    if (imageCacheRef.current[src]) {
      return imageCacheRef.current[src];
    }

    const img = new Image();
    img.src = src;
    img.onload = () => {
      requestRedraw();
    };
    imageCacheRef.current[src] = img;
    return img;
  };

  // Canvas drawing loop
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawRoundRect = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      if (c.roundRect) {
        c.roundRect(x, y, w, h, r);
      } else {
        c.beginPath();
        c.moveTo(x + r, y);
        c.lineTo(x + w - r, y);
        c.quadraticCurveTo(x + w, y, x + w, y + r);
        c.lineTo(x + w, y + h - r);
        c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        c.lineTo(x + r, y + h);
        c.quadraticCurveTo(x, y + h, x, y + h - r);
        c.lineTo(x, y + r);
        c.quadraticCurveTo(x, y, x + r, y);
        c.closePath();
      }
    };

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Adapt resolution for Retina screens (high DPI)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);


    // Calculate grid dimensions centered inside the fluid canvas with padding for coordinates
    const padLeft = 28;
    const padTop = 28;
    const cellSize = Math.min((rect.width - padLeft) / gridCols, (rect.height - padTop) / gridRows);
    const xOffset = (rect.width - padLeft - gridCols * cellSize) / 2 + padLeft;
    const yOffset = (rect.height - padTop - gridRows * cellSize) / 2 + padTop;

    const playerCar = vehiclesRef.current.find((v) => v.isPlayer || v.id === "R");
    const isPlayerVertical = playerCar?.direction === "vertical";
    const exitCol = playerCar ? playerCar.col : 4;

    ctx.save();
    // Translate rendering origin to the centered parking grid
    ctx.translate(xOffset, yOffset);

    // Draw grid coordinates (column numbers on top, row numbers on left)
    ctx.save();
    ctx.fillStyle = "rgba(71, 85, 105, 0.8)";
    ctx.font = "600 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let c = 0; c < gridCols; c++) {
      ctx.fillText(String(c), c * cellSize + cellSize / 2, -14);
    }
    for (let r = 0; r < gridRows; r++) {
      ctx.fillText(String(r), -14, r * cellSize + cellSize / 2);
    }
    ctx.restore();

    // 1. Draw Grid Slots and Borders
    const bgImg = getBgImage();
    if (bgImg.complete) {
      ctx.drawImage(bgImg, 0, 0, gridCols * cellSize, gridRows * cellSize);
    }

    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const isExitLine = isPlayerVertical
          ? r === gridRows - 1 && c === exitCol
          : r === exitRow && c === gridCols - 1;

        if (!bgImg.complete) {
          ctx.fillStyle = isExitLine
            ? "#E8F5E9" // Emerald light tint for exit row slot
            : (r + c) % 2 === 0
            ? "#F8FAFC" // Slate 50
            : "#F1F5F9"; // Slate 100

          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }

    // 2. Draw Exit Gate Indicator (Zebra Cross + Taxi Yellow border bar + "KELUAR" with black outline)
    const drawExitGateCell = (
      cellX: number,
      cellY: number,
      size: number,
      position: "top" | "bottom" | "right"
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(cellX, cellY, size, size);
      ctx.clip();

      // Base dark asphalt color for zebra cross
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(cellX, cellY, size, size);

      // Alternating white zebra cross stripes
      const stripeCount = 8;
      const stripeStep = size / stripeCount;
      ctx.fillStyle = "#FFFFFF";
      for (let i = 0; i < stripeCount; i += 2) {
        if (position === "top" || position === "bottom") {
          ctx.fillRect(cellX + 2, cellY + i * stripeStep, size - 4, stripeStep);
        } else {
          ctx.fillRect(cellX + i * stripeStep, cellY + 2, stripeStep, size - 4);
        }
      }

      // Subtle border around the zebra cross cell
      ctx.strokeStyle = "rgba(15, 23, 42, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cellX + 0.75, cellY + 0.75, size - 1.5, size - 1.5);

      // Taxi Yellow border bar on the outer edge (top border for top exit, bottom border for bottom exit)
      const borderThickness = 5;
      ctx.fillStyle = "#FFCF01";
      if (position === "top") {
        ctx.fillRect(cellX, cellY, size, borderThickness);
      } else if (position === "bottom") {
        ctx.fillRect(cellX, cellY + size - borderThickness, size, borderThickness);
      } else {
        ctx.fillRect(cellX + size - borderThickness, cellY, borderThickness, size);
      }

      // Draw "KELUAR" text centered inside the cell with comfortable padding (always upright, never flipped)
      const centerX = cellX + size / 2;
      const centerY = cellY + size / 2;
      ctx.translate(centerX, centerY);

      const fontSize = Math.max(6, Math.floor(size * 0.16));
      ctx.font = `900 ${fontSize}px 'Plus Jakarta Sans', 'Inter', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;

      // Measure text to guarantee horizontal padding (max 72% of cell width) and exact vertical center
      const metrics = ctx.measureText("KELUAR");
      const maxTextWidth = size * 0.72;
      if (metrics.width > maxTextWidth && metrics.width > 0) {
        const scaleFactor = maxTextWidth / metrics.width;
        ctx.scale(scaleFactor, scaleFactor);
      }
      const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.72;
      const descent = metrics.actualBoundingBoxDescent || fontSize * 0.18;
      const textY = (ascent - descent) / 2;

      // Black outline
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = Math.max(2.5, size * 0.065);
      ctx.strokeText("KELUAR", 0, textY);

      // White fill with black outline over the zebra cross
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("KELUAR", 0, textY);

      ctx.restore();
    };

    const playerCars = vehiclesRef.current.filter((v) => v.isPlayer || v.id === "R");
    playerCars.forEach((v) => {
      ctx.save();
      if (v.direction === "vertical") {
        const col = v.exitCol !== undefined ? v.exitCol : v.col;
        const isUpperArea = (levelId === 4 || levelId === 5) ? v.row < 5 : false;

        if (isUpperArea) {
          // Top Exit Gate (row 0, col) — normal upright "KELUAR"
          drawExitGateCell(col * cellSize, 0, cellSize, "top");
        } else {
          // Bottom Exit Gate (row gridRows - 1, col) — upside-down / mirrored "KELUAR"
          drawExitGateCell(col * cellSize, (gridRows - 1) * cellSize, cellSize, "bottom");
        }
      } else {
        const row = v.exitRow !== undefined ? v.exitRow : exitRow;
        drawExitGateCell((gridCols - 1) * cellSize, row * cellSize, cellSize, "right");
      }
      ctx.restore();
    });

    // Overlay thin grid outlines (always visible, only lines, no text)
    ctx.strokeStyle = "rgba(15, 23, 42, 0.08)";
    ctx.lineWidth = 1;
    for (let r = 0; r <= gridRows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellSize);
      ctx.lineTo(gridCols * cellSize, r * cellSize);
      ctx.stroke();
    }
    for (let c = 0; c <= gridCols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cellSize, 0);
      ctx.lineTo(c * cellSize, gridRows * cellSize);
      ctx.stroke();
    }

    // Grid coordinates text (only in dev mode, drawn above grid & zebra cross)
    if (isDevModeRef.current) {
      ctx.save();
      ctx.font = "bold 8px 'JetBrains Mono', monospace";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 2.5;
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const coordText = `${r},${c}`;
          ctx.strokeText(coordText, c * cellSize + 4, r * cellSize + 11);
          ctx.fillText(coordText, c * cellSize + 4, r * cellSize + 11);
        }
      }
      ctx.restore();
    }

    // 3. Draw Walls
    activeWallsRef.current.forEach((w) => {
      const wx = w.col * cellSize;
      const wy = w.row * cellSize;
      
      ctx.save();
      if (isDevModeRef.current) {
        // Dev mode: draw a visible gray hazard block with yellow warnings
        ctx.fillStyle = "#334155"; // Slate 700
        ctx.beginPath();
        drawRoundRect(ctx, wx + 2, wy + 2, cellSize - 4, cellSize - 4, 6);
        ctx.fill();
        
        // Draw stripes
        ctx.strokeStyle = "#F59E0B"; // Amber 500
        ctx.lineWidth = 3.5;
        ctx.lineCap = "round";
        ctx.save();
        ctx.beginPath();
        drawRoundRect(ctx, wx + 2, wy + 2, cellSize - 4, cellSize - 4, 6);
        ctx.clip();
        
        for (let offset = -cellSize; offset < cellSize * 2; offset += 14) {
          ctx.beginPath();
          ctx.moveTo(wx + offset, wy);
          ctx.lineTo(wx + offset + cellSize, wy + cellSize);
          ctx.stroke();
        }
        ctx.restore();
        
        // Border
        ctx.strokeStyle = "#1E293B";
        ctx.lineWidth = 2;
        ctx.beginPath();
        drawRoundRect(ctx, wx + 2, wy + 2, cellSize - 4, cellSize - 4, 6);
        ctx.stroke();
        
        // Text
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 8px 'NotoSans', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("WALL", wx + cellSize / 2, wy + cellSize / 2);
      } else {
        // Production mode: completely transparent
      }
      ctx.restore();
    });

    // 4. Draw Vehicles (Pass 1: Vehicle bodies & selection outlines)
    vehiclesRef.current.forEach((v) => {
      const isSelected = selectedVehicleIdRef.current === v.id;

      // Draw vehicle based on visual state (if currently dragged, use visual pos from ref, else use animated visualPos)
      const isThisVehicleDragged = dragInfoRef.current?.vehicleId === v.id;
      const visualPos = visualPositionsRef.current[v.id] || { col: v.col, row: v.row };
      const drawCol = (isThisVehicleDragged && dragInfoRef.current?.direction === "horizontal")
        ? dragInfoRef.current.visualPos
        : visualPos.col;
      const drawRow = (isThisVehicleDragged && dragInfoRef.current?.direction === "vertical")
        ? dragInfoRef.current.visualPos
        : visualPos.row;

      const vx = drawCol * cellSize;
      const vy = drawRow * cellSize;
      const vw = (v.direction === "horizontal" ? v.length : 1) * cellSize;
      const vh = (v.direction === "vertical" ? v.length : 1) * cellSize;

      ctx.save();

      // Selected ring highlights
      if (isSelected) {
        ctx.strokeStyle = "#3B82F6";
        ctx.lineWidth = 3.5;
      } else {
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 2;
      }

      // Draw as WebP Image
      const img = getVehicleImage(v);
      if (img.complete) {
        ctx.save();
        if (v.direction === "horizontal") {
          // Horizontal vehicle: needs to be rotated 90 degrees clockwise since asset is vertical (facing UP)
          const cx = vx + vw / 2;
          const cy = vy + vh / 2;
          ctx.translate(cx, cy);
          ctx.rotate(Math.PI / 2);
          
          // Width in rotated space is grid vertical (cellSize)
          // Height in rotated space is grid horizontal (v.length * cellSize)
          const drawW = cellSize;
          const drawH = v.length * cellSize;
          ctx.drawImage(img, -drawW / 2 + 3, -drawH / 2 + 3, drawW - 6, drawH - 6);
        } else {
          // Vertical vehicle: draw directly or rotate 180 deg if above row 5 wall (so it faces UP towards top exit)
          const cx = vx + vw / 2;
          const cy = vy + vh / 2;
          ctx.translate(cx, cy);
          
          if (drawRow < 5) {
            // Vehicle is above row 5 (facing UP towards top exit)
            ctx.rotate(Math.PI);
          }
          
          ctx.drawImage(img, -vw / 2 + 3, -vh / 2 + 3, vw - 6, vh - 6);
        }
        ctx.restore();
      } else {
        // Fallback: draw rounded rect
        let bodyColor = "#3B82F6";
        let borderColor = "#1D4ED8";
        if (v.id === "R" || v.isPlayer) {
          bodyColor = "#EF4444";
          borderColor = "#B91C1C";
        } else if (v.length >= 3) {
          bodyColor = "#F59E0B";
          borderColor = "#B45309";
        }
        ctx.fillStyle = bodyColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        drawRoundRect(ctx, vx + 4, vy + 4, vw - 8, vh - 8, 10);
        ctx.fill();
        ctx.stroke();
      }

      // Draw selection border highlight
      if (isSelected) {
        ctx.strokeStyle = "#3B82F6";
        ctx.lineWidth = 3;
        ctx.beginPath();
        drawRoundRect(ctx, vx + 2, vy + 2, vw - 4, vh - 4, 11);
        ctx.stroke();
      }

      ctx.restore();
    });

    // 5. Draw Colorblind-Friendly Vehicle Number Card Badges (Pass 2: drawn strictly on top of all vehicles)
    const numbersMap = getVehicleNumbersMap(vehiclesRef.current);
    vehiclesRef.current.forEach((v) => {
      const isThisVehicleDragged = dragInfoRef.current?.vehicleId === v.id;
      const visualPos = visualPositionsRef.current[v.id] || { col: v.col, row: v.row };
      const drawCol = (isThisVehicleDragged && dragInfoRef.current?.direction === "horizontal")
        ? dragInfoRef.current.visualPos
        : visualPos.col;
      const drawRow = (isThisVehicleDragged && dragInfoRef.current?.direction === "vertical")
        ? dragInfoRef.current.visualPos
        : visualPos.row;

      const vx = drawCol * cellSize;
      const vy = drawRow * cellSize;
      const vw = (v.direction === "horizontal" ? v.length : 1) * cellSize;
      const vh = (v.direction === "vertical" ? v.length : 1) * cellSize;

      const isTaxi = v.isPlayer || v.id === "R" || v.id === "T" || v.id === "S" || v.id === "U" || v.id === "V" || (v.label && v.label.toLowerCase().includes("taxi"));
      const vehicleNum = numbersMap[v.id];

      if (vehicleNum !== undefined) {
        ctx.save();
        // Shift towards roof: upwards for top-area vertical vehicles (drawRow < 5), downwards for bottom-area vertical vehicles, leftwards for horizontal vehicles
        const xShift = v.direction === "horizontal" ? -cellSize * 0.24 : 0;
        const yShift =
          v.direction === "vertical"
            ? drawRow < 5
              ? -cellSize * 0.24
              : cellSize * 0.24
            : 0;
        const cx = vx + vw / 2 + xShift;
        const cy = vy + vh / 2 + yShift;

        // Card dimensions (responsive to grid cell size and mobile viewports)
        const numStr = String(vehicleNum);
        const isDoubleDigit = numStr.length > 1;
        const isMobileGrid = cellSize < 42;
        const baseH = isMobileGrid
          ? Math.max(11, Math.min(15, Math.round(cellSize * 0.34)))
          : Math.max(14, Math.min(20, Math.round(cellSize * 0.32)));
        const cardH = baseH;
        const cardW = isDoubleDigit ? Math.round(baseH * 1.35) : Math.round(baseH * 1.05);
        const cardR = Math.max(2, Math.round(cardH * 0.2));

        const cardX = cx - cardW / 2;
        const cardY = cy - cardH / 2;

        // Subtle drop shadow scaled to card size
        ctx.shadowColor = "rgba(0, 0, 0, 0.32)";
        ctx.shadowBlur = isMobileGrid ? 2 : 3;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = isMobileGrid ? 0.8 : 1.2;

        // Card background: small white card
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardR);
        ctx.fill();

        // Reset shadow for crisp border and text rendering
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Card border: crisp black outline, scaled down for mobile responsiveness
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = isTaxi
          ? (isMobileGrid ? 1.2 : Math.max(1.4, Math.min(2.0, cellSize * 0.035)))
          : (isMobileGrid ? 0.85 : Math.max(1.0, Math.min(1.4, cellSize * 0.025)));
        ctx.beginPath();
        drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardR);
        ctx.stroke();

        // Text: black bold number
        ctx.fillStyle = "#000000";
        const fontSize = Math.max(8, Math.round(cardH * 0.72));
        ctx.font = `900 ${fontSize}px 'NotoSans', -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Optical vertical center adjustment
        ctx.fillText(numStr, cx, cy + (fontSize >= 11 ? 0.5 : 0.3));

        ctx.restore();
      }

      // Label text with shadow (vehicle labels are only shown in Dev Mode)
      if (isDevModeRef.current) {
        ctx.save();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 9px 'NotoSans', sans-serif";
        ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
        ctx.shadowBlur = 4;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          v.id === "R" ? "TAXI" : getVehicleBaseName(v, vehiclesRef.current).toUpperCase(),
          vx + vw / 2,
          vy + vh / 2 + 14
        );
        ctx.restore();
      }
    });

    ctx.restore();
    ctx.restore();
  };

  // High performance throttle for animation frames
  const renderScheduledRef = useRef(false);
  const requestRedraw = () => {
    if (renderScheduledRef.current) return;
    renderScheduledRef.current = true;
    requestAnimationFrame(() => {
      drawCanvas();
      renderScheduledRef.current = false;
    });
  };

  // Redraw when states or props change
  useEffect(() => {
    requestRedraw();
  }, [vehicles, selectedVehicleId, gridRows, gridCols, exitRow, activeWalls, isDevMode]);

  // Redraw when the window resizes to adapt the fluid canvas resolution
  useEffect(() => {
    const handleResize = () => {
      requestRedraw();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle hover tooltip on desktop (mousemove) — touch devices use tap via handlePointerDown
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Skip if a touch/pen event (handled by tap logic instead)
      const rect = canvas.getBoundingClientRect();
      const padLeft = 28;
      const padTop = 28;
      const cellSize = Math.min((rect.width - padLeft) / gridCols, (rect.height - padTop) / gridRows);
      const xOffset = (rect.width - padLeft - gridCols * cellSize) / 2 + padLeft;
      const yOffset = (rect.height - padTop - gridRows * cellSize) / 2 + padTop;

      const xActive = e.clientX - rect.left - xOffset;
      const yActive = e.clientY - rect.top - yOffset;

      let foundVehicle: Vehicle | null = null;
      for (const v of vehiclesRef.current) {
        const vx = v.col * cellSize;
        const vy = v.row * cellSize;
        const vw = (v.direction === "horizontal" ? v.length : 1) * cellSize;
        const vh = (v.direction === "vertical" ? v.length : 1) * cellSize;

        if (xActive >= vx && xActive <= vx + vw && yActive >= vy && yActive <= vy + vh) {
          foundVehicle = v;
          break;
        }
      }

      if (foundVehicle) {
        if (hoveredVehicleRef.current !== foundVehicle.id) {
          hoveredVehicleRef.current = foundVehicle.id;
          showTooltip(foundVehicle, e.clientX - rect.left, e.clientY - rect.top);
        } else {
          setTooltipInfo((prev) =>
            prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : prev
          );
        }
        canvas.style.cursor = disabled ? "default" : "grab";
      } else {
        if (hoveredVehicleRef.current !== null) {
          hideTooltip();
        }
        canvas.style.cursor = "default";
      }
    };

    const handleMouseLeave = () => {
      hideTooltip();
      canvas.style.cursor = "default";
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [gridCols, gridRows, disabled]);

  // Global pointer move & up event listeners on window
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!dragInfoRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const padLeft = 28;
      const padTop = 28;
      const cellSize = Math.min((rect.width - padLeft) / gridCols, (rect.height - padTop) / gridRows);

      if (dragInfoRef.current) {
        const diffX = e.clientX - dragInfoRef.current.startX;
        const diffY = e.clientY - dragInfoRef.current.startY;

        if (dragInfoRef.current.direction === "horizontal") {
          const diffCol = diffX / cellSize;
          const targetCol = Math.max(
            dragInfoRef.current.minVal,
            Math.min(dragInfoRef.current.maxVal, dragInfoRef.current.startCol + diffCol)
          );
          dragInfoRef.current.visualPos = targetCol;
        } else {
          const diffRow = diffY / cellSize;
          const targetRow = Math.max(
            dragInfoRef.current.minVal,
            Math.min(dragInfoRef.current.maxVal, dragInfoRef.current.startRow + diffRow)
          );
          dragInfoRef.current.visualPos = targetRow;
        }
        
        requestRedraw();
        audio.playSlide();
      }
    };

    const handleGlobalPointerUp = () => {
      if (dragInfoRef.current) {
        const finalVal = Math.round(dragInfoRef.current.visualPos);
        const dragId = dragInfoRef.current.vehicleId;
        const startC = dragInfoRef.current.startCol;
        const startR = dragInfoRef.current.startRow;
        const dragDir = dragInfoRef.current.direction;

        const updated = vehiclesRef.current.map((v) => {
          if (v.id === dragId) {
            if (dragDir === "horizontal") {
              return { ...v, col: finalVal };
            } else {
              return { ...v, row: finalVal };
            }
          }
          return v;
        });

        dragInfoRef.current = null;
        setDragState(null);
        onChangeVehicles(updated);

        const stepsMoved = dragDir === "horizontal"
          ? Math.abs(finalVal - startC)
          : Math.abs(finalVal - startR);

        if (stepsMoved > 0 && onMoveRecorded) {
          const dir = dragDir === "horizontal"
            ? (finalVal > startC ? "right" : "left")
            : (finalVal > startR ? "down" : "up");
          onMoveRecorded(dragId, dir, stepsMoved);
        }
      }
    };

    window.addEventListener("pointermove", handleGlobalPointerMove, { passive: true });
    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("pointercancel", handleGlobalPointerUp);

    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("pointercancel", handleGlobalPointerUp);
    };
  }, [gridCols, gridRows, onChangeVehicles, onMoveRecorded]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const xOnCanvas = (e.clientX - rect.left) * (canvas.width / (rect.width * window.devicePixelRatio));
    const yOnCanvas = (e.clientY - rect.top) * (canvas.height / (rect.height * window.devicePixelRatio));
    const xInGridPixels = xOnCanvas;
    const yInGridPixels = yOnCanvas;

    // Calculate grid dimensions centered inside the fluid canvas with padding for coordinates
    const padLeft = 28;
    const padTop = 28;
    const cellSize = Math.min((rect.width - padLeft) / gridCols, (rect.height - padTop) / gridRows);
    const xOffset = (rect.width - padLeft - gridCols * cellSize) / 2 + padLeft;
    const yOffset = (rect.height - padTop - gridRows * cellSize) / 2 + padTop;

    const xActive = xInGridPixels - xOffset;
    const yActive = yInGridPixels - yOffset;

    let clickedVehicle: Vehicle | null = null;
    for (const v of vehiclesRef.current) {
      const vx = v.col * cellSize;
      const vy = v.row * cellSize;
      const vw = (v.direction === "horizontal" ? v.length : 1) * cellSize;
      const vh = (v.direction === "vertical" ? v.length : 1) * cellSize;

      if (
        xActive >= vx &&
        xActive <= vx + vw &&
        yActive >= vy &&
        yActive <= vy + vh
      ) {
        clickedVehicle = v;
        break;
      }
    }

    // Toggle wall in Dev Mode if empty space clicked
    if (isDevModeRef.current && !clickedVehicle) {
      const clickCol = Math.floor(xActive / cellSize);
      const clickRow = Math.floor(yActive / cellSize);
      if (clickRow >= 0 && clickRow < gridRows && clickCol >= 0 && clickCol < gridCols) {
        // Toggle wall at coordinates
        const wallIndex = activeWalls.findIndex((w) => w.row === clickRow && w.col === clickCol);
        let updatedWalls;
        if (wallIndex > -1) {
          updatedWalls = activeWalls.filter((_, idx) => idx !== wallIndex);
        } else {
          updatedWalls = [...activeWalls, { row: clickRow, col: clickCol }];
        }
        if (onChangeWalls) {
          onChangeWalls(updatedWalls);
        }
        audio.playClick();
        return;
      }
    }

    audio.playClick();

    if (clickedVehicle) {
      onSelectVehicle(clickedVehicle.id);

      // Show tooltip on tap (for touch/mobile devices)
      // Use pointerType to detect touch; position tooltip at vehicle center
      if (e.pointerType === "touch" || e.pointerType === "pen") {
        const center = getVehicleCenterOnCanvas(clickedVehicle);
        showTooltip(clickedVehicle, center.x, center.y, true);
      }

      if (disabled) return;

      const occupied = getOccupiedCells(vehiclesRef.current, clickedVehicle.id, gridRows, gridCols, activeWalls);
      let minVal = 0;
      let maxVal = 0;

      if (clickedVehicle.direction === "horizontal") {
        minVal = 0;
        maxVal = gridCols - clickedVehicle.length;
        for (let c = clickedVehicle.col - 1; c >= 0; c--) {
          if (occupied[clickedVehicle.row][c] !== null) {
            minVal = c + 1;
            break;
          }
        }
        for (let c = clickedVehicle.col + clickedVehicle.length; c < gridCols; c++) {
          if (occupied[clickedVehicle.row][c] !== null) {
            maxVal = c - clickedVehicle.length;
            break;
          }
        }
      } else {
        minVal = 0;
        maxVal = gridRows - clickedVehicle.length;
        for (let r = clickedVehicle.row - 1; r >= 0; r--) {
          if (occupied[r][clickedVehicle.col] !== null) {
            minVal = r + 1;
            break;
          }
        }
        for (let r = clickedVehicle.row + clickedVehicle.length; r < gridRows; r++) {
          if (occupied[r][clickedVehicle.col] !== null) {
            maxVal = r - clickedVehicle.length;
            break;
          }
        }
      }

      const info = {
        vehicleId: clickedVehicle.id,
        startCol: clickedVehicle.col,
        startRow: clickedVehicle.row,
        startX: e.clientX,
        startY: e.clientY,
        minVal,
        maxVal,
        visualPos: clickedVehicle.direction === "horizontal" ? clickedVehicle.col : clickedVehicle.row,
        direction: clickedVehicle.direction,
      };

      dragInfoRef.current = info;
      setDragState(info);
    } else {
      onSelectVehicle(null);
      hideTooltip();
    }
  };



  return (
    <div className="flex flex-col items-center w-full h-full relative">
      {/* Board Viewport Wrapper (Fluid Ratio) */}
      <div
        className="w-full h-full overflow-hidden relative flex items-center justify-center rounded-2xl animate-[fadeIn_0.5s_ease-out]"
        style={{
          width: "100%",
          height: "100%",
          cursor: "default",
          border: "none",
          outline: "none",
          boxShadow: "none"
        }}
      >
        <canvas
          ref={canvasRef}
          id="parking-canvas"
          className="w-full h-full select-none touch-none block bg-transparent"
          style={{
            border: "none",
            outline: "none",
            boxShadow: "none"
          }}
          onPointerDown={handlePointerDown}
        />

        {/* Vehicle Tooltip (desktop hover + mobile tap) */}
        {tooltipInfo && !dragState && (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              left: `clamp(40px, ${tooltipInfo.x}px, calc(100% - 40px))`,
              top: tooltipInfo.y - 8,
              transform: "translate(-50%, -100%)",
              transition: "left 0.08s ease-out, top 0.08s ease-out",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                color: "#F8FAFC",
                fontSize: "11px",
                fontWeight: 700,
                padding: "5px 10px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
                whiteSpace: "nowrap",
                letterSpacing: "0.3px",
                backdropFilter: "blur(8px)",
                animation: "fadeIn 0.15s ease-out",
              }}
            >
              {tooltipInfo.name}
              <div
                style={{
                  position: "absolute",
                  bottom: "-4px",
                  left: "50%",
                  transform: "translateX(-50%) rotate(45deg)",
                  width: "8px",
                  height: "8px",
                  background: "#334155",
                  boxShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          </div>
        )}

        {/* Top Right Floating Controls: Back to Level Menu + Mute/Unmute Button */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-40 select-none flex items-center gap-2 sm:gap-3">
          {onGoToDashboard && (
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                onGoToDashboard();
              }}
              className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-2xl md:rounded-3xl shadow-md bg-white/95 hover:bg-white text-slate-700 hover:text-blue-600 border border-slate-200 backdrop-blur-md hover:shadow-lg hover:border-slate-300 flex items-center justify-center cursor-pointer transition-all duration-200 select-none active:scale-95"
              title="Kembali ke Menu Level"
              aria-label="Kembali ke Menu Level"
            >
              <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 stroke-[2.2]" />
            </button>
          )}
          <MuteButton variant="floating" size="logo" />
        </div>

        {/* Floating Dev Mode Controls (Vertical) - Hidden */}
        {/* {onToggleDevMode && (
          <div className="absolute top-16 right-2 sm:top-17 sm:right-3 md:top-22 md:right-4 lg:top-26 z-40 flex flex-col items-center gap-1.5 select-none">
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                onToggleDevMode();
              }}
              className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-[10px] md:text-xs font-black rounded-xl cursor-pointer border transition-all select-none ${
                isDevMode
                  ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-md scale-105"
                  : "bg-slate-800 hover:bg-slate-900 text-white border-slate-700 shadow-sm"
              }`}
              title="Toggle Dev Mode (Click grid to place/remove walls)"
            >
              DEV
            </button>
          </div>
        )} */}

        {/* HTML EXIT Label removed: exit indicators are drawn dynamically on canvas */}
      </div>

      {/* Instructions Overlay */}
      {!selectedVehicleId && !disabled && !isDevMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-1.5 pointer-events-none z-10">
          <HelpCircle size={13} className="text-amber-500 animate-bounce" />
          <span className="text-[10px] font-sans font-medium text-slate-600">
            Sentuh mobil untuk memindahkan
          </span>
        </div>
      )}

      {isDevMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-amber-500/90 text-slate-950 backdrop-blur px-3 py-1.5 rounded-full border border-amber-600 shadow-sm flex items-center gap-1.5 pointer-events-none z-10 text-[9px] font-bold">
          🛠️ Mode Dev Aktif: Klik slot kosong untuk atur koordinat dinding (wall)
        </div>
      )}
    </div>
  );
};
