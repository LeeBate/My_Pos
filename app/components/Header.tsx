import Image from "next/image";
import React from "react";

function Header() {
  return (
    <div className="w-[100px] h-[84px] bg-white py-[10px] px-4 rounded-r-3xl mt-3">
      <Image
        src="/assets/icons/Logo_POS.png"
        alt="logo"
        width={100}
        height={30}
        className="w-full h-full"
      />
    </div>
  );
}

export default Header;
