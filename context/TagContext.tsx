"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { Tag } from "@/lib/types";
type TagContextType = {
  tags: Tag[];
  loading: boolean;
};

const TagContext = createContext<TagContextType | undefined>(undefined);

// 3. Create the provider component
export const TagProvider = ({ children }: { children: ReactNode }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const response = await fetch(`${baseUrl}/tag`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch tags");
        const data = await response.json();
        console.log("provider : Tag", data);
        setTags(data.data || []);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return (
    <TagContext.Provider value={{ tags, loading }}>
      {children}
    </TagContext.Provider>
  );
};

// 4. Custom hook to consume the context
export const useTags = (): TagContextType => {
  const context = useContext(TagContext);
  if (context === undefined) {
    throw new Error("useTags must be used within a TagProvider");
  }
  return context;
};
