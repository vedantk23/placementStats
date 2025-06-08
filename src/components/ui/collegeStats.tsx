"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import collegesDataRaw from "data/colleges.json"; // centralized JSON
import BarChart from "src/components/ui/bar_chart";

type BranchStats = {
  branch: string;
  highestPackage: number;
  lowestPackage: number;
  medianPackage: number;
  averagePackage: number;
  placementPercentage: number;
  registeredStudent: number;
  placedStudent: number;
};

type YearStats = {
  UG: BranchStats[];
  PG: BranchStats[];
};

type CollegeData = {
  name: string;
  photo?: string;
  nirfRank?: number;
  qsWorldRanking?: number;
  UG: BranchStats[];
  PG: BranchStats[];
  oneYearbackStats?: YearStats;
  twoYearbackStats?: YearStats;
};

const collegesData: Record<string, CollegeData> = collegesDataRaw;

export default function PlacementStatsPage() {
  const searchParams = useSearchParams();
  const collegeKey = searchParams.get("college");

  const [college, setCollege] = useState<CollegeData | null>(null);

  // Degree selection: UG or PG
  const [degree, setDegree] = useState<"UG" | "PG">("UG");
  // Selected branch for bar chart
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  useEffect(() => {
    if (collegeKey && collegesData[collegeKey]) {
      setCollege(collegesData[collegeKey]);
      // Reset degree and branch on new college load
      setDegree("UG");
      setSelectedBranch("");
    } else {
      setCollege(null);
    }
  }, [collegeKey]);

  // When degree or college changes, reset selected branch
  useEffect(() => {
    if (!college) return;
    const branches = college[degree];
    setSelectedBranch(branches.length > 0 ? branches[0].branch : "");
  }, [degree, college]);

  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl font-semibold">
        College not found. Please select a valid college.
      </div>
    );
  }

  // Pretty table render function
  const renderTable = (title: string, data: BranchStats[]) => (
    <div className="my-6 w-full overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="border border-indigo-700 p-3 text-left">Branch</th>
            <th className="border border-indigo-700 p-3 text-right">Highest Package (LPA)</th>
            <th className="border border-indigo-700 p-3 text-right">Lowest Package (LPA)</th>
            <th className="border border-indigo-700 p-3 text-right">Median Package (LPA)</th>
            <th className="border border-indigo-700 p-3 text-right">Average Package (LPA)</th>
            <th className="border border-indigo-700 p-3 text-right">Placement %</th>
            <th className="border border-indigo-700 p-3 text-right">Registered</th>
            <th className="border border-indigo-700 p-3 text-right">Placed</th>
          </tr>
        </thead>
        <tbody>
          {data.map((branch, i) => (
            <tr
              key={i}
              className={`cursor-pointer ${
                selectedBranch === branch.branch ? "bg-indigo-100 font-semibold" : i % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-indigo-50`}
              onClick={() => setSelectedBranch(branch.branch)}
            >
              <td className="border border-gray-300 p-3">{branch.branch}</td>
              <td className="border border-gray-300 p-3 text-right">{branch.highestPackage}</td>
              <td className="border border-gray-300 p-3 text-right">{branch.lowestPackage}</td>
              <td className="border border-gray-300 p-3 text-right">{branch.medianPackage}</td>
              <td className="border border-gray-300 p-3 text-right">{branch.averagePackage}</td>
              <td className="border border-gray-300 p-3 text-right">{branch.placementPercentage}%</td>
              <td className="border border-gray-300 p-3 text-right">{branch.registeredStudent}</td>
              <td className="border border-gray-300 p-3 text-right">{branch.placedStudent}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-sm text-gray-500">* Click on a row to view placement trends in chart below.</p>
    </div>
  );

  // Prepare data for BarChart for selected branch & degree

  // Helper: get trend data from oneYearbackStats and twoYearbackStats or fallback mock
  const getTrendData = (): Array<{ year: string; highest: number; median: number; lowest: number }> => {
    if (!college || !selectedBranch) return [];

    // Extract current stats for selected branch
    const currentStats = college[degree].find((b) => b.branch === selectedBranch);
    if (!currentStats) return [];

    // Get historical stats if available
    const oneYearBack = college.oneYearbackStats?.[degree]?.find((b) => b.branch === selectedBranch);
    const twoYearBack = college.twoYearbackStats?.[degree]?.find((b) => b.branch === selectedBranch);

    return [
      {
        year: "2 Years Ago",
        highest: twoYearBack?.highestPackage || currentStats.highestPackage * 0.8,
        median: twoYearBack?.medianPackage || currentStats.medianPackage * 0.8,
        lowest: twoYearBack?.lowestPackage || currentStats.lowestPackage * 0.8,
      },
      {
        year: "1 Year Ago",
        highest: oneYearBack?.highestPackage || currentStats.highestPackage * 0.9,
        median: oneYearBack?.medianPackage || currentStats.medianPackage * 0.9,
        lowest: oneYearBack?.lowestPackage || currentStats.lowestPackage * 0.9,
      },
      {
        year: "Current",
        highest: currentStats.highestPackage,
        median: currentStats.medianPackage,
        lowest: currentStats.lowestPackage,
      },
    ];
  };

  const trendData = getTrendData();

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          {college.photo && (
            <img src={college.photo} alt={college.name} className="w-20 h-20 object-contain rounded-md border" />
          )}
          <div>
            <h1 className="text-3xl font-extrabold">{college.name}</h1>
            <p className="text-gray-600 mt-1">
              NIRF Rank: <span className="font-semibold">{college.nirfRank ?? "NA"}</span> | QS Rank:{" "}
              <span className="font-semibold">{college.qsWorldRanking ?? "NA"}</span>
            </p>
          </div>
        </div>

        {/* Degree selector */}
        <div className="flex items-center gap-6 mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="degree"
              value="UG"
              checked={degree === "UG"}
              onChange={() => setDegree("UG")}
              className="form-radio text-indigo-600"
            />
            <span>Undergraduate (UG)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="degree"
              value="PG"
              checked={degree === "PG"}
              onChange={() => setDegree("PG")}
              className="form-radio text-indigo-600"
            />
            <span>Postgraduate (PG)</span>
          </label>

          {/* Branch selector */}
          
        </div>

        {/* Tables */}
        {degree === "UG" && renderTable("Undergraduate (UG) Stats", college.UG)}
        {degree === "PG" && renderTable("Postgraduate (PG) Stats", college.PG)}
        {/* Branch selector - moved below table */}
<div className="mt-8 flex flex-col items-start">
  <label className="block text-gray-700 font-semibold mb-2">
    Select Branch to View Placement Trends
  </label>
  <div className="relative w-full max-w-xs">
    <select
      className="block appearance-none w-full bg-white border border-gray-300 hover:border-indigo-500 px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150"
      value={selectedBranch}
      onChange={(e) => setSelectedBranch(e.target.value)}
    >
      {college[degree].map((branch) => (
        <option key={branch.branch} value={branch.branch}>
          {branch.branch}
        </option>
      ))}
    </select>
    {/* Down arrow icon */}
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
        <path d="M5.516 7.548a.625.625 0 0 1 .884-.04L10 10.708l3.6-3.2a.625.625 0 1 1 .84.92l-4 3.556a.625.625 0 0 1-.84 0l-4-3.556a.625.625 0 0 1-.084-.88z" />
      </svg>
    </div>
  </div>
</div>



        {/* Bar Chart */}
        <div className="mt-12">
          <BarChart data={trendData} title={`${college.name} - ${degree} - ${selectedBranch} Placement Trends`} branch={selectedBranch} />
        </div>
      </div>
    </div>
  );
}
