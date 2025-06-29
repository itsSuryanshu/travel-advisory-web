import { NextResponse } from 'next/server';
import { generatePresignedURL } from "../../../lib/aws-s3-connect";

export async function GET() {
    try {
        console.log('Generating presignedUrl...');

        const result = await generatePresignedURL();

        return NextResponse.json({
            success: true,
            message: 'S3 bucket presigned url generated.',
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('S3 Test Error:', error);

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}