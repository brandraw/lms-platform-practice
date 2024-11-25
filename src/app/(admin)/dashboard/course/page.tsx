import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

export default async function Course() {
  const courses = await db.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-5 space-y-3">
      <h1 className="text-xl font-semibold">Course</h1>
      <div>
        <Button asChild>
          <Link href="/dashboard/course/add">Add new course</Link>
        </Button>
      </div>
      <div>
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
}
