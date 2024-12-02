"use client";

import { Button } from "@/components/ui/button";
import { confettiStore } from "@/hooks/confetti-store";
import { cn } from "@/lib/utils";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CompleteButtonProps {
  courseId: string;
  chapterId: string;
  nextChapter: {
    id: string;
  } | null;
  isCompleted: boolean;
}

export function CompleteButton({
  courseId,
  chapterId,
  nextChapter,
  isCompleted,
}: CompleteButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const confetti = confettiStore();

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isCompleted && nextChapter) {
        return router.push(`/course/${courseId}/chapter/${nextChapter.id}`);
      }

      if (!isCompleted && nextChapter) {
        await axios.put(
          `/api/course/${courseId}/chapter/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );
        return router.push(`/course/${courseId}/chapter/${nextChapter.id}`);
      }

      if (!isCompleted && !nextChapter) {
        await axios.put(
          `/api/course/${courseId}/chapter/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );
        confetti.onOpen();
      }

      toast.success("완료!");
    } catch {
      toast.error("실패 ㅠㅠ");
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      className={cn(isCompleted ? "bg-slate-400" : "bg-blue-500")}
      disabled={isLoading}
      onClick={onClick}
    >
      <CheckCircle className="size-4" />
      {isCompleted ? "다음으로" : "완료하고 다음으로!"}
    </Button>
  );
}
