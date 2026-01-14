import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { getTrending, searchMovies } from "../../src/api/tmdb";
import MovieCard from "../../src/components/MovieCard";
import MovieCardSkeleton from "../../src/components/MovieCardSkeleton";
import PosterRow from "../../src/components/PosterRow";
import { useTheme } from "../../src/hooks/useTheme";

export default function Search() {
  const router = useRouter();
  const t = useTheme();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [trending, setTrending] = useState([]);

  // Prevent “old request overwriting new request”
  const requestIdRef = useRef(0);

  useEffect(() => {
    (async () => {
      try {
        const d = await getTrending();
        setTrending(d?.results?.slice(0, 10) ?? []);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const q = query.trim();
    setError("");

    // if too short, don't constantly flip UI — keep results stable
    if (q.length < 2) {
      setLoading(false);
      setResults([]);
      return;
    }

    const myId = ++requestIdRef.current;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchMovies(q);

        // Only apply if this is the latest request
        if (myId === requestIdRef.current) {
          setResults(data?.results ?? []);
        }
      } catch (e) {
        if (myId === requestIdRef.current) {
          setError(String(e?.message || "Search failed."));
          setResults([]);
        }
      } finally {
        if (myId === requestIdRef.current) setLoading(false);
      }
    }, 600); // slightly longer debounce = less “glitch”

    return () => clearTimeout(timer);
  }, [query]);

  const showEmptyHero = query.trim().length < 2;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, padding: 16 }}>
        {/* Header */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 24, fontWeight: "900", color: t.text }}>
            Search
          </Text>
          <Text style={{ marginTop: 6, color: t.muted }}>
            Find movies fast — trailers, cast, and more.
          </Text>
        </View>

        {/* Input */}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            borderWidth: 1,
            borderColor: t.border,
            backgroundColor: t.card,
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search movies…"
            placeholderTextColor={t.muted}
            autoCapitalize="none"
            autoCorrect={false}
            style={{ flex: 1, fontSize: 16, color: t.text }}
            returnKeyType="search"
          />

          {query.length > 0 ? (
            <Pressable
              onPress={() => setQuery("")}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: t.border,
                backgroundColor: t.chip,
              }}
            >
              <Text style={{ color: t.text, fontWeight: "900" }}>Clear</Text>
            </Pressable>
          ) : null}
        </View>

        {error ? (
          <Text style={{ marginTop: 10, color: "crimson" }}>{error}</Text>
        ) : null}

        {/* Keep ONE stable list on screen (no big tree switching = no glitch) */}
        <FlatList
          style={{ marginTop: 14 }}
          data={loading ? Array.from({ length: 6 }) : results}
          keyExtractor={(item, i) => (loading ? String(i) : String(item.id))}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12, paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            showEmptyHero ? (
              <View style={{ marginBottom: 14 }}>
                <View
                  style={{
                    padding: 14,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: t.border,
                    backgroundColor: t.card,
                  }}
                >
                  <Text
                    style={{ fontSize: 18, fontWeight: "900", color: t.text }}
                  >
                    Try “Batman”, “Marvel”, “Comedy”
                  </Text>
                  <Text style={{ marginTop: 6, color: t.muted }}>
                    Type at least 2 letters to search.
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 10,
                      marginTop: 12,
                    }}
                  >
                    {[
                      "Batman",
                      "Marvel",
                      "Harry Potter",
                      "Comedy",
                      "Action",
                    ].map((s) => (
                      <Pressable
                        key={s}
                        onPress={() => setQuery(s)}
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderRadius: 999,
                          borderWidth: 1,
                          borderColor: t.border,
                          backgroundColor: t.chip,
                        }}
                      >
                        <Text style={{ color: t.text, fontWeight: "800" }}>
                          {s}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <PosterRow
                  title="Popular right now"
                  movies={trending}
                  onPressMovie={(m) => router.push(`/movie/${m.id}`)}
                />
              </View>
            ) : null
          }
          renderItem={({ item }) =>
            loading ? (
              <MovieCardSkeleton />
            ) : (
              <MovieCard
                movie={item}
                onPress={() => router.push(`/movie/${item.id}`)}
              />
            )
          }
          ListEmptyComponent={
            !showEmptyHero && !loading ? (
              <Text style={{ color: t.muted, marginTop: 6 }}>No results.</Text>
            ) : null
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}
