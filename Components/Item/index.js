import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { vw } from "react-native-expo-viewport-units";
import { useNavigation } from "@react-navigation/native";
import { OptimizedFlatList } from "react-native-optimized-flatlist";

import tailwind from "tailwind-rn";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default function Item(props) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const states = {
    list: [list, setList],
    loading: [loading, setLoading],
  };

  const navigation = useNavigation();

  if (props.data) {
    useEffect(() => {
      setList(props.data);
    }, [props.data]);
  }

  useEffect(() => {
    if (props.onMounted) {
      props.onMounted({ ...props, states });
    } else if (props.data) {
      setLoading(true);
      setList(props.data);
      setLoading(false);
    }
  }, []);

  const handleRenderItem = (passedData) => {
    if (props.renderItem) {
      return props.renderItem({ ...passedData, ...props, handleItemPress });
    }
  };

  const handleEndReached = (data) => {
    if (props.onNewList) {
      props.onNewList({ ...props, ...data, states });
    }
  };

  const handleShowList = () => {
    if (props.onShowListClick) {
      return props.onShowListClick({ ...props });
    }

    navigation.navigate("List", {
      ...props,
    });
  };

  const handleItemPress = (id) => {
    if (props.onItemPress) {
      props.onItemPress({ ...props, id });
    }
  };

  return (
    <View style={{ ...tailwind("my-3"), flex: 1 }}>
      {props.itemName && (
        <View
          style={tailwind("flex flex-row justify-between items-center mb-5")}
        >
          <Text style={tailwind("text-white font-bold text-xl ml-2")}>
            {props.itemName}
          </Text>
          {props.showList && (
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
        <View style={{ flex: 1 }}>
          <FlatList
            contentContainerStyle={{
              ...tailwind("flex items-center"),
            }}
            horizontal={props.horizontal}
            data={list}
            numColumns={!props.horizontal ? 2 : false}
            renderItem={handleRenderItem}
            keyExtractor={(item) => item._id || item.id}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
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
