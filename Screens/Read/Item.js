import React, { memo } from "react";
import { Image, StyleSheet } from "react-native";
import tailwind from "tailwind-rn";
import { vh, vw } from "react-native-expo-viewport-units";

function Item({ item }) {
  return (
    <Image
      source={{
        uri: item,
      }}
      style={styles.image}
    />
  );
}

export default memo(Item);

const styles = StyleSheet.create({
  image: {
    ...tailwind("rounded-md"),
    resizeMode: "stretch",
    width: vw(95),
    height: vh(80),
    alignSelf: "center",
  },
});
