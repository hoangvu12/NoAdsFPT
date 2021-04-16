import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";

import screens, { options } from "./Screens";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={options.screenOptions}
        initialRouteName={options.initialRouteName}
      >
        {screens.map((screen, index) => (
          <Stack.Screen {...screen} key={index} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
