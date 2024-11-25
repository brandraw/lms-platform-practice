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

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
      },
      select: {
        title: true,
        description: true,
        videoUrl: true,
      },
    });

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId: params.chapterId,
      },
      select: {
        id: true,
      },
    });

    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      return new NextResponse("Missing Require Fields", { status: 400 });
    }

    const publishChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(publishChapter);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
