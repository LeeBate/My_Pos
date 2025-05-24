"use client";

import React, { useRef, useState } from "react";
import { OneTouch } from "@/types/onetouch";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // อย่าลืมนำเข้า CSS
import GridPagination from "./pagination";
import type { Swiper as SwiperClass } from "swiper";
type Props = {
  oneTouchInfo: OneTouch[];
};

const LeftSectionClient = ({ oneTouchInfo }: Props) => {
  const itemsize = 10;
  const pagsize = Math.ceil(oneTouchInfo?.length / itemsize);
  const [currentindex, setCurrentindex] = useState(1);

  const swiperRef = useRef<SwiperClass | null>(null);
  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handleBack = () => {
    swiperRef.current?.slidePrev();
  };

  return (
    <div className="w-full max-h-screen flex flex-col ">
      {/* เมนู */}
      <h1 className="text-black text-5xl text-center">เมนู</h1>
      {/* pagination */}
      <GridPagination
        currentPage={currentindex}
        totalPage={pagsize}
        onNext={handleNext}
        onPrev={handleBack}
        disablePrev={currentindex <= 1}
        disableNext={currentindex >= pagsize}
      />

      <Swiper
  spaceBetween={20}
  slidesPerView={1}
  allowTouchMove={true}
  onSwiper={(swiper) => {
    swiperRef.current = swiper;
  }}
  onSlideChange={(swiper) => setCurrentindex(swiper.activeIndex + 1)}
>
  {[...Array(pagsize)].map((_, j) => {
    const items = oneTouchInfo.slice(j * itemsize, (j + 1) * itemsize);
    console.log(`Page ${j + 1}:`, items); // 🔍 log ที่นี่ได้เลย

    return (
      <SwiperSlide key={`page-${j}`}>
        <div className="grid grid-cols-4 xl:grid-cols-5 gap-3 place-items-center">
          {items.map((item) => (
            <div
              key={item._id}
              className="w-[129px] h-[181px] bg-white shadow-sm rounded-[20px] p-4 flex flex-col items-center border border-gray-200"
            >
              <img
                src={item.image}
                alt={item.description}
                className="w-full h-32 object-cover rounded-[20px] mb-2"
              />
              <h2 className="text-xl text-center">{item.description}</h2>
            </div>
          ))}
        </div>
      </SwiperSlide>
    );
  })}
</Swiper>

    </div>
  );
};

export default LeftSectionClient;
