"use client";

import { useEffect, useRef } from "react";

interface ParsedData {
  Country: string;
  "Risk Level": string;
  Description: string;
  "Last Updated": string;
}

interface ChoroplethProps {
  data: ParsedData[];
  targetCountry: string | null;
}

const ColorBox = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-1 text-xs">
    <div
      className="w-5 h-5 rounded-sm"
      style={{ backgroundColor: color }}
    ></div>
    <span className="font-[family-name:var(--font-geist-mono)]">{label}</span>
  </div>
);

export default function Choropleth({
  data,
  targetCountry = null,
}: ChoroplethProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const getRiskLevel = (risk: string): number => {
    const riskMap: Record<string, number> = {
      "normal-precautions": 1,
      "increased-caution": 2,
      "reconsider-travel": 3,
      "do-not-travel": 4,
    };
    return riskMap[risk];
  };

  useEffect(() => {
    if (!plotRef.current || !data.length) return;

    let isMounted = true;
    const cleanupFunctions: (() => void)[] = [];

    const initializePlot = async () => {
      try {
        const Plotly = await import("plotly.js");

        if (!isMounted || !plotRef.current) return;

        let target: ParsedData | undefined;
        if (targetCountry) {
          target = data.find((item) => item.Country === targetCountry);
        }

        const plotElement = plotRef.current;
        const locations = target
          ? [target.Country]
          : data.map((d) => d["Country"]);
        const risks = target
          ? [getRiskLevel(target["Risk Level"])]
          : data.map((d) => getRiskLevel(d["Risk Level"]));
        const hoverText = target
          ? `<b>${target.Country}</b><br>` +
            `Risk Level: ${target["Risk Level"]}<br>` +
            `Description: ${target.Description}<br>` +
            `Last Updated: ${target["Last Updated"]}`
          : data.map(
              (d) =>
                `<b>${d["Country"]}</b><br>` +
                `Risk Level: ${d["Risk Level"]}<br>` +
                `Description: ${d["Description"]}<br>` +
                `Last Updated: ${d["Last Updated"]}`,
            );

        const plotData = [
          {
            type: "choropleth" as const,
            locationmode: "country names" as const,
            locations,
            z: risks,
            text: hoverText,
            hovertemplate: "%{text}<extra></extra>",
            colorscale: [
              [0, "#75ef75"],
              [0.33, "#e2e65b"],
              [0.66, "#ce6711"],
              [1, "#b30003"],
            ] as [number, string][],
            showscale: false,
            colorbar: {
              orientation: "h" as const,
              x: 0.5,
              y: 0,
              xanchor: "center" as const,
              yanchor: "bottom" as const,
              len: 0.4,
              thickness: 15,
              title: {
                text: "Risk Level",
                side: "top" as const,
                font: {
                  family: "Geist Mono",
                  size: 16,
                },
              },
              tickvals: [1, 2, 3, 4],
              ticktext: [
                "Normal Precautions",
                "Increased Caution",
                "Reconsider Travel",
                "Do Not Travel",
              ],
              ticks: "outside" as const,
              showticklabels: true,
              ticklabelposition: "outside" as const,
              tickfont: {
                family: "Geist Mono",
                size: 12,
              },
            },
          },
        ];

        const initialWidth = window.innerWidth;
        const initialHeight = window.innerHeight;

        const layout = {
          geo: {
            projection: {
              type: "equirectangular" as const,
            },
            domain: {
              x: [0, 1],
              y: [0, 1],
            },
            fitbounds: "locations" as const,
            showframe: false,
            showcoastlines: true,
            coastlinecolor: "#444",
            showland: true,
            landcolor: "#f0f0f0",
            showocean: true,
            oceancolor: "#ccf2ff",
            showcountries: true,
            resolution: 50,
          },
          autosize: false,
          width: initialWidth,
          height: initialHeight,
          margin: { t: 0, r: 0, b: 0, l: 0 },
        };

        const config = {
          responsive: false,
          displayModeBar: true,
          displaylogo: false,
          scrollZoom: true,
          autosizable: true,
          modeBarButtonsToRemove: ["select2d", "lasso2d", "toImage"],
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await Plotly.newPlot(plotElement, plotData, layout, config as any);

        if (!isMounted) return;

        // Resize function that uses the loaded Plotly
        const resizeMapWithPlotly = async () => {
          if (!plotRef.current) return;

          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;

          let width = windowWidth;
          let height = windowHeight;
          let offsetx = 0;
          let offsety = 0;

          if (windowWidth <= 480) {
            width = windowWidth * 8;
            height = windowHeight * 2.5;
            offsetx = -(width - windowWidth) / 2;
            offsety = -(height - windowHeight) / 2;
          } else if (windowWidth <= 768) {
            width = windowWidth * 5;
            height = windowHeight * 2;
            offsetx = -(width - windowWidth) / 2;
            offsety = -(height - windowHeight) / 2;
          } else if (windowWidth <= 1024) {
            width = windowWidth * 5;
            height = windowHeight * 2;
            offsetx = -(width - windowWidth) / 2;
            offsety = -(height - windowHeight) / 2;
          }

          if (plotRef.current) {
            plotRef.current.style.left = `${offsetx}px`;
            plotRef.current.style.top = `${offsety}px`;
          }

          const update = {
            width: width,
            height: height,
            autosize: false,
          };

          await Plotly.relayout(plotRef.current, update);
        };

        await resizeMapWithPlotly();

        const handleResize = () => {
          setTimeout(resizeMapWithPlotly, 100);
        };

        window.addEventListener("resize", handleResize);

        cleanupFunctions.push(() => {
          window.removeEventListener("resize", handleResize);
          if (plotElement) {
            Plotly.purge(plotElement);
          }
        });
      } catch (error) {
        console.error("Failed to load Plotly:", error);
      }
    };

    initializePlot();

    return () => {
      isMounted = false;
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [data, targetCountry]);

  return (
    <div className="relative w-screen h-screen">
      <div
        ref={plotRef}
        className="absolute inset-0"
        style={{
          minHeight: "100%",
          minWidth: "100%",
          top: 0,
          left: 0,
          transformOrigin: "center center",
        }}
      />
      {/* Desktop and iPad version */}
      <div className="hidden sm:flex fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/50 backdrop-blur-md border border-black px-4 py-2 rounded-full shadow-lg flex-row items-center gap-4 text-xs font-mono">
        <span className="font-[family-name:var(--font-geist-mono)] font-bold">
          Risk Levels:
        </span>
        <ColorBox color="#75ef75" label="Normal Precautions" />
        <div className="w-px h-6 bg-gray-400"></div>
        <ColorBox color="#e2e65b" label="Increased Caution" />
        <div className="w-px h-6 bg-gray-400"></div>
        <ColorBox color="#ce6711" label="Reconsider Travel" />
        <div className="w-px h-6 bg-gray-400"></div>
        <ColorBox color="#b30003" label="Do Not Travel" />
      </div>
      {/* Phone version */}
      <div className="flex sm:hidden fixed top-6 left-4 z-50 bg-white/50 backdrop-blur-md border border-black px-4 py-2 rounded-md shadow-lg flex-col items-start gap-2 text-xs font-mono">
        <span className="font-[family-name:var(--font-geist-mono)] font-bold">
          Risk Levels:
        </span>
        <ColorBox color="#75ef75" label="Normal Precautions" />
        <ColorBox color="#e2e65b" label="Increased Caution" />
        <ColorBox color="#ce6711" label="Reconsider Travel" />
        <ColorBox color="#b30003" label="Do Not Travel" />
      </div>
    </div>
  );
}
