"use client";

import { useEffect, useState } from "react";
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

  const loadCities = async () => {
    const offset = page * 20;

    try {
      const res = await fetch(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset=${offset}&order_by=name`
      );
      const json = await res.json();
      const results: City[] = json.results || [];

      if (results.length > 0) {
        setData((prev) => [...prev, ...results]);
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
  };

  useEffect(() => {
    loadCities();
  }, []);

  const filtered = data.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (cityName: string) => {
    setSearchTerm(cityName);
    setShowSuggestions(false);
  };

  return (
    <div className="text-gray-800 w-full min-h-screen flex justify-center items-start p-6">
      <main className="w-[60rem] flex flex-col gap-4">
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
            <table className="border-collapse border border-gray-400 w-full">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Country</th>
                  <th className="border border-gray-300 px-4 py-2">Timezone</th>
                  <th className="border border-gray-300 px-4 py-2">City</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, index) => (
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
