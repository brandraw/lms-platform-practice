import { CourseWithCategoryWithPregress } from "@/actions/get-courses";
import { CoursesListItem } from "./courses-list-item";

interface CoursesListProps {
  items: CourseWithCategoryWithPregress[];
}

export function CoursesList({ items }: CoursesListProps) {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <CoursesListItem
            key={item.id}
            id={item.id}
            title={item.title}
            thumbnail={item.thumbnail!}
            price={item.price!}
            chapters={item.chapters}
            category={item.category!}
            progress={item.progress}
            purchase={item.purchase}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-sm text-center text-muted-foreground mt-10">
          검색결과가 없어요 ㅠㅠ
        </div>
      )}
    </div>
  );
}
