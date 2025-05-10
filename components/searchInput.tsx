import { Search } from "@/type/types";

export const SearchInput = ({
  data,
  showSuggestions,
  searchTerm,
  setSearchTerm,
  setShowSuggestions,
}: Search) => {
  const filtered = data.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (cityName: string) => {
    setSearchTerm(cityName);
    setShowSuggestions(false);
  };
  return (
    <div className="flex flex-col relative">
      <div className="border border-orange rounded-sm">
        <input
          type="search"
          placeholder="Search by city name"
          className="px-2 py-1 rounded-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />
      </div>
      {showSuggestions && filtered.length > 0 && (
        <ul className="absolute top-10  max-h-60 overflow-auto bg-white border border-gray-300 shadow-lg z-10">
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
  );
};
