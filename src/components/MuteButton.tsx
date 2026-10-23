import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useAudioMute } from "../lib/audio";

interface MuteButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "logo";
  variant?: "floating" | "compact" | "arena" | "glass" | "logo";
  showLabel?: boolean;
}

export const MuteButton: React.FC<MuteButtonProps> = ({
  className = "",
  size = "logo",
  variant = "floating",
  showLabel = false,
}) => {
  const { isMuted, toggleMute } = useAudioMute();

  // Size variations
  const sizeClasses = {
    sm: "w-8 h-8 text-xs rounded-xl",
    md: "w-9 h-9 sm:w-10 sm:h-10 text-sm rounded-xl",
    lg: "w-11 h-11 sm:w-12 sm:h-12 text-base rounded-2xl",
    logo: "w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-2xl md:rounded-3xl shadow-md",
  }[size];

  const isLogoSize = size === "logo";

  // Variant styling
  let baseStyle = "flex items-center justify-center cursor-pointer transition-all duration-200 select-none active:scale-95 ";

  if (variant === "arena") {
    baseStyle += isMuted
      ? "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 shadow-sm"
      : "bg-white/95 hover:bg-white text-emerald-600 hover:text-emerald-700 border border-slate-250 shadow-sm backdrop-blur-sm";
  } else if (variant === "glass") {
    baseStyle += isMuted
      ? "bg-slate-900/80 hover:bg-slate-900 text-rose-400 border border-rose-500/40 shadow-lg backdrop-blur-md"
      : "bg-slate-900/70 hover:bg-slate-900/90 text-emerald-300 border border-white/20 shadow-lg backdrop-blur-md";
  } else if (variant === "compact") {
    baseStyle += isMuted
      ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
      : "bg-slate-100 text-slate-700 border border-slate-250 hover:bg-slate-200";
  } else {
    // Default "floating"
    baseStyle += isMuted
      ? "bg-white/95 hover:bg-white text-rose-600 border border-rose-300/80 shadow-md backdrop-blur-md hover:shadow-lg hover:border-rose-400"
      : "bg-white/95 hover:bg-white text-slate-700 hover:text-emerald-600 border border-slate-200 shadow-md backdrop-blur-md hover:shadow-lg hover:border-slate-300";
  }

  return (
    <button
      type="button"
      onClick={toggleMute}
      className={`${sizeClasses} ${baseStyle} ${className}`}
      title={isMuted ? "Nyalakan Musik Latar (Unmute BGM)" : "Matikan Musik Latar (Mute BGM)"}
      aria-label={isMuted ? "Unmute Background Music" : "Mute Background Music"}
    >
      <span className="relative flex items-center justify-center pointer-events-none">
        {isMuted ? (
          <VolumeX
            className={
              isLogoSize
                ? "w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 stroke-[2.2]"
                : size === "sm"
                ? "w-4 h-4 stroke-[2.2]"
                : size === "lg"
                ? "w-6 h-6 stroke-[2.2]"
                : "w-5 h-5 stroke-[2.2]"
            }
          />
        ) : (
          <Volume2
            className={
              isLogoSize
                ? "w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 stroke-[2.2]"
                : size === "sm"
                ? "w-4 h-4 stroke-[2.2]"
                : size === "lg"
                ? "w-6 h-6 stroke-[2.2]"
                : "w-5 h-5 stroke-[2.2]"
            }
          />
        )}
      </span>

      {showLabel && (
        <span className="ml-1.5 text-xs font-bold font-sans">
          {isMuted ? "BGM Mati" : "BGM Nyala"}
        </span>
      )}
    </button>
  );
};
