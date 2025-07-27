"use client";

import { useEffect, useRef } from "react";
import * as Plotly from "plotly.js";
import type { Data, Layout, Config } from "plotly.js";

interface ParsedData {
    "Country": string;
    "Risk Level": string;
    "Description": string;
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
            "do-not-travel": 3,
        }
        return riskMap[risk];
    };

    useEffect(() => {
        if (!plotRef.current || !data.length) return;

        const plotElement = plotRef.current;
        const locations = data.map(d => d["Country"]);
        const risks = data.map(d => getRiskLevel(d["Risk Level"]));
        const hoverText = data.map(d =>
            `<b>${d["Country"]}</b><br>` +
            `Risk Level: ${d["Risk Level"]}<br>` +
            `Description: ${d["Description"]}<br>` +
            `Last Updated: ${d["Last Updated"]}`
        );

        const plotData: Partial<Data>[] = [{
            type: "choropleth",
            locationmode: "country names",
            locations,
            z: risks,
            text: hoverText,
            hovertemplate: "%{text}<extra></extra>",
            colorscale: [
                [0, "#3E8B57"],
                [0.5, "#FF8C00"],
                [1, "#DC143C"]
            ],
            showscale: true,
            colorbar: {
                title: {
                    text: "Risk Level",
                },
                tickvals: [1, 2, 3],
                ticktext: ["Normal Precautions", "Increased Caution", "Do Not Travel"],
                x: 1.02
            }
        }];

        const layout: Partial<Layout> = {
            title: {
                text: "Canadian Travel Advisory",
                x: 0.5,
                font: { size: 16 }
            },
            geo: {
                projection: {
                    type: "natural earth"
                },
                showframe: false,
                showcoastlines: true,
                coastlinecolor: "#444",
                showland: true,
                landcolor: "#f0f0f0",
            },
            width: 1000,
            height: 600,
            margin: { t: 60, r: 100, b: 40, l: 40 }
        };

        const config: Partial<Config> = {
            responsive: true
        };

        Plotly.newPlot(plotElement, plotData, layout, config);

        return () => {
            if (plotElement) {
                Plotly.purge(plotElement);
            }
        };
    }, [data]);

    return (
        <div ref={plotRef} />
    );
}