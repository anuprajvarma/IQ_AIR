"use client";

import { useEffect, useState } from "react";
import { InfiniteTablePage } from "@/components/tables";
import { City } from "@/type/city";
import { Loading } from "@/components/loading";
import { loadCities } from "@/services/getCities";
import { Filter } from "@/components/filters";
import { SortBy } from "@/components/sortByButton";
import { SearchInput } from "@/components/searchInput";

export default function Home() {
  const [data, setData] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [orderby, setOrderby] = useState("name");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTimezon, setSelectedTimezon] = useState<string[]>([]);
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

  const seenCity = new Set();

  const filteredByCity = data.filter((item) => {
    const tz = item.name.toLowerCase();
    if (seenCity.has(tz)) return false;
    seenCity.add(tz);
    return true;
  });

  const handleFilterSubmit = () => {
    setFilterOpen(true);
  };

  return (
    <div className="text-gray-800 w-full min-h-screen flex justify-center items-start p-6">
      <main className="w-[60rem] h-screen flex flex-col gap-4">
        <div className="flex justify-between">
          <SearchInput
            data={data}
            showSuggestions={showSuggestions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setShowSuggestions={setShowSuggestions}
          />

          <div className="flex gap-2">
            <button
              className="w-[7rem] bg-gray-100 border border-gray-300 rounded px-2 py-1 cursor-pointer"
              onClick={handleFilterSubmit}
            >
              Filter
            </button>
            <SortBy orderby={orderby} setOrderby={setOrderby} />
          </div>
        </div>
        <Filter
          filterOpen={filterOpen}
          selectedCountries={selectedCountries}
          selectedTimezon={selectedTimezon}
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
