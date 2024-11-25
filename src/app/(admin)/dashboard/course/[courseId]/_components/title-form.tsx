"use client";

import axios from "axios";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1),
});

interface FormProps {
  initialData: Course;
  courseId: string;
}

export function TitleForm({ initialData, courseId }: FormProps) {
  const [isEditting, setIsEditting] = useState(false);
  const toggleEdit = () => setIsEditting((c) => !c);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

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
        <div className="text-sm font-semibold">강의 제목</div>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditting ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="size-4" />
              Edit
            </>
          )}
        </Button>
      </div>
      <div>
        {isEditting ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="강의 제목 입력"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting || !isValid}>
                저장
              </Button>
            </form>
          </Form>
        ) : (
          <div className="text-sm text-slate-500">{initialData.title}</div>
        )}
      </div>
    </div>
  );
}
