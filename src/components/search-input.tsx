"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useState } from "react";

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);
  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          title: value,
          categoryId: currentCategoryId,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, [debouncedValue]);

  return (
    <div className="relative">
      <Search className="size-4 absolute left-3 top-3" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="outline-none py-2 pl-9 pr-4 border rounded-full w-full md:w-[300px]"
        placeholder="검색해보세요"
      />
    </div>
  );
}
