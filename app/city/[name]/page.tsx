"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type WeatherData = {
  temp: number;
  humidity: number;
  pressure: number;
  country: string;
  description: string;
  speed: number;
  dt: number;
  timezone: number;
  lon: number;
  lat: number;
  icon: string;
  feels_like: number;
  visibility: number;
};

export default function CityDetailsPage() {
  const params = useParams();
  const city = decodeURIComponent(params.name as string);

  const [weatherInfo, setWeatherInfo] = useState<WeatherData | null>(null);

  useEffect(() => {
    const apiKey = "367034bec150b66451287d887377c191";
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        );
        const data = await res.json();
        const weatherDetails: WeatherData = {
          temp: data.main.temp,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          country: data.sys.country,
          description: data.weather[0].description,
          speed: data.wind.speed,
          dt: data.dt,
          timezone: data.timezone,
          lon: data.coord.lon,
          lat: data.coord.lat,
          icon: data.weather[0].icon,
          feels_like: data.main.feels_like,
          visibility: data.visibility,
        };
        setWeatherInfo(weatherDetails);
      } catch (err) {
        console.error("Weather API Error:", err);
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city]);

  function getFormattedLocalDateTime(dt: number, timezone: number): string {
    const localUnixTime = dt + timezone;
    const date = new Date(localUnixTime * 1000);

    const day: number = date.getDate(); // No leading zero
    const month: string = date.toLocaleString("default", { month: "short" }); // e.g., "May"

    // 12-hour time formatting
    let hours: number = date.getHours();
    const minutes: string = date.getMinutes().toString().padStart(2, "0");
    const ampm: string = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 => 12

    const formattedTime: string = `${hours}:${minutes}${ampm}`;
    const formattedDate: string = `${month} ${day}, ${formattedTime}`;

    return formattedDate;
  }

  const formatted = getFormattedLocalDateTime(
    weatherInfo?.dt ?? 0,
    weatherInfo?.timezone ?? 0
  );

  if (!weatherInfo) return <div>Loading...</div>;

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="w-[60rem] h-screen p-6">
        <div className="w-full flex gap-2">
          <div className="w-[30rem]">
            <div className="flex flex-col gap-1">
              <p className="text-orange">{formatted}</p>
              <p>
                <strong>
                  {city}, {weatherInfo.country}
                </strong>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-4">
                <p>{weatherInfo.icon}</p>
                <p className="text-2xl">
                  {(weatherInfo.temp - 273.15).toFixed()} °C
                </p>
              </div>
              <h1>
                <strong>
                  Feel like {(weatherInfo.feels_like - 273.15).toFixed(2)} °C,{" "}
                  {weatherInfo.description}
                </strong>{" "}
              </h1>
            </div>
            <div className="flex gap-4 border-l-2 border-orange p-2">
              <div className="flex flex-col">
                <p>
                  Visibility: {(weatherInfo.visibility / 1000).toFixed(1)} km
                </p>
                <p>Humidity: {weatherInfo.humidity}%</p>
              </div>
              <div className="flex flex-col">
                <p>Pressure: {weatherInfo.pressure} hPa</p>
                <p>Wind Speed: {weatherInfo.speed} m/s</p>
              </div>
            </div>
          </div>
          <div className="w-[30rem]">asdf</div>
        </div>
      </div>
    </div>
  );
}
