"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";

const slideItems = [
  {
    title: "Wow Amazing",
    desc: "unbelivible",
  },
  {
    title: "Wow Amazing",
    desc: "unbelivible",
  },
  {
    title: "Wow Amazing",
    desc: "unbelivible",
  },
  {
    title: "Wow Amazing",
    desc: "unbelivible",
  },
];

export default function HeroSlider() {
  return (
    <div className="p-5 relative">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        pagination={{
          el: ".custom-pagination",
          type: "fraction",
        }}
        scrollbar={{ draggable: true }}
        loop
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        onSlideChange={() => {
          console.log("slide change");
        }}
        onSwiper={(swiper) => {
          console.log(swiper);
        }}
      >
        {slideItems.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div className="flex flex-col gap-3 min-h-[400px] justify-center bg-slate-100 p-5 relative">
              <h2 className="text-2xl font-semibold">{slide.title}</h2>
              <p>{slide.desc}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="custom-prev size-10 bg-blue-700 rounded-full z-10 absolute left-0 top-[50%] flex"></div>
      <div className="custom-next size-10 bg-blue-700 rounded-full z-10 absolute right-0 top-[50%] flex"></div>
      <div className="custom-pagination"></div>
    </div>
  );
}
