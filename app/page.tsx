"use client";

import { useEffect, useState, useCallback, ChangeEvent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

type City = {
  cou_name_en: string;
  timezone: string;
  name: string;
};

export default function Home() {
  const [data, setData] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [orderby, setOrderby] = useState("name");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTimezon, setSelectedTimezon] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const loadCities = useCallback(async () => {
    console.log("loadcities");
    const offset = page * 20;
    try {
      setLoading(true);
      let url = "";
      if (debouncedSearch !== "") {
        const encoded = encodeURIComponent(`%${debouncedSearch}%`);
        url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset=${offset}&order_by=${orderby}&where=name like "${encoded}"`;
      } else {
        url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset=${offset}&order_by=${orderby}`;
      }

      if (selectedCountries.length > 0) {
        const countryFilters = selectedCountries
          .map((c) => `refine=cou_name_en%3A%22${encodeURIComponent(c)}%22`)
          .join("&");
        url += `&${countryFilters}`;
      }

      if (selectedTimezon.length > 0) {
        const timezoneFilters = selectedTimezon
          .map((tz) => `refine=timezone%3A%22${encodeURIComponent(tz)}%22`)
          .join("&");
        console.log(timezoneFilters);
        url += `&${timezoneFilters}`;
      }

      const res = await fetch(url);
      console.log(res);
      const json = await res.json();
      const results: City[] = json.results || [];
      console.log(results);
      if (results.length > 0) {
        setData((prev) => (page === 0 ? results : [...prev, ...results]));
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [orderby, page, selectedCountries, selectedTimezon, debouncedSearch]);

  // useEffect(() => {
  //   if (debouncedSearch !== "") {
  //     const encoded = encodeURIComponent(`%${debouncedSearch}%`);
  //     const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset=0&order_by=name&where=name like "${encoded}"`;

  //     console.log("API Call =>", url);
  //     fetch(url)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log("Results:", data.results);
  //       });
  //   }
  // }, [debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setPage(0);
    setData([]);
    setHasMore(true);
  }, [
    selectedCountries,
    selectedTimezon,
    searchTerm,
    orderby,
    debouncedSearch,
  ]);

  useEffect(() => {
    if (hasMore) {
      loadCities();
    }
  }, [orderby, selectedCountries, selectedTimezon, hasMore, debouncedSearch]);

  const filtered = data.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const seenCity = new Set();

  const filteredByCity = data.filter((item) => {
    const tz = item.name.toLowerCase();
    if (seenCity.has(tz)) return false;
    seenCity.add(tz);
    return true;
  });

  // console.log(`Cities ${filteredByCity.length}`);

  const seenCountry = new Set();

  const filteredByCountry = data.filter((item) => {
    const tz = item.cou_name_en.toLowerCase();
    if (seenCountry.has(tz)) return false;
    seenCountry.add(tz);
    return true;
  });

  // console.log(`Country ${filteredByCountry.length}`);

  const seentimezon = new Set();

  const filteredByTimezone = data.filter((item) => {
    const tz = item.timezone.toLowerCase();
    if (seentimezon.has(tz)) return false;
    seentimezon.add(tz);
    return true;
  });

  // console.log(`Timexzon ${filteredByTimezone.length}`);

  const handleSelect = (cityName: string) => {
    setSearchTerm(cityName);
    setShowSuggestions(false);
  };

  // const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setOrderby(event.target.value);
  // };

  const handleFilterSubmit = () => {
    // console.log(filterOpen);
    setFilterOpen(true);
  };

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

  // const handleSearchCity = () => {
  //   if (e.target.checked) {
  //     setSelectedCountries((prev) => [...prev, countryName]);
  //   } else {
  //     setSelectedCountries((prev) =>
  //       prev.filter((name) => name !== countryName)
  //     );
  //   }
  //   setIsDropdownOpen(false);
  // };

  return (
    <div className="text-gray-800 w-full min-h-screen flex justify-center items-start p-6">
      <main className="w-[60rem] h-screen flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex flex-col w-[20rem] relative">
            <input
              type="search"
              placeholder="Search by city name"
              className="border border-amber-500 rounded-sm px-2 py-1"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            />
            {showSuggestions && filtered.length > 0 && (
              <ul className="absolute top-10 w-full max-h-60 overflow-auto bg-white border border-gray-300 shadow-lg z-10">
                {filtered.map((city, idx) => (
                  <li
                    key={idx}
                    className="px-3 py-2 hover:bg-amber-100 cursor-pointer"
                    onClick={() => handleSelect(city.name)}
                  >
                    {city.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-2">
            <button
              className="w-[7rem] bg-gray-100 border border-gray-300 rounded px-2 py-1 cursor-pointer"
              onClick={handleFilterSubmit}
            >
              Filter
            </button>
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
                            setIsSortDropdownOpen(false); // Close dropdown after selection
                          }}
                        />
                        <span>{option}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* <select
              id="orders"
              value={orderby}
              onChange={handleChange}
              className="w-[7rem] bg-gray-100 border border-gray-300 rounded px-2 py-1"
            >
              <option value="name">name</option>
              <option value="timezone">timezone</option>
              <option value="cou_name_en">coutnry</option>
            </select> */}
          </div>
        </div>
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
                            checked={selectedCountries.includes(
                              item.cou_name_en
                            )}
                            onChange={(e) =>
                              handleCheckboxChangeForCountry(
                                e,
                                item.cou_name_en
                              )
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
        {loading ? (
          <div className="text-center text-lg text-amber-600 font-semibold py-10">
            Loading cities...
          </div>
        ) : (
          <InfiniteScroll
            dataLength={data.length}
            next={loadCities}
            hasMore={hasMore}
            loader={
              <div className="text-center text-sm text-amber-600 py-4">
                Loading more cities...
              </div>
            }
            endMessage={
              <p className="text-center font-medium text-gray-600">
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <table className="border-collapse border border-gray-400 h-screen w-full">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Country</th>
                  <th className="border border-gray-300 px-4 py-2">Timezone</th>
                  <th className="border border-gray-300 px-4 py-2">City</th>
                </tr>
              </thead>
              <tbody>
                {filteredByCity.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.cou_name_en}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.timezone}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <a
                        href={`/weather/${encodeURIComponent(item.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {item.name}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </InfiniteScroll>
        )}
      </main>
    </div>
  );
}
