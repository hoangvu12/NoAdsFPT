import React, { useContext, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import tailwind from "tailwind-rn";
import {
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { VideoContext } from "./Store";

export default function OverlayBar(props) {
  const {
    episode: [episode, setEpisode],
    maxEpisode: [maxEpisode, setMaxEpisode],
  } = useContext(VideoContext);

  const { status, video } = props;

  const onPreviousButtonPress = useCallback(async () => {
    await video.current.pauseAsync();

    setEpisode(episode > 0 ? episode - 1 : 0);
  }, []);

  const onSeekLeftPress = useCallback(async () => {
    await video.current.setPositionAsync(status.positionMillis - 10000);
  }, []);

  const onPlayPress = () =>
    status.isPlaying ? video.current.pauseAsync() : video.current.playAsync();

  const onSeekRightPress = useCallback(async () => {
    await video.current.setPositionAsync(status.positionMillis + 10000);
  }, []);

  const onNextButtonPress = useCallback(async () => {
    await video.current.pauseAsync();

    setEpisode(episode + 1);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          disabled={episode === 0}
          onPress={onPreviousButtonPress}
        >
          <MaterialCommunityIcons
            name="rewind"
            size={30}
            color={episode === 0 ? "gray" : "white"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onSeekLeftPress}>
          <MaterialIcons name="replay" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onPlayPress}>
          {status.isBuffering && (
            <ActivityIndicator size={80} color="#FF6400" />
          )}

          {!status.isBuffering && (
            <MaterialIcons
              name={status.isPlaying ? "pause" : "play-arrow"}
              size={80}
              color="white"
              iconStyle={{ borderWidth: 10, borderColor: "black" }}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onSeekRightPress}>
          <MaterialIcons
            name="replay"
            size={30}
            color="white"
            style={{ transform: [{ rotateY: "180deg" }] }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={episode >= maxEpisode - 1}
          onPress={onNextButtonPress}
        >
          <Entypo
            name="controller-fast-forward"
            size={30}
            color={episode >= maxEpisode ? "gray" : "white"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...tailwind("w-full"),
    alignItems: "center",
  },
  buttonContainer: {
    ...tailwind("w-4/6"),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
