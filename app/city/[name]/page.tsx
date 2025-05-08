"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchWeatherByCity } from "../../lib/weatherService";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type WeatherData = {
  name: string;
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
  temp_min: number;
  temp_max: number;
};

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

export default function CityDetailsPage() {
  const params = useParams();
  const city = decodeURIComponent(params.name as string);

  const [weatherInfo, setWeatherInfo] = useState<WeatherData | null>(null);
  const [weatherData, setWeatherData] = useState<{
    [key: string]: WeatherData;
  }>({});

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherDetails = await fetchWeatherByCity(city);
        setWeatherInfo(weatherDetails);
      } catch (err) {
        console.error("Weather API Error:", err);
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city]);

  useEffect(() => {
    cities.forEach((city) => {
      fetchWeatherByCity(city)
        .then((data) => setWeatherData((prev) => ({ ...prev, [city]: data })))
        .catch(console.error);
    });
  }, []);

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

  const url = `https://openweathermap.org/img/wn/${weatherInfo?.icon}@2x.png`;

  const containerStyle = {
    width: "100%",
    height: "20rem",
  };

  const center = {
    lat: weatherInfo?.lat ?? 0,
    lng: weatherInfo?.lon ?? 0,
  };

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
                  {weatherInfo.name}, {weatherInfo.country}
                </strong>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-4">
                <Image src={url} alt="weather icon" width={50} height={50} />

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
          <div className="w-[30rem]">
            <LoadScript
              googleMapsApiKey={"AIzaSyA3gd1Jhq-5xo7IvZ_dCn9fiiLEefSiR6M"}
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
        <div>
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
                    {(weatherData[city]?.temp_max - 273.15).toFixed() ??
                      "Loading..."}
                  </td>
                  <td className="border p-2">
                    {(weatherData[city]?.temp_min - 273.15).toFixed() ??
                      "Loading..."}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
