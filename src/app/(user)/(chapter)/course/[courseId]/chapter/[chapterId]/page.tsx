import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { getSession } from "@/lib/session";
import { getChapter } from "@/actions/get-chapter";

export default async function ChapterIdPage({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const session = await getSession();
  if (!session.id) {
    return redirect("/");
  }
  const {
    course,
    chapter,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId: session.id,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  if (!course || !chapter) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;
  const isCompleted = !!userProgress?.isCompleted;

  return (
    <div className="flex flex-col max-w-[800px] mx-auto">
      <div className="p-5">
        <VideoPlayer
          courseId={params.courseId}
          chapterId={params.chapterId}
          title={chapter.title}
          nextChapterId={nextChapter?.id}
          playbackId={muxData?.playbackId!}
          isLocked={isLocked}
          completeOnEnd={completeOnEnd}
          isCompleted={isCompleted}
        />
      </div>
    </div>
  );
}
