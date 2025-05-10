export const SortBy = ({
  orderby,
  isSortDropdownOpen,
  setIsSortDropdownOpen,
  setOrderby,
  setFilterOpen,
}: {
  orderby: string;
  isSortDropdownOpen: boolean;
  setIsSortDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderby: React.Dispatch<React.SetStateAction<string>>;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleDropDown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
    setFilterOpen(false);
  };

  return (
    <div className="relative w-[10rem]">
      <button
        type="button"
        className={`w-full border border-gray-300 rounded px-4 py-2 transition duration-200 cursor-pointer text-left ${
          isSortDropdownOpen ? "bg-gray-300" : "bg-gray-100"
        } `}
        onClick={handleDropDown}
      >
        Sort By
      </button>
      {isSortDropdownOpen && (
        <div
          className={`absolute z-10 mt-1 w-full bg-gray-100 border border-gray-300 rounded shadow`}
        >
          {["name", "timezone", "country"].map((option) => (
            <div key={option} className="px-4 py-2 hover:bg-gray-50">
              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="orderby"
                  value={option}
                  className="cursor-pointer"
                  checked={orderby === option}
                  onChange={(e) => {
                    setOrderby(e.target.value);
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
