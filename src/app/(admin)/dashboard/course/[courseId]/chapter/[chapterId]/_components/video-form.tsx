"use client";

import axios from "axios";

import { z } from "zod";
import { Chapter, MuxData } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Pencil, PlusCircle, Video } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/file-upload";

import MuxPlayer from "@mux/mux-player-react";

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

interface FormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

export function VideoForm({ initialData, courseId, chapterId }: FormProps) {
  const [isEditting, setIsEditting] = useState(false);
  const toggleEdit = () => setIsEditting((c) => !c);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/course/${courseId}/chapter/${chapterId}`, values);
      setIsEditting(false);
      toast.success("업데이트 완료!");
      router.refresh();
    } catch (error) {
      toast.error("업데이트 실패");
    }
  };

  return (
    <div className="flex flex-col p-5 border rounded-md bg-white gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">강의 영상</div>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditting && <>취소</>}
          {!isEditting && !initialData.videoUrl && (
            <>
              <PlusCircle className="size-4" />
              추가
            </>
          )}
          {!isEditting && initialData.videoUrl && (
            <>
              <Pencil className="size-4" />
              수정
            </>
          )}
        </Button>
      </div>
      <div>
        {isEditting ? (
          <div>
            <FileUpload
              endpoint="courseVideo"
              onChange={(url) => {
                if (url) {
                  onSubmit({ videoUrl: url });
                }
              }}
            />
          </div>
        ) : (
          <>
            {!initialData.videoUrl && (
              <div className="w-full flex items-center justify-center h-60 border-4 border-dashed border-slate-300 rounded-md bg-slate-50">
                <Video className="size-10 text-slate-400" />
              </div>
            )}
            {initialData.videoUrl && (
              <div className="relative aspect-video">
                <MuxPlayer
                  playbackId={initialData?.muxData?.playbackId || ""}
                />
              </div>
            )}
          </>
        )}
        <div className="text-sm text-slate-700 mt-2">
          첫 업로드시 약간의 시간이 걸릴 수 있습니다.
        </div>
      </div>
    </div>
  );
}
