import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import tailwind from "tailwind-rn";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";

import Dashboard from "./Screens/Dashboard/Dashboard";
import ShowList from "./Screens/ShowList/ShowList";
import Search from "./Screens/Search/Search";
import Watch from "./Screens/Watch/Watch";

const Stack = createStackNavigator();
import { AntDesign } from "@expo/vector-icons";

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
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
        })}
        initialRouteName="Dashboard"
      >
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ title: "Trang chủ" }}
        />
        <Stack.Screen
          name="List"
          component={ShowList}
          options={{ title: "Danh sách" }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            title: "Tìm kiếm",
          }}
        />
        <Stack.Screen
          name="Watch"
          component={Watch}
          options={({ route, navigation }) => ({
            title: "Xem video",
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => {
                  navigation.navigate("Dashboard");
                }}
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
