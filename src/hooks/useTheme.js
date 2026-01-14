import { useColorScheme } from "react-native";
import { theme } from "../styles/theme";

export function useTheme() {
  const scheme = useColorScheme();
  return theme[scheme === "dark" ? "dark" : "light"];
}
