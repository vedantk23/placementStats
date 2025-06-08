"use client";

import { useSearchParams } from "next/navigation";
import PlacementStatsRenderer from "./PlacementStatsRenderer";

export default function PlacementStatsPage() {
  const searchParams = useSearchParams();
  const collegeKey = searchParams.get("college");

  if (!collegeKey) {
    return <div className="text-red-500 text-xl p-6">Please select a valid college from the search list.</div>;
  }

  return <PlacementStatsRenderer collegeKey={collegeKey} />;
}
