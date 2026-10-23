import React, { useState } from "react";
import { QuizQuestion } from "../../../types";
import { CheckCircle2, AlertTriangle, ArrowRight, HelpCircle, GraduationCap } from "lucide-react";
import audio from "../../../lib/audio";

interface QuizSectionProps {
  questions: QuizQuestion[];
  onQuizComplete: (score: number) => void;
  onPrevStage?: () => void;
  lockedAnswers?: { [questionIdx: number]: number };
  onLockAnswer?: (questionIdx: number, answerIdx: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  onQuizComplete,
  onPrevStage,
  lockedAnswers: externalLockedAnswers,
  onLockAnswer,
}) => {
  const [internalLockedAnswers, setInternalLockedAnswers] = useState<{ [questionIdx: number]: number }>({});
  const lockedAnswers = externalLockedAnswers ?? internalLockedAnswers;

  // Start at the first unanswered question when opened (so reopening after locking Q1 goes directly to Q2)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const firstUnanswered = questions.findIndex((_, idx) => lockedAnswers[idx] === undefined);
    return firstUnanswered !== -1 ? firstUnanswered : Math.max(0, questions.length - 1);
  });
  const [draftSelectedAnswerIndex, setDraftSelectedAnswerIndex] = useState<number | null>(null);

  const question = questions[currentQuestionIndex];
  const isAnswerSubmitted = lockedAnswers[currentQuestionIndex] !== undefined;
  const selectedAnswerIndex = isAnswerSubmitted
    ? lockedAnswers[currentQuestionIndex]
    : draftSelectedAnswerIndex;
  const isCorrect = selectedAnswerIndex === question?.correctAnswerIndex;

  const handleSelectAnswer = (index: number) => {
    if (isAnswerSubmitted) return;
    audio.playClick();
    setDraftSelectedAnswerIndex(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswerIndex === null || isAnswerSubmitted) return;

    if (selectedAnswerIndex === question.correctAnswerIndex) {
      audio.playBeepSuccess();
    } else {
      audio.playError();
    }

    if (onLockAnswer) {
      onLockAnswer(currentQuestionIndex, selectedAnswerIndex);
    } else {
      setInternalLockedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: selectedAnswerIndex }));
    }
  };

  const handleNextQuestion = () => {
    setDraftSelectedAnswerIndex(null);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      audio.playClick();
    } else {
      // Completed last question — compute total score from all locked answers
      const correctCount = questions.reduce(
        (acc, q, idx) => acc + (lockedAnswers[idx] === q.correctAnswerIndex ? 1 : 0),
        0
      );
      const finalScorePercentage = Math.round((correctCount / questions.length) * 100);
      audio.playSuccess();
      onQuizComplete(finalScorePercentage);
    }
  };

  if (!question) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
        <GraduationCap className="mx-auto text-blue-600 mb-2" size={40} />
        <p className="text-slate-800 text-sm font-black">Semua kuis telah diselesaikan!</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-none rounded-2xl p-5 md:p-6 flex flex-col justify-between min-h-0 flex-1 overflow-hidden text-slate-800">
      <div className="flex-1 overflow-y-auto pr-1 min-h-0 mb-4 space-y-3">
        {/* Question Text */}
        <div className="pr-8 sm:pr-10">
          <div className="flex gap-2 items-start">
            <HelpCircle size={16} className="text-blue-500 mt-0.5 sm:mt-1 flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
            <h4 className="text-xs sm:text-sm md:text-base text-slate-800 font-black leading-relaxed font-sans">
              {question.question}
            </h4>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {question.options.map((option, idx) => {
            let optionStyles = "bg-slate-50 hover:bg-slate-105 border-slate-200 text-slate-700 font-medium hover:border-slate-350";
            
            if (selectedAnswerIndex === idx) {
              optionStyles = "bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-500/20 font-bold";
            }

            if (isAnswerSubmitted) {
              if (idx === question.correctAnswerIndex) {
                optionStyles = "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold";
              } else if (selectedAnswerIndex === idx) {
                optionStyles = "bg-rose-50 border-rose-500 text-rose-800 font-bold";
              } else {
                optionStyles = "opacity-50 bg-slate-100 border-slate-200 text-slate-400";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectAnswer(idx)}
                className={`w-full text-left p-2.5 sm:p-3 rounded-xl border text-[11px] sm:text-xs md:text-sm transition-all duration-200 flex items-center justify-between shadow-xs cursor-pointer ${optionStyles}`}
              >
                <span>{option}</span>
                {isAnswerSubmitted && idx === question.correctAnswerIndex && (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                )}
                {isAnswerSubmitted && selectedAnswerIndex === idx && idx !== question.correctAnswerIndex && (
                  <AlertTriangle size={16} className="text-rose-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation / Feedback */}
        {isAnswerSubmitted && (
          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
            isCorrect 
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}>
            <div className="flex gap-1.5 items-center font-black mb-1 font-mono uppercase tracking-wider text-[10px]">
              {isCorrect ? "Jawaban Benar! 🎉" : "Saran Pembelajaran 💡"}
            </div>
            <p className="font-sans font-medium text-slate-650">{question.explanation}</p>
          </div>
        )}
      </div>

      {/* Button footer controls */}
      <div className="flex items-center justify-between mt-auto border-t border-slate-200 pt-3 flex-shrink-0">
        {onPrevStage && (
          <button
            onClick={onPrevStage}
            className="text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors cursor-pointer"
          >
            ← Kembali ke Arena
          </button>
        )}
        
        {!isAnswerSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswerIndex === null}
            className={`px-4 py-2 text-xs font-extrabold font-sans rounded-xl transition-all ${
              selectedAnswerIndex !== null
                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs border-none"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            }`}
          >
            Kunci Jawaban
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="bg-emerald-600 hover:bg-emerald-750 text-white px-4 py-2 text-xs font-extrabold font-sans rounded-xl flex items-center gap-1 shadow-xs transition-all cursor-pointer border-none"
          >
            <span>{currentQuestionIndex + 1 < questions.length ? "Muat Soal Berikutnya" : "Simpan Analisis & Lanjut"}</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
};
