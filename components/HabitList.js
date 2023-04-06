import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Button,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import format from "date-fns/format";

import HabitListItem from "./HabitListItem";

export default function HabitList(props) {
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [habits, setHabits] = useState([]);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [newHabitTimeString, setNewHabitTimeString] = useState(null);
  const [isTimeSelected, setIsTimeSelected] = useState(false);
  const [newHabitTime, setNewHabitTime] = useState(null);
  const navigation = useNavigation();

  function handlePress() {
    navigation.goBack();
  }

  useEffect(() => {
    async function loadHabits() {
      try {
        const storedHabits = await AsyncStorage.getItem("habits");
        if (storedHabits !== null) {
          setHabits(JSON.parse(storedHabits));
        }
      } catch (e) {
        console.error("Failed to load habits from storage", e);
      }
    }
    loadHabits();
  }, []);

  useEffect(() => {
    async function saveHabits() {
      try {
        await AsyncStorage.setItem("habits", JSON.stringify(habits));
      } catch (e) {
        console.error("Failed to save habits to storage", e);
      }
    }
    saveHabits();
  }, [habits]);

  function renderHabitListItem({ item }) {
    return (
      <TouchableOpacity onPress={() => setSelectedHabit(item)}>
        <HabitListItem
          habit={item}
          onDelete={handleDeleteHabit}
          onEdit={handleEditHabit}
        />
      </TouchableOpacity>
    );
  }

  function handleAddHabit(newHabit) {
    if (selectedHabit) {
      const newHabits = habits.map((habit) => {
        if (habit.id === selectedHabit.id) {
          return {
            ...habit,
            title: newHabitTitle,
            time: newHabitTime ? newHabitTime.toISOString() : null,
          };
        }
        return habit;
      });
      setHabits(newHabits);
    } else {
      setHabits([...habits, newHabit]);
    }
    setModalVisible(false);
    setSelectedHabit(null);
    resetModalState();
  }

  function handleEditHabit(habit) {
    setSelectedHabit(habit);
    setModalVisible(true);
  }

  function resetModalState() {
    setNewHabitTitle("");
    setNewHabitTime(null);
    setNewHabitTimeString(null);
  }

  function handleDeleteHabit(id) {
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            const newHabits = habits.filter((habit) => habit.id !== id);
            setHabits(newHabits);
            setSelectedHabit(null);
            setModalVisible(false);
          },
        },
      ],
      { cancelable: true }
    );
  }

  return (
    <View style={styles.list}>
      <View style={styles.container}>
        {habits.length >= 1 ? (
          <Text style={styles.header}>
            {habits.length} Habit{habits.length !== 1 ? "s" : ""}
          </Text>
        ) : (
          <Text style={styles.header}>No habits yet</Text>
        )}

        <FlatList
          data={habits}
          renderItem={renderHabitListItem}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setModalVisible(true);
                setSelectedHabit(null);
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <MaterialIcons
                  name="add-circle"
                  size={24}
                  color="black"
                  style={{ marginRight: 12 }}
                />
                <Text style={styles.buttonText}>Add New Habit</Text>
              </View>
            </TouchableOpacity>
          }
        />

        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBackground}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <TextInput
                style={styles.input}
                placeholder={selectedHabit ? selectedHabit.title : "Habit Name"}
                value={newHabitTitle}
                onChangeText={setNewHabitTitle}
              />

              {showTimePicker && (
                <DateTimePicker
                  value={
                    newHabitTime !== null
                      ? newHabitTime
                      : new Date(new Date().setSeconds(0))
                  }
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (event.type === "dismissed") {
                    } else {
                      if (selectedDate) {
                        const currentDate = new Date(
                          selectedDate.setSeconds(0)
                        );

                        setNewHabitTime(currentDate);
                        setIsTimeSelected(true);
                        const formattedTime = currentDate.toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        );

                        setNewHabitTimeString(formattedTime);
                      } else {
                        setNewHabitTime(null);
                        setIsTimeSelected(false);
                        setNewHabitTimeString(null);
                      }
                    }
                    setShowTimePicker(false);
                  }}
                />
              )}

              <View style={{ width: "100%" }}>
                <TouchableOpacity
                  style={styles.setTime}
                  onPress={() => setShowTimePicker(true)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialIcons name="edit" size={20} color="#808080" />
                    <Text style={{ marginLeft: 5, fontSize: 20 }}>
                      {newHabitTime !== null
                        ? `Time: ${newHabitTimeString}`
                        : selectedHabit && selectedHabit.time
                        ? `Time: ${new Date(
                            selectedHabit.time
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}`
                        : "No time set"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    if (!newHabitTitle.trim()) {
                      alert("Please enter a title for your habit.");
                      return;
                    }
                    handleAddHabit({
                      id: Math.floor(Math.random() * 100000),
                      title: newHabitTitle,
                      time: newHabitTime ? newHabitTime.toISOString() : null,
                    });
                    setNewHabitTitle("");
                    setNewHabitTime(null);
                  }}
                >
                  <Text style={styles.modalButtonText}>
                    {selectedHabit ? "Save Changes" : "Add Habit"}
                  </Text>
                </TouchableOpacity>
                {selectedHabit && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      handleDeleteHabit(selectedHabit.id);
                      setModalVisible(false);
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialIcons name="delete" size={20} color="#fff" />
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      <View>
        <Button title="Back to Habit Circle" onPress={handlePress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 72,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 38,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(248, 248, 248, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 6,
  },
  buttonText: {
    color: "#808080",
    fontSize: 18,
    fontWeight: "bold",
  },
  setTime: {
    padding: 12,
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#D3D3D3",
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 10,
    width: "100%",
    fontSize: 20,
  },
  addButton: {
    backgroundColor: "#0099ff",
    color: "#fffff",
  },
  modalButtonText: {
    color: "#fff",
    padding: 18,
    fontSize: 20,
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 6,
  },
});
