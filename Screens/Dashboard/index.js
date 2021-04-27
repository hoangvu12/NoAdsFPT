import React, { useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import tailwind from "tailwind-rn";
import Item from "../../Components/Item";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getInfo } from "../../models/Manga";

import { getList as animeGetList } from "../../models/Anime";
import { getList as mangaGetList } from "../../models/Manga";

import { render as animeRender } from "../../Components/Anime/render";
import { render as mangaRender } from "../../Components/Manga/render";

export default function Dashboard() {
  const animeStructures = [
    {
      structure_id: "560e368317dc1310a164d2c7",
      structure_name: "Đề cử",
    },
    {
      structure_id: "5e732aa12089bd0041850ac3",
      structure_name: "Top anime đặc sắc",
    },
  ];

  const mangaStructures = [
    { type: "recommended", name: "Đề cử" },
    { type: "latest", name: "Mới cập nhật" },
  ];

  return (
    <ScrollView style={styles.container} stickyHeaderIndices={[0, 2]}>
      <View style={{ backgroundColor: "#18191A" }}>
        <Text style={tailwind("text-center text-white text-2xl font-bold")}>
          Anime
        </Text>
      </View>
      <View style={tailwind("w-full mb-5")}>
        <Item.Container>
          <Anime structures={animeStructures} />
        </Item.Container>
      </View>
      <View style={{ backgroundColor: "#18191A" }}>
        <Text style={tailwind("text-center text-white text-2xl font-bold")}>
          Manga
        </Text>
      </View>
      <View style={tailwind("w-full")}>
        <Item.Container>
          <Manga structures={mangaStructures} />
        </Item.Container>
      </View>
    </ScrollView>
  );
}

const Manga = (props) => {
  const navigation = useNavigation();

  const handleOnMounted = async (props) => {
    const [loading, setLoading] = props.states.loading;
    const [list, setList] = props.states.list;

    setLoading(true);

    const newList = await mangaGetList({
      type: props.type,
    });

    setLoading(false);
    setList(newList);
  };

  const handleItemPress = ({ id: data }) => {
    navigation.push("Manga", {
      id: data.id,
      slug: data.slug.name || data.slug,
    });
  };

  return (
    <>
      <Item
        onMounted={async ({ states }) => {
          const [loading, setLoading] = states.loading;
          const [list, setList] = states.list;

          setLoading(true);

          const savedMangaIds = await AsyncStorage.getAllKeys();

          const savedManga = await AsyncStorage.multiGet(
            savedMangaIds.filter((id) => Number(id))
          );

          let promiseManga = savedManga.map(async ([id, rawInfo]) => {
            const { mangaId, mangaSlug, chapterId } = JSON.parse(rawInfo);

            const info = await getInfo({ slug: mangaSlug, id: mangaId });

            const latestChapter = info.chapters.find(
              (chapter) => chapter.id === chapterId
            );

            return { ...info, latestChapter: latestChapter.name };
          });

          const manga = await Promise.all(promiseManga);

          setLoading(false);
          setList(manga);
        }}
        itemName="Xem gần đây"
        onItemPress={handleItemPress}
        renderItem={mangaRender}
        horizontal
      />

      {props.structures.map((structure, index) => (
        <Item
          type={structure.type}
          itemName={structure.name}
          key={index}
          onItemPress={handleItemPress}
          onMounted={handleOnMounted}
          getList={mangaGetList}
          renderItem={mangaRender}
          horizontal
          showList
        />
      ))}
    </>
  );
};

const Anime = (props) => {
  const navigation = useNavigation();

  const [page, setPage] = useState(1);

  const handleOnMounted = async (props) => {
    const [loading, setLoading] = props.states.loading;
    const [list, setList] = props.states.list;

    setLoading(true);

    const newList = await animeGetList({
      structure_id: props.structure_id,
    });

    setLoading(false);
    setList(newList);
  };

  const handleItemPress = (props) => {
    navigation.push("Watch", { id: props.id });
  };

  return props.structures.map((structure, index) => (
    <Item
      {...structure}
      itemName={structure.structure_name}
      key={index}
      onItemPress={handleItemPress}
      onMounted={handleOnMounted}
      getList={animeGetList}
      renderItem={animeRender}
      horizontal
      showList
    />
  ));
};

const styles = StyleSheet.create({
  container: {
    ...tailwind("h-full w-full"),
    backgroundColor: "#18191A",
    // paddingTop: Constants.statusBarHeight,
  },
});
