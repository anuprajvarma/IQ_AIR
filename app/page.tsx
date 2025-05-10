"use client";

import { useEffect, useState } from "react";
import { InfiniteTablePage } from "@/components/tables";
import { City } from "@/type/city";
import { Loading } from "@/components/loading";
import { loadCities } from "@/services/getCities";
import { Filter } from "@/components/filters";

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);

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
      loadCities({
        orderby,
        page,
        selectedCountries,
        debouncedSearch,
        selectedTimezon,
        setData,
        setPage,
        setHasMore,
        setLoading,
      });
    }
  }, [debouncedSearch, selectedCountries, selectedTimezon, orderby, hasMore]);

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

  const handleSelect = (cityName: string) => {
    setSearchTerm(cityName);
    setShowSuggestions(false);
  };

  const handleFilterSubmit = () => {
    setFilterOpen(true);
  };

  return (
    <div className="text-gray-800 w-full min-h-screen flex justify-center items-start p-6">
      <main className="w-[60rem] h-screen flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex flex-col w-[20rem] relative">
            <input
              type="search"
              placeholder="Search by city name"
              className="border border-orange rounded-sm px-2 py-1"
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
          </div>
        </div>
        <Filter
          filterOpen={filterOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          selectedCountries={selectedCountries}
          selectedTimezon={selectedTimezon}
          isDropdownOpen={isDropdownOpen}
          data={data}
          setSelectedCountries={setSelectedCountries}
          setSelectedTimezon={setSelectedTimezon}
        />

        {loading ? (
          <Loading name="Cities" />
        ) : (
          <InfiniteTablePage
            dataLenth={data.length}
            loadCities={() =>
              loadCities({
                orderby,
                page,
                selectedCountries,
                debouncedSearch,
                selectedTimezon,
                setData,
                setPage,
                setHasMore,
                setLoading,
              })
            }
            hasMore={hasMore}
            filteredByCity={filteredByCity}
          />
        )}
      </main>
    </div>
  );
}
