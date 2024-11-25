"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Course } from "@prisma/client";

interface CourseProps {
  course: Course;
}

export default function CourseDetailForm({ course }: CourseProps) {
  return (
    <form action="" className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="title" className="font-semibold">
          Course Title
        </Label>
        <Input
          name="title"
          id="title"
          defaultValue={course?.title}
          placeholder="title"
        />
      </div>
      <Input
        name="description"
        defaultValue={course?.description || ""}
        placeholder="description"
      />
      <Input
        name="price"
        defaultValue={course?.price || ""}
        placeholder="price"
      />
      <Input
        name="thumbnail"
        defaultValue={course?.thumbnail || ""}
        placeholder="thumbnail"
      />
      <Button>Update</Button>
    </form>
  );
}
