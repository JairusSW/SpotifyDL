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
exports.getPlaylistInfo = exports.getTrackInfo = exports.getArtistInfo = exports.getAccessToken = void 0;
const undici_1 = __importDefault(require("undici"));
function getAccessToken(client_id, client_secret) {
    return __awaiter(this, void 0, void 0, function* () {
        const access_token = yield (yield undici_1.default.request("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
        })).body.json();
        return access_token;
    });
}
exports.getAccessToken = getAccessToken;
function getArtistInfo(artist_id, access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const artist_info = yield (yield (yield undici_1.default.request(`https://api.spotify.com/v1/artists/${artist_id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer  ${access_token}`,
            },
        })).body).json();
        return artist_info;
    });
}
exports.getArtistInfo = getArtistInfo;
function getTrackInfo(track_id, access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const track_info = yield (yield (yield undici_1.default.request(`https://api.spotify.com/v1/tracks/${track_id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer  ${access_token}`,
            },
        })).body).json();
        return track_info;
    });
}
exports.getTrackInfo = getTrackInfo;
function getPlaylistInfo(playlist_id, access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const track_info = yield (yield (yield undici_1.default.request(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
            method: "GET",
            headers: {
                Authorization: `Bearer  ${access_token}`,
            },
        })).body).json();
        return track_info;
    });
}
exports.getPlaylistInfo = getPlaylistInfo;
