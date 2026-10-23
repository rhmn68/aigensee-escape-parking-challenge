import React from "react";

interface SimulationConsoleProps {
  simulationLogs: string[];
}

export const SimulationConsole: React.FC<SimulationConsoleProps> = ({
  simulationLogs,
}) => {
  return (
    <div className="md:col-span-1 flex flex-col justify-between max-h-full overflow-hidden min-h-0 p-1">
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3 flex-shrink-0">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider font-display">
            Konsol Jalur
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto font-mono text-[10px] leading-relaxed pr-1 mb-2">
          {simulationLogs.map((log, idx) => (
            <div
              key={idx}
              className={`py-1 ${
                log.includes("⛔") || log.includes("💥")
                  ? "text-rose-600 font-bold bg-rose-50 px-1.5 border-l-2 border-rose-500"
                  : log.includes("✓")
                  ? "text-emerald-600 font-bold"
                  : log.includes("🏁") || log.includes("🏆")
                  ? "text-amber-600 font-black"
                  : "text-slate-500"
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
