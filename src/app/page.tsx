"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";


export default function LandingPage() {
  const [searching] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 flex flex-col items-center justify-center">
      {!searching ? (
        <>
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-center text-blue-900 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main heading */}
            Explore College Placement Stats
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-center text-gray-700 mb-10 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Get detailed insights on B.Tech and M.Tech placements across IITs, NITs, IIITs, and other top institutes. Compare branches, view trends, and make informed decisions.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-6 flex flex-col items-start">
                <h2 className="text-2xl font-semibold mb-2 text-blue-800">Check Placement Stats</h2>
                <p className="text-gray-600 mb-4">
                  Explore detailed year-wise placement data, CTCs, and recruiters by branch and institute.
                </p>
                <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => router.push('/stats')}>
                  View Stats <span className="ml-2">→</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-6 flex flex-col items-start">
                <h2 className="text-2xl font-semibold mb-2 text-blue-800">Compare Colleges</h2>
                <p className="text-gray-600 mb-4">
                  Compare placement statistics across branches and institutes side-by-side.
                </p>
                <Button className="bg-green-600 text-white hover:bg-green-700" onClick={() => router.push('/compare')}>
                  Compare Now <span className="ml-2">→</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="w-full max-w-xl mt-10">
          <h2 className="text-3xl font-semibold text-blue-800 mb-6 text-center">Search for a College</h2>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter college name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
         
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 w-full"
            
            onClick={() => router.push(`/college/${encodeURIComponent(query)}`)}
          >
            Search
          </Button>
        </div>
      )}
    </div>
  );
}
