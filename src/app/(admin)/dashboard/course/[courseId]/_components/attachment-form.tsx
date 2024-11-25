"use client";

import axios from "axios";

import { z } from "zod";
import { Attachment, Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  File,
  Image as ImageIcon,
  Loader2,
  Pencil,
  PlusCircle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  url: z.string(),
  name: z.string().optional(),
});

interface FormProps {
  initialData: Course & {
    attachments: Attachment[];
  };
  courseId: string;
}

export function AttachmantForm({ initialData, courseId }: FormProps) {
  const [isEditting, setIsEditting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditting((c) => !c);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      await axios.post(`/api/course/${courseId}/attachment`, values);
      setIsEditting(false);
      toast.success("업데이트 완료!");
      router.refresh();
    } catch (error) {
      toast.error("업데이트 실패");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/course/${courseId}/attachment/${id}`);

      toast.success("삭제성공!");
      router.refresh();
    } catch {
      toast.error("실패!");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col p-5 border rounded-md bg-white gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">강의 자료</div>
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
              endpoint="courseAttachment"
              onChange={(url, name) => {
                if (url) {
                  onSubmit({ url: url, name: name });
                }
              }}
            />
          </div>
        ) : (
          <>
            {initialData.attachments.length === 0 && (
              <div className="text-sm text-slate-500 italic">자료가 없어요</div>
            )}
            {initialData.attachments.length > 0 && (
              <div className="space-y-2">
                {initialData.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="bg-sky-50 border border-sky-200 rounded-md px-3 py-2 w-full flex items-center gap-2"
                  >
                    <File className="size-5" />
                    <p className="text-xs line-clamp-1">{attachment.name}</p>

                    <div className="ml-auto flex">
                      {deletingId === attachment.id && (
                        <Loader2 className="size-5 animate-spin text-slate-500" />
                      )}
                      {deletingId !== attachment.id && (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(attachment.id)}
                          className="size-5 hover:opacity-75"
                        >
                          <X />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
