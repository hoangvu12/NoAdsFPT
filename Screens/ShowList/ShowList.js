import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Item from "../../Components/Item";
import tailwind from "tailwind-rn";
import Constants from "expo-constants";
import { isEmpty, notifyMessage } from "../../utils";

export default function ShowList({ route, navigation }) {
  const { onNewList, getList, ...params } = route.params;

  const [page, setPage] = useState(1);

  async function handleNewList(props) {
    const [list, setList] = props.states.list;

    console.log(page);

    notifyMessage("Đang tải dữ liệu!");

    const newList = await getList({
      ...props,
      page: page + 1,
    });

    if (isEmpty(newList)) {
      return notifyMessage("Hết dữ liệu!");
    }

    setPage(page + 1);

    const mergedList = [...list, ...newList];

    setList(mergedList);
  }

  return (
    <View style={styles.container}>
      <Item.Container>
        <Item
          {...params}
          onNewList={handleNewList}
          horizontal={false}
          showList={false}
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
