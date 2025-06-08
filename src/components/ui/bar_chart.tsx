"use client";

import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  
} from "recharts";

interface BarChartProps {
  data: Array<{ year: string; highest: number; median: number; lowest: number }>;
  title?: string;
  branch?: string;
}

export default function BarChart({ data, title = "Placement Trends", branch = "" }: BarChartProps) {
  const formatTooltipValue = (value: number, name: string): [string, string] => {
    return [`${value} LPA`, name];
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      {title && <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>}
      {branch && <h3 className="text-center mb-6">Branch: {branch}</h3>}

      <ResponsiveContainer width="100%" height={400}>
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap={40}
          barGap={5}
        >
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip
            formatter={formatTooltipValue}
            contentStyle={{ backgroundColor: "#fff" }}
          />
          <Legend />
          <Bar dataKey="highest" fill="#3B82F6" name="Highest" barSize={15} />
          <Bar dataKey="median" fill="#22C55E" name="Median" barSize={15} />
          <Bar dataKey="lowest" fill="#EF4444" name="Lowest" barSize={15} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
