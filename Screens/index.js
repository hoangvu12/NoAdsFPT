import React from "react";
import { TouchableOpacity } from "react-native";
import { HeaderBackButton } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";

import Dashboard from "./Dashboard/Dashboard";
import ShowList from "./ShowList/ShowList";
import Search from "./Search/Search";
import Watch from "./Watch/";

const screenOptions = ({ route, navigation }) => ({
  headerStyle: {
    backgroundColor: "#18191A",
  },
  headerTintColor: "#fff",
  headerRight: () => (
    <TouchableOpacity
      style={{ marginRight: 12 }}
      onPress={() => navigation.navigate("Search")}
    >
      <AntDesign name="search1" size={24} color="white" />
    </TouchableOpacity>
  ),
});

export const options = {
  screenOptions: screenOptions,
  initialRouteName: "Dashboard",
};

export default [
  { name: "Dashboard", component: Dashboard, options: { title: "Trang chủ" } },
  { name: "List", component: ShowList, options: { title: "Danh sách" } },
  { name: "Search", component: Search, options: { title: "Tìm kiếm" } },
  {
    name: "Watch",
    component: Watch,
    options: ({ navigation }) => ({
      title: "Xem video",
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            navigation.navigate("Dashboard");
          }}
        />
      ),
    }),
  },
];
