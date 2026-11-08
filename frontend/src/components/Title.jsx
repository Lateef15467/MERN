import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="mb-4 inline-flex items-center justify-center gap-2.5">
      <p className="text-base font-normal tracking-wide text-gray-500 sm:text-lg">
        {text1}
        <span className="ml-1 font-semibold text-gray-800">{text2}</span>
      </p>

      <span className="mt-1 h-[2px] w-8 rounded-full bg-orange-500 sm:w-12" />
    </div>
  );
};

export default Title;
