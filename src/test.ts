import { createWriteStream, writeFile } from "fs";
import { getAccessToken, getPlaylistInfo, getTrackInfo } from "./auth";
import { search } from "play-dl";
import ytdl, { videoFormat } from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import { FFmpeg } from "prism-media";
const access_token = "BQCd4AWSCM5JQ5sJ5vNoKrioXDRSktpYEZ33S0nZmrsVvBS96YC1AWU4gP74GcyuTGqYKAnrKeTHPV_XO5iktRkgzAZbM8BzLVBYs_ZX_Lb1hSv2Hng"/*getAccessToken(
  "e16ba747847f4705b3f162645e6d6f14",
  "648b8f2568924b86b5ad18925413951b"
).then(console.log)*/

export async function downloadTrack(track_id: string, access_token: string) {
  const track_info = await getTrackInfo(track_id, access_token);
  const name = track_info.name as string;
  const artist = track_info.artists[0].name as string;
  console.log(`${artist} - ${name}`);
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
  transcoder.pipe(createWriteStream(`dl/${artist} - ${name}.mp3`));
  transcoder.on("close", () => {
    console.log("closed")
  })
  transcoder.on("finish", () => {
    console.log("finished")
  })
}

function nextBestFormat(formats: ytdl.videoFormat[]) {
  formats = formats
    .filter(format => format.bitrate)
    .filter(format => !format.fps)
    .sort((a: videoFormat, b: videoFormat) => b.bitrate! - a.bitrate!);
	return formats[0];
}

downloadTrack("4hL5RU7vwnquO8a7RKmFL8", access_token);

export async function downloadPlaylist(playlist_id: string, access_token: string) {
  const playlist_info = await getPlaylistInfo(playlist_id, access_token);
  console.log(playlist_info)
  for (let i = 0; i < playlist_info.items.length; i++) {
    const track = playlist_info.items[i];
    console.log(`Downloading ${track.track.artists[0].name} - ${track.track.name}`);
    downloadTrack(track.track.id, access_token);
  }
}

downloadPlaylist("2QtTv6MY7SlP2BHuSo4zAG", access_token);