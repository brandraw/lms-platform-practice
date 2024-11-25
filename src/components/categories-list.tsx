import { Category } from "@prisma/client";
import { CategoryItem } from "./category-item";

interface CategoriesListProps {
  categories: Category[];
}

export function CategoriesList({ categories }: CategoriesListProps) {
  return (
    <div className="flex itmes-center gap-2 overflow-x-auto p-5">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          label={category.name}
          value={category.id}
        />
      ))}
    </div>
  );
}
