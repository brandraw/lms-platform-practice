import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <div className="p-5">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/course"
          className="py-2 px-3 bg-blue-100 rounded-md text-blue-600 text-sm font-medium"
        >
          Course
        </Link>
        <Button asChild variant="secondary">
          <Link href="/">프론트</Link>
        </Button>
      </div>
    </div>
  );
};
