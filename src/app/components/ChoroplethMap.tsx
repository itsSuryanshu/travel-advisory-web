"use client";

import { useEffect, useRef } from "react";
import * as Plotly from "plotly.js";
import type { Data, Layout, Config } from "plotly.js";

interface ParsedData {
  Country: string;
  "Risk Level": string;
  Description: string;
  "Last Updated": string;
}

interface ChoroplethProps {
  data: ParsedData[];
}

export default function Choropleth({ data }: ChoroplethProps) {
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

    const plotElement = plotRef.current;
    const locations = data.map((d) => d["Country"]);
    const risks = data.map((d) => getRiskLevel(d["Risk Level"]));
    const hoverText = data.map(
      (d) =>
        `<br>` +
        `<b>${d["Country"]}</b><br>` +
        `Risk Level: ${d["Risk Level"]}<br>` +
        `Description: ${d["Description"]}<br>` +
        `Last Updated: ${d["Last Updated"]}`,
    );

    const plotData: Partial<Data>[] = [
      {
        type: "choropleth",
        locationmode: "country names",
        locations,
        z: risks,
        text: hoverText,
        hovertemplate: "%{text}<extra></extra>",
        colorscale: [
          [0, "#75ef75"],
          [0.33, "#e2e65b"],
          [0.66, "#ce6711"],
          [1, "#b30003"],
        ],
        showscale: true,
        colorbar: {
          //bgcolor: "7A7A7A",
          orientation: "h",
          x: 0,
          y: -0,
          xanchor: "left",
          xpad: 500,
          title: {
            text: "Risk Level",
            side: "top",
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
          ticks: "outside",
          showticklabels: true,
          ticklabelposition: "outside",
          tickfont: {
            family: "Geist Mono",
            size: 12,
          },
        },
      },
    ];

    const layout: Partial<Layout> = {
      // title: {
      //   text: "Canadian Travel Advisory",
      //   x: 0.5,
      //   font: { size: 25 },
      // },
      geo: {
        projection: {
          type: "equirectangular",
        },
        domain: {
          x: [0, 1],
          y: [0, 1],
        },
        showframe: false,
        showcoastlines: true,
        coastlinecolor: "#444",
        showland: true,
        landcolor: "#f0f0f0",
        showocean: true,
        oceancolor: "ccf2ff",
        showcountries: true,

        resolution: 110,
      },
      autosize: true,
      margin: { t: 0, r: 0, b: 0, l: 0 },
    };

    const config: Partial<Config> = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ["select2d", "lasso2d", "toImage"],
    };

    Plotly.newPlot(plotElement, plotData, layout, config);

    return () => {
      if (plotElement) {
        Plotly.purge(plotElement);
      }
    };
  }, [data]);

  return <div ref={plotRef} className="w-full h-full" />;
}
