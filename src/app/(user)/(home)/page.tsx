import CourseListSection from "@/components/main/course-list-section";
import HeroSlider from "@/components/main/hero-slider";
import { db } from "@/lib/db";

export default async function Home() {
  const courses = await db.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main>
      <section>
        <HeroSlider />
      </section>
      <section>
        <CourseListSection courses={courses} />
      </section>
      <section>Third</section>
      <section>Fourth</section>
      <section>Fith</section>
    </main>
  );
}
