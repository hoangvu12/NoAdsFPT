import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import tailwind from "tailwind-rn";

export function render(props) {
  const { item: anime, handleItemPress, onTitleColor } = props;

  return (
    <View style={tailwind("w-40 mb-5 mx-2")}>
      <TouchableOpacity
        onPress={(_) => handleItemPress(anime.referred_object_id || anime._id)}
      >
        <Image
          source={{
            uri: `${anime.wide_image || anime.thumb}?w=282&mode=scale&fmt=webp`,
          }}
          style={{
            ...tailwind("w-full h-24 rounded-md mb-2"),
            resizeMode: "cover",
          }}
        />

        <Text
          style={{
            ...tailwind("w-11/12 text-sm"),
            color: onTitleColor ? onTitleColor({ ...props, anime }) : "#fff",
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
  );
}
