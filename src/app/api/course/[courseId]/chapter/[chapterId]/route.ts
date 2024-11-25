import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

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

    const values = await req.json();

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      const existingData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
        select: {
          id: true,
          assetId: true,
        },
      });
      if (existingData) {
        await mux.video.assets.delete(existingData.assetId);
        await db.muxData.delete({
          where: {
            id: existingData.id,
          },
        });
      }
      const asset = await mux.video.assets.create({
        input: values.videoUrl,
        playback_policy: ["public"],
        test: false,
      });
      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
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
        id: true,
        videoUrl: true,
      },
    });
    if (chapter?.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });
      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            chapterId: params.chapterId,
          },
          select: {
            id: true,
          },
        });
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    const isPublishChpaterInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });
    if (!isPublishChpaterInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[CHAPTER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
