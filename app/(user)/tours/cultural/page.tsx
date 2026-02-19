"use client";

import ToursPage from "@/components/tours-page";

export default function CulturalToursPage() {
  return (
    <ToursPage apiEndpoint="/api/tours/type/cultural" tourType="cultural" />
  );
}
