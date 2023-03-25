import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HabitListItem(props) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => props.onEdit(props.habit)}
    >
      <Text style={styles.title}>{props.habit.title}</Text>
      {props.habit.time && (
        <Text style={styles.time}>
          {new Date(props.habit.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
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
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
