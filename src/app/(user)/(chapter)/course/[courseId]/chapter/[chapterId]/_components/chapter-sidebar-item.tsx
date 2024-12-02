"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface ChapterSidebarItemProps {
  chapterId: string;
  chapterTitle: string;
  courseId: string;
  isCompleted: boolean | null;
  isLocked: boolean;
}

export function ChapterSidebarItem({
  chapterId,
  chapterTitle,
  courseId,
  isCompleted,
  isLocked,
}: ChapterSidebarItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = pathname.includes(chapterId);

  return (
    <button
      className={cn(
        "flex items-center gap-2 p-4 font-semibold",
        isActive && "text-white bg-blue-500",
        isCompleted && "text-slate-400",
        isActive && isCompleted && "text-white"
      )}
      type="button"
      onClick={() => router.push(`/course/${courseId}/chapter/${chapterId}`)}
    >
      <div className="text-sm">{chapterTitle}</div>
      <Check className="size-4" />
    </button>
  );
}
