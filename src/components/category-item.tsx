"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface CategoryItemProps {
  label: string;
  value: string;
}

export function CategoryItem({ label, value }: CategoryItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTitle = searchParams.get("title");
  const currentCategoryId = searchParams.get("categoryId");
  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  return (
    <button
      className={cn(
        "py-2 px-3 rounded-full border text-sm flex items-center justify-center bg-slate-50 hover:opacity-75 transition",
        isSelected && "border-blue-500 text-blue-700 bg-blue-50"
      )}
      onClick={onClick}
      type="button"
    >
      <div className="truncate">{label}</div>
    </button>
  );
}
