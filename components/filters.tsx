import { FilterType } from "@/type/types";
import { ChangeEvent, useState } from "react";

export const Filter = ({
  filterOpen,
  selectedCountries,
  selectedTimezon,
  data,
  setSelectedCountries,
  setSelectedTimezon,
}: FilterType) => {
  const [isDropdownOpenCountry, setIsDropdownOpenCountry] = useState(false);
  const [isDropdownOpenTimeZone, setIsDropdownOpenTimeZone] = useState(false);
  const seenCountry = new Set();

  const filteredByCountry = data.filter((item) => {
    const tz = item.cou_name_en?.toLowerCase();
    if (seenCountry.has(tz)) return false;
    seenCountry.add(tz);
    return true;
  });

  const seentimezon = new Set();

  const filteredByTimezone = data.filter((item) => {
    const tz = item.timezone.toLowerCase();
    if (seentimezon.has(tz)) return false;
    seentimezon.add(tz);
    return true;
  });

  const handleCheckboxChangeForCountry = (
    e: ChangeEvent<HTMLInputElement>,
    countryName: string
  ) => {
    if (e.target.checked) {
      setSelectedCountries((prev) => [...prev, countryName]);
    } else {
      setSelectedCountries((prev) =>
        prev.filter((name) => name !== countryName)
      );
    }
    setIsDropdownOpenCountry(false);
  };

  const handleCheckboxChangeForTimezone = (
    e: ChangeEvent<HTMLInputElement>,
    timeZone: string
  ) => {
    if (e.target.checked) {
      setSelectedTimezon((prev) => [...prev, timeZone]);
    } else {
      setSelectedTimezon((prev) =>
        prev.filter((timezone) => timezone !== timeZone)
      );
    }
    setIsDropdownOpenTimeZone(false);
  };

  const handleDropDown = (name: string, r: boolean) => {
    if (name === "country") {
      setIsDropdownOpenCountry(!r);
    } else {
      setIsDropdownOpenTimeZone(!r);
    }
  };

  return (
    <div className="flex items-end justify-end">
      {filterOpen ? (
        <div className="flex gap-2">
          <div className="relative w-[15rem]">
            {/* Select-like Button */}
            <button
              type="button"
              className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2 text-left cursor-pointer"
              onClick={() => handleDropDown("country", isDropdownOpenCountry)}
            >
              {selectedCountries.length > 0
                ? selectedCountries.join(", ")
                : "Select country"}
            </button>

            {/* Dropdown List */}
            {isDropdownOpenCountry && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow">
                {filteredByCountry.map((item, index) => (
                  <div key={index} className="px-4 py-2 hover:bg-gray-50">
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`country-${index}`}
                        name="country"
                        value={item.cou_name_en}
                        checked={selectedCountries.includes(item.cou_name_en)}
                        onChange={(e) =>
                          handleCheckboxChangeForCountry(e, item.cou_name_en)
                        }
                      />
                      <span>{item.cou_name_en}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative w-[15rem]">
            {/* Select-like Button */}
            <button
              type="button"
              className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2 text-left cursor-pointer"
              onClick={() => handleDropDown("timezone", isDropdownOpenTimeZone)}
            >
              {selectedTimezon.length > 0
                ? selectedTimezon.join(", ")
                : "Select Timezone"}
            </button>

            {/* Dropdown List */}
            {isDropdownOpenTimeZone && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow">
                {filteredByTimezone.map((item, index) => (
                  <div key={index} className="px-4 py-2 hover:bg-gray-50">
                    <label className="inline-flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        id={`timezon-${index}`}
                        name="timezon"
                        value={item.timezone}
                        checked={selectedTimezon.includes(item.timezone)}
                        onChange={(e) =>
                          handleCheckboxChangeForTimezone(e, item.timezone)
                        }
                      />
                      <span>{item.timezone}</span>
                    </label>
                  </div>
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
