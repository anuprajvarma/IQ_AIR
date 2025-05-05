"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

// ✅ Define the type of each city item returned from the API
type City = {
  cou_name_en: string;
  timezone: string;
  name: string;
};

export default function Home() {
  const [data, setData] = useState<City[]>([]); // ✅ Type the state
  // const [filteredData, setFilteredData] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(
      "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&refine=cou_name_en%3A%22India%22&refine=cou_name_en%3A%22Pakistan%22&refine=cou_name_en%3A%22China%22"
    )
      .then((res) => res.json())
      .then((data) => {
        // ✅ Check if data.results exists and is an array
        if (Array.isArray(data.results)) {
          setData(data.results);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // const handleFilter = () => {
  //   const filtered = data.filter((city) =>
  //     city.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredData(filtered);
  // };

  return (
    <div className="text-gray2 w-full">
      <main className="w-[60rem] flex flex-col ">
        <div className="flex gap-2 items-center">
          <input
            type="search"
            name="textSearch"
            placeholder="Search by city name"
            className="border border-amber-500 w-[20rem] rounded-sm px-2 py-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            // onClick={handleFilter}
            className="bg-amber-500 text-white px-4 py-1 rounded-sm hover:bg-amber-600 transition"
          >
            Filter
          </button>
        </div>

        <Table>
          <TableCaption>A list of cities with timezone info.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Country/Region</TableHead>
              <TableHead>Timezone</TableHead>
              <TableHead>City</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.cou_name_en}</TableCell>
                <TableCell>{item.timezone}</TableCell>
                <TableCell>{item.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
