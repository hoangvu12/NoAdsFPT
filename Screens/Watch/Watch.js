import React, { useEffect, useState, useContext } from "react";
import { View, Text } from "react-native";

import Video from "../../Components/Video";

import { getAnimeInfo, getVideoSource } from "../../models/Anime";
import { isEmpty } from "../../utils/";
import useOrientation from "../../hooks/useOrientation";

import { VideoContext } from "../../Components/Video/Store";

export default function Watch({ route, navigation }) {
  const { id } = route.params;

  const {
    episode: [episode, setEpisode],
    maxEpisode: [maxEpisode, setMaxEpisode],
    info: [info, setInfo],
  } = useContext(VideoContext);

  const [videoUrl, setVideoUrl] = useState("");

  const orientation = useOrientation();

  const handleEpisodePress = ({ id: episode }) => setEpisode(episode);

  useEffect(() => {
    const getData = async () => {
      const info = await getAnimeInfo({ id });

      setInfo(info);
      setMaxEpisode(info.episodes[info.episodes.length - 1]._id);
    };

    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const { url } = await getVideoSource({ id, episode });

      let videoUrl = url;

      if (!videoUrl.includes("https")) {
        videoUrl = url.replace("http", "https");
      }

      setVideoUrl(videoUrl);
    };

    getData();
  }, [episode]);

  return (
    <>
      {!isEmpty(info) && (
        <View style={{ flex: 1, backgroundColor: "#18191A" }}>
          <Video source={videoUrl} />

          {orientation !== "LANDSCAPE" && (
            <Video.Description onEpisodePress={handleEpisodePress} />
          )}
        </View>
      )}
    </>
  );
}
