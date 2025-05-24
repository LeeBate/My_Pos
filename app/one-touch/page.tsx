// app/page.tsx

import LeftSection from "./components/left-section";
import RightSection from "./components/right-section";

export default function OneTouch() {
  return (
    <div className="w-full h-screen flex overflow-hidden">
      {/* Left section */}
      <div className="w-[55%] h-full pt-0 px-4 pb-4 overflow-hidden">
        <LeftSection />
      </div>

      {/* Right section */}
      <div className="w-[45%] h-screen bg-white absolute right-0 top-0">
        <RightSection />
      </div>
    </div>
  );
}
