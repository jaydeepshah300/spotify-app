import { songListConstants } from './songList.types';
const initialState = {
  songList: [],
  hasMore : true,
  apiCalled : false
};

function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case songListConstants.GET_SONG_LIST:
      return {
        ...state,
        songList: payload.offset === 0 ? payload.items : state.songList.concat(payload.items),
        hasMore: payload.next === null ? false : true,
        apiCalled : true
      };
    default:
      return state;
  }
}
export default reducer
