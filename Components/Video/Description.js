import React, { useState, useContext, useRef, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  LogBox,
  Dimensions,
} from "react-native";
import tailwind from "tailwind-rn";
import { vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

import { render } from "../../Components/Anime/render";
import BottomSheet from "../../Components/BottomSheet";
import Item from "../../Components/Item";
import { notifyMessage } from "../../utils";

import { VideoContext } from "./Store";

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

export default function Description(props) {
  const {
    episode: [episode],
    info: [anime],
  } = useContext(VideoContext);

  const [itemsShow, setItemsShow] = useState(24);
  const bottomSheetRef = useRef(null);

  const navigation = useNavigation();
  const screenHeight = useMemo(() => Dimensions.get("screen").height, []);

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
    bottomSheetRef.current.open();
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

              <BottomSheet
                ref={bottomSheetRef}
                height={screenHeight - (Constants.statusBarHeight + 50)}
              >
                <View style={[{ flex: 1 }]}>
                  <Item
                    itemName="Tập phim"
                    data={anime.episodes
                      .filter((episode) => !episode.is_trailer)
                      .slice(0, itemsShow)}
                    horizontal={false}
                    episode={episode}
                    onItemPress={props.onEpisodePress}
                    onTitleColor={handleTitleColor}
                    onNewList={handleNewList}
                    renderItem={render}
                  />
                </View>
              </BottomSheet>
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
});
