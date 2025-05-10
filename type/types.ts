export interface City {
  cou_name_en: string;
  timezone: string;
  name: string;
}

export interface WeatherData {
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
}

export interface Table {
  dataLenth: number;
  loadCities: VoidFunction;
  hasMore: boolean;
  filteredByCity: City[];
}

export interface Search {
  data: City[];
  showSuggestions: boolean;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FilterType {
  filterOpen: boolean;
  selectedCountries: string[];
  setSelectedCountries: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedTimezon: React.Dispatch<React.SetStateAction<string>>;
}
