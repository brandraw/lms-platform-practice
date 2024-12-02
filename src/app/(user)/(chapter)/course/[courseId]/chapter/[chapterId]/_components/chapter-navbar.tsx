import Link from "next/link";
import { ChapterSidebarProps } from "./chapter-sidebar";
import { MobileCourseSidebar } from "./mobile-course-sidebar";
import { CompleteButton } from "./complete-button";

export function ChapterNavbar({
  course,
  progressCount,
  purchase,
  nextChapter,
  chapter,
  isCompleted,
}: ChapterSidebarProps & {
  nextChapter: { id: string } | null;
  chapter: {
    id: string;
    position: number;
  };
  isCompleted: boolean;
}) {
  return (
    <div className="fixed w-full left-0 top-0 h-20 bg-slate-50 border-b z-20">
      <div className="flex items-center w-full h-full p-4">
        <div className="">
          <MobileCourseSidebar
            course={course}
            progressCount={progressCount}
            purchase={purchase}
          />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/my-page">나가기</Link>
          <CompleteButton
            courseId={course.id}
            chapterId={chapter.id}
            nextChapter={nextChapter}
            isCompleted={isCompleted}
          />
        </div>
      </div>
    </div>
  );
}
