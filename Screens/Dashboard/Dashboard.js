import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import tailwind from "tailwind-rn";
import Item from "../../Components/Item";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";

import { getList } from "../../utils/api";

export default function Dashboard() {
  const navigation = useNavigation();

  const handleOnMounted = async (props) => {
    const [loading, setLoading] = props.states.loading;
    const [list, setList] = props.states.list;

    setLoading(true);

    const newList = await getList({
      structure_id: props.structure_id,
    });

    setLoading(false);
    setList(newList);
  };

  const handleItemPress = (props) => {
    navigation.push("Watch", { id: props.id });
  };

  const handleShowList = (props) => {
    const { structure_id, structure_name } = props;

    navigation.navigate("List", { structure_id, structure_name });
  };

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
          <Item
            {...structure}
            itemName={structure.structure_name}
            key={index}
            onItemPress={handleItemPress}
            onShowList={handleShowList}
            onMounted={handleOnMounted}
            horizontal
          />
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
