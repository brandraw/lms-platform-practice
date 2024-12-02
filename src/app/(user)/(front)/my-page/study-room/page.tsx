import { getUserProgress } from "@/actions/get-user-progress";
import { CourseProgress } from "@/components/course-progress";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import Link from "next/link";

export default async function StudyRoom() {
  const session = await getSession();
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      purchase: {
        some: {
          userId: session.id,
        },
      },
    },
    include: {
      chapters: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <div className="grid grid-cols-3 gap-3">
      {courses.map(async (course) => {
        const courseProgress = await getUserProgress(session.id, course.id);

        return (
          <Link
            key={course.id}
            href={`/course/${course.id}/chapter/${course.chapters[0].id}`}
          >
            <div className="border p-4 rounded-lg">
              <h3>{course.title}</h3>
              <CourseProgress value={courseProgress} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
