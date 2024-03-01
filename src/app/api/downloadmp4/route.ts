import { NextResponse, NextRequest } from 'next/server';
import ytdl from 'ytdl-core'
import fs from "fs"
import * as path from "path"

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request: NextRequest) {
    try {
        const url = request.nextUrl.searchParams
        const value: string = url as string;

        if (!value || !ytdl.validateURL(value)) {
            return new Response("Invalid or missing YouTube URL", {
                status: 400,
            });
        }

        const info: any = await ytdl.getInfo(value);
        const videoFormat = ytdl.chooseFormat(info.formats, { quality: "highestvideo", filter: "audioandvideo" });
        const sanitizeName = info.videoDetails.title;

        const result = ytdl(value, { format: videoFormat });

        const headers = {
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': `attachment; filename="${sanitizeName}.mp4"`,
        };

        return new NextResponse(result, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error(error);
        return new Response("Error", {
            status: 500,
        });
    }
}
