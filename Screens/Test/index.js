import React, { useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import BottomSheet from "../../Components/BottomSheet";
import animeList from "../../data/list.json";
import Item from "../../Components/Item";

import { render } from "../../Components/Anime/render";

import styles from "../../styles";

export default function Test() {
  const bottomSheetRef = useRef(null);

  return (
    <View style={[styles.backgroundColor, { flex: 1 }]}>
      <Button
        title="OPEN BOTTOM SHEET"
        onPress={() => bottomSheetRef.current.open()}
      />

      <BottomSheet ref={bottomSheetRef}>
        <View style={[{ flex: 1 }]}>
          <Item data={animeList.result_list} renderItem={render} />
          {/* <Text style={{ color: "white" }}>ALOALO</Text> */}
        </View>
      </BottomSheet>
    </View>
  );
}
