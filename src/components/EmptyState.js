import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";

export default function EmptyState({
  title,
  subtitle,
  icon = "bookmark-outline",
}) {
  const t = useTheme();

  return (
    <View
      style={{
        marginTop: 40,
        padding: 18,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: t.border,
        backgroundColor: t.card,
        alignItems: "center",
      }}
    >
      <Ionicons name={icon} size={40} color={t.muted} />
      <Text
        style={{
          marginTop: 12,
          fontSize: 18,
          fontWeight: "900",
          color: t.text,
        }}
      >
        {title}
      </Text>
      <Text style={{ marginTop: 6, color: t.muted, textAlign: "center" }}>
        {subtitle}
      </Text>
    </View>
  );
}
