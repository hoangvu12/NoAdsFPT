import React, { useState, useContext } from "react";
import { View, Text, ScrollView, StyleSheet, LogBox } from "react-native";
import tailwind from "tailwind-rn";
import { vw, vh } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";

import Item from "../../Components/Item";
import { VideoContext } from "./Store";

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

export default function Description(props) {
  const {
    episode: [episode],
    info: [anime],
  } = useContext(VideoContext);

  const navigation = useNavigation();

  const handleTitleColor = ({ anime }) => {
    return anime._id === episode ? "#ff6500" : "#fff";
  };

  const handleItemPress = (props) => {
    navigation.push("Watch", { id: props.id });
  };

  const [descriptionObj] = useState(() => {
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
  });

  return (
    <View style={{ ...tailwind("py-2 items-center"), width: vw(100), flex: 1 }}>
      <ScrollView horizontal style={styles.container}>
        <View style={styles.column}>
          <ScrollView>
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
          <ScrollView>
            <View style={tailwind("flex justify-center mb-5")}>
              <Text
                style={tailwind("text-white text-base font-bold")}
                numberOfLines={1}
              >
                Tập phim
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Item.Container style={{ width: "100%" }}>
                <Item
                  data={anime.episodes.filter((episode) => !episode.is_trailer)}
                  horizontal={false}
                  episode={episode}
                  onItemPress={props.onEpisodePress}
                  onTitleColor={handleTitleColor}
                />
              </Item.Container>
            </View>
          </ScrollView>
        </View>

        {anime.episodes.some((episode) => episode.is_trailer) && (
          <View style={styles.column}>
            <ScrollView>
              <View style={tailwind("flex justify-center mb-5")}>
                <Text
                  style={tailwind("text-white text-base font-bold")}
                  numberOfLines={1}
                >
                  Trailer
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Item.Container style={{ width: "100%" }}>
                  <Item
                    data={anime.episodes.filter(
                      (episode) => episode.is_trailer
                    )}
                    horizontal={false}
                    episode={episode}
                    onItemPress={props.onEpisodePress}
                    onTitleColor={handleTitleColor}
                  />
                </Item.Container>
              </View>
            </ScrollView>
          </View>
        )}

        <View style={styles.column}>
          <ScrollView>
            <View style={tailwind("flex justify-center mb-5")}>
              <Text
                style={tailwind("text-white text-base font-bold")}
                numberOfLines={1}
              >
                Nội dung liên quan
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Item.Container style={{ width: "100%" }}>
                <Item
                  data={anime.related_videos}
                  horizontal={false}
                  onItemPress={handleItemPress}
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
  container: {
    width: "95%",
  },
  column: {
    width: vw(90),
    marginRight: 12,
  },
});
