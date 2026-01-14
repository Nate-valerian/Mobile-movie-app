import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getTrending } from "../../src/api/tmdb";
import FeaturedCarousel from "../../src/components/FeaturedCarousel";
import MovieCard from "../../src/components/MovieCard";
import MovieCardSkeleton from "../../src/components/MovieCardSkeleton";
import { useTheme } from "../../src/hooks/useTheme";

export default function Home() {
  const router = useRouter();
  const t = useTheme();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const featured = movies.slice(0, 6);

  const load = useCallback(async () => {
    try {
      setError("");
      const d = await getTrending();
      setMovies(d?.results ?? []);
    } catch (e) {
      setError("Failed to load trending movies.");
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={["top"]}>
      <View style={{ flex: 1, padding: 16, backgroundColor: t.bg }}>
        {/* Header card */}
        <View
          style={{
            padding: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: t.border,
            backgroundColor: t.card,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "800", color: t.text }}>
            Trending Today
          </Text>
          <Text style={{ marginTop: 3, color: t.muted }}>
            Tap a movie to see details, trailer, and cast.
          </Text>
          {error ? (
            <Text style={{ marginTop: 8, color: "crimson" }}>{error}</Text>
          ) : null}
        </View>

        {/* Featured carousel */}
        <FeaturedCarousel
          title="Featured"
          movies={featured}
          onPressMovie={(m) => router.push(`/movie/${m.id}`)}
        />

        {/* Grid */}
        {loading ? (
          <FlatList
            data={Array.from({ length: 8 })}
            keyExtractor={(_, i) => String(i)}
            numColumns={2}
            columnWrapperStyle={{ gap: 10 }}
            contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
            renderItem={() => <MovieCardSkeleton />}
          />
        ) : (
          <FlatList
            data={movies}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={{ gap: 12 }}
            contentContainerStyle={{ gap: 12, paddingBottom: 30 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                onPress={() => router.push(`/movie/${item.id}`)}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
