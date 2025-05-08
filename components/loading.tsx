import React from "react";

export const Loading = ({ name }: { name: string }) => {
  return (
    <div className="text-center text-lg text-orange font-semibold py-10">
      Loading {name}...
    </div>
  );
};
