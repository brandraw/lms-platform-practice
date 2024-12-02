import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";
import { getUserProgress } from "./get-user-progress";

type CoursesWithCategoryWithProgress = Course & {
  category: Category;
  progress: number | null;
};

type GetMyPageCourses = {
  coursesInProgress: CoursesWithCategoryWithProgress[];
  coursesInComplete: CoursesWithCategoryWithProgress[];
};

export async function getMyPageCourses(
  userId: number
): Promise<GetMyPageCourses> {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        userId,
      },
      include: {
        course: {
          include: {
            category: true,
          },
        },
      },
    });

    const courses = purchases.map(
      (purchase) => purchase.course
    ) as CoursesWithCategoryWithProgress[];

    for (let course of courses) {
      const progress = await getUserProgress(userId, course.id);
      course.progress = progress;
    }

    const coursesInComplete = courses.filter(
      (course) => course.progress === 100
    );
    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return {
      coursesInProgress: coursesInProgress,
      coursesInComplete: coursesInComplete,
    };
  } catch (error) {
    console.log("[GET_MY_PAGE]", error);
    return {
      coursesInProgress: [],
      coursesInComplete: [],
    };
  }
}
