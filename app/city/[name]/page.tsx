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

  if (!weatherInfo) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{city} Weather</h1>
      <p>
        <strong>Temperature:</strong> {(weatherInfo.temp - 273.15).toFixed(2)}{" "}
        °C
      </p>
      <p>
        <strong>Humidity:</strong> {weatherInfo.humidity}%
      </p>
      <p>
        <strong>Pressure:</strong> {weatherInfo.pressure} hPa
      </p>
      <p>
        <strong>Country:</strong> {weatherInfo.country}
      </p>
      <p>
        <strong>Description:</strong> {weatherInfo.description}
      </p>
      <p>
        <strong>Wind Speed:</strong> {weatherInfo.speed} m/s
      </p>
    </div>
  );
}
