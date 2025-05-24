import Image from "next/image";
import React from "react";

function Header() {
  return (
    <div className="relative top-2 w-[6vw] h-[7vh] bg-white py-[1.389vh] px-4 rounded-r-3xl">
      <img
        src="/assets/icons/Logo_POS.png"
        alt="logo"
        className="w-full h-full"
      />
    </div>
  );
}

export default Header;
