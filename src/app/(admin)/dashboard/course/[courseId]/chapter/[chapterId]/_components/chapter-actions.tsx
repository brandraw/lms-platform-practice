"use client";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
  courseId: string;
  chapterId: string;
  isPublished: boolean;
  isCompleted: boolean;
}

export const ChapterActions = ({
  courseId,
  chapterId,
  isPublished,
  isCompleted,
}: ChapterActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/course/${courseId}/chapter/${chapterId}`);
      toast.success("삭제 성공!");
      router.push(`/dashboard/course/${courseId}`);
      router.refresh();
    } catch {
      toast.error("실패!");
    } finally {
      setIsLoading(false);
    }
  };

  const onPublish = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(
          `/api/course/${courseId}/chapter/${chapterId}/unpublish`
        );
        toast.success("비공개 완료");
      } else {
        await axios.patch(
          `/api/course/${courseId}/chapter/${chapterId}/publish`
        );

        toast.success("공개 완료");
      }

      router.refresh();
    } catch {
      toast.error("실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        onClick={onPublish}
        disabled={!isCompleted || isLoading}
      >
        {isPublished ? "비공개하기" : "공개하기"}
      </Button>
      <Modal onAction={onDelete}>
        <Button size="icon" disabled={isLoading}>
          <Trash className="size-5" />
        </Button>
      </Modal>
    </div>
  );
};
