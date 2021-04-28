import React, { useContext, useCallback } from "react";
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

  const handleSlideDrag = useCallback(async (value) => {
    await video.current.setPositionAsync(value);
    video.current.playAsync();
  }, []);

  return (
    <>
      <View style={styles.buttonContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={(_) => setIsLocked(!isLocked)}
            style={tailwind("mr-2")}
          >
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
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={tailwind("text-white")}>
            {millisToMinutesAndSeconds(status.durationMillis)}
          </Text>

          <TouchableOpacity
            onPress={async () => {
              await ScreenOrientation.lockAsync(
                orientation === "LANDSCAPE"
                  ? ScreenOrientation.OrientationLock.PORTRAIT
                  : ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
              );
            }}
            style={tailwind("ml-2")}
          >
            <MaterialCommunityIcons name="fullscreen" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={status.durationMillis}
          value={status.positionMillis}
          minimumTrackTintColor="#FF6400"
          maximumTrackTintColor="#fff"
          thumbTintColor="#fff"
          onValueChange={handleSlideDrag}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    ...tailwind("w-full bottom-0"),
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
  },
  buttonContainer: {
    ...tailwind("w-11/12 bottom-10"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
  },
  slider: { ...tailwind("w-full"), height: 40 },
});
