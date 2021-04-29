import React, {
  useState,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  LogBox,
} from "react-native";
import tailwind from "tailwind-rn";
import { vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";
import ScrollBottomSheet from "react-native-scroll-bottom-sheet";

import { render } from "../../Components/Anime/render";

import Item from "../../Components/Item";
import { notifyMessage } from "../../utils";
import globalStyles from "../../styles";

import { VideoContext } from "./Store";

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

export default function Description(props) {
  const {
    episode: [episode],
    info: [anime],
  } = useContext(VideoContext);

  const customRender = useCallback(
    ({ item: anime }) => (
      <View style={tailwind("w-40 mb-5 mx-2")}>
        <TouchableOpacity
          onPress={(_) =>
            props.onEpisodePress({ id: anime.referred_object_id || anime._id })
          }
        >
          <Image
            source={{
              uri: `${
                anime.wide_image || anime.thumb
              }?w=282&mode=scale&fmt=webp`,
            }}
            style={{
              ...tailwind("w-full h-24 rounded-md mb-2"),
              resizeMode: "cover",
            }}
          />

          <Text
            style={{
              ...tailwind("w-11/12 text-sm"),
              color: anime._id === episode ? "#ff6500" : "#fff",
            }}
            numberOfLines={1}
          >
            {anime.title_vie || anime.title}
          </Text>

          <Text
            style={tailwind("w-11/12 text-gray-400 text-xs")}
            numberOfLines={1}
          >
            {anime.title_origin || ""}
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [episode]
  );

  const [itemsShow, setItemsShow] = useState(24);
  const bottomSheetRef = useRef(null);

  const navigation = useNavigation();

  const handleTitleColor = ({ anime }) => {
    return anime._id === episode ? "#ff6500" : "#fff";
  };

  const handleItemPress = (props) => {
    navigation.push("Watch", { id: props.id });
  };

  const handleNewList = (props) => {
    if (itemsShow >= anime.episodes.length) {
      return notifyMessage("Hết dữ liệu");
    }

    notifyMessage("Đang tải dữ liệu");
    setItemsShow(itemsShow + 12);
  };

  const handleShowListClick = (props) => {
    bottomSheetRef.current.snapTo(0);
  };

  const descriptionObj = useMemo(() => {
    return [
      {
        key: "Số tập",
        value: `${anime.episode_latest}/${anime.episode_total}`,
      },
      {
        key: "Thời lượng",
        value: anime.avrg_duration,
      },
      {
        key: "Quốc gia",
        value: anime.nation,
      },
      {
        key: "Thể loại",
        value: anime.list_structure_name.join(", "),
      },
      {
        key: "Phát hành",
        value: anime.movie_release_date,
      },
    ];
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.column}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={tailwind("flex items-center justify-center mb-5")}>
              <Text
                style={tailwind("text-white text-base font-bold")}
                numberOfLines={1}
              >
                {anime.title_vie || anime.title}
              </Text>
              <Text style={tailwind("text-gray-500 text-sm")} numberOfLines={1}>
                {anime.title_origin || anime.title}
              </Text>
            </View>
            <View style={tailwind("mb-5")}>
              {descriptionObj.map((description, index) => (
                <View style={tailwind("flex-row justify-between")} key={index}>
                  <Text style={tailwind("text-white font-bold text-sm")}>
                    {description.key}
                  </Text>
                  <Text style={tailwind("text-gray-500 text-sm")}>
                    {description.value}
                  </Text>
                </View>
              ))}
            </View>
            <View>
              <Text style={tailwind("text-white font-bold text-sm mb-1")}>
                Tóm tắt
              </Text>
              <Text style={tailwind("text-white mb-3")}>
                {anime.description}
              </Text>
            </View>
          </ScrollView>
        </View>
        <View style={styles.column}>
          <ScrollView
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flex: 1 }}>
              <Item.Container style={{ flex: 1 }}>
                <Item
                  itemName="Tập phim"
                  data={anime.episodes
                    .filter((episode) => !episode.is_trailer)
                    .slice(0, 24)}
                  horizontal={false}
                  episode={episode}
                  onItemPress={props.onEpisodePress}
                  onTitleColor={handleTitleColor}
                  onShowListClick={handleShowListClick}
                  renderItem={render}
                  showList
                />
              </Item.Container>
            </View>
          </ScrollView>
        </View>

        {anime.episodes.some((episode) => episode.is_trailer) && (
          <View style={styles.column}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ flex: 1 }}>
                <Item.Container style={{ width: "100%" }}>
                  <Item
                    data={anime.episodes.filter(
                      (episode) => episode.is_trailer
                    )}
                    itemName="Trailer / Hậu trường"
                    horizontal={false}
                    episode={episode}
                    onItemPress={props.onEpisodePress}
                    onTitleColor={handleTitleColor}
                    renderItem={render}
                  />
                </Item.Container>
              </View>
            </ScrollView>
          </View>
        )}

        <View style={styles.column}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flex: 1 }}>
              <Item.Container style={{ width: "100%" }}>
                <Item
                  itemName="Nội dung liên quan"
                  data={anime.related_videos}
                  horizontal={false}
                  onItemPress={handleItemPress}
                  renderItem={render}
                />
              </Item.Container>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      <ScrollBottomSheet // If you are using TS, that'll infer the renderItem `item` type
        componentType="FlatList"
        ref={bottomSheetRef}
        snapPoints={["0%", "100%"]}
        initialSnapIndex={1}
        renderHandle={() => (
          <View style={styles.header}>
            <View style={styles.panelHandle} />
          </View>
        )}
        numColumns={2}
        data={anime.episodes
          .filter((episode) => !episode.is_trailer)
          .slice(0, itemsShow)}
        keyExtractor={(item, index) => item._id || item.id || index}
        renderItem={customRender}
        contentContainerStyle={styles.contentContainerStyle}
        key="h"
        onEndReached={handleNewList}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...tailwind("py-2 items-center"), width: vw(100), flex: 1 },
  scrollContainer: {
    width: "95%",
  },
  column: {
    width: vw(90),
    marginRight: 12,
  },
  header: {
    ...globalStyles.backgroundColor,
    alignItems: "center",
    paddingVertical: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  panelHandle: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(250,250,250,0.7)",
    borderRadius: 4,
  },
  contentContainerStyle: {
    ...tailwind("flex items-center"),
    ...globalStyles.backgroundColor,
  },
});
