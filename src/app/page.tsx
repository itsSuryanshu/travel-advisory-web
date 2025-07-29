"use client";

// import Image from "next/image";
import { useEffect, useState } from "react";
import { useCSV } from "../../lib/hooks/useCSV";
import ChoroplethMap from "@/app/components/ChoroplethMap";
import Search from "@/app/components/Search";
import Drawer from "@/app/components/Drawer";
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
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    fetchCSVData();
  }, [fetchCSVData]);

  useEffect(() => {
    if (data) {
      parseCSVData();
    }
  }, [data, parseCSVData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-8">
        <div className="scale-400 animate-spin">🇨🇦</div>
        <div className="font-medium font-[family-name:var(--font-geist-mono)] text-lg">
          Loading Map...
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {/* Desktop and iPad version */}
      <nav className="hidden sm:block sm:absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-1 bg-white/50 backdrop-blur-md border border-black rounded-full px-4 py-0.5 shadow-lg whitespace-nowrap font-[family-name:var(--font-geist-mono)]">
            <NavigationMenuItem className="font-bold">
              <NavigationMenuLink href="/">Home</NavigationMenuLink>
            </NavigationMenuItem>
            <div className="w-px h-6 bg-gray-400"></div>
            <NavigationMenuItem>
              <NavigationMenuLink href="/how-it-works">
                How it works
              </NavigationMenuLink>
            </NavigationMenuItem>
            <div className="w-px h-6 bg-gray-400"></div>
            <NavigationMenuItem>
              <Search
                data={parsedData || []}
                onCountrySelect={setSelectedCountry}
              ></Search>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
      {/* Phone version */}
      <nav className="block sm:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-1 bg-white/50 backdrop-blur-md border border-black rounded-full px-4 py-0.5 shadow-lg whitespace-nowrap font-[family-name:var(--font-geist-mono)]">
            <NavigationMenuItem className="font-bold">
              <NavigationMenuLink href="/">Home</NavigationMenuLink>
            </NavigationMenuItem>
            <div className="w-px h-6 bg-gray-400"></div>
            <NavigationMenuItem>
              <NavigationMenuLink href="/how-it-works">
                How it works
              </NavigationMenuLink>
            </NavigationMenuItem>
            <div className="w-px h-6 bg-gray-400"></div>
            <NavigationMenuItem>
              <Search
                data={parsedData || []}
                onCountrySelect={setSelectedCountry}
              ></Search>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
      {/* Drawer */}
      <div className="hidden sm:block sm:absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50">
        <Drawer data={parsedData || []} />
      </div>
      <div className="block sm:hidden absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50">
        <Drawer data={parsedData || []} />
      </div>
      {/* Maps */}
      <div className="w-screen h-screen overflow-hidden">
        {/* <div>
        <h3>Parsed Data:</h3>
        <pre>{JSON.stringify(parsedData, null, 2)}</pre>
      </div> */}
        {parsedData && parsedData.length > 0 ? (
          <>
            <ChoroplethMap data={parsedData} targetCountry={selectedCountry} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="font-medium font-[family-name:var(--font-geist-mono)] text-lg">
              No Data Available.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
