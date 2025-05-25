"use client";

import React from "react";
import Image from "next/image";
import menuArrowBack from "../../../public/assets/icons/menu-back.png";
import menuArrowGreenBack from "../../../public/assets/icons/menu-green-back.png";
import menuArrowNext from "../../../public/assets/icons/menu-next.png";
import menuArrowGreenNext from "../../../public/assets/icons/menu-green-next.png";

interface GridPaginationProps {
  currentPage: number;
  totalPage: number;
  onNext: () => void;
  onPrev: () => void;
  disableNext: boolean;
  disablePrev: boolean;
}

interface ButtonArrowProps {
  direction: "back" | "next";
  disable?: boolean;
  onPrev: () => void;
  onNext: () => void;
}

function GridPagination({
  currentPage,
  totalPage,
  onNext,
  onPrev,
  disableNext,
  disablePrev,
}: GridPaginationProps) {
  const ButtonArrow = ({
    direction,
    disable = false,
    onPrev,
    onNext,
  }: ButtonArrowProps) => {
    const imgBack = disable ? menuArrowBack : menuArrowGreenBack;
    const imgNext = disable ? menuArrowNext : menuArrowGreenNext;
    const img = direction === "back" ? imgBack : imgNext;

    const onClick = direction === "back" ? onPrev : onNext;

    return (
      <button
        onClick={onClick}
        className={`
          flex items-center justify-center
          rounded-[1.852vh]
          w-[4vw] xl:w-[5.333vw]
          h-[6.667vh] xl:h-[6.926vh]
          transition-none
          shadow-none
          ${
            disable
              ? "bg-gray-100 border border-gray-300 xl:border-2"
              : "bg-white border border-green-800 xl:border-2 border-green-800"
          }
        `}
        style={{
          borderColor: disable ? "#C4C4C4" : "#125C13",
        }}
      >
        <Image
          src={img || "/placeholder.svg"}
          alt={`${direction} arrow`}
          className={`
            h-[2.6vh] w-auto
            ${disable ? "opacity-50" : "opacity-100"}
          `}
        />
      </button>
    );
  };

  return (
    <div className="flex flex-row items-center justify-center w-full gap-2 xl:gap-1 ml-0 py-2">
      <div>
        <ButtonArrow
          direction="back"
          disable={disablePrev}
          onPrev={onPrev}
          onNext={onNext}
        />
      </div>
      <div className="px-1 xl:px-2">
        <p
          className="text-sm xl:text-2xl font-normal xl:font-medium"
          style={{ color: "#666666" }}
        >
          หน้า {currentPage || 1} / {totalPage || 1}
        </p>
      </div>
      <div>
        <ButtonArrow
          direction="next"
          disable={disableNext}
          onPrev={onPrev}
          onNext={onNext}
        />
      </div>
    </div>
  );
}

export default GridPagination;
