import { City } from "@/type/types";

interface LoadCitiesType {
  orderby: string;
  page: number;
  selectedCountries: string[];
  selectedCities: string[];
  debouncedSearch: string;
  selectedTimezon: string;
  setData: React.Dispatch<React.SetStateAction<City[]>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const loadCities = async ({
  orderby,
  page,
  selectedCountries,
  selectedCities,
  debouncedSearch,
  selectedTimezon,
  setData,
  setPage,
  setHasMore,
  setLoading,
}: LoadCitiesType) => {
  const offsets = 0;
  const orderBy = "population DESC";
  const offset = page * 20;
  if (orderby == "country") {
    orderby = "cou_name_en";
  }
  //   console.log(orderby);
  try {
    setLoading(true);
    let url = "";

    if (debouncedSearch !== "") {
      const encoded = encodeURIComponent(`%${debouncedSearch}%`);
      url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset=${offset}&order_by=${orderby}&where=name like "${encoded}"`;
    }
    if (selectedCities.length > 0) {
      console.log(selectedCities.length);
      const where = selectedCities
        .map((city) => `ascii_name="${city}"`)
        .join(" OR ");

      url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset=${offsets}&order_by=${encodeURIComponent(
        orderBy
      )}&where=${encodeURIComponent(where)}`;
    } else {
      url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset=${offset}&order_by=${orderby}`;
    }

    if (selectedCountries.length > 0) {
      const countryFilters = selectedCountries
        .map((c) => `refine=cou_name_en%3A%22${encodeURIComponent(c)}%22`)
        .join("&");
      url += `&${countryFilters}`;
    }

    if (selectedTimezon) {
      const timezoneFilters = `refine=timezone%3A%22${encodeURIComponent(
        selectedTimezon
      )}%22`;

      url += `&${timezoneFilters}`;
    }

    // if (selectedCities.length > 0) {
    //   const where = selectedCities
    //     .map((city) => `ascii_name="${city}"`)
    //     .join(" OR ");

    //   url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset=${offsets}&order_by=${encodeURIComponent(
    //     orderBy
    //   )}&where=${encodeURIComponent(where)}`;

    //   console.log(`url ${url}`);
    // }

    // // console.log(url);

    const res = await fetch(url);
    const json = await res.json();
    const results: City[] = json.results || [];

    if (results.length > 0) {
      setData((prev) => (page === 0 ? results : [...prev, ...results]));
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
