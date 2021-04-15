import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import tailwind from "tailwind-rn";
import Item from "../../Components/Anime/Item";
import Constants from "expo-constants";

export default function Dashboard() {
  const structures = [
    {
      structure_id: "560e368317dc1310a164d2c7",
      structure_name: "Anime",
    },
    {
      structure_id: "5e732aa12089bd0041850ac3",
      structure_name: "Top anime đặc sắc",
    },
  ];

  return (
    <View style={styles.container}>
      <Item.Container>
        {structures.map((structure, index) => (
          <Item {...structure} key={index} horizontal />
        ))}
      </Item.Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...tailwind("h-full w-full"),
    backgroundColor: "#18191A",
    paddingTop: Constants.statusBarHeight,
  },
});
