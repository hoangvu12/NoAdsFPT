import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import Video from "../../Components/Video/Video";

import { getAnimeInfo, getVideoSource } from "../../utils/api";
import { isEmpty } from "../../utils/";

export default function Watch({ route, navigation }) {
  const [info, setInfo] = useState({});
  const [episode, setEpisode] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const { id } = route.params;

  const handleEpisodePress = (episode) => {
    setEpisode(episode);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const info = await getAnimeInfo({ id });

      setInfo(info);

      setLoading(false);
    };

    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const { url } = await getVideoSource({ id, episode });

      setVideoUrl(url);
      setLoading(false);
    };

    getData();
  }, [episode]);

  return (
    <>
      {!isEmpty(info) && (
        <View style={{ flex: 1, backgroundColor: "#18191A" }}>
          <Video source={videoUrl} />

          <Video.Description
            data={info}
            episode={episode}
            onEpisodePress={handleEpisodePress}
          />
        </View>
      )}
    </>
  );
}
