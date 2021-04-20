import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import tailwind from "tailwind-rn";

export function render(props) {
  const { item: manga, handleItemPress, onTitleColor } = props;

  return (
    <View style={tailwind("w-40 mb-5 mx-2")}>
      <TouchableOpacity onPress={(_) => handleItemPress(manga)}>
        <Image
          source={{
            uri: manga.image,
          }}
          style={{
            ...tailwind("w-full h-64 rounded-md mb-2"),
            resizeMode: "cover",
          }}
        />

        <Text
          style={{
            ...tailwind("w-11/12 text-sm"),
            color: onTitleColor ? onTitleColor({ ...props, manga }) : "#fff",
          }}
          numberOfLines={1}
        >
          {manga.title}
        </Text>

        <Text
          style={tailwind("w-11/12 text-gray-400 text-xs")}
          numberOfLines={1}
        >
          {manga.recentChapters
            ? manga.recentChapters[0].name
            : manga.latestChapter}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
