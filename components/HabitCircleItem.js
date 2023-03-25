import React, { useState, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HabitCircleItem({ habit, updateCompletedHabits }) {
  const [isCrossedOut, setIsCrossedOut] = useState(habit.completed);

  function handlePress() {
    const newStatus = !isCrossedOut;
    updateCompletedHabits(habit.id, newStatus);
    setIsCrossedOut(newStatus);
  }

  const formattedTime = useMemo(() => {
    return habit.time
      ? new Date(habit.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;
  }, [habit.time]);

  return (
    <TouchableOpacity style={styles.item} onPress={handlePress}>
      <Text style={[styles.title, isCrossedOut && styles.crossedOut]}>
        {habit.title}
      </Text>
      {formattedTime && (
        <Text style={[styles.time, isCrossedOut && styles.crossedOut]}>
          {formattedTime}
        </Text>
      )}
      <View style={styles.separator} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 28,
  },
  time: {
    color: "#808080",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "rgba(115, 115, 115, 0.5)",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  crossedOut: {
    textDecorationLine: "line-through",
  },
});
