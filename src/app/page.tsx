"use client";

// import Image from "next/image";
import { useEffect } from "react";
import { useCSV } from "../../lib/hooks/useCSV";
import ChoroplethMap from "@/app/components/ChoroplethMap";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

// interface ParsedData {
//   country: string;
//   risk: string;
//   description: string;
//   updatedLast: string;
// }

export default function Home() {
  const { data, parsedData, isLoading, error, fetchCSVData, parseCSVData } =
    useCSV();

  useEffect(() => {
    fetchCSVData();
  }, [fetchCSVData]);

  useEffect(() => {
    if (data) {
      parseCSVData();
    }
  }, [data, parseCSVData]);

  if (isLoading) {
    return <div>Loading Map...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <NavigationMenu>
          <NavigationMenuList className="flex, items-center space-x-1 bg-white/50 backdrop-blur-md border border-black rounded-full px-4 py-0.5 shadow-lg font-[family-name:var(--font-geist-mono)]">
            <NavigationMenuItem>
              <NavigationMenuLink href="/">Home</NavigationMenuLink>
            </NavigationMenuItem>
            <div className="w-px h-6 bg-gray-500"></div>
            <NavigationMenuItem>
              <NavigationMenuLink href="/how-it-works">
                How It Works
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
      <div className="w-screen h-screen overflow-hidden">
        {/* <div>
        <h3>Parsed Data:</h3>
        <pre>{JSON.stringify(parsedData, null, 2)}</pre>
      </div> */}
        {parsedData && parsedData.length > 0 ? (
          <>
            <ChoroplethMap data={parsedData} />
          </>
        ) : (
          <div>No data available.</div>
        )}
      </div>
    </>
  );
}
