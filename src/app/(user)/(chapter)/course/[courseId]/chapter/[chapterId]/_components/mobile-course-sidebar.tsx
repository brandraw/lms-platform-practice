import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeftCircle } from "lucide-react";
import { ChapterSidebar, ChapterSidebarProps } from "./chapter-sidebar";

export function MobileCourseSidebar({
  course,
  progressCount,
  purchase,
}: ChapterSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild className="flex md:hidden">
        <button className="flex items-center text-sm gap-2" type="button">
          <ArrowLeftCircle className="size-5" />
          레슨열기
        </button>
      </SheetTrigger>
      <SheetContent className="p-0 w-72 z-[999]" side="left">
        <ChapterSidebar
          course={course}
          progressCount={progressCount}
          purchase={purchase}
        />
      </SheetContent>
    </Sheet>
  );
}
