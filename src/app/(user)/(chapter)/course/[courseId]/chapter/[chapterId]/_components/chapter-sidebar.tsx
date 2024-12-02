import { Chapter, Course, Purchase, UserProgress } from "@prisma/client";
import { ChapterSidebarItem } from "./chapter-sidebar-item";
import { CourseProgress } from "@/components/course-progress";

export interface ChapterSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
  purchase: Purchase | null;
}

export function ChapterSidebar({
  course,
  progressCount,
  purchase,
}: ChapterSidebarProps) {
  return (
    <div className="flex flex-col w-full h-full bg-white border-r">
      <div className="p-4">
        <CourseProgress value={progressCount} />
      </div>
      {course.chapters.map((chapter) => (
        <ChapterSidebarItem
          key={chapter.id}
          courseId={course.id}
          chapterId={chapter.id}
          chapterTitle={chapter.title}
          isCompleted={chapter.userProgress?.[0]?.isCompleted || null}
          isLocked={!chapter.isFree && !purchase}
        />
      ))}
    </div>
  );
}
