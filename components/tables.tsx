import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { City } from "@/type/city";
import { fetchWeatherByCity } from "@/services/getWeather";
import { WeatherData } from "../type/weather";

interface tableType {
  dataLenth: number;
  loadCities: VoidFunction;
  hasMore: boolean;
  filteredByCity: City[];
}

const cities = [
  "Paris",
  "Tokyo",
  "Singapore",
  "Madrid",
  "Rome",
  "Delhi",
  "Barcelona",
  "Berlin",
  "Sydney",
  "London",
  "New York",
];

export const InfiniteTablePage = ({
  dataLenth,
  loadCities,
  hasMore,
  filteredByCity,
}: tableType) => {
  return (
    <InfiniteScroll
      dataLength={dataLenth}
      next={loadCities}
      hasMore={hasMore}
      loader={
        <div className="text-center text-sm text-orange py-4">
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
                  href={`/city/${item.name}`}
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
  );
};

export const WeatherTable = () => {
  const [weatherData, setWeatherData] = useState<{
    [key: string]: WeatherData;
  }>({});

  useEffect(() => {
    cities.forEach((city) => {
      fetchWeatherByCity(city)
        .then((data) => setWeatherData((prev) => ({ ...prev, [city]: data })))
        .catch(console.error);
    });
  }, []);
  return (
    <table className="w-full border mt-4">
      <thead>
        <tr>
          <th className="border p-2">City</th>
          <th className="border p-2">High (°C)</th>
          <th className="border p-2">Low (°C)</th>
        </tr>
      </thead>
      <tbody>
        {cities.map((city) => (
          <tr key={city}>
            <td className="border p-2">{city}</td>
            <td className="border p-2">
              {(weatherData[city]?.temp_max - 273.15).toFixed() ?? "Loading..."}
            </td>
            <td className="border p-2">
              {(weatherData[city]?.temp_min - 273.15).toFixed() ?? "Loading..."}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
