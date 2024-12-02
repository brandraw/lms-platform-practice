import { formatPrice } from "@/lib/format";
import { Category, Purchase } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface CoursesListItemProps {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  category: Category;
  progress: number | null;
  chapters: { id: string }[];
  purchase: Purchase[];
}

export function CoursesListItem({
  id,
  title,
  thumbnail,
  price,
  category,
  progress,
  chapters,
  purchase,
}: CoursesListItemProps) {
  return (
    <Link href={`/course/${id}`}>
      <div className="flex flex-col rounded-md p-3 gap-2">
        <div className="relative aspect-video rounded-md overflow-hidden w-full">
          <Image fill alt={title} className="object-cover" src={thumbnail} />
        </div>
        <div className="flex flex-col">
          <div className="text-xl font-semibold">{title}</div>
          <p className="text-muted-foreground text-sm">{category.name}</p>
          <div className="flex items-center gap-2">
            <div>
              {chapters.length} {chapters.length === 1 ? "Chapter" : "Chapters"}
            </div>
          </div>
          {progress === null ? (
            <div>{formatPrice(price)}</div>
          ) : (
            <div>Progress</div>
          )}
        </div>
      </div>
    </Link>
  );
}
