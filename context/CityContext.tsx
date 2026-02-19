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
        const response = await fetch("/api/city");
        if (!response.ok) throw new Error("Failed to fetch cities");
        const data = await response.json();
        console.log('provider : city' ,data)
        setCities(data.data || []);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
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
