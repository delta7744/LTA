"use client";

import ToursPage from "@/components/tours-page";

export default function AdventureToursPage() {
  return (
    <ToursPage apiEndpoint="/api/tours/type/adventure" tourType="adventure" />
  );
}
