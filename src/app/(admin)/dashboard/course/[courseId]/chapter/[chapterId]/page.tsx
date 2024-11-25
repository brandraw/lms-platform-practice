import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DescriptionForm } from "./_components/description-form";
import { AccessForm } from "./_components/access-form";
import { VideoForm } from "./_components/video-form";
import { ChapterActions } from "./_components/chapter-actions";

export default async function ChapterDetail({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
    },
    include: {
      muxData: true,
    },
  });
  if (!chapter) {
    return redirect("/dashboard");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalLength = requiredFields.length;
  const completedLength = requiredFields.filter(Boolean).length;
  const completionText = `(${completedLength}/${totalLength})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-5 space-y-3">
      <div>
        <Link
          href={`/dashboard/course/${params.courseId}`}
          className="flex items-center gap-2 text-sm hover:opacity-75"
        >
          <ArrowLeft className="size-4" />
          이전으로 돌아가기
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Chpater!</h1>
        <div className="text-sm text-end">{completionText}</div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {chapter.isPublished ? "공개된 강의" : "비공개된 강의"}
        </div>
        <ChapterActions
          courseId={params.courseId}
          chapterId={params.chapterId}
          isPublished={chapter.isPublished}
          isCompleted={isComplete}
        />
      </div>
      <div className="flex flex-col gap-3">
        <TitleForm
          initialData={chapter}
          courseId={params.courseId}
          chapterId={params.chapterId}
        />
        <DescriptionForm
          initialData={chapter}
          courseId={params.courseId}
          chapterId={params.chapterId}
        />
        <AccessForm
          initialData={chapter}
          courseId={params.courseId}
          chapterId={params.chapterId}
        />
        <VideoForm
          initialData={chapter}
          courseId={params.courseId}
          chapterId={params.chapterId}
        />
      </div>
    </div>
  );
}
