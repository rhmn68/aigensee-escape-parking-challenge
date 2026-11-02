import React, { useEffect, useRef } from "react";
import { Video, X } from "lucide-react";
import { TUTORIAL_VIDEO_ID } from "../tutorial";

interface TutorialVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialVideoModal: React.FC<TutorialVideoModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) dialog?.showModal();
    else dialog?.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="tutorial-video-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="m-auto w-[min(90vw,48rem)] max-h-[90dvh] overflow-y-auto rounded-3xl border-4 border-blue-600 bg-white p-0 shadow-2xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm"
    >
      {isOpen && (
        <div>
          <div className="flex items-center gap-3 bg-blue-600 px-4 py-3 text-white">
            <Video className="h-5 w-5 shrink-0" />
            <h2 id="tutorial-video-title" className="flex-1 font-bold">Video Panduan Bermain</h2>
            <button type="button" autoFocus onClick={onClose} aria-label="Tutup video tutorial" className="rounded-full bg-white/20 p-1.5 hover:bg-white/30 cursor-pointer focus-visible:outline-2">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <p className="mb-3 text-sm text-slate-600">Tonton panduan ini sebelum memulai tantangan parkir.</p>
            <div className="aspect-video overflow-hidden rounded-xl bg-slate-950">
              <iframe
                className="h-full w-full border-0"
                src={`https://www.youtube-nocookie.com/embed/${TUTORIAL_VIDEO_ID}`}
                title="Video panduan bermain Escape Parking Challenge"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <a href={`https://www.youtube.com/watch?v=${TUTORIAL_VIDEO_ID}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-700 underline underline-offset-4">Buka di YouTube</a>
              <button type="button" onClick={onClose} className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer">Lanjut Bermain</button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
};
