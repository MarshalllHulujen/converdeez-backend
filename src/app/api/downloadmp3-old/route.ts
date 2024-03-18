import { NextResponse, NextRequest } from "next/server";
import ytdl from "ytdl-core";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    const value: string = url as string;

    if (!value || !ytdl.validateURL(value)) {
      return new Response("Invalid or missing YouTube URL", {
        status: 400,
      });
    }

    const info: any = await ytdl.getInfo(value);

    const videoFormat = ytdl.chooseFormat(info.formats, {
      quality: "highestaudio",
    });
    const sanitizeName = info.videoDetails.title;

    const result = ytdl(value, { format: videoFormat });

    const headers = {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `attachment; filename="${sanitizeName}.mp3"`,
    };

    result.pipe(headers);

    result.on("end", () => {
      console.log("Streaming complete!");
    });

    return new Response(result);
  } catch (error) {
    console.error(error);
    return new Response("Error", {
      status: 500,
    });
  }
}

pages / api / download.js;
