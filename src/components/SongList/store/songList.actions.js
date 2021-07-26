import { songListConstants } from './songList.types';
import Spotify from 'spotify-web-api-js';
let spotify = new Spotify();


export const getSongList = data => async dispatch => {
  console.log("check check", process.env.REACT_APP_ACCESS_TOKEN)
  try {
    await spotify.setAccessToken(process.env.REACT_APP_ACCESS_TOKEN)
    let songs = await spotify.searchTracks(data.searchKey, {limit : data.limit , offset: data.offset});
    
    songs['offset'] = data.offset
    dispatch({
      type: songListConstants.GET_SONG_LIST,
      payload: songs.tracks,
    });
  } catch (err) {
    return err;
  }
};

