import { useState } from "react";

export const SortBy = ({
  orderby,
  setOrderby,
}: {
  orderby: string;
  setOrderby: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  return (
    <div className="relative w-[15rem]">
      {/* Select-like Button */}
      <button
        type="button"
        className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2 text-left"
        onClick={() => setIsSortDropdownOpen((prev) => !prev)}
      >
        {orderby ? orderby : "Sort By"}
      </button>

      {/* Dropdown List */}
      {isSortDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow">
          {["name", "timezone", "country"].map((option) => (
            <div key={option} className="px-4 py-2 hover:bg-gray-50">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="orderby"
                  value={option}
                  checked={orderby === option}
                  onChange={(e) => {
                    if (e.target.value === "country") {
                      setOrderby("cou_name_en");
                    } else {
                      setOrderby(e.target.value);
                    }
                    setIsSortDropdownOpen(false);
                  }}
                />
                <span>{option}</span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
