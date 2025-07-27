"use client";

// import Image from "next/image";
import { useEffect } from "react";
import { useCSV } from "../../lib/hooks/useCSV";
import ChoroplethMap from "@/app/components/ChoroplethMap";

// interface ParsedData {
//   country: string;
//   risk: string;
//   description: string;
//   updatedLast: string;
// }

export default function Home() {
  const { data, parsedData, isLoading, error, fetchCSVData, parseCSVData } = useCSV();

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
      <div>Loading Map...</div>
    );
  }

  if (error) {
    return (
      <div>Error: {error}</div>
    );
  }

  return (
    <div>
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
  );
}
