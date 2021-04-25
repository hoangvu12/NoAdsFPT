import React, { useContext } from "react";
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={episode === 0}
        onPress={async () => {
          await video.current.pauseAsync();

          setEpisode(episode > 0 ? episode - 1 : 0);
        }}
      >
        <MaterialCommunityIcons
          name="rewind"
          size={30}
          color={episode === 0 ? "gray" : "white"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          await video.current.setPositionAsync(status.positionMillis - 10000);
        }}
      >
        <MaterialIcons name="replay" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          status.isPlaying
            ? video.current.pauseAsync()
            : video.current.playAsync()
        }
      >
        {status.isBuffering && <ActivityIndicator size={80} color="gray" />}

        {!status.isBuffering && (
          <MaterialIcons
            name={status.isPlaying ? "pause" : "play-arrow"}
            size={80}
            color="white"
            iconStyle={{ borderWidth: 10, borderColor: "black" }}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          await video.current.setPositionAsync(status.positionMillis + 10000);
        }}
      >
        <MaterialIcons
          name="replay"
          size={30}
          color="white"
          style={{ transform: [{ rotateY: "180deg" }] }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        disabled={episode >= maxEpisode - 1}
        onPress={async () => {
          await video.current.pauseAsync();

          setEpisode(episode + 1);
        }}
      >
        <Entypo
          name="controller-fast-forward"
          size={30}
          color={episode >= maxEpisode - 1 ? "gray" : "white"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...tailwind("w-full"),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
