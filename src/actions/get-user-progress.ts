import { db } from "@/lib/db";

export async function getUserProgress(
  userId: number | null | undefined,
  courseId: string
): Promise<number> {
  try {
    if (!userId) {
      return 0;
    }
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      include: {
        userProgress: {
          where: {
            isCompleted: true,
          },
        },
      },
    });

    const chaptersIds = publishedChapters.map((chapter) => chapter.id);

    const userProgressCount = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: chaptersIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage = (userProgressCount / chaptersIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_USER_PROGRESS]", error);
    return 0;
  }
}
