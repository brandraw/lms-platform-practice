import { db } from "@/lib/db";
import { Category, Course, Purchase } from "@prisma/client";
import { getUserProgress } from "./get-user-progress";

interface getCoursesProps {
  userId?: number;
  title?: string;
  categoryId?: string;
}

export type CourseWithCategoryWithPregress = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
  purchase: Purchase[];
};
export async function getCourses({
  userId,
  title,
  categoryId,
}: getCoursesProps): Promise<CourseWithCategoryWithPregress[]> {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchase: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const courseWithProgress: CourseWithCategoryWithPregress[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchase.length === 0) {
            return {
              ...course,
              progress: null,
            };
          }

          const progressPercentage = await getUserProgress(userId, course.id);

          return {
            ...course,
            progress: progressPercentage,
          };
        })
      );

    return courseWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
}
