import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
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

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const featured = movies.slice(0, 6);

  const handleRefresh = async () => {
    try {
      setError("");
      setRefreshing(true);
      const d = await getTrending(1);
      setMovies(d?.results ?? []);
      setPage(1);
    } catch {
      setError("Failed to refresh trending movies.");
    } finally {
      setRefreshing(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore) return;
    try {
      setError("");
      setLoadingMore(true);

      const next = page + 1;
      const d = await getTrending(next);
      const more = d?.results ?? [];

      setMovies((prev) => [...prev, ...more]);
      setPage(next);
    } catch {
      setError("Failed to load more movies.");
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setError("");
        setLoading(true);
        const d = await getTrending(1);
        setMovies(d?.results ?? []);
        setPage(1);
      } catch {
        setError("Failed to load trending movies.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={["top"]}>
      <View style={{ flex: 1, padding: 16, backgroundColor: t.bg }}>
        {/* Header card */}
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: t.border,
            backgroundColor: t.card,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "800", color: t.text }}>
            Trending today
          </Text>
          <Text style={{ marginTop: 4, color: t.muted, fontSize: 13 }}>
            Tap a movie to see details, trailer, and cast.
          </Text>
          {error ? (
            <Text style={{ marginTop: 8, color: "crimson" }}>{error}</Text>
          ) : null}
        </View>

        {/* Featured 2-up row */}
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
            columnWrapperStyle={{ gap: 10 }}
            contentContainerStyle={{ gap: 10, paddingBottom: 30 }}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                onPress={() => router.push(`/movie/${item.id}`)}
              />
            )}
            ListFooterComponent={
              <View style={{ paddingVertical: 18 }}>
                <Pressable
                  onPress={loadMore}
                  disabled={loadingMore}
                  style={{
                    paddingVertical: 14,
                    borderRadius: 16,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: t.border,
                    backgroundColor: t.card,
                    opacity: loadingMore ? 0.8 : 1,
                  }}
                >
                  {loadingMore ? (
                    <ActivityIndicator />
                  ) : (
                    <Text style={{ color: t.text, fontWeight: "900" }}>
                      Continue loading
                    </Text>
                  )}
                </Pressable>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
