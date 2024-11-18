import { defineStore } from 'pinia';
import { useAuthStore } from './auth.js';  // Import auth store
import getters from './songs-getters.js';

export interface Song {
  songId: number;
  songName: string;
  artistId: number;
  userId: number;
  firstKey?: string | null;
  firstKeyNotes?: string | null;
  firstChordProgression?: string | null;
  secondKey?: string | null;
  secondKeyNotes?: string | null;
  secondChordProgression?: string | null;
  practicedPrcntg?: number | null;
  isFavorite?: boolean | null;
  isMySong?: boolean | null;
  bpm?: number | null;
  capo?: number | null;
  songText?: string | null;
  ytLink?: string | null;
  chordsWebsiteLink?: string | null;
  acoustic?: boolean | null;
  electric?: boolean | null;
  difficulty?: string | null;
  tuning?: string | null;
  lastViewed?: string | null;
  imgUrl?: string | null;
  [key: string]: any; // TODO: check where "artist" property comes
}

interface WebsiteLink {
  id: number;
  name: string;
  link: string;
  userId: number;
  [key: string]: any;
}

interface Artist {
  artistId: number;
  userId: number;
  name: string;
  imgUrl?: string | null;
  order?: number;
}

interface Playlist {
  id: number;
  name: string;
  userId: number;
  songs: Song[];
  [key: string]: any;
}

export interface State {
  songDetailTitle: string | null;
  songsLoading: boolean;
  songsOffset: number;
  allSongsLoaded: boolean;
  musicKeys: object[];
  artists: Artist[];
  mySongs: Song[];
  songs: Song[];
  playlists: Playlist[];
  activePlaylistSongs: number[]; // TODO: check
  activeFilters: string[];
  usefulResources: {
    notes: string | null;
    websitesLinks: WebsiteLink[]; // TODO: type this
    txtAreaHeight: number;
  };
}

