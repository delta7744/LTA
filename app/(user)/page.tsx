import { Suspense, lazy } from "react";

// Lazy-load the components
const HeroSlider = lazy(() => import("@/components/hero-slider"));
const SearchBar = lazy(() => import("@/components/search-bar"));
const HotelSection = lazy(() => import("@/components/hotel-section"));
const StatsSection = lazy(() => import("@/components/stats-section"));
const DestinationsSection = lazy(
  () => import("@/components/destinations-section")
);
const FaqSection = lazy(() => import("@/components/faq-section"));
const AboutLta = lazy(() => import("@/components/about-lta"));
const ServicesSection = lazy(() => import("@/components/services-section"));

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Suspense>
          <HeroSlider />
        </Suspense>
        <Suspense>
          <AboutLta />
        </Suspense>
        <Suspense>
          <ServicesSection />
        </Suspense>
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <HotelSection />
        </Suspense>
        <Suspense>
          <StatsSection />
        </Suspense>
        <Suspense>
          <DestinationsSection />
        </Suspense>
        <Suspense>
          <FaqSection />
        </Suspense>
      </main>
    </div>
  );
}
