import React, { useContext } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

import tailwind from "tailwind-rn";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import Slider from "@react-native-community/slider";

import { millisToMinutesAndSeconds } from "../../utils";
import { VideoContext } from "./Store";
import useOrientation from "../../hooks/useOrientation";

export default function ControlBar(props) {
  const {
    isLocked: [isLocked, setIsLocked],
  } = useContext(VideoContext);

  const { status, video } = props;

  const orientation = useOrientation();

  const handleSlideDrag = async (value) => {
    await video.current.setPositionAsync(value);
    video.current.playAsync();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={(_) => setIsLocked(!isLocked)}>
        <Entypo
          name={isLocked ? "lock-open" : "lock"}
          size={20}
          color="white"
          style={tailwind("ml-2")}
        />
      </TouchableOpacity>

      <Text style={tailwind("text-white")}>
        {millisToMinutesAndSeconds(status.positionMillis)}
      </Text>

      <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={0}
        maximumValue={status.durationMillis}
        value={status.positionMillis}
        minimumTrackTintColor="#FF6500"
        maximumTrackTintColor="#fff"
        thumbTintColor="#FF6500"
        onValueChange={handleSlideDrag}
      />

      <Text style={tailwind("text-white")}>
        {millisToMinutesAndSeconds(
          status.durationMillis - status.positionMillis
        )}
      </Text>

      <TouchableOpacity
        onPress={async () => {
          await ScreenOrientation.lockAsync(
            orientation === "LANDSCAPE"
              ? ScreenOrientation.OrientationLock.PORTRAIT
              : ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
          );
        }}
      >
        <MaterialCommunityIcons name="fullscreen" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...tailwind("w-full bottom-0"),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    position: "absolute",
  },
});
