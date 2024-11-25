import { db } from "@/lib/db";

export default async function CourseDetail({
  params,
}: {
  params: { courseId: string };
}) {
  const id = params.courseId;

  const course = await db.course.findUnique({
    where: {
      id,
    },
  });

  return (
    <main>
      <h1>{course?.title}</h1>
    </main>
  );
}
