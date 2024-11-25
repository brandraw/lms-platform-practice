"use client";

import axios from "axios";

import { z } from "zod";
import { Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Image as ImageIcon, Pencil, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/file-upload";
import Image from "next/image";

const formSchema = z.object({
  thumbnail: z.string(),
});

interface FormProps {
  initialData: Course;
  courseId: string;
}

export function ImageForm({ initialData, courseId }: FormProps) {
  const [isEditting, setIsEditting] = useState(false);
  const toggleEdit = () => setIsEditting((c) => !c);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      await axios.patch(`/api/course/${courseId}`, values);
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
        <div className="text-sm font-semibold">강의 대표이미지</div>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditting && <>취소</>}

          {!isEditting && !initialData.thumbnail && (
            <>
              <PlusCircle className="size-4" />
              추가
            </>
          )}
          {!isEditting && initialData.thumbnail && (
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
              endpoint="courseImage"
              onChange={(url) => {
                if (url) {
                  onSubmit({ thumbnail: url });
                }
              }}
            />
          </div>
        ) : (
          <>
            {!initialData.thumbnail && (
              <div className="w-full flex items-center justify-center h-60 border-4 border-dashed border-slate-300 rounded-md bg-slate-50">
                <ImageIcon className="size-10 text-slate-400" />
              </div>
            )}
            {initialData.thumbnail && (
              <div className="relative aspect-video">
                <Image
                  fill
                  src={initialData.thumbnail}
                  alt="Thumbnail Image"
                  className="rounded-md object-cover"
                />
              </div>
            )}
          </>
        )}
        <div className="text-sm text-slate-700 mt-2">
          16:9 비율의 이미지를 업로드해주세요.
        </div>
      </div>
    </div>
  );
}
