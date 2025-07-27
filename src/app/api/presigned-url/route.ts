"use server";

import { NextResponse } from 'next/server';
import { generatePresignedURL } from "../../../../lib/aws-s3-connect";

export async function GET() {
    try {
        const axios = (await import("axios")).default;
        const url = await generatePresignedURL();

        if (!url) {
            NextResponse.json({
                success: false,
                error: 'Error connecting to data.',
                timestamp: new Date().toISOString()
            }, { status: 500 });
        }

        const response = await axios.get(url, {
            responseType: "text",
            timeout: 10000,
        });

        const csv_data = <string>response.data;
        return NextResponse.json({
            success: true,
            message: "CSV data fetched successfully.",
            data: {
                csv_data,
                url,
                metadata: {
                    size: csv_data.length,
                    contentType: response.headers["content-type"] || "text/csv",
                    lastModified: response.headers["last-modified"],
                    status: response.status,
                    statusText: response.statusText
                },
            },
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        const error = err as Error & {
            response?: { status: number; statusText?: string; data?: unknown };
            request?: { status: number; statusText?: string; data?: unknown }
        };
        console.error('Error getting data: ', error);

        if (error.response) {
            return NextResponse.json({
                success: false,
                error: `Failed to fetch data: ${error.response.status} - ${error.response.statusText}`,
                status: error.response.status,
                timestamp: new Date().toISOString()
            });
        } else if (error.request) {
            return NextResponse.json({
                success: false,
                error: "No data received.",
                status: error.request.status,
                timestamp: new Date().toISOString()
            });
        } else {
            return NextResponse.json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown Error.',
                status: 500,
                timestamp: new Date().toISOString()
            });
        }
    }
}