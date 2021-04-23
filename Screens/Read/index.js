import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import tailwind from "tailwind-rn";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Item from "./Item";
import { getImages, getImageUrl } from "../../models/Manga";
import { isEmpty, notifyMessage } from "../../utils";

const showAlert = ({ chapters, chapterIndex, setChapterId }) =>
  Alert.alert("Thông báo", "Sang chapter tiếp theo?", [
    {
      text: "Ở lại",
      style: "cancel",
    },
    {
      text: "Đồng ý",
      onPress: () => {
        const chapter = chapters[chapterIndex - 1];

        setChapterId(chapter.id);
      },
    },
  ]);

export default function Read({ route }) {
  const { mangaSlug, mangaId, chapterSlug, chapters } = route.params;

  const flatListRef = useRef();

  const [images, setImages] = useState([]);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [chapterId, setChapterId] = useState(route.params.chapterId);

  const renderItem = useCallback(({ item }) => <Item item={item} />, []);
  const keyExtractor = useCallback((_, index) => index.toString(), []);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData().then(() => setRefreshing(false));
  }, []);

  const getData = async () => {
    setImages([]);

    const images = await getImages({ mangaSlug, chapterId, chapterSlug });

    let fullUrlImgs = images.map((image) => getImageUrl(image));

    setImages(fullUrlImgs);
  };

  useEffect(() => {
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
      <View style={styles.stickyHeader}>
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
          style={styles.picker}
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ref={flatListRef}
          data={images}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onEndReached={() =>
            showAlert({ setChapterId, chapters, chapterIndex })
          }
          onEndReachedThreshold={0.1}
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
  stickyHeader: {
    height: 40,
    width: "100%",
    backgroundColor: "#18191A",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  picker: {
    height: 50,
    color: "white",
    flex: 1,
  },
});
