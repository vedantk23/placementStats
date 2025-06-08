"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import collegesDataRaw from "data/colleges.json";
import PlacementStatsRenderer from "../stats/placementStats/PlacementStatsRenderer";

type College = {
  name: string;
};

const collegesData: Record<string, College> = collegesDataRaw as Record<string, College>;

export default function PlacementStatsSearchPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCollegeKey, setSelectedCollegeKey] = useState<string | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const collegeKeys = Object.keys(collegesData);
  const collegeNames = collegeKeys.map((key) => ({ key, name: collegesData[key]?.name || key }));

  useEffect(() => {
    
      const stored = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      if (Array.isArray(stored)) setRecentSearches(stored);
    
  }, []);

  const updateRecentSearches = (collegeKey: string) => {
    let updated = [...recentSearches.filter((k) => k !== collegeKey)];
    updated.unshift(collegeKey);
    updated = updated.slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSelect = (collegeKey: string) => {
    const college = collegesData[collegeKey];
    if (!college) return;

    updateRecentSearches(collegeKey);
    setSelectedCollegeKey(collegeKey);
    setQuery(college.name);
    setFiltered([]);

    setTimeout(() => {
      statsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedCollegeKey(null);
    setFiltered(
      val
        ? collegeNames
            .filter((c) => c.name?.toLowerCase().includes(val.toLowerCase()))
            .map((c) => c.key)
        : []
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < filtered.length) {
      handleSelect(filtered[selectedIndex]);
    }
  };

  const clearSearch = (key: string) => {
    const updated = recentSearches.filter((item) => item !== key);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    if (selectedCollegeKey === key) {
      setSelectedCollegeKey(null);
      setQuery("");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start px-4 pt-32">
      {/* Fixed Search Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-transparent px-4 py-4">
        <div className="w-full max-w-xl mx-auto relative">
          <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            placeholder="Search IITs, NITs, IIITs..."
            className="w-full pl-11 pr-5 py-3 rounded-xl border border-gray-300 shadow-md text-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            autoComplete="off"
          />
          {(isFocused || query) && filtered.length > 0 && (
            <ul className="absolute z-50 top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {filtered.map((key, idx) => {
                const college = collegesData[key];
                return (
                  <li
                    key={key}
                    onClick={() => handleSelect(key)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      window.open(`/stats/placementStats?college=${key}`, "_blank");
                    }}
                    className={`px-5 py-3 text-sm cursor-pointer transition-all ${
                      idx === selectedIndex ? "bg-indigo-100 scale-[1.01] shadow-sm" : "hover:bg-gray-100"
                    }`}
                  >
                    {college?.name || key}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="w-full max-w-xl mt-4">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">Recent Searches</h4>
          <ul className="flex flex-wrap gap-3">
            {recentSearches.map((key) => {
              const collegeName = collegesData[key]?.name || key;
              return (
                <li
                  key={key}
                  className="flex items-center bg-gray-200 text-md rounded-full px-5 py-2 cursor-pointer hover:bg-gray-300 transition shadow-sm"
                  onClick={() => handleSelect(key)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    window.open(`/stats/placementStats?college=${key}`, "_blank");
                  }}
                >
                  {collegeName}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSearch(key);
                    }}
                    className="ml-2 text-sm text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Placement Stats */}
      {selectedCollegeKey && (
        <div ref={statsRef} className="w-full mt-4 px-4 max-w-7xl">
          <PlacementStatsRenderer collegeKey={selectedCollegeKey} />
          <p className="mt-4 text-center text-sm text-gray-600 italic">
            *Click on table to get previous year stats.
          </p>
        </div>
      )}
    </div>
  );
}
