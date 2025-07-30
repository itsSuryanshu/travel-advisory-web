import { useState, useCallback } from "react";

interface CSVData {
  csv_data: string;
  url: string;
  metadata: {
    size: number;
    type: string;
    lastModified: string;
  };
}

interface ParsedData {
  Country: string;
  "Risk Level": string;
  Description: string;
  "Last Updated": string;
}

interface UseCSVReturnData {
  data: CSVData | null;
  parsedData: ParsedData[] | null;
  isLoading: boolean;
  error: string | null;
  fetchCSVData: () => Promise<void>;
  parseCSVData: () => ParsedData[];
  reset: () => void;
}

export const useCSV = (): UseCSVReturnData => {
  const [csvData, setCSVData] = useState<CSVData | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCSVData = useCallback(async () => {
    setIsLoading(true);
    try {
      const axios = (await import("axios")).default;
      const response = await axios.get<{
        success: boolean;
        error: string;
        data: CSVData;
      }>("/api/presigned-url", {
        timeout: 10000,
      });
      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to fetch data.");
      }

      setCSVData(response.data.data);
    } catch (err) {
      const error = err as Error & {
        response?: { status: number; statusText?: string; data?: unknown };
        request?: { status: number; statusText?: string; data?: unknown };
      };
      let errorMessage = `Error fetching CSV data: ${err}`;
      console.log(errorMessage);
      if (error.response) {
        errorMessage = `Error fetching data: ${error.response.status} - ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "No response received from server.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setCSVData(null);
      setParsedData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const parseCSVData = useCallback(() => {
    if (!csvData?.csv_data) return [];
    const lines = csvData.csv_data.trim().split("\n");
    const delimiter = ",";
    let headers: string[] = [];
    const startingIndex = 1; // index 1 because the first line is always going to be headers

    if (lines.length === 0) {
      return [];
    } else {
      headers = lines[0].split(delimiter).map((header) => header.trim());

      const rows = lines.slice(startingIndex).map((line) => {
        let values = line
          .split(delimiter)
          .map((value) => value.trim().replace(/"/g, ""));

        // for countries that have bigger names with ',' characters in them
        if (values.length > 4) {
          values = [values[0] + ", " + values[1], ...values.slice(2)];
        }

        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });
        return row as unknown as ParsedData;
      });
      setParsedData(rows);
      return rows;
    }
  }, [csvData]);

  const reset = useCallback(() => {
    setCSVData(null);
    setParsedData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data: csvData,
    parsedData,
    isLoading,
    error,
    fetchCSVData,
    parseCSVData,
    reset,
  } as UseCSVReturnData;
};
