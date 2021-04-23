import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import tailwind from "tailwind-rn";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Item from "./Item";
import { getImages, getImageUrl } from "../../models/Manga";
import { isEmpty } from "../../utils";

export default function Read({ route, navigation }) {
  const { mangaSlug, mangaId, chapterSlug, chapters } = route.params;
  const [chapterIndex, setChapterIndex] = useState(0);

  const flatListRef = useRef();

  const [chapterId, setChapterId] = useState(route.params.chapterId);

  const renderItem = useCallback(({ item }) => {
    return <Item item={item} />;
  }, []);

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      setImages([]);

      const images = await getImages({ mangaSlug, chapterId, chapterSlug });

      let fullUrlImgs = images.map((image) => getImageUrl(image));

      setImages(fullUrlImgs);

      setLoading(false);
    };

    const storeData = async () => {
      await AsyncStorage.setItem(
        mangaId,
        JSON.stringify({ mangaId, mangaSlug, chapterId })
      );
    };

    setChapterIndex(chapters.findIndex((chapter) => chapter.id === chapterId));

    getData();
    storeData();
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
          disabled={chapterIndex >= chapters.length - 1}
          style={tailwind("ml-5")}
          onPress={(_) => {
            const chapter = chapters[chapterIndex + 1];

            setChapterId(chapter.id);
            flatListRef.current.scrollToOffset({ animated: true, y: 0 });
          }}
        >
          <AntDesign
            name="arrowleft"
            size={24}
            color={
              chapterIndex >= chapters.length - 1
                ? tailwind("text-gray-400").color
                : "white"
            }
          />
        </TouchableOpacity>
        <Picker
          selectedValue={chapterId}
          style={{
            height: 50,
            color: "white",
            flex: 1,
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
            flatListRef.current.scrollToOffset({ animated: true, y: 0 });
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
        <FlatList
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          windowSize={10}
          ref={flatListRef}
          data={images}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
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
