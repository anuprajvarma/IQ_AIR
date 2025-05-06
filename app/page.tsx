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

  const loadCities = async () => {
    const offset = page * 10;

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

  return (
    <div className="text-gray-800 w-full min-h-screen flex justify-center items-start p-6">
      <main className="w-[60rem] flex flex-col gap-4">
        <div className="flex gap-2 items-center mt-4">
          <input
            type="search"
            placeholder="Search by city name"
            className="border border-amber-500 w-[20rem] rounded-sm px-2 py-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            list="autocomplete"
          />
          <datalist id="autocomplete">
            {filtered.slice(0, 10).map((city, idx) => (
              <option key={idx} value={city.name} />
            ))}
          </datalist>
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
              <p style={{ textAlign: "center" }}>
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
