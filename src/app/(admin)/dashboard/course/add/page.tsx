"use client";

import { addCourse } from "@/app/(admin)/_actions/course-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormState } from "react-dom";

export default function AddCourse() {
  const [state, action] = useFormState(addCourse, null);

  return (
    <div className="p-5">
      <form action={action} className="space-y-3">
        <Input name="title" type="text" placeholder="강의명을 입력해주세요." />
        <div className="text-sm text-red-500">{state?.errors.title}</div>
        <Button>가보자!</Button>
      </form>
    </div>
  );
}
