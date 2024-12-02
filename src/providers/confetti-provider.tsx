"use client";

import { confettiStore } from "@/hooks/confetti-store";
import ReactConfetti from "react-confetti";

export const ConfettiProvider = () => {
  const confetti = confettiStore();

  if (!confetti.isOpen) {
    return null;
  }

  return (
    <ReactConfetti
      numberOfPieces={1000}
      recycle={false}
      onConfettiComplete={confetti.onClose}
      className="pointer-events-none z-[200]"
    />
  );
};
