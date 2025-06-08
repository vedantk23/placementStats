"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import BarChart from "@/components/ui/bar_chart";

const placementDataBTech2024 = {
  CSE: { highest: 60, lowest: 10, median: 25, average: 30, percentagePlaced: 40  },
  ECE: { highest: 50, lowest: 8, median: 20, average: 28, percentagePlaced:50 },
};

const placementDataMTech2024 = {
  CSE: { highest: 45, lowest: 7, median: 18, average: 24, percentagePlaced: 80 },
  ECE: { highest: 40, lowest: 6, median: 15, average: 20, percentagePlaced: 70 },
};

const oneYearBackStatsBTech = {
  CSE: { highest: 58, lowest: 9, median: 24 },
  ECE: { highest: 48, lowest: 7, median: 19 },
};

const twoYearBackStatsBTech = {
  CSE: { highest: 55, lowest: 8, median: 22 },
  ECE: { highest: 46, lowest: 6, median: 18 },
};

const oneYearBackStatsMTech = {
  CSE: { highest: 42, lowest: 6, median: 17 },
  ECE: { highest: 38, lowest: 5, median: 13 },
};

const twoYearBackStatsMTech = {
  CSE: { highest: 40, lowest: 5, median: 15 },
  ECE: { highest: 35, lowest: 4, median: 12 },
};

const BranchSelect = ({ branches, value, onChange }: any) => (
  <select
    className="border border-gray-300 p-2 rounded"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    <option value="">Select Branch</option>
    {branches.map((branch: string) => (
      <option key={branch} value={branch}>
        {branch}
      </option>
    ))}
  </select>
);

export default function IITStatsPage() {
  const params = useParams();
  const iitNameParam = params?.iitName;
  const iitName = decodeURIComponent(
    Array.isArray(iitNameParam) ? iitNameParam[0] || "" : iitNameParam || ""
  );

  const [program, setProgram] = useState("BTech");
  const [branch, setBranch] = useState("");
  type Branch = "CSE" | "ECE";
  const b = branch as Branch;

  const currentTableData = program === "BTech" ? placementDataBTech2024 : placementDataMTech2024;

  // Prepare chart data automatically whenever branch or program changes and branch is selected
  const chartData = branch
    ? [
        { year: "2022-23", ...((program === "BTech" ? twoYearBackStatsBTech : twoYearBackStatsMTech)[b] || {}) },
        { year: "2023-24", ...((program === "BTech" ? oneYearBackStatsBTech : oneYearBackStatsMTech)[b] || {}) },
        { year: "2024-25", ...currentTableData[b] },
      ]
    : [];
    const chartRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (branch && chartRef.current) {
    chartRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    chartRef.current.focus();
  }
}, [branch]);


  return (
    <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold text-center mb-8">{iitName} Placement Stats</h1>

      {/* B.Tech Table */}
      <h2 className="text-2xl font-semibold mb-4">B.Tech</h2>
      <div className="overflow-x-auto mb-10">
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-2">Branch</th>
              <th>Highest</th>
              <th>Lowest</th>
              <th>Median</th>
              <th>Average</th>
              <th>Percentage Placed</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(placementDataBTech2024).map(([branch, data]) => (
              <tr key={branch} className="text-center">
                <td className="p-2 font-medium">{branch}</td>
                <td>{data.highest} LPA</td>
                <td>{data.lowest} LPA</td>
                <td>{data.median} LPA</td>
                <td>{data.average} LPA</td>
                <td>
                  {data.percentagePlaced} % 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* M.Tech Table */}
      <h2 className="text-2xl font-semibold mb-4">M.Tech</h2>
      <div className="overflow-x-auto mb-10">
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2">Branch</th>
              <th>Highest</th>
              <th>Lowest</th>
              <th>Median</th>
              <th>Average</th>
              <th>Percentage Placed</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(placementDataMTech2024).map(([branch, data]) => (
              <tr key={branch} className="text-center">
                <td className="p-2 font-medium">{branch}</td>
                <td>{data.highest} LPA</td>
                <td>{data.lowest} LPA</td>
                <td>{data.median} LPA</td>
                <td>{data.average} LPA</td>
                <td>
                  {data.percentagePlaced} % 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
<div className="my-10 text-center">
  <h2 className="text-3xl font-semibold mb-6">Previous Year Placement</h2>

  <div
    className="max-w-md mx-auto p-6 rounded-xl shadow-md flex flex-col sm:flex-row items-center gap-6"
    style={{ backgroundColor: "rgba(250, 243, 221, 0.5)" }} // FAF3DD with 0.5 opacity
  >
    <select
      className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400
                 transition duration-300 ease-in-out text-yellow-700 font-semibold"
      value={program}
      onChange={(e) => {
        setProgram(e.target.value);
        setBranch("");
      }}
    >
      <option value="BTech">B.Tech</option>
      <option value="MTech">M.Tech</option>
    </select>

    <select
      className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400
                 transition duration-300 ease-in-out text-yellow-700 font-semibold"
      value={branch}
      onChange={(e) => setBranch(e.target.value)}
    >
      <option value="">Select Branch</option>
      {Object.keys(program === "BTech" ? placementDataBTech2024 : placementDataMTech2024).map(
        (br) => (
          <option key={br} value={br}>
            {br}
          </option>
        )
      )}
    </select>
  </div>

  {branch && (
    <div
      tabIndex={-1} // make focusable
      ref={chartRef}
      className="max-w-4xl mx-auto mt-8 p-6 rounded-xl shadow-md outline-none"
      style={{ backgroundColor: "#DBEAFE" }} // Light blue background
    >
      <BarChart data={chartData} title={`${program} Placement Trends`} branch={branch} />
    </div>
  )}
</div>

     

    </motion.div>
  );
}