export const useSongsStore = defineStore('songs', {
    state: (): State => ({
      songDetailTitle: null,
      songsLoading: false,
      songsOffset: 0,
      allSongsLoaded: false,
      musicKeys: [],
      artists: [],
      mySongs: [],
      songs: [],
      playlists: [],
      activePlaylistSongs: [],
      activeFilters: ["all"],
      usefulResources: {
          notes: null,
          websitesLinks: [],
          txtAreaHeight: 600
      }
    }),
    getters,
    actions: {
      clearStore() {
        this.songDetailTitle = null;
        this.songsLoading = false;
        this.songsOffset = 0;
        this.allSongsLoaded = false;
        this.musicKeys = [];
        this.artists = [];
        this.mySongs = [];
        this.songs = [];
        this.playlists = [];
        this.activePlaylistSongs = [];
        this.activeFilters = ['all'];
        this.usefulResources = {
          notes: null,
          websitesLinks: [],
          txtAreaHeight: 600,
        };
      },
      setLoader() {
        this.songsLoading = true;
      },
      removeLoader() {
          this.songsLoading = false;
      },
      setAllSongsLoaded(payload: boolean) {
        this.allSongsLoaded = payload;
      },
      increaseSongsOffset(payload: number) {
        this.songsOffset = this.songsOffset + payload;
      },
      toggleFavorite(payload: { songId: number; isMySong: boolean }) {
        let index;
        
        if (payload.isMySong) {
          index = this.mySongs.findIndex(song => song.songId === payload.songId);
          
          if (index !== -1) {
            this.mySongs[index].isFavorite = !this.mySongs[index].isFavorite;
          }
        } else {
          index = this.songs.findIndex(song => song.songId === payload.songId);
          
          if (index !== -1) {
            this.songs[index].isFavorite = !this.songs[index].isFavorite;
          }
        }
      },
      setSongDetailTitle(payload: string) {
        this.songDetailTitle = payload;
      },
      sortSongs(option: string) {
        if (option === "A-Z") {
          this.songs.sort((a, b) => a.songName.localeCompare(b.songName));
        } else if (option === "Z-A") {
          this.songs.sort((a, b) => b.songName.localeCompare(a.songName));
        } else if (option === "Least learned") {
          this.songs.sort((a, b) => (a.practicedPrcntg ?? 0) - (b.practicedPrcntg ?? 0));
        } else if (option === "Best learned") {
          this.songs.sort((a, b) => (b.practicedPrcntg ?? 0) - (a.practicedPrcntg ?? 0));
        } else if (option === "Last added") {
          this.songs.sort((a, b) => (new Date(b.lastViewed ?? 0).getTime()) - (new Date(a.lastViewed ?? 0).getTime()));
        } else {
          this.songs.sort((a, b) => (new Date(a.lastViewed ?? 0).getTime()) - (new Date(b.lastViewed ?? 0).getTime()));
        }
      },
      deleteSong(id: number) { // TODO: check if its really number instaed of string
        let index = this.songs.findIndex(song => song.songId === id);
        if (index === -1) {
          index = this.mySongs.findIndex(song => song.songId === id);
          if (index !== -1) {
            this.mySongs.splice(index, 1);
          }
        } else {
          this.songs.splice(index, 1);
        }
      },
      updateSong(payload: { songId: number; isMySong: boolean; songData: Song }) {
        let index;
        if (payload.isMySong) {
          index = this.mySongs.findIndex(song => song.songId === payload.songId);
          if (index !== -1) {
            this.mySongs[index] = payload.songData;
          }
        } else {
          index = this.songs.findIndex(song => song.songId === payload.songId);
          if (index !== -1) {
            this.songs[index] = payload.songData;  // Update the song in 'songs'
          }
        }
      },
      insertSong(payload: Song) {
        if (payload.isMySong) {
          this.mySongs.unshift(payload);
        } else {
          this.songs.unshift(payload);
        }
      },
      setAllSongs(payload: Song[]) {
        payload.forEach(song => {
          if (song.isMySong) {
            this.mySongs.push(song); 
          } else {
            this.songs.push(song);
          }
        });
      },

      // ARTISTS
      setAllArtists(payload: Artist[]) {
        const authStore = useAuthStore();
        this.artists = payload.filter(artist => artist.name !== authStore.user.username);
        this.artists.forEach((artist, index) => {
          artist.order = index + 1;
        });
      },
      sortArtists(option: string) {
        if (option === "A-Z") {
          this.artists.sort((a, b) => a.name.localeCompare(b.name));
        } else if (option === "Z-A") {
          this.artists.sort((a, b) => b.name.localeCompare(a.name));
        }
      },
      updateArtistsList(payload: Artist[]) {
        this.artists = payload;
      },

      // RESOURCES
      storeMusicKeys(payload: object[]) {
        this.musicKeys = payload;
      },
      updateUserNotes(payload: string) {
        this.usefulResources.notes = payload;
      },
      addUserWebsite(payload: WebsiteLink) { // TODO: check
        this.usefulResources.websitesLinks.unshift(payload);
      },
      deleteUserWebsite(name: string) {
        const index = this.usefulResources.websitesLinks.findIndex(link => link.name === name);
        if (index !== -1) {
          this.usefulResources.websitesLinks.splice(index, 1);
        }
      },
      updateTxtAreaHeight(payload: number) {
        this.usefulResources.txtAreaHeight = payload;
      },
      setUserWebsites(payload: WebsiteLink[]) {
        this.usefulResources.websitesLinks = payload;
      },

      // PLAYLISTS
      setPlaylists(payload: Playlist[]) {
        this.playlists = payload;
      },
      addPlaylist(payload: Playlist) {
        this.playlists.push(payload);
      },
      setActiveFilters(payload: string[]) {
        this.activeFilters = payload;
      },
      addSongsForPlaylist(payload: number[]) { // TODO: check what this is
        this.activePlaylistSongs = payload.reverse();
      },
      addSongInPlaylist(payload: number) {
        this.activePlaylistSongs.push(payload);
      },
      deleteSongFromPlaylist(songId: number) {
        const index = this.activePlaylistSongs.findIndex(elem => elem === songId);
        if (index !== -1) this.activePlaylistSongs.splice(index, 1);
      },
      updatePlaylistName(payload: Playlist) {
        const index = this.playlists.findIndex(elem => elem === payload.playlist_name);
        if (index !== -1) {
          this.playlists[index] = payload.new_playlist_name;
        }
      },
      deletePlaylist(name: string) {
        const index = this.playlists.findIndex(elem => elem === name);
        if (index !== -1) {
          this.playlists.splice(index, 1);
          this.activePlaylistSongs = [];
        }
      },

      // ACTION GETTERS
      indexOfCurrentSong(payload: any): number { // TODO
        const activeFilters = this.activeFilters;

        if (payload.query?.isMySong) {
          return this.mySongs.findIndex(song => song.songId === payload.id);
        } else if (payload.playlist) {
          const filteredSongs = this.songs.filter(song => activeFilters.includes(song.artist));

          return filteredSongs.findIndex(song => song.songId === payload.id);
        } else {
          if (activeFilters[0] !== "all") {
            const filteredSongs = this.songs.filter(song => activeFilters.includes(song.difficulty ?? ''));
            return filteredSongs.findIndex(song => song.songId === payload.id);
          }

          return this.songs.findIndex(song => song.songId === payload.id);
        }
      },
  
      filterSongs(filters: string[], query: any = {}) {
        // In case of displaying all songs from an artist
        if (filters[0] === "all" && query?.artist) {
          return this.songs.filter(song => song.artist.toLowerCase() == query?.artist.toLowerCase());
        }
        // In case of displaying all songs
        if (filters[0] === "all") {
          if (query?.isMySong) return this.mySongs;
          return this.songs;
        }
        // Filter songs when filter option is !== "all"
        if (query?.isMySong) {
          return this.mySongs.filter(song => this.shouldFilterSong(filters, song));
        } else if (query?.artist) {
          return this.songs.filter(song => song.artist.toLowerCase() === query?.artist.toLowerCase()).filter(song => {
            return this.shouldFilterSong(filters, song);
          });
        } else {
          return this.songs.filter(song => this.shouldFilterSong(filters, song));
        }
      },

      shouldFilterSong(filters: string[], song: any) {
        return filters.every(filterOption => {
          if (filterOption === "favorites") {
            return song.isFavorite;
          }
          if (filterOption === "acoustic") {
            return song.acoustic;
          }
          if (filterOption === "electric") {
            return song.electric;
          }
          return song.difficulty === filterOption;
        });
      },
  
    }
  });