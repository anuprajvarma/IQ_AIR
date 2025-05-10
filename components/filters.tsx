import { FilterType } from "@/type/types";
import { ChangeEvent, useState } from "react";
import { allCountries } from "@/type/countries";
import { timeZones } from "@/type/timezone";

interface CityRecord {
  ascii_name: string;
}

export const Filter = ({
  filterOpen,
  selectedCountries,
  allCities,
  selectedCities,
  setSelectedCountries,
  setAllCities,
  setSelectedCities,
  setSelectedTimezon,
}: FilterType) => {
  const [isDropdownOpenCountry, setIsDropdownOpenCountry] = useState(false);
  const [isDropdownOpenTimeZone, setIsDropdownOpenTimeZone] = useState(false);
  const [isDropdownOpenCity, setIsDropdownOpenCity] = useState(false);

  async function fetchTopCities() {
    const baseUrl =
      "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records";
    const params = new URLSearchParams({
      limit: "100",
      order_by: "population DESC",
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results.map((r: CityRecord) => r.ascii_name);
  }

  (async () => {
    try {
      const top100Cities = await fetchTopCities();
      //   console.log(top100Cities);
      setAllCities(top100Cities);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  })();

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

  const handleCheckboxChangeForCity = (
    e: ChangeEvent<HTMLInputElement>,
    cityName: string
  ) => {
    // console.log(e.target.checked);
    if (e.target.checked) {
      setSelectedCities((prev) => [...prev, cityName]);
    } else {
      setSelectedCities((prev) => prev.filter((name) => name !== cityName));
    }
  };

  const handleDropDown = (name: string, r: boolean) => {
    if (name === "country") {
      setIsDropdownOpenCountry(!r);
      if (isDropdownOpenTimeZone || isDropdownOpenCity) {
        setIsDropdownOpenTimeZone(false);
        setIsDropdownOpenCity(false);
      }
    } else if (name === "city") {
      setIsDropdownOpenCity(!r);
      if (isDropdownOpenTimeZone || isDropdownOpenCountry) {
        setIsDropdownOpenTimeZone(false);
        setIsDropdownOpenCountry(false);
      }
    } else if (name === "timezone") {
      setIsDropdownOpenTimeZone(!r);
      if (isDropdownOpenCountry || isDropdownOpenCity) {
        setIsDropdownOpenCountry(false);
        setIsDropdownOpenCity(false);
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

          <div className="relative w-[11rem]">
            <div className="flex justify-between bg-gray-100 border border-gray-300 w-full rounded px-4 py-2 text-left cursor-pointer">
              <button
                type="button"
                className="cursor-pointer w-full text-left"
                onClick={() => handleDropDown("city", isDropdownOpenCity)}
              >
                City
              </button>
              {!isDropdownOpenCity ? (
                ""
              ) : (
                <button
                  className="cursor-pointer"
                  onClick={() => handleDropDown("city", isDropdownOpenCity)}
                >
                  X
                </button>
              )}
            </div>

            {isDropdownOpenCity && (
              <div className="absolute z-10 mt-1 w-full max-h-[20rem] overflow-auto bg-white border border-gray-300 rounded shadow">
                {allCities.map((item, index) => (
                  <div key={index} className="px-4 py-2 hover:bg-gray-50">
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`country-${index}`}
                        name="country"
                        value={item}
                        checked={selectedCities.includes(item)}
                        onChange={(e) => handleCheckboxChangeForCity(e, item)}
                      />
                      <span>{item}</span>
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
