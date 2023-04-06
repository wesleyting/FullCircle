import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import format from "date-fns/format";

export default function HabitListItem(props) {
  const time = props.habit.time
    ? format(new Date(props.habit.time), "h:mm aaa")
    : null;

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => props.onEdit(props.habit)}
    >
      <Text style={styles.title}>{props.habit.title}</Text>
      {time && <Text style={styles.time}>{time}</Text>}

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
