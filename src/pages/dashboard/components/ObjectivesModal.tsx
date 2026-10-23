import React, { useState } from "react";
import { Target, CheckCircle2, ListOrdered, Layers, ChevronLeft, ChevronRight, X } from "lucide-react";
import { audio } from "@lib/audio";

interface ObjectivesModalProps {
  isOpen: boolean;
  onContinue: () => void;
}

interface Slide {
  icon: React.ReactNode;
  title: string;
  items: { keyword: string; text: string }[];
}

const slides: Slide[] = [
  {
    icon: <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />,
    title: "Tujuan Pembelajaran",
    items: [
      {
        keyword: "Berpikir Komputasional",
        text: "Belajar mengenali pola kemacetan, memecah masalah, dan menyusun algoritma urutan langkah untuk membebaskan Taxi Kuning ke pintu keluar.",
      },
    ],
  },
  {
    icon: <ListOrdered className="w-4 h-4 sm:w-5 sm:h-5 text-white" />,
    title: "Setelah Misi Ini, Kamu Mampu",
    items: [
      {
        keyword: "Pengenalan Pola",
        text: "Mengenali pola gerakan dan posisi kendaraan yang menghambat jalan keluar.",
      },
      {
        keyword: "Dekomposisi",
        text: "Memecah rute kemacetan yang rumit menjadi langkah-langkah kecil pergeseran kendaraan.",
      },
    ],
  },
  {
    icon: <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />,
    title: "Setelah Misi Ini, Kamu Mampu",
    items: [
      {
        keyword: "Algoritma",
        text: "Menyusun dan mengurutkan urutan langkah terbaik dan paling efisien untuk meloloskan taxi.",
      },
      {
        keyword: "Evaluasi Solusi",
        text: "Menganalisis efisiensi solusi dan menarik kesimpulan melalui kuis pemahaman.",
      },
    ],
  },
];

export const ObjectivesModal: React.FC<ObjectivesModalProps> = ({ isOpen, onContinue }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const total = slides.length;
  const isFirst = currentSlide === 0;
  const isLast = currentSlide === total - 1;
  const slide = slides[currentSlide];

  const handleNext = () => {
    audio.playClick();
    if (isLast) {
      handleClose();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    audio.playClick();
    if (!isFirst) setCurrentSlide((prev) => prev - 1);
  };

  const handleClose = () => {
    audio.playClick();
    onContinue();
    setCurrentSlide(0);
  };

  const goToSlide = (index: number) => {
    audio.playClick();
    setCurrentSlide(index);
  };

  return (
    <div
      id="objectives-modal-backdrop"
      className="fixed inset-0 z-[998] flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn"
      onClick={handleClose}
    >
      {/* Backdrop overlay */}
      <div id="objectives-modal-overlay" className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

      {/* Modal Container with blue border */}
      <div
        id="objectives-modal-card"
        className="relative z-10 w-full max-w-[340px] sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[85vh] bg-white border-[3px] sm:border-[4px] md:border-[5px] border-blue-600 rounded-[20px] sm:rounded-[26px] md:rounded-[30px] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Solid blue matching Play button */}
        <div
          id="objectives-modal-header"
          className="flex items-center gap-2 sm:gap-2.5 md:gap-3 px-3 sm:px-4 md:px-5 pt-2.5 sm:pt-4 md:pt-5 pb-2 sm:pb-3 md:pb-4 border-b border-blue-700/30 shrink-0 bg-blue-600 text-white shadow-sm"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-inner">
            {slide.icon}
          </div>
          <h2
            id="objectives-modal-title"
            className="text-[10px] sm:text-xs md:text-base lg:text-lg font-black font-display tracking-wide text-white flex-1 leading-none drop-shadow-xs truncate"
          >
            {slide.title}
          </h2>
          <span
            id="objectives-modal-counter"
            className="text-[8px] sm:text-[10px] md:text-xs font-black bg-white/20 text-white tracking-wider font-display shrink-0 px-2 sm:px-2.5 md:px-3 py-0.5 md:py-1 rounded-full border border-white/30 shadow-xs"
          >
            {currentSlide + 1}/{total}
          </span>
          <button
            id="objectives-modal-close-btn"
            onClick={handleClose}
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-white/20 hover:bg-white/30 border border-white/30 rounded-full flex items-center justify-center transition-colors shrink-0 ml-0.5 cursor-pointer text-white"
            aria-label="Tutup"
          >
            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
          </button>
        </div>

        {/* Body */}
        <div
          id="objectives-modal-body"
          className="p-3 sm:p-4 md:p-5 flex flex-col gap-2 sm:gap-2.5 md:gap-3 bg-[#f5f9ff] flex-1 min-h-0 overflow-y-auto scrollbar-none"
        >
          {slide.items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-2 sm:gap-3 md:gap-3.5 border-2 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 md:p-4 bg-white border-[#12a7ff]/30 hover:border-[#12a7ff]/60 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 shrink-0 mt-0.5 text-[#12a7ff]" />
              <span className="text-slate-700 text-[9px] sm:text-xs md:text-sm lg:text-[15px] font-medium leading-snug sm:leading-relaxed font-sans">
                <strong className="font-extrabold text-[#2852b0]">{item.keyword}:</strong>{" "}
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          id="objectives-modal-footer"
          className="px-3 sm:px-4 md:px-5 pt-2 sm:pt-3 pb-2.5 sm:pb-4 border-t border-blue-100 bg-white shrink-0 flex flex-col gap-2 sm:gap-2.5"
        >
          {/* Dot Indicators */}
          <div id="objectives-modal-dots" className="flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentSlide
                    ? "w-4 sm:w-5 md:w-6 h-1 sm:h-1.5 md:h-2 bg-[#12a7ff]"
                    : "w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 bg-[#2852b0]/25 hover:bg-[#2852b0]/50"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div id="objectives-modal-nav" className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {!isFirst && (
              <button
                id="objectives-modal-prev-btn"
                onClick={handlePrev}
                className="flex-1 py-1.5 sm:py-2 md:py-2.5 lg:py-3 px-3 sm:px-4 md:px-5 rounded-lg sm:rounded-xl md:rounded-2xl text-[#2852b0] font-bold text-[9px] sm:text-xs md:text-sm lg:text-base flex items-center justify-center gap-0.5 sm:gap-1 bg-blue-50/80 hover:bg-blue-100/90 border-b-2 sm:border-b-4 border-blue-200 active:border-b-0 active:translate-y-[2px] sm:active:translate-y-[4px] transition-all font-display tracking-wider cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                Kembali
              </button>
            )}
            <button
              id="objectives-modal-next-btn"
              onClick={handleNext}
              className="flex-1 py-1.5 sm:py-2 md:py-2.5 lg:py-3 px-3 sm:px-4 md:px-5 rounded-lg sm:rounded-xl md:rounded-2xl text-white font-bold text-[9px] sm:text-xs md:text-sm lg:text-base flex items-center justify-center gap-0.5 sm:gap-1 bg-blue-600 hover:bg-blue-700 border-b-2 sm:border-b-4 border-blue-800 active:border-b-0 active:translate-y-[2px] sm:active:translate-y-[4px] transition-all font-display tracking-wider cursor-pointer shadow-md"
            >
              {isLast ? "Mulai Bermain" : "Lanjut"}
              {!isLast && <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
