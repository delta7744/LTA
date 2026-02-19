"use client";

import ToursPage from "@/components/tours-page";

export default function BeachToursPage() {
  return <ToursPage apiEndpoint="/api/tours/type/beach" tourType="beach" />;
}
