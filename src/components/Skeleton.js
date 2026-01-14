import { View } from "react-native";
import { useTheme } from "../hooks/useTheme";

export default function Skeleton({ style }) {
  const t = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: t.chip,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: t.border,
        },
        style,
      ]}
    />
  );
}
