import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Picker,
  StyleSheet,
} from "react-native";
import tailwind from "tailwind-rn";
import { vh, vw } from "react-native-expo-viewport-units";
import { AntDesign } from "@expo/vector-icons";
import { OptimizedFlatList } from "react-native-optimized-flatlist";
import Item from "./Item";

import { getImages } from "../../models/Manga";
import { isEmpty } from "../../utils";

export default function Read({ route, navigation }) {
  const { nameSlug, chapterSlug, chapters } = route.params;
  const [chapterIndex, setChapterIndex] = useState(0);

  const [chapterId, setChapterId] = useState(route.params.chapterId);
  const ITEM_HEIGHT = 800;

  const renderItem = useCallback(({ item }) => {
    return <Item item={item} />;
  }, []);

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const images = await getImages({ nameSlug, chapterId, chapterSlug });

      let fullUrlImgs = images.map(
        (image) =>
          `http://nguyenvu-api.com/nettruyen/image?url=${encodeURIComponent(
            image
          )}`
      );

      setImages(fullUrlImgs);

      setLoading(false);
    };

    setChapterIndex(chapters.findIndex((chapter) => chapter.id === chapterId));

    getData();
  }, [chapterId]);

  return (
    <View style={styles.container}>
      <View
        style={{
          height: 40,
          width: "100%",
          backgroundColor: "#18191A",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          disabled={chapterIndex >= chapters.length}
          style={tailwind("ml-5")}
          onPress={(_) => {
            const chapter = chapters[chapterIndex + 1];

            setChapterId(chapter.id);
          }}
        >
          <AntDesign
            name="arrowleft"
            size={24}
            color={
              chapterIndex >= chapters.length
                ? tailwind("text-gray-400").color
                : "white"
            }
          />
        </TouchableOpacity>
        <Picker
          selectedValue={chapterId}
          style={{
            height: 50,
            minWidth: 130,
            backgroundColor: "white",
            color: "white",
            textAlign: "center",
          }}
          onValueChange={(itemValue, itemIndex) => setChapterId(itemValue)}
        >
          {chapters.map((chapter) => (
            <Picker.Item
              label={chapter.name}
              value={chapter.id}
              key={chapter.id}
            />
          ))}
        </Picker>
        <TouchableOpacity
          disabled={chapterIndex === 0}
          style={tailwind("mr-5")}
          onPress={(_) => {
            const chapter = chapters[chapterIndex - 1];

            setChapterId(chapter.id);
          }}
        >
          <AntDesign
            name="arrowright"
            size={24}
            color={
              chapterIndex === 0 ? tailwind("text-gray-400").color : "white"
            }
          />
        </TouchableOpacity>
      </View>

      {!isEmpty(images) && (
        <OptimizedFlatList
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
          data={images}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#18191A",
    flex: 1,
  },
});
