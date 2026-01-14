import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "../../src/hooks/useTheme";

export default function TabsLayout() {
  const t = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: t.bg, borderTopColor: t.border },
        tabBarActiveTintColor: t.text,
        tabBarInactiveTintColor: t.muted,
        tabBarLabelStyle: { fontWeight: "700" },
        tabBarIcon: ({ color, size, focused }) => {
          let name = "home";
          if (route.name === "index") name = focused ? "home" : "home-outline";
          if (route.name === "search")
            name = focused ? "search" : "search-outline";
          if (route.name === "watchlist")
            name = focused ? "bookmark" : "bookmark-outline";
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="watchlist" options={{ title: "Watchlist" }} />
    </Tabs>
  );
}

// import { Ionicons } from "@expo/vector-icons";
// import { Tabs } from "expo-router";
// import { useTheme } from "../../src/hooks/useTheme";

// export default function TabsLayout() {
//     const t = useTheme();
//   return (
//     <Tabs
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarIcon: ({ color, size, focused }) => {
//           let name = "home";

//           if (route.name === "index") name = focused ? "home" : "home-outline";
//           if (route.name === "search")
//             name = focused ? "search" : "search-outline";
//           if (route.name === "watchlist")
//             name = focused ? "bookmark" : "bookmark-outline";

//           return <Ionicons name={name} size={size} color={color} />;
//         },
//         tabBarLabelStyle: { fontWeight: "700" },
//       })}
//     >
//       <Tabs.Screen name="index" options={{ title: "Home" }} />
//       <Tabs.Screen name="search" options={{ title: "Search" }} />
//       <Tabs.Screen name="watchlist" options={{ title: "Watchlist" }} />
//     </Tabs>
//   );
// }
