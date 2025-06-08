"use client";

import React, { useMemo, useState } from "react";
import collegesDataRaw from "data/colleges.json";

type Program = {
  branch?: string;
  highestPackage?: number | null;
  lowestPackage?: number | null;
  medianPackage?: number | null;
  averagePackage?: number | null;
  placementPercentage?: number | null;
  registeredStudent?: number | null;
  placedStudent?: number | null;
};

type College = {
  name?: string;
  key: string;
  UG?: Program[];
  PG?: Program[];
  oneYearbackStats?: {
    UG?: Program[];
    PG?: Program[];
  };
  twoYearbackStats?: {
    UG?: Program[];
    PG?: Program[];
  };
};

const colleges: College[] = Object.entries(collegesDataRaw).map(([key, value]) => ({
  key,
  ...value,
}));

export default function ComparePage() {
  const [degree, setDegree] = useState<"UG" | "PG">("UG");
  const [year, setYear] = useState<"current" | "oneYearBack" | "twoYearBack">("current");

  const programsList = useMemo(() => {
    const list: {
      collegeName: string;
      branch: string;
      medianPackage: number | null | undefined;
      averagePackage: number | null | undefined;
      placementPercentage: number | null | undefined;
    }[] = [];

    for (const college of colleges) {
      let programs: Program[] | undefined;

      if (year === "current") {
        programs = college[degree];
      } else if (year === "oneYearBack") {
        programs = college.oneYearbackStats?.[degree];
      } else if (year === "twoYearBack") {
        programs = college.twoYearbackStats?.[degree];
      }

      if (!Array.isArray(programs)) continue;

      for (const prog of programs) {
        list.push({
          collegeName: college.name ?? "Unknown",
          branch: prog.branch ?? "NA",
          medianPackage: prog.medianPackage,
          averagePackage: prog.averagePackage,
          placementPercentage: prog.placementPercentage,
        });
      }
    }

    return list;
  }, [degree, year]);

  const displayValue = (v: number | null | undefined) =>
    v === null || v === undefined ? "NA" : Number.isInteger(v) ? v : v.toFixed(2);

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-indigo-900">Compare Colleges</h1>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div>
          <label className="block mb-1 font-semibold">Select Degree</label>
          <select
            value={degree}
            onChange={(e) => setDegree(e.target.value as "UG" | "PG")}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="UG">Undergraduate (B.Tech)</option>
            <option value="PG">Postgraduate (M.Tech)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Select Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value as "current" | "oneYearBack" | "twoYearBack")}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="current">Current Year</option>
            <option value="oneYearBack">One Year Back</option>
            <option value="twoYearBack">Two Years Back</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-indigo-600 text-white">
            <th className="p-3 border border-indigo-700">College</th>
            <th className="p-3 border border-indigo-700">Branch</th>
            <th className="p-3 border border-indigo-700">Median Package (LPA)</th>
            <th className="p-3 border border-indigo-700">Average Package (LPA)</th>
            <th className="p-3 border border-indigo-700">Placement %</th>
          </tr>
        </thead>
        <tbody>
          {programsList.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500">
                No data available.
              </td>
            </tr>
          ) : (
            programsList.map((item, index) => (
              <tr key={`${item.collegeName}-${item.branch}-${index}`} className="hover:bg-indigo-50">
                <td className="p-3 border border-indigo-300">{item.collegeName}</td>
                <td className="p-3 border border-indigo-300">{item.branch}</td>
                <td className="p-3 border border-indigo-300">{displayValue(item.medianPackage)}</td>
                <td className="p-3 border border-indigo-300">{displayValue(item.averagePackage)}</td>
                <td className="p-3 border border-indigo-300">
                  {item.placementPercentage !== null && item.placementPercentage !== undefined
                    ? `${item.placementPercentage}%`
                    : "NA"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
