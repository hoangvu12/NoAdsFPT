import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import tailwind from "tailwind-rn";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getInfo } from "../../models/Manga";
import { isEmpty } from "../../utils";

export default function Manga({ route, navigation }) {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [savedChapter, setSavedChapter] = useState({});

  const { slug, id } = route.params;

  const handleChapterPress = ({ slug: chapterSlug, id: chapterId }) => {
    navigation.navigate("Read", {
      mangaSlug: slug,
      chapterSlug,
      chapterId,
      chapters: info.chapters,
      mangaId: id,
    });
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const info = await getInfo({
        slug,
        id,
      });

      const savedInfo = await AsyncStorage.getItem(id);

      if (savedInfo) {
        const { chapterId } = JSON.parse(savedInfo);
        const savedChapter = info.chapters.find(
          (chapter) => chapter.id === Number(chapterId)
        );

        setSavedChapter(savedChapter || []);
      }

      setInfo(info);

      setLoading(false);
    };

    getData();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {loading && <Loader placeholderNumber={5} />}

      {!loading && (
        <>
          <View style={tailwind("my-5")}>
            <Text
              style={{
                ...styles.text,
                ...tailwind("font-bold text-2xl text-center"),
              }}
            >
              {info.title}
            </Text>
            <Text
              style={{
                ...styles.text,
                ...tailwind("text-gray-400 text-lg text-center"),
              }}
            >
              {info.updatedAt}
            </Text>
          </View>
          <View style={{ ...tailwind("flex flex-col items-center w-5/6") }}>
            <Image
              source={{
                uri: info.image,
              }}
              style={{ ...tailwind("h-72 w-44"), resizeMode: "contain" }}
            />

            {info.pair.map(({ key, value }, index) => {
              return (
                <View
                  style={{
                    ...tailwind("flex flex-row justify-between w-full my-5"),
                  }}
                  key={index}
                >
                  <Text
                    style={{ ...tailwind("text-gray-200 text-base font-bold") }}
                  >
                    {key}
                  </Text>
                  <Text
                    style={{
                      ...tailwind("text-gray-300 text-base"),
                      maxWidth: 200,
                    }}
                  >
                    {value}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={tailwind("w-5/6 my-5")}>
            <Text style={[styles.text, tailwind("text-xl font-bold")]}>
              N???i dung
            </Text>
            <Text style={[styles.text, tailwind("text-gray-300")]}>
              {info.description}
            </Text>
          </View>

          <View
            style={tailwind("flex-row items-center justify-between w-4/6 my-5")}
          >
            <Button
              title="?????c t??? ?????u"
              onPress={(_) => {
                const firstChapter = info.chapters[info.chapters.length - 1];

                navigation.navigate("Read", {
                  mangaSlug: slug,
                  chapterId: firstChapter.id,
                  chapterSlug: firstChapter.slug,
                  chapters: info.chapters,
                  mangaId: id,
                });
              }}
            />

            <Button
              title="?????c m???i nh???t"
              onPress={(_) => {
                const lastChapter = info.chapters[0];

                navigation.navigate("Read", {
                  mangaSlug: slug,
                  chapterId: lastChapter.id,
                  chapterSlug: lastChapter.slug,
                  chapters: info.chapters,
                  mangaId: id,
                });
              }}
            />
          </View>

          {!isEmpty(savedChapter) && (
            <View
              style={tailwind(
                "flex-row items-center justify-center w-4/6 my-5"
              )}
            >
              <Button
                title={`?????c ${savedChapter.name}`}
                onPress={(_) => {
                  navigation.navigate("Read", {
                    mangaSlug: slug,
                    chapterId: savedChapter.id,
                    chapterSlug: savedChapter.slug,
                    chapters: info.chapters,
                    mangaId: id,
                  });
                }}
              />
            </View>
          )}

          <View style={tailwind("w-5/6 my-5")}>
            <Text style={[styles.text, tailwind("text-xl font-bold")]}>
              Danh s??ch ch????ng
            </Text>
            <View style={tailwind("flex flex-col w-full")}>
              <View
                style={tailwind("flex flex-row w-full justify-between my-3")}
              >
                <Text style={tailwind("text-gray-200 font-bold")}>
                  S??? ch????ng
                </Text>
                <Text style={tailwind("text-gray-200 font-bold")}>
                  C???p nh???t
                </Text>
              </View>

              {info.chapters.slice(0, 30).map((chapter) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleChapterPress(chapter)}
                    key={chapter.id}
                  >
                    <View
                      style={tailwind(
                        "flex flex-row w-full justify-between my-3"
                      )}
                    >
                      <Text style={tailwind("text-gray-100")}>
                        {chapter.name}
                      </Text>
                      <Text style={tailwind("text-gray-300")}>
                        {chapter.updatedAt}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function Loader({ placeholderNumber = 1 }) {
  return (
    <SkeletonPlaceholder flexDirection="column">
      <View style={[{ flexDirection: "column" }, tailwind("my-5")]}>
        {[...Array(placeholderNumber)].map((_, index) => {
          return (
            <View style={tailwind("flex-row mb-2 justify-center")} key={index}>
              <View style={tailwind("w-44 mr-2 mb-5")}>
                <View style={tailwind("w-full h-28 rounded-md")}></View>
              </View>
              <View style={tailwind("w-44")}>
                <View style={tailwind("w-full h-28 rounded-md")}></View>
              </View>
            </View>
          );
        })}
      </View>
    </SkeletonPlaceholder>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18191A",
    // justifyContent: "center",
  },
  text: {
    color: "#fff",
  },
});
