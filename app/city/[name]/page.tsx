"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import { WeatherData } from "@/type/weather";
import { Loading } from "@/components/loading";
import { getFormattedLocalDateTime } from "@/services/getLocalTime";
import { fetchWeatherByCity } from "@/services/getWeather";
import { Map } from "@/components/map";
import { WeatherTable } from "@/components/tables";

export default function CityDetailsPage() {
  const { name } = useParams();
  const city = decodeURIComponent(name as string);

  const [weatherInfo, setWeatherInfo] = useState<WeatherData | null>(null);

  useEffect(() => {
    const getWeather = async () => {
      try {
        const weather = await fetchWeatherByCity(city);
        setWeatherInfo(weather);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      }
    };

    if (city) getWeather();
  }, [city]);

  if (!weatherInfo) return <Loading name="Weather" />;

  const {
    name: cityName,
    country,
    dt,
    timezone,
    icon,
    temp,
    feels_like,
    description,
    visibility,
    humidity,
    pressure,
    speed,
    lat,
    lon,
  } = weatherInfo;

  const formattedDate = getFormattedLocalDateTime(dt, timezone);
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="w-[60rem] h-screen p-6">
        <div className="w-full flex gap-2">
          {/* Weather Details Section */}
          <div className="w-[30rem] flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-orange">{formattedDate}</p>
              <p className="font-semibold">
                {cityName}, {country}
              </p>
            </div>

            <div className="flex gap-4 items-center">
              <Image src={iconUrl} alt="Weather icon" width={50} height={50} />
              <p className="text-2xl">{(temp - 273.15).toFixed()} °C</p>
            </div>

            <h1 className="font-semibold">
              Feels like {(feels_like - 273.15).toFixed(2)} °C, {description}
            </h1>

            <div className="flex gap-4 border-l-2 border-orange p-2">
              <div className="flex flex-col gap-1">
                <p>Visibility: {(visibility / 1000).toFixed(1)} km</p>
                <p>Humidity: {humidity}%</p>
              </div>
              <div className="flex flex-col gap-1">
                <p>Pressure: {pressure} hPa</p>
                <p>Wind Speed: {speed} m/s</p>
              </div>
            </div>
          </div>
          <Map lat={lat} lng={lon} width="100%" height="20rem" />
        </div>
        <WeatherTable />
      </div>
    </div>
  );
}
