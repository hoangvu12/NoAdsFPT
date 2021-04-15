import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import tailwind from "tailwind-rn";
import Constants from "expo-constants";

import { vw, vh } from "react-native-expo-viewport-units";

import { getTrendingKeywords, search } from "../../utils/api";
import { isEmpty } from "../../utils/";

import Item from "../../Components/Anime/Item";

export default function Search() {
  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const getData = async () => {
      if (!keyword) return;

      const searchResults = await search({ keyword });

      setResults(searchResults);
    };

    const delayDebounceFn = setTimeout(() => {
      getData();
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  function handleOnPress(keyword) {
    setKeyword(keyword);
  }

  const handleChange = () => {
    setKeyword(keyword);
  };

  return (
    <View style={styles.container}>
      <View style={tailwind("flex items-center")}>
        <Search.Input
          keyword={keyword}
          setKeyword={setKeyword}
          onChange={handleChange}
        />
      </View>
      <View>
        <Search.Suggestion
          trendingKeywords={trendingKeywords}
          setTrendingKeywords={setTrendingKeywords}
          onPress={handleOnPress}
        />
      </View>
      {!isEmpty(results) && (
        <View>
          <Search.List data={results} />
        </View>
      )}
    </View>
  );
}

Search.List = ({ data }) => {
  return (
    <Item.Container>
      <Item data={data} />
    </Item.Container>
  );
};

Search.Suggestion = (props) => {
  const { trendingKeywords, setTrendingKeywords, onPress } = props;

  useEffect(() => {
    const getData = async () => {
      const keywords = await getTrendingKeywords();

      setTrendingKeywords(keywords);
    };

    getData();
  }, []);

  return (
    <View>
      <Text style={tailwind("text-white text-base font-bold ml-3 mb-3 mt-5")}>
        Tìm kiếm hàng đầu
      </Text>
      <ScrollView
        style={{
          alignSelf: "flex-start",
        }}
        horizontal
      >
        {trendingKeywords.map((keyword) => (
          <Text
            style={{
              ...tailwind("ml-2 p-3 rounded-lg"),
              backgroundColor: "#1B1B1B",
              color: "#9B9B9B",
            }}
            key={keyword._id}
            onPress={() => onPress(keyword.source_key)}
          >
            {keyword.source_key}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

Search.Input = (props) => {
  const { keyword, setKeyword } = props;

  return (
    <TextInput
      style={styles.input}
      onChangeText={setKeyword}
      value={keyword}
      placeholder="Nhập từ khóa"
      placeholderTextColor="#5B5B5B"
      selectionColor="white"
      onChange={props.onChange}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    ...tailwind("h-full w-full"),
    backgroundColor: "#18191A",
    paddingTop: Constants.statusBarHeight,
  },
  input: {
    ...tailwind("text-white text-xl rounded-md"),
    width: vw(80),
    padding: 12,
    textAlign: "center",
    backgroundColor: "#1B1B1B",
  },
});
