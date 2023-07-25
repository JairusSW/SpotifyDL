"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadPlaylist = exports.downloadTrack = void 0;
const fs_1 = require("fs");
const auth_1 = require("./auth");
const play_dl_1 = require("play-dl");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const prism_media_1 = require("prism-media");
const access_token = "BQCd4AWSCM5JQ5sJ5vNoKrioXDRSktpYEZ33S0nZmrsVvBS96YC1AWU4gP74GcyuTGqYKAnrKeTHPV_XO5iktRkgzAZbM8BzLVBYs_ZX_Lb1hSv2Hng"; /*getAccessToken(
  "e16ba747847f4705b3f162645e6d6f14",
  "648b8f2568924b86b5ad18925413951b"
).then(console.log)*/
function downloadTrack(track_id, access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const track_info = yield (0, auth_1.getTrackInfo)(track_id, access_token);
        const name = track_info.name;
        const artist = track_info.artists[0].name;
        console.log(`${artist} - ${name}`);
        const url = (yield (0, play_dl_1.search)(artist + " " + name, { limit: 1 }))[0].url;
        const info = yield ytdl_core_1.default.getInfo(url);
        const bestFormat = nextBestFormat(info.formats);
        const transcoder = new prism_media_1.FFmpeg({
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
        transcoder.pipe((0, fs_1.createWriteStream)(`dl/${artist} - ${name}.mp3`));
        transcoder.on("close", () => {
            console.log("closed");
        });
        transcoder.on("finish", () => {
            console.log("finished");
        });
    });
}
exports.downloadTrack = downloadTrack;
function nextBestFormat(formats) {
    formats = formats
        .filter(format => format.bitrate)
        .filter(format => !format.fps)
        .sort((a, b) => b.bitrate - a.bitrate);
    return formats[0];
}
downloadTrack("4hL5RU7vwnquO8a7RKmFL8", access_token);
function downloadPlaylist(playlist_id, access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const playlist_info = yield (0, auth_1.getPlaylistInfo)(playlist_id, access_token);
        console.log(playlist_info);
        for (let i = 0; i < playlist_info.items.length; i++) {
            const track = playlist_info.items[i];
            console.log(`Downloading ${track.track.artists[0].name} - ${track.track.name}`);
            downloadTrack(track.track.id, access_token);
        }
    });
}
exports.downloadPlaylist = downloadPlaylist;
downloadPlaylist("2QtTv6MY7SlP2BHuSo4zAG", access_token);
