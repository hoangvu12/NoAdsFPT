import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import tailwind from "tailwind-rn";
import { AntDesign } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";

import { VideoContext } from "./Store";
import { useNavigation } from "@react-navigation/native";

import useOrientation from "../../hooks/useOrientation";

export default function TopOverlay() {
  const {
    info: [info],
    episode: [episode],
  } = useContext(VideoContext);

  const orientation = useOrientation();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={async () => {
            if (orientation === "LANDSCAPE") {
              await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT
              );

              return;
            }

            navigation.navigate("Dashboard");
          }}
        >
          <AntDesign
            name={orientation === "LANDSCAPE" ? "down" : "left"}
            size={20}
            color="white"
            style={{ marginRight: 12 }}
          />
        </TouchableOpacity>
        {orientation === "LANDSCAPE" && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.text, { marginRight: 12 }]}>
              {info.title_vie || info.title_origin || info.title}
            </Text>
            <Text style={styles.subText}>{info.episodes[episode].title}</Text>
          </View>
        )}
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
  subText: {
    ...tailwind("text-gray-400 text-base"),
  },
});
