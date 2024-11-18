import type { State } from './songs.js';  

export default {
  songsLoading(state: State) {
    return state.songsLoading;
  },
  getMusicKeys(state: State) {
    return state.musicKeys;
  },
  getSongDetailTitle(state: State) {
    return state.songDetailTitle;
  },
  getAllSongs(state: State) {
    return state.songs;
  },
  getAllSongsLen(state: State) {
    return state.songs.length;
  },
  getAllMySongsLen(state: State) {
    return state.mySongs.length;
  },
  getAllMySongs(state: State) {
    return state.mySongs;
  },
  findSong(state: State) {
    return (songId: number) => {
      let foundSong = state.songs.find(song => song.songId == songId);
      if (!foundSong) {
        foundSong = state.mySongs.find(song => song.songId == songId);
      }
      return foundSong;
    };
  },
//    filterSongs(state: State, getters: any) { // TODO: check
//      return (filters: any[], query: any = {}) => {
//        if (filters[0] === "all" && query?.artist) {
//          return state.songs.filter(song => song.artist.toLowerCase() == query?.artist.toLowerCase());
//        }
//        if (filters[0] === "all") {
//          if (query?.isMySong) return state.mySongs;
//          return state.songs;
//        }
//        if (query?.isMySong) {
//          return state.mySongs.filter(song => getters.shouldFilterSong(filters, song));
//        } else if (query?.artist) {
//          return state.songs.filter(song => song.artist.toLowerCase() === query?.artist.toLowerCase()).filter(song => {
//            return getters.shouldFilterSong(filters, song);
//          });
//        } else {
//          return state.songs.filter(song => {
//            return getters.shouldFilterSong(filters, song);
//          });
//        }
//      };
//    },

//   shouldFilterSong() {
//     return (filters: any[], song: any) => {
//       return filters.every(filterOption => {
//         if (filterOption === "favorites") {
//           return song.isFavorite;
//         }
//         if (filterOption === "acoustic") {
//           return song.acoustic;
//         }
//         if (filterOption === "electric") {
//           return song.electric;
//         }
//         return song.difficulty === filterOption;
//       });
//     };
//   },

//   getSongsFromPlaylist(state: State, getters: any) {
//     return (filters: any[]) => {
//       const activePlaylistSongs = state.activePlaylistSongs;
//       if (filters[0] === "all") return state.songs.filter(song => activePlaylistSongs.includes(song.songId));
//       return state.songs.filter(song => activePlaylistSongs.includes(song.songId) && getters.shouldFilterSong(filters, song));
//     };
//   },
  getActiveFilters(state: State) {
    return state.activeFilters;
  },
//   getSongsByKey(state: State) {
//     const keys = state.musicKeys;
//     const sortedSongs = {};
//     const songs = state.songs;
//     if (!keys.length) return;

//     songs.forEach(song => { // TODO
//       if (!song.firstKey) return;

//       let [key, quality] = song.firstKey.toLowerCase().split(" ");
//       const songData = { songId: song.songId, songName: song.songName, artist: song.artist, songKey: song.firstKey, imgUrl: song.imgUrl };

//       if (quality === "minor") {
//         let relativeMajor = keys.filter(item => {
//           return item.relativeMinor.toLowerCase() === key;
//         })[0].key.toLowerCase();

//         if (sortedSongs[relativeMajor]) sortedSongs[relativeMajor].push(songData);
//         else sortedSongs[relativeMajor] = [songData];

//       } else {
//         if (sortedSongs[key]) sortedSongs[key].push(songData);
//         else sortedSongs[key] = [songData];
//       }
//     });
//     return sortedSongs;
//   },
  getArtists(state: State) {
    return state.artists;
  },
  getPlaylists(state: State) {
    return state.playlists;
  },
  getActivePlaylistSongsLength(state: State) {
    return state.activePlaylistSongs.length;
  },
  getUserNotes(state: State) {
    return state.usefulResources.notes;
  },
  getUserWebsitesLinks(state: State) {
    return state.usefulResources.websitesLinks;
  },
  getTxtAreaHeight(state: State) {
    return state.usefulResources.txtAreaHeight;
  },
  allSongsLoaded(state: State) {
    return state.allSongsLoaded;
  },
  getSongsOffset(state: State) {
    return state.songsOffset;
  },
};
