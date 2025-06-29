import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const bucket_name = process.env.S3_BUCKET_NAME!;

export async function generatePresignedURL(): Promise<string> {
    try {
        const listFolders = new ListObjectsV2Command({
            Bucket: process.env.S3_BUCKET_NAME!,
        });

        const listResponse = await Client.send(listFolders);
        // returns nothing -> no data found
        if (!listResponse.Contents || listResponse.Contents.length === 0) {
            throw new Error("No data folders found.");
        }

        const csvFiles = listResponse.Contents
            .filter(obj => obj.Key?.endsWith(".csv"))
            .sort((a, b) => {
                const dateA = a.LastModified?.getTime() || 0;
                const dateB = b.LastModified?.getTime() || 0;
                return dateB - dateA;
            });
        // returns nothing -> no data found
        if (csvFiles.length === 0) throw new Error("No data folders found.");

        const mostRecentFile = csvFiles[0];
        const fileKey = mostRecentFile.Key!;

        const getCommand = new GetObjectCommand({
            Bucket: bucket_name,
            Key: fileKey,
        });

        const presignedUrl = await getSignedUrl(Client, getCommand, { expiresIn: 180 });
        return presignedUrl;
    } catch (error) {
        console.error("Error generating presignedUrl: ", error);
        throw new Error("Failed to generate presignedUrl.");
    }
}