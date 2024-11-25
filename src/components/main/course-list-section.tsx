"use client";

import { Course } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface SectionProps {
  courses: Course[];
}

export default function CourseListSection({ courses }: SectionProps) {
  return (
    <div className="">
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 3000,
        }}
        loop
        slidesPerView={1.2}
        spaceBetween={10}
        breakpoints={{
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
        style={{
          paddingLeft: "20px",
        }}
      >
        {courses.map((course) => (
          <SwiperSlide key={course.id}>
            <Link href={`/course/${course.id}`} className="flex flex-col gap-3">
              <div className="relative aspect-video bg-slate-100 rounded-lg w-full overflow-hidden">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    fill
                    alt={course.title}
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-slate-100 w-full h-full"></div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <span className="font-semibold">{course.price}</span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
