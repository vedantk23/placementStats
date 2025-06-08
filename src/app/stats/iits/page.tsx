"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export type Program = {
  branch: string;
  highestPackage: number;
  lowestPackage: number;
  medianPackage: number;
  averagePackage: number;
  placementPercentage: number;
  registeredStudent: number;
  placedStudent: number;
  degree: "UG" | "PG"; // make degree required for easier filtering
};

export type Iit = {
  name: string;
  nirfRank: number;
  qsWorldRanking: number;
  photo: string;
  UG: Omit<Program, "degree">[]; // original data doesn't have degree
  PG: Omit<Program, "degree">[];
};

export default function IitsPage() {
  const [iitsData, setIitsData] = useState<Iit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDegree, setSelectedDegree] = useState<"" | "UG" | "PG">("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedFilterOption, setSelectedFilterOption] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/iits");
      const data: Iit[] = await res.json();

      // Add degree field to each program for filtering
      const dataWithDegree = data.map((iit) => ({
        ...iit,
        UG: iit.UG.map((p) => ({ ...p, degree: "UG" })),
        PG: iit.PG.map((p) => ({ ...p, degree: "PG" })),
      }));

      setIitsData(dataWithDegree);
    };

    fetchData();
  }, []);

  const filteredIits = useMemo(() => {
    return iitsData.filter((iit) => {
      // combine UG and PG programs with degree field
      const programs: Program[] = [
        ...iit.UG.map((p) => ({ ...p, degree: "UG" as const })),
        ...iit.PG.map((p) => ({ ...p, degree: "PG" as const })),
      ];

      const matchesProgram = programs.some((p) => {
        const matchDegree = !selectedDegree || p.degree === selectedDegree;
        const matchBranch = !selectedBranch || p.branch === selectedBranch;
        return matchDegree && matchBranch;
      });

      // Also apply search filter on NIT name
      const matchesSearch = iit.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesProgram && matchesSearch;
    });
  }, [iitsData, selectedDegree, selectedBranch, searchTerm]);

  const sortedIits = useMemo(() => {
    if (!selectedFilterOption) return filteredIits;

    return [...filteredIits].sort((a, b) => {
      const aPrograms: Program[] = [
        ...a.UG.map((p) => ({ ...p, degree: "UG" as const })),
        ...a.PG.map((p) => ({ ...p, degree: "PG" as const })),
      ];
      const bPrograms: Program[] = [
        ...b.UG.map((p) => ({ ...p, degree: "UG" as const })),
        ...b.PG.map((p) => ({ ...p, degree: "PG" as const })),
      ];

      // Filter programs by selectedDegree and selectedBranch for accurate sorting
      const filterPrograms = (programs: Program[]) =>
        programs.filter((p) => {
          const matchDegree = !selectedDegree || p.degree === selectedDegree;
          const matchBranch = !selectedBranch || p.branch === selectedBranch;
          return matchDegree && matchBranch;
        });

      const aFiltered = filterPrograms(aPrograms);
      const bFiltered = filterPrograms(bPrograms);

      // Find max value for sorting criterion or fallback to 0
      const getMaxValue = (programs: Program[], key: keyof Program) =>
        programs.length
          ? Math.max(
              ...programs.map((p) => {
                const value = p[key];
                return typeof value === "number" ? value : 0;
              })
            )
          : 0;

      if (selectedFilterOption === "median") {
        return getMaxValue(bFiltered, "medianPackage") - getMaxValue(aFiltered, "medianPackage");
      }

      if (selectedFilterOption === "placement") {
        return getMaxValue(bFiltered, "placementPercentage") - getMaxValue(aFiltered, "placementPercentage");
      }

      return 0;
    });
  }, [filteredIits, selectedFilterOption, selectedDegree, selectedBranch]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-6xl mx-auto">
        <div>
          <label className="block text-sm font-semibold mb-1">Degree</label>
          <select
            value={selectedDegree}
            onChange={(e) => {
              setSelectedDegree(e.target.value as "" | "UG" | "PG");
              setSelectedFilterOption("");
              setError("");
            }}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">All Degrees</option>
            <option value="UG">UG</option>
            <option value="PG">PG</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Branch</label>
          <select
            value={selectedBranch}
            onChange={(e) => {
              setSelectedBranch(e.target.value);
              setSelectedFilterOption("");
              setError("");
            }}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="Mechanical">Mechanical</option> {/* Update to match JSON */}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Filter Options</label>
          <select
            value={selectedFilterOption}
            onChange={(e) => {
              if (!selectedDegree || !selectedBranch) {
                setError("Please select both Degree and Branch before applying filters.");
                return;
              }
              setSelectedFilterOption(e.target.value);
              setError("");
            }}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">None</option>
            <option value="median">Median Package (High to Low)</option>
            <option value="placement">Placement % (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-center text-red-600 font-semibold mb-4">{error}</div>
      )}

      {/* Search Bar */}
      <div className="flex justify-end items-center mb-8 max-w-6xl mx-auto">
        <input
          type="text"
          placeholder="Search NIT..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 border border-gray-300 rounded-full pl-4 pr-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {sortedIits.map((iit) => (
          <motion.div
            key={iit.name}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transition-shadow duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => {
  // Create a URL-safe string for iitName (e.g., iit_bombay)
  const iitSlug = iit.name.toLowerCase().replace(/\s+/g, "_");
  router.push(`/stats/iits/${iitSlug}`);
}}

          >
            <img
              src={iit.photo}
              alt={`${iit.name} logo`}
              className="w-32 h-32 object-contain mb-4"
              loading="lazy"
            />
            <h3 className="text-xl font-light mb-1">{iit.name}</h3>
            <p className="text-indigo-600 font-medium">NIRF Rank: {iit.nirfRank}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
