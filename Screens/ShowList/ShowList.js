import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Item from "../../Components/Item";
import tailwind from "tailwind-rn";
import Constants from "expo-constants";

import { getList } from "../../utils/api";
import { isEmpty, notifyMessage } from "../../utils";

export default function ShowList({ route, navigation }) {
  const { structure_id, structure_name } = route.params;
  const [page, setPage] = useState(1);

  const handleOnMounted = async (props) => {
    const [loading, setLoading] = props.states.loading;
    const [list, setList] = props.states.list;

    setLoading(true);

    const newList = await getList({
      structure_id,
    });

    setLoading(false);
    setList(newList);
  };

  const handleItemPress = (props) => {
    navigation.push("Watch", { id: props.id });
  };

  const handleNewList = async (props) => {
    const [list, setList] = props.states.list;

    const newList = await getList({
      structure_id: structure_id,
      page: page + 1,
    });

    if (isEmpty(newList)) {
      return notifyMessage("Hết dữ liệu!");
    }

    setPage(page + 1);

    const mergedList = [...list, ...newList];

    setList(mergedList);
  };

  return (
    <View style={styles.container}>
      <Item.Container>
        <Item
          itemName={structure_name}
          onItemPress={handleItemPress}
          onEndReached={handleNewList}
          onMounted={handleOnMounted}
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
