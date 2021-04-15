import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Item from "../../Components/Anime/Item";
import tailwind from "tailwind-rn";
import Constants from "expo-constants";

export default function ShowList({ route, navigation }) {
  const { structure_id, structure_name } = route.params;

  return (
    <View style={styles.container}>
      <Item.Container>
        <Item
          structure_id={structure_id}
          structure_name={structure_name}
          horizontal={false}
        />
      </Item.Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...tailwind("h-full w-full"),
    backgroundColor: "#18191A",
    paddingTop: Constants.statusBarHeight,
    // flex: 1,
  },
});
