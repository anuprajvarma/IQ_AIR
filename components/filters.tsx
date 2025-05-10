import { FilterType } from "@/type/types";
import { ChangeEvent, useState } from "react";
import { allCountries } from "@/type/cities";
import { timeZones } from "@/type/timezone";

export const Filter = ({
  filterOpen,
  selectedCountries,
  setSelectedCountries,
  setSelectedTimezon,
}: FilterType) => {
  const [isDropdownOpenCountry, setIsDropdownOpenCountry] = useState(false);
  const [isDropdownOpenTimeZone, setIsDropdownOpenTimeZone] = useState(false);

  const handleCheckboxChangeForCountry = (
    e: ChangeEvent<HTMLInputElement>,
    countryName: string
  ) => {
    // console.log(e.target.checked);
    if (e.target.checked) {
      setSelectedCountries((prev) => [...prev, countryName]);
    } else {
      setSelectedCountries((prev) =>
        prev.filter((name) => name !== countryName)
      );
    }
  };

  const handleDropDown = (name: string, r: boolean) => {
    if (name === "country") {
      //   console.log(r);
      setIsDropdownOpenCountry(!r);
      if (isDropdownOpenTimeZone === true) {
        setIsDropdownOpenTimeZone(false);
      }
    } else {
      setIsDropdownOpenTimeZone(!r);
      if (isDropdownOpenCountry === true) {
        setIsDropdownOpenCountry(false);
      }
    }
  };

  return (
    <div className="flex items-end justify-end">
      {filterOpen ? (
        <div className="flex gap-2">
          <div className="relative w-[10rem]">
            <div className="flex justify-between bg-gray-100 border border-gray-300 w-full rounded px-4 py-2 text-left cursor-pointer">
              <button
                type="button"
                className="cursor-pointer w-full text-left"
                onClick={() => handleDropDown("country", isDropdownOpenCountry)}
              >
                country{" "}
              </button>

              {!isDropdownOpenCountry ? (
                ""
              ) : (
                <button
                  className="cursor-pointer"
                  onClick={() =>
                    handleDropDown("country", isDropdownOpenCountry)
                  }
                >
                  X
                </button>
              )}
            </div>
            {isDropdownOpenCountry && (
              <div className="absolute z-10 mt-1 w-full max-h-[20rem] overflow-auto bg-white border border-gray-300 rounded shadow">
                {allCountries.map((item, index) => (
                  <div key={index} className="px-4 py-2 hover:bg-gray-50">
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`country-${index}`}
                        name="country"
                        value={item}
                        checked={selectedCountries.includes(item)}
                        onChange={(e) =>
                          handleCheckboxChangeForCountry(e, item)
                        }
                      />
                      <span>{item}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative w-[11rem]">
            <div className="flex justify-between bg-gray-100 border border-gray-300 w-full rounded px-4 py-2 text-left cursor-pointer">
              <button
                type="button"
                className="cursor-pointer w-full text-left"
                onClick={() =>
                  handleDropDown("timezone", isDropdownOpenTimeZone)
                }
              >
                Timezone
              </button>
              {!isDropdownOpenTimeZone ? (
                ""
              ) : (
                <button
                  className="cursor-pointer"
                  onClick={() =>
                    handleDropDown("timezone", isDropdownOpenTimeZone)
                  }
                >
                  X
                </button>
              )}
            </div>

            {isDropdownOpenTimeZone && (
              <div className="absolute z-10 mt-1 w-full max-h-[20rem] overflow-auto bg-white border border-gray-300 rounded shadow">
                {timeZones.map((item, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 hover:bg-gray-50 cursor-pointer text-left"
                    onClick={() => setSelectedTimezon(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
