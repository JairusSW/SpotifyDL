import { createWriteStream, existsSync, writeFile } from "fs";
import { getAccessToken, getPlaylistInfo, getTrackInfo } from "./auth";
import { search } from "play-dl";
import ytdl, { videoFormat } from "ytdl-core";
import { FFmpeg } from "prism-media";
let access_token = "";

export function downloadTrack(track_id: string) {
  return new Promise<void>(async (resolve, reject) => {
    if (!access_token) {
      access_token = (
        await getAccessToken(
          "e16ba747847f4705b3f162645e6d6f14",
          "648b8f2568924b86b5ad18925413951b"
        )
      ).access_token as string;
      console.log("Created Access Token: " + access_token);
    }
    const track_info = await getTrackInfo(track_id, access_token);
    const name = track_info.name as string;
    const artist = track_info.artists[0].name as string;
    if (existsSync(`dl/${artist} - ${name.replace("/", "|")}.mp3`)) {
      console.log(
        `Already Downloaded ${artist} - ${name.replace("/", "|")}.mp3`
      );
      resolve();
    } else {
      console.log(`Downloading ${artist} - ${name}`);
      const url = (await search(artist + " " + name, { limit: 1 }))[0].url;
      const info = await ytdl.getInfo(url);
      const bestFormat = nextBestFormat(info.formats);
      const transcoder = new FFmpeg({
        args: [
          "-reconnect",
          "1",
          "-reconnect_streamed",
          "1",
          "-reconnect_delay_max",
          "5",
          "-i",
          bestFormat.url,
          "-analyzeduration",
          "0",
          "-loglevel",
          "0",
          "-f",
          "mp3",
          "-ar",
          "48000",
          "-ac",
          "2",
        ],
        shell: false,
      });
      transcoder.pipe(
        createWriteStream(`dl/${artist} - ${name.replace("/", "|")}.mp3`)
      );
      transcoder.on("end", () => {
        console.log(
          `Finished Downloading ${artist} - ${name.replace("/", "|")}.mp3`
        );
        resolve();
      });
      transcoder.on("error", () => {
        console.log(
          `Failed Downloading ${artist} - ${name.replace("/", "|")}.mp3`
        );
        resolve();
      });
    }
  });
}

function nextBestFormat(formats: ytdl.videoFormat[]) {
  formats = formats
    .filter((format) => format.bitrate)
    .filter((format) => !format.fps)
    .sort((a: videoFormat, b: videoFormat) => b.bitrate! - a.bitrate!);
  return formats[0];
}

export async function downloadPlaylist(playlist_id: string) {
  if (!access_token) {
    access_token = (
      await getAccessToken(
        "e16ba747847f4705b3f162645e6d6f14",
        "648b8f2568924b86b5ad18925413951b"
      )
    ).access_token as string;
    console.log("Created Access Token: " + access_token);
  }
  const playlist_info = await getPlaylistInfo(playlist_id, access_token);
  for (let i = 0; i < playlist_info.items.length; i++) {
    const track = playlist_info.items[i];
    await downloadTrack(track.track.id);
  }
}

downloadPlaylist("2QtTv6MY7SlP2BHuSo4zAG");
/*downloadTrack(
  "3ZtHqEyU0b1gG4CsOaVW28?"
);*/
