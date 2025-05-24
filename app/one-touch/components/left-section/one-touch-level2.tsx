import React from "react";

interface Level2Item {
  _id?: string;
  image: string;
  description: string;
  productName: string;
}

interface OneTouchLevel2Props {
  selectedItem: { level2: Level2Item[] } | null;
  setSelectedItem: (item: any) => void;
  setCurrentIndex: (index: number) => void;
}

function OneTouchLevel2({
  selectedItem,
  setSelectedItem,
  setCurrentIndex,
}: OneTouchLevel2Props) {
  return (
    <div className="w-full max-h-screen flex flex-col bg-red-300">
      <button
        className="self-start mb-4 px-4 py-2 bg-gray-200 rounded"
        onClick={() => {
          setSelectedItem(null), setCurrentIndex(1);
        }}
      >
        กลับ
      </button>
      <h2 className="text-3xl text-center mb-4">Level 2</h2>
      <div className="grid grid-cols-5 gap-4">
        {selectedItem?.level2.map((lv2: any, idx: number) => (
          <div
            key={lv2._id || idx}
            className="w-[8.621vw] h-[20.139vh] bg-white shadow-sm rounded-[2.778vh] p-2 flex flex-col items-center border border-gray-200 gap-2"
          >
            <div className="w-[6.897vw] h-[11.111vh]">
              <img
                src={lv2.image}
                alt={''}
                className="w-full h-full object-cover rounded-[2.778vh]"
              />
            </div>
            <h3 className="text-xs text-center">{lv2.productName}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OneTouchLevel2;
