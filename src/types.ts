export type Direction = "horizontal" | "vertical";

export interface Vehicle {
  id: string; // "R" (Player/Red Car), "A", "B", "C", etc.
  direction: Direction;
  row: number; // 0-5 (from top)
  col: number; // 0-5 (from left)
  length: number; // 2 or 3
  color: string; // Tailwind color class or hex
  label: string; // Friendly name like "Mobil Merah", "Truk Kuning"
  isPlayer?: boolean;
  exitRow?: number; // custom exit row for horizontal player cars
  exitCol?: number; // custom exit col for vertical player cars
}

export type MoveAction = {
  vehicleId: string;
  direction: "left" | "right" | "up" | "down";
  distance: number; // number of cells to move
};

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LevelDefinition {
  id: number;
  name: string;
  description: string;
  difficulty: "Mudah" | "Sedang" | "Menengah" | "Sulit" | "Ahli";
  optimalSteps: number;
  gridRows: number;
  gridCols: number;
  vehicles: Vehicle[];
  exitRow: number;
  quizQuestions: QuizQuestion[];
  walls?: { row: number; col: number }[];
  focus: string;
  outcomes: string[];
}

export type CTStage = "analysis" | "sandbox" | "algorithm" | "simulation" | "evaluation";

export interface PlayerProgress {
  unlockedLevel: number;
  levelScores: {
    [levelId: number]: {
      stars: number;
      bestSteps: number;
      completed: boolean;
    };
  };
}
