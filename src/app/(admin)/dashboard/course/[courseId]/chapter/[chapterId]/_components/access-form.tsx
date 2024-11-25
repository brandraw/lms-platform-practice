"use client";

import axios from "axios";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useState } from "react";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

interface FormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

export function AccessForm({ initialData, courseId, chapterId }: FormProps) {
  const [isEditting, setIsEditting] = useState(false);
  const toggleEdit = () => setIsEditting((c) => !c);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!initialData.isFree,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
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
        <div className="text-sm font-semibold">강의 공개 설정</div>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditting ? (
            <>취소</>
          ) : (
            <>
              <Pencil className="size-4" />
              수정
            </>
          )}
        </Button>
      </div>
      <div>
        {isEditting ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                name="isFree"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={field.name}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <label htmlFor={field.name} className="text-sm">
                          체크하면 이 챕터가 무료로 공개됩니다.
                        </label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting || !isValid}>
                저장
              </Button>
            </form>
          </Form>
        ) : (
          <div
            className={cn(
              "text-sm text-slate-800",
              !initialData.isFree && "italic text-slate-500"
            )}
          >
            {!initialData.isFree && "공짜는 없습니다."}
            {initialData.isFree && "무료에요!"}
          </div>
        )}
      </div>
    </div>
  );
}
