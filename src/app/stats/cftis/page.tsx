"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

// Dynamic imports for sub-pages


const options = ["IITs", "NITs", "IIITs", "CFTIs"];

const colleges = [
  "IIT Bombay",
  "IIT Delhi",
  "IIT Madras",
  "IIT Kanpur",
  "IIT Kharagpur",
  "IIT Roorkee",
  "NIT Trichy",
  "NIT Surathkal",
  "IIIT Hyderabad",
  "IIT BHU",
];

function formatCollegeName(name: string) {
  return name.toLowerCase().replace(/\s+/g, "_");
}

export default function StatsPage() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length > 0) {
      const filtered = colleges.filter((college) =>
        college.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (college: string) => {
    const formatted = formatCollegeName(college);
    router.push(`/stats/iits/${formatted}`);
    setSearch("");
    setSuggestions([]);
  };

  // const renderSelectedComponent = () => {
  //   switch (selectedType) {
  //     case "IITs":
  //       return <IitsPage />;
  //     case "NITs":
  //       return <NitsPage />;
  //     case "IIITs":
  //       return <IiitsPage />;
  //     case "CFTIs":
  //       return <CftisPage />;
  //     default:
  //       return null;
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-br from-blue-50 to-white">
      {/* 🔍 Search College */}
      <h2 className="text-3xl font-semibold text-blue-900 mt-10 mb-4">Search College</h2>
      <div className="relative w-full max-w-md mb-10">
        <input
          type="text"
          placeholder="Search your college..."
          value={search}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-md max-h-60 overflow-y-auto">
            {suggestions.map((college) => (
              <li
                key={college}
                onClick={() => handleSelect(college)}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
              >
                {college}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🏫 Select Institution Type */}
      <h2 className="text-3xl font-semibold text-blue-900 mb-6">Select Your Institution Type</h2>
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {options.map((option) => (
          <Button
            key={option}
            className={`bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg ${
              selectedType === option ? "ring-4 ring-blue-300" : ""
            }`}
            onClick={() => setSelectedType(option)}
          >
            {option}
          </Button>
        ))}
      </div>

      {/* ⬇️ Render selected institution page */}
      {/* <div className="w-full max-w-7xl">
        {renderSelectedComponent()}
      </div> */}
    </div>
  );
}
