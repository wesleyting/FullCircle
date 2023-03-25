import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const CircularProgressBar = ({
  progress,
  total,
  completed,
  size = 200,
  strokeWidth = 10,
  duration = 1000,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const scale = useState(new Animated.Value(1))[0];
  const isComplete = completed === total;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = (1 - animatedProgress) * circumference;

  useEffect(() => {
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progressRatio = elapsedTime / duration;
      const progressDifference = progress - animatedProgress;

      setAnimatedProgress(
        animatedProgress + progressDifference * Math.min(progressRatio, 1)
      );

      if (elapsedTime < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [progress, duration]);

  useEffect(() => {
    if (isComplete) {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isComplete, scale]);

  const circleStyle = {
    transform: [{ scale }],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={circleStyle}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            stroke="#f3f3f3"
          />
          <Path
            stroke="#3b5998"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            d={`M${size / 2},${strokeWidth / 2}
              a${radius},${radius} 0 0,1 0,${radius * 2}
              a${radius},${radius} 0 0,1 0,-${radius * 2}`}
          />
        </Svg>
      </Animated.View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {isComplete ? "Full circle achieved" : `${completed}/${total} habits`}
        </Text>
        {!isComplete && <Text style={styles.text}>completed</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  textContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CircularProgressBar;
