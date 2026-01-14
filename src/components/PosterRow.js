import { FlatList, Image, Pressable, Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";

const poster = (path) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : null;

export default function PosterRow({ title, movies = [], onPressMovie }) {
  const t = useTheme();

  if (!movies.length) return null;

  return (
    <View style={{ marginTop: 16 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "900",
          color: t.text,
          marginBottom: 10,
        }}
      >
        {title}
      </Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={(m) => String(m.id)}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => onPressMovie?.(item)}>
            <View
              style={{
                width: 110,
                borderRadius: 16,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: t.border,
                backgroundColor: t.card,
              }}
            >
              {poster(item.poster_path) ? (
                <Image
                  source={{ uri: poster(item.poster_path) }}
                  style={{ width: "100%", height: 165 }}
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: 165,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: t.muted, fontWeight: "800" }}>
                    No poster
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
