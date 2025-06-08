"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const iitsData = [
{
name: "IIT Bombay",
nirfRank: 3,
photo: "https://upload.wikimedia.org/wikipedia/en/8/89/IIT_Bombay_Logo.svg",
},
{
name: "IIT Delhi",
nirfRank: 2,
photo: "https://upload.wikimedia.org/wikipedia/en/1/13/IIT_Delhi_Logo.svg",
},
{
name: "IIT Madras",
nirfRank: 1,
photo: "https://upload.wikimedia.org/wikipedia/en/9/95/IIT_Madras_Logo.svg",
},
{
name: "IIT Kanpur",
nirfRank: 4,
photo: "https://upload.wikimedia.org/wikipedia/en/e/e1/IIT_Kanpur_Logo.svg",
},
{
name: "IIT Kharagpur",
nirfRank: 5,
photo: "https://upload.wikimedia.org/wikipedia/en/0/07/IIT_Kharagpur_Logo.svg",
},
{
name: "IIT Roorkee",
nirfRank: 6,
photo: "https://upload.wikimedia.org/wikipedia/en/6/68/IIT_Roorkee_Logo.svg",
},
];

export default function IitsPage() {
const [searchTerm, setSearchTerm] = useState("");
const [compareMode, setCompareMode] = useState(false);
const [selectedIits, setSelectedIits] = useState<string[]>([]);
const router = useRouter();

const filteredIits = iitsData.filter((iit) =>
iit.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const toggleSelection = (name: string) => {
if (selectedIits.includes(name)) {
setSelectedIits(selectedIits.filter((n) => n !== name));
} else if (selectedIits.length < 4) {
setSelectedIits([...selectedIits, name]);
}
};

const handleCompare = () => {
if (selectedIits.length >= 2 && selectedIits.length <= 4) {
router.push(`/compare-iits?iits=${encodeURIComponent(selectedIits.join(","))}`);
}
};

return (
<div className="min-h-screen bg-gray-50 p-6">
{/* Top bar */}
<div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
<button
className="bg-gray-200 px-4 py-2 rounded-md text-sm font-medium"
onClick={() => {
setCompareMode(!compareMode);
setSelectedIits([]);
}}
>
{compareMode ? "Cancel Compare" : "Compare"}
</button>
    <input
      type="text"
      placeholder="Search IIT..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-64 border border-gray-300 rounded-full pl-4 pr-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
    />
  </div>

  {/* Show Compare button */}
  {compareMode && selectedIits.length >= 2 && selectedIits.length <= 4 && (
    <div className="text-center mb-6">
      <button
        className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-indigo-700 transition"
        onClick={handleCompare}
      >
        Click to Compare
      </button>
    </div>
  )}

  {/* Grid */}
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
    {filteredIits.map((iit) => {
      const selected = selectedIits.includes(iit.name);
      return (
        <motion.div
          key={iit.name}
          className={`relative bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transition-shadow duration-300 ${
            compareMode ? "cursor-pointer" : "cursor-default"
          } ${selected ? "border-4 border-green-500" : ""}`}
          whileHover={compareMode ? { scale: 1.05 } : {}}
          onClick={() => {
            if (!compareMode) router.push(`/placement-stats/${encodeURIComponent(iit.name)}`);
          }}
        >
          {compareMode && (
            <input
              type="checkbox"
              checked={selected}
              onChange={() => toggleSelection(iit.name)}
              className="absolute top-2 left-2 w-5 h-5 accent-indigo-600"
            />
          )}
          <img
            src={iit.photo}
            alt={`${iit.name} logo`}
            className="w-32 h-32 object-contain mb-4"
            loading="lazy"
          />
          <h3 className="text-xl font-light mb-1">{iit.name}</h3>
          <p className="text-indigo-600 font-medium">NIRF Rank: {iit.nirfRank}</p>
        </motion.div>
      );
    })}
  </div>
</div>
);
}