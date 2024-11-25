import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmantForm } from "./_components/attachment-form";
import { ChapterForm } from "./_components/chapter-form";
import { CourseActions } from "./_components/course-actions";

export default async function CourseDetail({
  params,
}: {
  params: { courseId: string };
}) {
  const id = params.courseId;
  if (!id) {
    return redirect("/dashboard/course");
  }
  const course = await db.course.findUnique({
    where: {
      id,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) {
    return redirect("/dashboard/course");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const requiredFields = [
    course.title,
    course.description,
    course.thumbnail,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const completedLegnth = requiredFields.filter(Boolean).length;
  const totalLength = requiredFields.length;
  const completionText = `(${completedLegnth}/${totalLength})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="py-10">
      <div className="max-w-[800px] mx-auto px-5">
        <div className="space-y-4">
          <div className="border p-3 rounded-md text-center">
            {course.isPublished ? "공개된 강의" : "강의 비공개됨"}
          </div>
          <div className="flex items-center justify-between">
            <div>{completionText}</div>
            <CourseActions
              courseId={params.courseId}
              isPublished={course.isPublished}
              isCompleted={isComplete}
            />
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
          <PriceForm initialData={course} courseId={course.id} />
          <AttachmantForm initialData={course} courseId={course.id} />
          <ChapterForm initialData={course} courseId={course.id} />
        </div>
      </div>
    </div>
  );
}
