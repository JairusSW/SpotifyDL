import Undici from "undici";

export async function getAccessToken(client_id: string, client_secret: string) {
  const access_token = await (
    await Undici.request("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
    })
  ).body.json();
  return access_token;
}

export async function getArtistInfo(artist_id: string, access_token: string) {
  const artist_info = await (
    await (
      await Undici.request(`https://api.spotify.com/v1/artists/${artist_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer  ${access_token}`,
        },
      })
    ).body
  ).json();
  return artist_info;
}

export async function getTrackInfo(track_id: string, access_token: string) {
  const track_info = await (
    await (
      await Undici.request(`https://api.spotify.com/v1/tracks/${track_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer  ${access_token}`,
        },
      })
    ).body
  ).json();
  return track_info;
}

export async function getPlaylistInfo(playlist_id: string, access_token: string) {
  const track_info = await (
    await (
      await Undici.request(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer  ${access_token}`,
        },
      })
    ).body
  ).json();
  return track_info;
}