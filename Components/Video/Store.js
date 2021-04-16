import React, { createContext, useState } from "react";

export const VideoContext = createContext(null);

export default function Store({ children }) {
  const [isLocked, setIsLocked] = useState(false);
  const [episode, setEpisode] = useState(0);
  const [maxEpisode, setMaxEpisode] = useState(0);
  const [info, setInfo] = useState({});

  const store = {
    isLocked: [isLocked, setIsLocked],
    episode: [episode, setEpisode],
    maxEpisode: [maxEpisode, setMaxEpisode],
    info: [info, setInfo],
  };

  return (
    <VideoContext.Provider value={store}>{children}</VideoContext.Provider>
  );
}
