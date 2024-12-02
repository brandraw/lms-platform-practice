import { Chapter } from "@prisma/client";
import Link from "next/link";

interface PurchaseActionsProps {
  isPurchase: boolean;
  courseId: string;
  chapters: Chapter[];
}

export async function PurchaseActions({
  isPurchase,
  courseId,
  chapters,
}: PurchaseActionsProps) {
  const firstChapterId = chapters[0].id;

  return (
    <div className="flex flex-col">
      {true && (
        <Link href={`/course/${courseId}/chapter/${firstChapterId}`}>
          강의보러가기
        </Link>
      )}
      {true && (
        <Link href={`/checkout?courseId=${courseId}`}>결제하러 가기!</Link>
      )}
    </div>
  );
}
