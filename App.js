import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HabitList from "./components/HabitList";
import HabitCircle from "./components/HabitCircle";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HabitCircle"
          component={HabitCircle}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="HabitList" component={HabitList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
