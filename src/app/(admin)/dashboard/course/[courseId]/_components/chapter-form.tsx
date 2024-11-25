"use client";

import axios from "axios";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ChaptersList } from "./chapters-list";

const formSchema = z.object({
  title: z.string().min(1),
});

interface FormProps {
  initialData: Course & {
    chapters: Chapter[];
  };
  courseId: string;
}

export function ChapterForm({ initialData, courseId }: FormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const toggleCreate = () => setIsCreating((c) => !c);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      await axios.post(`/api/course/${courseId}/chapter`, values);
      form.reset();
      setIsCreating(false);
      toast.success("업데이트 완료!");
      router.refresh();
    } catch (error) {
      toast.error("업데이트 실패");
    }
  };

  const onReordered = async (
    updateData: { id: string; position: number }[]
  ) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/course/${courseId}/chapter/reorder`, {
        list: updateData,
      });
      toast.success("순서 변경 완료");
      router.refresh();
    } catch {
      toast.error("실패!");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/dashboard/course/${courseId}/chapter/${id}`);
  };

  return (
    <div className="flex flex-col p-5 border rounded-md bg-white gap-3 shadow-sm relative">
      {isUpdating && (
        <div className="absolute w-full h-full left-0 top-0 bg-slate-500/20 flex items-center justify-center cursor-not-allowed">
          <Loader2 className="size-8 animate-spin text-slate-600" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">강의 챕터</div>
        <Button variant="ghost" onClick={toggleCreate}>
          {isCreating ? (
            <>취소</>
          ) : (
            <>
              <PlusCircle className="size-4" />
              추가
            </>
          )}
        </Button>
      </div>
      <div>
        {isCreating && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 mb-4"
            >
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="강의 챕터 입력"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting || !isValid}>
                만들기
              </Button>
            </form>
          </Form>
        )}
        {!isCreating && (
          <>
            {!initialData.chapters.length && (
              <div className="text-xs text-muted-foreground italic">
                챕터가 없어요
              </div>
            )}
          </>
        )}
        {initialData.chapters.length > 0 && (
          <ChaptersList
            items={initialData.chapters || []}
            onEdit={onEdit}
            onReordered={onReordered}
          />
        )}
        <div className="text-xs text-slate-500 mt-4">
          드래그하여 순서를 변경할 수 있어요
        </div>
      </div>
    </div>
  );
}
