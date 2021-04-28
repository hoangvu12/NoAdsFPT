import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import tailwind from "tailwind-rn";
import { AntDesign } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";

import { VideoContext } from "./Store";
import { TouchableOpacity } from "react-native-gesture-handler";
import useOrientation from "../../hooks/useOrientation";

export default function TopOverlay() {
  const {
    info: [info],
    episode: [episode],
  } = useContext(VideoContext);

  const orientation = useOrientation();

  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <AntDesign
          name="down"
          size={20}
          color="white"
          style={{ marginRight: 12 }}
        />
        <Text style={styles.text}>
          {info.title_vie || info.title_origin || info.title} - Tập{" "}
          {episode + 1}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...tailwind("w-full top-0"),
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
  },
  text: {
    ...tailwind("text-white text-lg font-bold"),
  },
});
