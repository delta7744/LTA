"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { City } from "@/lib/types";
type CityContextType = {
  cities: City[];
  loading: boolean;
};

// 2. Create the context with default value (or undefined and check later)
const CityContext = createContext<CityContextType | undefined>(undefined);

// 3. Create the provider component
export const CityProvider = ({ children }: { children: ReactNode }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const response = await fetch(`${baseUrl}/city`, {
          headers: { "Content-Type": "application/json" },
        }).catch(() => null); // silence network errors entirely

        if (response && response.ok) {
          const data = await response.json().catch(() => null);
          if (data) {
            console.log("provider : city", data);
            setCities(data.data || []);
          }
        } else {
          console.warn("City API unavailable, using empty list");
        }
      } catch {
        // silently fail — cities are not critical
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <CityContext.Provider value={{ cities, loading }}>
      {children}
    </CityContext.Provider>
  );
};

// 4. Custom hook to consume the context
export const useCities = (): CityContextType => {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error("useCities must be used within a CityProvider");
  }
  return context;
};
