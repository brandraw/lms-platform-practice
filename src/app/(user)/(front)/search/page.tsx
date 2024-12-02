import { getCourses } from "@/actions/get-courses";
import { CategoriesList } from "@/components/categories-list";
import { CoursesList } from "@/components/courses-list";
import { SearchInput } from "@/components/search-input";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const session = await getSession();
  const courses = await getCourses({
    userId: session.id,
    ...searchParams,
  });

  return (
    <div>
      <div className="px-5">
        <SearchInput />
      </div>
      <div>
        <CategoriesList categories={categories} />
      </div>
      <div>
        <CoursesList items={courses} />
      </div>
    </div>
  );
}
