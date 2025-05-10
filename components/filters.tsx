import { City } from "@/type/city";
import { ChangeEvent } from "react";

interface FilterType {
  filterOpen: boolean;
  selectedCountries: string[];
  selectedTimezon: string[];
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: City[];
  setSelectedCountries: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedTimezon: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Filter = ({
  filterOpen,
  setIsDropdownOpen,
  selectedCountries,
  selectedTimezon,
  isDropdownOpen,
  data,
  setSelectedCountries,
  setSelectedTimezon,
}: FilterType) => {
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
    setIsDropdownOpen(false);
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
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-end justify-end">
      {filterOpen ? (
        <div className="flex gap-2">
          <div className="relative w-[15rem]">
            {/* Select-like Button */}
            <button
              type="button"
              className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2 text-left"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              {selectedCountries.length > 0
                ? selectedCountries.join(", ")
                : "Select country"}
            </button>

            {/* Dropdown List */}
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow">
                {filteredByCountry.map((item, index) => (
                  <div key={index} className="px-4 py-2 hover:bg-gray-50">
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
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
              className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2 text-left"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              {selectedTimezon.length > 0
                ? selectedTimezon.join(", ")
                : "Select Timezone"}
            </button>

            {/* Dropdown List */}
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow">
                {filteredByTimezone.map((item, index) => (
                  <div key={index} className="px-4 py-2 hover:bg-gray-50">
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
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
