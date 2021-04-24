import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type IEpisode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type IPlayerContext = {
  episodes: Array<IEpisode>;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  play: (episode: IEpisode) => void;
  playList: (list: Array<IEpisode>, index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
  clearPlayerState: () => void;
  playNext: () => void;
  playPrevious: () => void;
};

type IPlayerContextProviderProps = {
  children: ReactNode;
};

export const PlayerContext = createContext({} as IPlayerContext);

export function PlayerContextProvider({
  children,
}: IPlayerContextProviderProps) {
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {}, []);

  function play(episode: IEpisode) {
    setEpisodes([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Array<IEpisode>, index: number) {
    setEpisodes(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState() {
    setEpisodes([]);
    setCurrentEpisodeIndex(0);
  }

  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodes.length;
  const hasPrevious = currentEpisodeIndex - 1 >= 0;

  function playNext() {
    if (isShuffling) {
      const nextIndex = Math.round(Math.random() * episodes.length);
      setCurrentEpisodeIndex(nextIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (hasPrevious) setCurrentEpisodeIndex(currentEpisodeIndex - 1);
  }

  return (
    <PlayerContext.Provider
      value={{
        episodes,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        hasNext,
        hasPrevious,
        play,
        playList,
        playNext,
        playPrevious,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        clearPlayerState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  return useContext(PlayerContext);
};
