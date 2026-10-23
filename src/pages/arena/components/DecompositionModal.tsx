import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { audio } from "@lib/audio";

interface DecompositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelName: string;
}

export const DecompositionModal: React.FC<DecompositionModalProps> = ({
  isOpen,
  onClose,
  levelName,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;

  if (!isOpen) return null;

  const handleNext = () => {
    audio.playClick();
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    audio.playClick();
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    audio.playClick();
    onClose();
    setCurrentSlide(0); // Reset for next open
  };

  const slides = [
    {
      title: "1. Misi Utama",
      text: "Bantu Taxi Kuning (Mobil nomor 1 atau 2 dengan kartu putih berbingkai hitam) keluar dari area parkir menuju pintu keluar yang ditandai dengan panah hijau di tepi jalan.",
      bgClass: "bg-amber-50/40 border-amber-100",
    },
    {
      title: "2. Aturan Gerakan & Identifikasi Mobil",
      text: "Setiap mobil memiliki kartu angka di atas atapnya agar mudah dikenali (ramah buta warna). Mobil Taxi Kuning ditandai dengan kartu putih nomor 1 atau 2. Setiap mobil hanya bisa bergerak maju atau mundur sesuai orientasinya: mobil Mendatar (Horizontal) hanya bisa digeser Kiri/Kanan, sedangkan mobil Tegak (Vertikal) hanya bisa digeser Atas/Bawah.",
      bgClass: "bg-blue-50/40 border-blue-100",
    },
    {
      title: "3. Buat Langkah Algoritma",
      text: "Pilih mobil dengan mengekliknya pada papan parkir. Tentukan arah dan jarak geser pada panel kanan, lalu klik Tambahkan Langkah. Terakhir, klik Jalankan untuk menyimulasikan gerakan secara otomatis. Tips: Kamu bisa menyeret (drag) langkah untuk menyusun ulang urutannya, atau menariknya ke luar daftar (drag to outside) untuk menghapusnya.",
      bgClass: "bg-emerald-50/40 border-emerald-100",
    },
    {
      title: "4. Uji Pemahaman Kuis",
      text: "Setelah taxi berhasil lolos dari kemacetan, kamu harus menjawab Kuis Pemahaman untuk menganalisis penyelesaian masalah menggunakan Berpikir Komputasional sebelum maju ke level berikutnya.",
      bgClass: "bg-blue-50/40 border-blue-100",
    },
  ];

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-[1000] flex justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 md:p-6 lg:p-8 select-none animate-fadeIn">
      <div className="relative max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl w-full m-auto shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden max-h-modal flex flex-col bg-white border border-slate-100">
        {/* Header */}
        <div className="bg-blue-600 text-white p-3 sm:p-4 md:p-5 lg:p-6 pb-2 sm:pb-3 md:pb-4 lg:pb-5 relative flex-shrink-0">
          <div className="flex items-center">
            <div>
              <h3 className="text-[10px] sm:text-xs md:text-base lg:text-lg font-black tracking-tight">
                Cara dan Aturan Bermain
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-2.5 sm:top-4 md:top-5 lg:top-6 right-2.5 sm:right-4 md:right-5 lg:right-6 z-50 w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-black text-[10px] sm:text-xs md:text-sm lg:text-base transition-colors cursor-pointer border-none"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3 sm:p-5 md:p-6 lg:p-8 flex-1 min-h-0 overflow-y-auto flex flex-col">
          <div className={`p-3 sm:p-4 md:p-5 lg:p-6 border rounded-xl sm:rounded-2xl transition-all duration-300 m-auto ${slide.bgClass}`}>
            <div className="flex-1 min-w-0">
              <h4 className="text-[10px] sm:text-xs md:text-sm lg:text-base font-black text-slate-800 font-display uppercase tracking-wide">
                {slide.title}
              </h4>
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-slate-650 mt-1 sm:mt-1.5 md:mt-2 lg:mt-3 leading-relaxed md:leading-relaxed lg:leading-loose font-medium">
                {slide.text}
              </p>
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-2.5 sm:p-4 md:p-5 lg:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between flex-shrink-0">
          {/* Slide Indicator Dots */}
          <div className="flex gap-1 md:gap-1.5 lg:gap-2">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 md:h-2 lg:h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? "w-4 md:w-5 lg:w-6 bg-blue-600" : "w-1.5 md:w-2 lg:w-2.5 bg-slate-300"
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-1.5 md:gap-2 lg:gap-3">
            {currentSlide > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-[10px] sm:text-xs md:text-sm lg:text-base rounded-lg sm:rounded-xl cursor-pointer transition-all flex items-center gap-1 md:gap-1.5 shadow-xs border-solid"
              >
                <ChevronLeft size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                Sebelumnya
              </button>
            )}

            {currentSlide < totalSlides - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] sm:text-xs md:text-sm lg:text-base rounded-lg sm:rounded-xl cursor-pointer transition-all flex items-center gap-1 md:gap-1.5 shadow-md border-none"
              >
                Lanjut
                <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] sm:text-xs md:text-sm lg:text-base rounded-lg sm:rounded-xl cursor-pointer transition-all shadow-md active:scale-95 border-none"
              >
                Mulai Bermain!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
