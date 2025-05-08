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

const apiKey = "367034bec150b66451287d887377c191";

export async function fetchWeatherByCity(city: string) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch weather for ${city}`);
  }
  const data = await response.json();

  const weatherDetails: WeatherData = {
    name: data.name,
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
    temp_min: data.main.temp_min,
    temp_max: data.main.temp_max,
  };
  return weatherDetails;
}
