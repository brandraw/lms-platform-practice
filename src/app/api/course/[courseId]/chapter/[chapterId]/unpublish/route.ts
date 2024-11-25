import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const session = await getSession();
    const isAdmin = await db.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    if (isAdmin?.role?.name !== "ADMIN" && isAdmin?.role?.name !== "TEACHER") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unPublisgedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
      },
      select: {
        id: true,
      },
    });

    const isPubilshedChapterInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });
    if (!isPubilshedChapterInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unPublisgedChapter);
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
