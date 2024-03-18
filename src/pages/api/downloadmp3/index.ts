// pages/api/download.js

import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { url: videoURL } = req.query as { url: string };

    try {
      // Check if the URL is valid
      if (!ytdl.validateURL(videoURL)) {
        throw new Error("Invalid YouTube video URL");
      }

      // Get basic information about the video
      const videoInfo = await ytdl.getInfo(videoURL);

      // Choose the format you want to download (e.g., "mp4")
      const format = ytdl.chooseFormat(videoInfo.formats, {
        quality: "highestaudio",
      });

      // Set response headers for streaming video
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${videoInfo.videoDetails.title}.mp3"`
      );
      res.setHeader("Content-Type", "audio/mpeg");

      const videoStream = ytdl(videoURL, { format });

      videoStream.pipe(res);

      videoStream.on("end", () => {
        console.log("Streaming complete!");
      });
    } catch (error: any) {
      console.error("Error:", error.message);
      res.status(500).send(`Error: ${error.message}`);
    }
  } else {
    res.status(405).send("Unsupported Method");
  }
}
