import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image } from "react-native";
import tailwind from "tailwind-rn";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useNavigation } from "@react-navigation/native";
import { vw } from "react-native-expo-viewport-units";

import { getList } from "../../utils/api";
import { isEmpty, notifyMessage } from "../../utils/";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Item(props) {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const navigation = useNavigation();

  useEffect(() => {
    if (!props.data) {
      const getData = async () => {
        setLoading(true);
        const list = await getList({ structure_id: props.structure_id });

        setAnimeList(list);
        setLoading(false);
      };

      getData();
    } else {
      setAnimeList(props.data);
      setLoading(false);
    }
  }, []);

  const handleNewList = async () => {
    const list = await getList({
      structure_id: props.structure_id,
      page: page + 1,
    });

    if (isEmpty(list)) {
      return notifyMessage("Hết dữ liệu!");
    }

    setPage(page + 1);

    const newList = [...animeList, ...list];

    setAnimeList(newList);
  };

  const handleShowList = () => {
    const { structure_id, structure_name } = props;

    navigation.navigate("List", { structure_id, structure_name });
  };

  const handleItemPress = (id) => {
    navigation.push("Watch", { id });
  };

  return (
    <View style={{ ...tailwind("my-3"), width: "100%" }}>
      {props.structure_name && (
        <View
          style={tailwind("flex flex-row justify-between items-center mb-5")}
        >
          <Text style={tailwind("text-white font-bold text-xl ml-2")}>
            {props.structure_name}
          </Text>
          {props.horizontal && (
            <Text
              style={tailwind("text-gray-500 text-sm mr-2")}
              onPress={handleShowList}
            >
              Tất cả
            </Text>
          )}
        </View>
      )}

      {loading && <Item.Loader placeholderNumber={props.horizontal ? 1 : 3} />}

      {!loading && (
        <View>
          <FlatList
            style={{ flexGrow: 1 }}
            contentContainerStyle={{
              ...tailwind("flex items-center"),
              // flex: 1,
            }}
            ListFooterComponent={<View style={{ paddingBottom: 100 }} />}
            horizontal={props.horizontal}
            data={animeList}
            numColumns={!props.horizontal ? 2 : false}
            renderItem={({ item: anime }) => {
              return (
                <View style={tailwind("w-40 mb-5 mx-2")}>
                  <TouchableOpacity
                    onPress={(_) => {
                      if (props.onPress) {
                        props.onPress(anime.referred_object_id || anime._id);
                      } else {
                        handleItemPress(anime.referred_object_id || anime._id);
                      }
                    }}
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
                        color: anime._id === props.episode ? "#ff6500" : "#fff",
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
            }}
            keyExtractor={(item) => item._id}
            updateCellsBatchingPeriod={100} // Increase time between renders
            onEndReached={!props.data ? handleNewList : false}
            onEndReachedThreshold={0.1}
          />
        </View>
      )}
    </View>
  );
}

Item.Loader = function ({ placeholderNumber = 1 }) {
  return (
    <SkeletonPlaceholder flexDirection="row">
      <View style={{ flexDirection: "column" }}>
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
};

Item.Container = function (props) {
  return (
    <View
      style={{ ...tailwind("flex justify-center"), width: vw(100) }}
      {...props}
    >
      {props.children}
    </View>
  );
};
