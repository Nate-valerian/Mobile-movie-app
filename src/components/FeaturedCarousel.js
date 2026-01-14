import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { useTheme } from "../hooks/useTheme";

const { width } = Dimensions.get("window");

const img = (path) => (path ? `https://image.tmdb.org/t/p/w780${path}` : null);

export default function FeaturedCarousel({
  title = "Featured",
  movies = [],
  onPressMovie,
}) {
  const t = useTheme();
  if (!movies.length) return null;

  return (
    <View style={{ marginBottom: 12 }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "900",
          color: t.text,
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={(m) => String(m.id)}
        renderItem={({ item }) => {
          const uri = img(item.backdrop_path || item.poster_path);
          return (
            <Pressable
              onPress={() => onPressMovie?.(item)}
              style={{ width: width - 32 }} // screen width minus padding (16+16)
            >
              <View
                style={{
                  borderRadius: 22,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: t.border,
                  backgroundColor: t.card,
                }}
              >
                {uri ? (
                  <Image
                    source={{ uri }}
                    style={{ width: "100%", height: 140 }}
                  />
                ) : (
                  <View
                    style={{
                      width: "100%",
                      height: 200,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: t.muted, fontWeight: "800" }}>
                      No image
                    </Text>
                  </View>
                )}

                <View style={{ padding: 7 }}>
                  <Text
                    numberOfLines={1}
                    style={{ color: t.text, fontWeight: "900", fontSize: 15 }}
                  >
                    {item.title}
                  </Text>
                  <Text style={{ marginTop: 4, color: t.muted }}>
                    ⭐ {item.vote_average?.toFixed(1) ?? "—"} •{" "}
                    {item.release_date || "—"}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      />
    </View>
  );
}
