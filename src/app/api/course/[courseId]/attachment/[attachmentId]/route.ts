import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const session = await getSession();
    const courseOwner = await db.user.findUnique({
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
    if (
      courseOwner?.role?.name !== "TEACHER" &&
      courseOwner?.role?.name !== "ADMIN"
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.delete({
      where: {
        id: params.attachmentId,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("[ATTACHMENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
