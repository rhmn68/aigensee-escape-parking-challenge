import React, { useState, useLayoutEffect, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { audio } from "@lib/audio";

/**
 * Interactive coach-mark / spotlight tour shown ONLY on Level 1.
 * Each step highlights a real UI element (by CSS selector) and explains
 * what the button is for and how to play. If a step has no selector it is
 * rendered as a centered card (intro / outro).
 */

interface TourStep {
  /** CSS selector of the element to highlight. Omit for a centered card. */
  selector?: string;
  title: string;
  body: string;
}

const STEPS: TourStep[] = [
  {
    title: "Selamat datang di Level 1! 👋",
    body:
      "Misimu: bantu Taxi Kuning (mobil [1] berkartu putih) keluar dari area parkir. Yuk kenali dulu tiap tombol dan cara bermainnya. Klik Lanjut untuk mulai.",
  },
  {
    selector: ".arena-left-column",
    title: "Area Parkir 🅿️",
    body:
      "Ini papan parkirnya. Taxi Kuning [1] terjebak tegak di kolom 6 dan harus turun ke bawah untuk keluar. Mobil Biru [6] yang mendatar menghalangi jalurnya.",
  },
  {
    selector: "#tour-mode-bk",
    title: "Mode Skenario BK 🧠",
    body:
      "Mode utama (Berpikir Komputasional). Di sini kamu menyusun urutan langkah (algoritma) lebih dulu, lalu menjalankannya. Pastikan mode ini yang aktif saat bermain Level 1.",
  },
  {
    selector: "#tour-mode-bebas",
    title: "Mode Bebas 🔥",
    body:
      "Mode latihan. Kamu bisa menggeser mobil langsung di papan dengan tangan tanpa menyusun langkah. Bagus untuk coba-coba, tapi untuk menyelesaikan level gunakan Mode Skenario BK.",
  },
  {
    selector: "#tour-guide-btn",
    title: "Tombol Panduan ❗",
    body:
      "Lupa caranya? Klik tombol ini kapan saja untuk membuka kembali panduan interaktif seperti sekarang.",
  },
  {
    selector: "#select-vehicle-input",
    title: "1) Pilih Mobil 🚗",
    body:
      "Langkah pertama menyusun algoritma: pilih mobil yang mau digeser. Kamu juga bisa langsung mengklik mobilnya di papan. Mulailah dengan Mobil Biru [6] yang menghalangi.",
  },
  {
    selector: "#select-direction-input",
    title: "2) Pilih Arah ↔️",
    body:
      "Tentukan arah geser. Mobil mendatar hanya bisa Kiri/Kanan, mobil tegak hanya bisa Atas/Bawah. Untuk membuka jalur, geser Mobil Biru ke Kanan.",
  },
  {
    selector: "#select-multiplier-input",
    title: "3) Jumlah Langkah 🔢",
    body:
      "Berapa petak sekali jalan. Misalnya pilih 4x untuk menambahkan 4 langkah sekaligus — berguna saat Taxi harus turun jauh ke pintu keluar.",
  },
  {
    selector: "#add-step-btn",
    title: "4) Tambah Langkah ➕",
    body:
      "Klik untuk memasukkan langkah ke daftar algoritma di bawahnya. Ulangi proses Pilih Mobil → Arah → Jumlah → Tambah sampai rencanamu lengkap.",
  },
  {
    selector: "#step-list-container",
    title: "Daftar Algoritma 📋",
    body:
      "Semua langkahmu tersusun di sini dan dijalankan berurutan dari atas. Seret kartu untuk mengurutkan ulang, atau tarik ke luar / klik ikon tempat sampah untuk menghapus.",
  },
  {
    selector: "#tour-reset-btn",
    title: "Tombol Ulangi ↺",
    body:
      "Mengembalikan posisi mobil ke awal supaya kamu bisa mencoba lagi dari nol. Daftar langkah tetap tersimpan.",
  },
  {
    selector: "#tour-run-btn",
    title: "Tombol Jalankan ▶",
    body:
      "Menjalankan algoritmamu! Mobil bergerak otomatis sesuai urutan langkah. Jika berhasil, Taxi keluar dan kamu lanjut ke Kuis Pemahaman.",
  },
  {
    title: "Siap Bermain! 🎉",
    body:
      "Solusi tercepat Level 1 (5 langkah): geser Mobil Biru [6] ke Kanan 1x, lalu geser Taxi Kuning [1] ke Bawah 4x, dan klik Jalankan. Selamat mencoba!",
  },
];

const CARD_W = 300;

interface Level1TourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Level1Tour: React.FC<Level1TourProps> = ({ isOpen, onClose }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardH, setCardH] = useState(180);

  const step = STEPS[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === STEPS.length - 1;

  // Reset to first step whenever the tour (re)opens
  useEffect(() => {
    if (isOpen) setStepIdx(0);
  }, [isOpen]);

  // Locate + measure the highlighted element for the current step
  const measure = useCallback(() => {
    if (!isOpen) return;
    if (!step.selector) {
      setRect(null);
      return;
    }
    const el = document.querySelector(step.selector) as HTMLElement | null;
    if (!el) {
      setRect(null);
      return;
    }
    try {
      el.scrollIntoView({ block: "nearest", inline: "nearest" });
    } catch {
      /* ignore */
    }
    setRect(el.getBoundingClientRect());
  }, [isOpen, step]);

  useLayoutEffect(() => {
    measure();
    // Re-measure on the next frame in case layout shifts after scrollIntoView
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [measure]);

  useEffect(() => {
    if (!isOpen) return;
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [isOpen, measure]);

  useLayoutEffect(() => {
    if (cardRef.current) setCardH(cardRef.current.offsetHeight);
  }, [stepIdx, rect]);

  if (!isOpen) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pad = 6;

  // Spotlight hole geometry
  const hole = rect
    ? {
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null;

  // Tooltip card position
  let cardTop: number;
  let cardLeft: number;
  if (!hole) {
    cardTop = Math.max(12, vh / 2 - cardH / 2);
    cardLeft = Math.max(12, vw / 2 - CARD_W / 2);
  } else {
    const spaceBelow = vh - (hole.top + hole.height);
    if (spaceBelow > cardH + 20) {
      cardTop = hole.top + hole.height + 12;
    } else if (hole.top > cardH + 20) {
      cardTop = hole.top - cardH - 12;
    } else {
      cardTop = Math.max(12, vh / 2 - cardH / 2);
    }
    cardLeft = hole.left + hole.width / 2 - CARD_W / 2;
    cardLeft = Math.min(Math.max(12, cardLeft), vw - CARD_W - 12);
  }

  const goNext = () => {
    audio.playClick();
    if (isLast) {
      onClose();
    } else {
      setStepIdx((i) => Math.min(STEPS.length - 1, i + 1));
    }
  };
  const goPrev = () => {
    audio.playClick();
    setStepIdx((i) => Math.max(0, i - 1));
  };
  const handleClose = () => {
    audio.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1200] select-none">
      {/* Click-blocking backdrop (captures taps outside the card) */}
      <div className="absolute inset-0" onClick={(e) => e.stopPropagation()} />

      {/* Spotlight: a box with a huge box-shadow dims everything else */}
      {hole ? (
        <div
          className="absolute rounded-xl ring-2 ring-blue-400 transition-all duration-300 pointer-events-none"
          style={{
            top: hole.top,
            left: hole.left,
            width: hole.width,
            height: hole.height,
            boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.70)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-900/70" />
      )}

      {/* Tooltip card */}
      <div
        ref={cardRef}
        className="absolute bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex flex-col gap-2 animate-scaleIn"
        style={{ top: cardTop, left: cardLeft, width: CARD_W, maxWidth: "calc(100vw - 24px)" }}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer border-none"
          title="Lewati panduan"
        >
          <X size={13} />
        </button>

        <h4 className="text-sm font-black text-slate-800 pr-6 leading-snug">{step.title}</h4>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">{step.body}</p>

        <div className="flex items-center justify-between mt-1.5">
          {/* Progress dots */}
          <div className="flex gap-1 items-center">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === stepIdx ? "w-3.5 bg-blue-600" : "w-1.5 bg-slate-300"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {!isFirst && (
              <button
                type="button"
                onClick={goPrev}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-lg cursor-pointer transition-all flex items-center gap-1"
              >
                <ChevronLeft size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={goNext}
              className={`px-3 py-1.5 text-white font-black text-xs rounded-lg cursor-pointer transition-all flex items-center gap-1 border-none active:scale-95 ${
                isLast ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLast ? "Mulai!" : "Lanjut"}
              {!isLast && <ChevronRight size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
