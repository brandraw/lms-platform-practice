import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ChapterNavbar } from "./_components/chapter-navbar";
import { ChapterSidebar } from "./_components/chapter-sidebar";
import { getUserProgress } from "@/actions/get-user-progress";

export default async function ChapterIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    courseId: string;
    chapterId: string;
  };
}) {
  const session = await getSession();
  if (!session.id) {
    return redirect("/");
  }
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
  });
  if (!user) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId: session.id,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: session.id,
        courseId: params.courseId,
      },
    },
  });
  if (!purchase) {
    return redirect(`/course/${course.id}`);
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
    },
    select: {
      id: true,
      position: true,
    },
  });
  const nextChapter = await db.chapter.findFirst({
    where: {
      isPublished: true,
      courseId: params.courseId,
      position: {
        gt: chapter?.position,
      },
    },
    orderBy: {
      position: "asc",
    },
    select: {
      id: true,
    },
  });
  const progressCount = await getUserProgress(session.id, course.id);
  const isCompleted = await db.userProgress.findUnique({
    where: {
      userId_chapterId: {
        userId: session.id,
        chapterId: params.chapterId,
      },
    },
    select: {
      isCompleted: true,
    },
  });

  return (
    <div className="">
      <ChapterNavbar
        course={course}
        progressCount={progressCount}
        purchase={purchase}
        nextChapter={nextChapter}
        chapter={chapter!}
        isCompleted={!!isCompleted?.isCompleted}
      />
      <div className="pt-20">
        <div className="md:flex hidden w-[300px] fixed top-0 left-0 pt-20 min-h-screen bg-slate-100">
          <ChapterSidebar
            course={course}
            progressCount={progressCount}
            purchase={purchase}
          />
        </div>
        <main className="md:pl-[300px]">{children}</main>
      </div>
    </div>
  );
}
