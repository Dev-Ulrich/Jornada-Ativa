import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

type ProgressRingProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
  backgroundColor?: string;
  label?: string;
};

export function ProgressRing({
  progress,
  size = 64,
  strokeWidth = 6,
  trackColor = "#1f1f1f",
  progressColor = "#ff7a1a",
  backgroundColor = "#0b0b0b",
  label,
}: ProgressRingProps) {
  const { radius, circumference, clamped } = useMemo(() => {
    const clampedValue = Math.min(Math.max(progress, 0), 1);
    const computedRadius = (size - strokeWidth) / 2;
    const computedCircumference = 2 * Math.PI * computedRadius;

    return {
      radius: computedRadius,
      circumference: computedCircumference,
      clamped: clampedValue,
    };
  }, [progress, size, strokeWidth]);

  const dashOffset = circumference - circumference * clamped;
  const displayLabel = label ?? `${Math.round(clamped * 100)}%`;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <Circle
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <View
        style={[
          styles.labelContainer,
          {
            top: strokeWidth,
            left: strokeWidth,
            right: strokeWidth,
            bottom: strokeWidth,
            borderRadius: (size - strokeWidth * 2) / 2,
            backgroundColor,
          },
        ]}
      >
        <Text style={styles.labelText}>{displayLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
});
