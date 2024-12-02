import { Progress } from "./ui/progress";

interface CourseProgressProps {
  value: number;
}

export function CourseProgress({ value }: CourseProgressProps) {
  return (
    <div className="space-y-2">
      <Progress value={value} className="h-2" />
      <div className="text-xs font-medium">{Math.round(value)}% 완료</div>
    </div>
  );
}
