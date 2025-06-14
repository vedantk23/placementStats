"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import BarChart from "src/components/ui/bar_chart";
import collegesDataRaw from "data/colleges.json";

type BranchStats = {
  branch: string | null;
  highestPackage: number | null;
  lowestPackage: number | null;
  medianPackage: number | null;
  averagePackage: number | null;
  placementPercentage: number | null;
  registeredStudent: number | null;
  placedStudent: number | null;
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

type Props = {
  collegeKey: string;
};

type PartialBranchStats = Partial<BranchStats> & Record<string, unknown>;

const filterValidBranchStats = (arr: PartialBranchStats[]): BranchStats[] =>
  Array.isArray(arr)
    ? arr
        .filter((b): b is BranchStats => b && typeof b.branch === "string")
        .map((b) => ({
          branch: b.branch ?? null,
          highestPackage: typeof b.highestPackage === "number" ? b.highestPackage : null,
          lowestPackage: typeof b.lowestPackage === "number" ? b.lowestPackage : null,
          medianPackage: typeof b.medianPackage === "number" ? b.medianPackage : null,
          averagePackage: typeof b.averagePackage === "number" ? b.averagePackage : null,
          placementPercentage: typeof b.placementPercentage === "number" ? b.placementPercentage : null,
          registeredStudent: typeof b.registeredStudent === "number" ? b.registeredStudent : null,
          placedStudent: typeof b.placedStudent === "number" ? b.placedStudent : null,
        }))
    : [];

const fixYearStats = (
  stats: Partial<Record<"UG" | "PG", PartialBranchStats[]>> | undefined
): YearStats | undefined =>
  stats
    ? {
        UG: filterValidBranchStats(stats.UG ?? []),
        PG: filterValidBranchStats(stats.PG ?? []),
      }
    : undefined;

const collegesData: Record<string, CollegeData> = Object.fromEntries(
  Object.entries(collegesDataRaw).map(([key, value]) => [
    key,
    {
      ...value,
      UG: filterValidBranchStats(value.UG),
      PG: filterValidBranchStats(value.PG),
      oneYearbackStats: fixYearStats(value.oneYearbackStats),
      twoYearbackStats: fixYearStats(value.twoYearbackStats),
    },
  ])
);

type SortKey = "medianPackage" | "placementPercentage" | "averagePackage" | null;
type SortOrder = "asc" | "desc";

export default function PlacementStatsRenderer({ collegeKey }: Props) {
  const [college, setCollege] = useState<CollegeData | null>(null);
  const [degree, setDegree] = useState<"UG" | "PG">("UG");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [yearView, setYearView] = useState<"current" | "oneYearBack" | "twoYearBack">("current");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const getCurrentYearData = useCallback((): BranchStats[] => {
    if (!college) return [];
    if (yearView === "oneYearBack") {
      return college.oneYearbackStats?.[degree] || [];
    } else if (yearView === "twoYearBack") {
      return college.twoYearbackStats?.[degree] || [];
    }
    return college[degree] || [];
  }, [college, degree, yearView]);

  useEffect(() => {
    if (collegeKey && collegesData[collegeKey]) {
      setCollege(collegesData[collegeKey]);
      setDegree("UG");
      setSelectedBranch("");
      setSortKey(null);
    } else {
      setCollege(null);
    }
  }, [collegeKey]);

  useEffect(() => {
    if (!college) return;
    const branches = getCurrentYearData();
    setSelectedBranch(branches.length > 0 ? branches[0].branch ?? "" : "");
    setSortKey(null);
  }, [degree, college, yearView, getCurrentYearData]);

  const sortedBranchData = (): BranchStats[] => {
    const data = [...getCurrentYearData()];
    if (!sortKey) return data;

    return data.sort((a, b) => {
      const valA = a[sortKey] ?? -Infinity;
      const valB = b[sortKey] ?? -Infinity;
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  if (!college) {
    return <div className="text-red-500 text-xl font-semibold">College not found</div>;
  }

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <span className="ml-1 cursor-pointer">⇅</span>;
    }
    return sortOrder === "asc" ? (
      <span className="ml-1 cursor-pointer">▲</span>
    ) : (
      <span className="ml-1 cursor-pointer">▼</span>
    );
  };

  const renderValue = (val: number | string | null | undefined) => val ?? "NA";

  const renderTable = (title: string, data: BranchStats[]) => (
    <div className="my-6 w-full overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="p-3 text-left">Branch</th>
            <th className="p-3 text-right">Highest</th>
            <th className="p-3 text-right">Lowest</th>
            <th className="p-3 text-right cursor-pointer" onClick={() => toggleSort("medianPackage")}>Median {renderSortIcon("medianPackage")}</th>
            <th className="p-3 text-right cursor-pointer" onClick={() => toggleSort("averagePackage")}>Average {renderSortIcon("averagePackage")}</th>
            <th className="p-3 text-right cursor-pointer" onClick={() => toggleSort("placementPercentage")}>Placement % {renderSortIcon("placementPercentage")}</th>
            <th className="p-3 text-right">Registered</th>
            <th className="p-3 text-right">Placed</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-gray-500 p-4">No placement data available for this selection.it</td>
            </tr>
          ) : (
            data.map((branch, i) => (
              <tr
                key={i}
                className={`cursor-pointer ${selectedBranch === branch.branch ? "bg-indigo-100 font-semibold" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                onClick={() => setSelectedBranch(branch.branch ?? "")}
              >
                <td className="p-3">{renderValue(branch.branch)}</td>
                <td className="p-3 text-right">{renderValue(branch.highestPackage)}</td>
                <td className="p-3 text-right">{renderValue(branch.lowestPackage)}</td>
                <td className="p-3 text-right">{renderValue(branch.medianPackage)}</td>
                <td className="p-3 text-right">{renderValue(branch.averagePackage)}</td>
                <td className="p-3 text-right">{renderValue(branch.placementPercentage)}%</td>
                <td className="p-3 text-right">{renderValue(branch.registeredStudent)}</td>
                <td className="p-3 text-right">{renderValue(branch.placedStudent)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const getTrendData = () => {
    if (!college || !selectedBranch) return [];
    const current = college[degree]?.find((b) => b.branch === selectedBranch);
    const oneBack = college.oneYearbackStats?.[degree]?.find((b) => b.branch === selectedBranch);
    const twoBack = college.twoYearbackStats?.[degree]?.find((b) => b.branch === selectedBranch);

    const data = [];
    if (twoBack) data.push({ year: "2 Years Ago", highest: twoBack.highestPackage ?? 0, median: twoBack.medianPackage ?? 0, lowest: twoBack.lowestPackage ?? 0 });
    if (oneBack) data.push({ year: "1 Year Ago", highest: oneBack.highestPackage ?? 0, median: oneBack.medianPackage ?? 0, lowest: oneBack.lowestPackage ?? 0 });
    if (current) data.push({ year: "Current", highest: current.highestPackage ?? 0, median: current.medianPackage ?? 0, lowest: current.lowestPackage ?? 0 });
    return data;
  };

  const trendData = getTrendData();
  const branchData = sortedBranchData();

  return (
    <div className="mt-10 bg-white rounded-xl shadow-lg p-8 relative z-20">
      <div className="flex items-center gap-4 mb-6">
        {college.photo && <Image src={college.photo} alt={`${college.name} logo`} width={80} height={80} className="object-contain" />}
        <div>
          <h1 className="text-3xl font-bold">{college.name}</h1>
          <p className="text-sm text-gray-600">NIRF Rank: {college.nirfRank ?? "NA"} | QS Rank: {college.qsWorldRanking ?? "NA"}</p>
        </div>
      </div>

      <div className="relative z-30 flex flex-wrap gap-4 mb-6">
        {["UG", "PG"].map((d) => (
          <label key={d}>
            <input type="radio" checked={degree === d} onChange={() => setDegree(d as "UG" | "PG")} /> <span className="ml-2">{d}</span>
          </label>
        ))}
        {["current", "oneYearBack", "twoYearBack"].map((y) => (
          <label key={y}>
            <input type="radio" checked={yearView === y} onChange={() => setYearView(y as "current" | "oneYearBack" | "twoYearBack")} /> <span className="ml-2">{y.replace(/([A-Z])/g, " $1").trim()}</span>
          </label>
        ))}
      </div>

      {branchData.length === 0 ? (
        <div className="text-red-600 font-medium text-lg mt-6">No data found. You can check Previous Years.</div>
      ) : (
        renderTable(`${degree} Placement Stats (${yearView.replace("Back", " Back")})`, branchData)
      )}

      <p className="mt-2 text-sm text-gray-600 italic">* Click on a row in the table to see previous year statistics in the chart below.</p>

      <div className="mt-10">
        {trendData.length === 0 || !selectedBranch ? (
          <div className="text-gray-500 italic">No trend data available for the selected branch.</div>
        ) : (
          <BarChart title={`${college.name} - ${selectedBranch}`} data={trendData} branch={selectedBranch} />
        )}
      </div>
    </div>
  );
}