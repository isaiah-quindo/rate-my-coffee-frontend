"use client";

import dynamic from "next/dynamic";
import config from "@/sanity.config";

// Lazy-load Studio so it only runs in the browser
const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Studio...</h2>
          <p className="text-gray-600">
            Please wait while we load the Sanity Studio.
          </p>
        </div>
      </div>
    ),
  }
);

export default function StudioPage() {
  return <NextStudio config={config} />;
}
