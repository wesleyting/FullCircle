import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HabitCircleItem from "./HabitCircleItem";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import CircularProgressBar from "./CircularProgressBar";
import { MaterialIcons } from "@expo/vector-icons";

export default function HabitCircle() {
  const [habits, setHabits] = useState([]);
  const [completedHabits, setCompletedHabits] = useState(0);
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());

  const loadHabits = useCallback(async () => {
    try {
      const storedHabits = await AsyncStorage.getItem("habits");
      if (storedHabits !== null) {
        setHabits(JSON.parse(storedHabits));
      }
    } catch (e) {
      console.error("Failed to load habits from storage", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onFocused = async () => {
        await loadHabits();
      };

      onFocused();

      return () => {};
    }, [loadHabits])
  );

  useEffect(() => {
    const countCompletedHabits = habits.filter(
      (habit) => habit.completed
    ).length;
    setCompletedHabits(countCompletedHabits);
  }, [habits]);

  useEffect(() => {
    const checkForNewDay = setInterval(() => {
      const newDate = new Date().toDateString();
      if (currentDate !== newDate) {
        setCurrentDate(newDate);
        setHabits((prevHabits) =>
          prevHabits.map((habit) => ({ ...habit, completed: false }))
        );
      }
    }, 60000);

    return () => clearInterval(checkForNewDay);
  }, [currentDate]);

  const updateCompletedHabits = useCallback((habitId, completed) => {
    setHabits((prevHabits) => {
      const updatedHabits = prevHabits.map((habit) =>
        habit.id === habitId ? { ...habit, completed } : habit
      );
      AsyncStorage.setItem("habits", JSON.stringify(updatedHabits)).catch((e) =>
        console.error("Failed to save habits to storage", e)
      );
      return updatedHabits;
    });
  }, []);

  const progress = habits.length > 0 ? completedHabits / habits.length : 0;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {habits.length > 0 && (
          <CircularProgressBar
            progress={progress}
            total={habits.length}
            completed={completedHabits}
            size={200}
            strokeWidth={10}
          />
        )}
        <MaterialIcons
          name="add-circle-outline"
          size={32}
          color="black"
          style={styles.materialIcons}
          onPress={() => navigation.navigate("HabitList")}
        />
      </View>

      <FlatList
        data={habits}
        renderItem={({ item }) => (
          <HabitCircleItem
            habit={item}
            updateCompletedHabits={updateCompletedHabits}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.noHabitsText}>
            You don't have any habits yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 72,
  },
  progressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    marginBottom: 28,
  },
  materialIcons: {
    position: "absolute",
    right: -70,
    top: 0,
  },
  noHabitsText: {
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 38,
  },
});
