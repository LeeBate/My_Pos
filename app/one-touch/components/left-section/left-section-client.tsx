"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { OneTouch } from "@/types/onetouch";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import GridPagination from "../pagination";
import type { Swiper as SwiperClass } from "swiper";
import OneTouchLevel2 from "./one-touch-level2";

const ITEM_SIZE = 20;

const LeftSectionClient = () => {
  const [oneTouchInfo, setOneTouchInfo] = useState<OneTouch[]>([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [selectedItem, setSelectedItem] = useState<OneTouch | null>(null);
  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    fetch("/api/get-onetouch")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch OneTouch data");
        return res.json();
      })
      .then((data: OneTouch[]) => setOneTouchInfo(data))
      .catch((error) => console.error("Error fetching OneTouch data:", error));
  }, []);

  const pageSize = useMemo(
    () => Math.ceil(oneTouchInfo?.length / ITEM_SIZE),
    [oneTouchInfo?.length]
  );

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  const handleBack = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleItemClick = useCallback((item: OneTouch) => {
    setSelectedItem(item);
  }, []);

  const slides = useMemo(
    () =>
      Array.from({ length: pageSize }, (_, j) => (
        <SwiperSlide key={`page-${j}`}>
          <div className="grid grid-cols-5 gap-4 place-items-center ">
            {oneTouchInfo
              .slice(j * ITEM_SIZE, (j + 1) * ITEM_SIZE)
              .map((item) => (
                <div
                  key={item?._id}
                  onClick={() => handleItemClick(item)}
                  className="w-[9.5vw] h-[17.3vh] bg-white shadow-sm rounded-[2.778vh] px-3 pt-3 flex flex-col items-center gap-2 "
                >
                  <div className="w-[7vw] h-[8.111vh] flex items-center justify-center shadow-sm shadow-black/30 rounded-[1.778vh] ">
                    <img
                      src={item?.image}
                      alt={item?.description}
                      className="w-[40px] h-[40px] object-cover"
                    />
                  </div>

                  <h3 className="text-center text-[1.1vh] md:text-xs">{item?.description}</h3>
                </div>
              ))}
          </div>
        </SwiperSlide>
      )),
    [oneTouchInfo, pageSize]
  );

  return (
    <div className="w-full max-h-screen flex flex-col">
      <h1 className="text-center text-[3.5vw] leading-[1.5]">เมนู</h1>

      {selectedItem && selectedItem?.level2 ? (
        <OneTouchLevel2
          selectedItem={{
            level2: selectedItem.level2.map((item) => ({
              ...item,
              description: item.description ?? item.productName, // fallback if description is missing
            })),
          }}
          setSelectedItem={setSelectedItem}
          setCurrentIndex={setCurrentIndex}
        />
      ) : (
        <>
          <GridPagination
            currentPage={currentIndex}
            totalPage={pageSize}
            onNext={handleNext}
            onPrev={handleBack}
            disablePrev={currentIndex <= 1}
            disableNext={currentIndex >= pageSize}
          />
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            allowTouchMove={true}
            className="w-full flex-1"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex + 1)}
          >
            {slides}
          </Swiper>
        </>
      )}
    </div>
  );
};

export default LeftSectionClient;
