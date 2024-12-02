"use client";

import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Chapter } from "@prisma/client";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface VideoPlayerProps {
  courseId: string;
  chapterId: string;
  title: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  nextChapterId?: string;
  playbackId: string;
  isCompleted: boolean;
}

export function VideoPlayer({
  courseId,
  chapterId,
  title,
  isLocked,
  completeOnEnd,
  nextChapterId,
  playbackId,
  isCompleted,
}: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  const onEnd = async () => {
    try {
      if (!isCompleted) {
        await axios.put(
          `/api/course/${courseId}/chapter/${chapterId}/progress`,
          { isCompleted: true }
        );
      }
      if (nextChapterId) {
        router.push(`/course/${courseId}/chapter/${nextChapterId}`);
      }

      router.refresh();
    } catch {
      toast.error("오류가 생겼어요.");
    }
  };

  return (
    <div className="relative aspect-video w-full">
      {!isLoaded && !isLocked && (
        <div className="absolute left-0 top-0 w-full h-full bg-slate-500 flex items-center justify-center z-10">
          <Loader2 className="size-6 animate-spin text-slate-200" />
        </div>
      )}
      {isLocked && (
        <div className="absolute w-full h-full top-0 left-0 bg-slate-500 flex items-center justify-center flex-col">
          <Lock className="size-8 text-slate-200" />
          <div className="text-sm font-medium mt-2 text-slate-100">
            접근 금지
          </div>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          onCanPlay={() => setIsLoaded(true)}
          onEnded={onEnd}
          playbackId={playbackId}
          className={cn(!isLoaded && "hidden")}
          autoPlay
        />
      )}
    </div>
  );
}
