import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import tailwind from "tailwind-rn";
import Constants from "expo-constants";
import SwitchSelector from "react-native-switch-selector";
import { vw } from "react-native-expo-viewport-units";

import { getTrendingKeywords, search as animeSearch } from "../../models/Anime";
import { search as mangaSearch } from "../../models/Manga";

import { useNavigation } from "@react-navigation/native";

import { render as animeRender } from "../../Components/Anime/render";
import { render as mangaRender } from "../../Components/Manga/render";
import Item from "../../Components/Item";

export default function Search() {
  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const [isMangaMode, setIsMangaMode] = useState(false);

  const switchOptions = useMemo(
    () => [
      {
        label: "Anime",
        value: "0",
      },
      {
        label: "Manga",
        value: "1",
      },
    ],
    []
  );

  const onSwitchPress = (value) => {
    setIsMangaMode(!!+value);
    setKeyword("");
    setResults([]);
  };

  useEffect(() => {
    setResults([]);

    const getData = async () => {
      if (!keyword) return;

      if (!isMangaMode) {
        const searchResults = await animeSearch({ keyword });

        setResults(searchResults);

        return;
      }

      const searchResults = await mangaSearch({ keyword });

      setResults(searchResults);
    };

    const delayDebounceFn = setTimeout(getData, 1500);

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
      <View style={{ ...tailwind("flex items-center") }}>
        <Search.Input
          keyword={keyword}
          setKeyword={setKeyword}
          onChange={handleChange}
        />
      </View>
      <View
        style={{
          ...tailwind("flex flex-row justify-center items-center my-2 mr-2"),
        }}
      >
        <SwitchSelector
          options={switchOptions}
          style={tailwind("w-5/6")}
          initial={0}
          onPress={onSwitchPress}
          backgroundColor="#242526"
          textColor="#fff"
          buttonColor="#FF6400"
          animationDuration={300}
        />
      </View>
      {!isMangaMode && (
        <View>
          <Search.Suggestion
            trendingKeywords={trendingKeywords}
            setTrendingKeywords={setTrendingKeywords}
            onPress={handleOnPress}
          />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Search.List data={results} isMangaMode={isMangaMode} />
      </View>
    </View>
  );
}

Search.List = ({ data, isMangaMode }) => {
  const navigation = useNavigation();

  const handleAnimeItemPress = (props) => {
    navigation.push("Watch", { id: props.id });
  };

  const handleMangaItemPress = ({ id: data }) => {
    navigation.push("Manga", {
      id: data.id,
      slug: data.slug.name || data.slug,
    });
  };

  return (
    <Item.Container style={{ flex: 1 }}>
      <Item
        data={data}
        onItemPress={isMangaMode ? handleMangaItemPress : handleAnimeItemPress}
        showList={false}
        horizontal={false}
        renderItem={isMangaMode ? mangaRender : animeRender}
      />
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
