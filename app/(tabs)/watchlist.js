import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { getTrending } from "../../src/api/tmdb";
import EmptyState from "../../src/components/EmptyState";
import PosterRow from "../../src/components/PosterRow";
import { useTheme } from "../../src/hooks/useTheme";
import { useWatchlist } from "../../src/hooks/useWatchlist";

const poster = (path) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : null;

function RightAction({ onRemove }) {
  return (
    <Pressable
      onPress={onRemove}
      style={{
        width: 92,
        marginVertical: 4,
        borderRadius: 16,
        backgroundColor: "#d11a2a",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "900" }}>Delete</Text>
    </Pressable>
  );
}

export default function Watchlist() {
  const router = useRouter();
  const t = useTheme();
  const { list, ready, remove } = useWatchlist();

  const [trending, setTrending] = useState([]);

  // Keep track of the currently open swipe row (properly)
  const openRowRef = useRef(null);

  const closeOpenRow = useCallback(() => {
    if (openRowRef.current) {
      openRowRef.current.close();
      openRowRef.current = null;
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const d = await getTrending();
        setTrending(d?.results?.slice(0, 10) ?? []);
      } catch {}
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: t.bg }}>
        <Text style={{ color: t.muted, marginTop: 10 }}>Loading…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: t.bg }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "900",
          marginBottom: 12,
          color: t.text,
        }}
      >
        Watchlist
      </Text>

      {!list.length ? (
        <View>
          <EmptyState
            icon="bookmark-outline"
            title="Your Watchlist is empty"
            subtitle="Save movies you want to watch later. Tap any movie to open details and press “Save”."
          />

          <PosterRow
            title="Trending you might like"
            movies={trending}
            onPressMovie={(m) => router.push(`/movie/${m.id}`)}
          />
        </View>
      ) : null}

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 12, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <Swipeable
            ref={(ref) => {
              // store the row ref; we will set openRowRef.current when opened
              item.__rowRef = ref;
            }}
            onSwipeableWillOpen={() => {
              // close previously open row before opening a new one
              if (openRowRef.current && openRowRef.current !== item.__rowRef) {
                openRowRef.current.close();
              }
              openRowRef.current = item.__rowRef;
            }}
            onSwipeableClose={() => {
              if (openRowRef.current === item.__rowRef) {
                openRowRef.current = null;
              }
            }}
            renderRightActions={() => (
              <RightAction
                onRemove={async () => {
                  await remove(item.id);
                  closeOpenRow();
                }}
              />
            )}
          >
            <Pressable
              onPress={() => router.push(`/movie/${item.id}`)}
              onPressIn={closeOpenRow}
              style={{
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor: t.border,
                backgroundColor: t.card,
                padding: 10,
                borderRadius: 18,
              }}
            >
              {poster(item.poster_path) ? (
                <Image
                  source={{ uri: poster(item.poster_path) }}
                  style={{ width: 60, height: 90, borderRadius: 12 }}
                />
              ) : (
                <View
                  style={{
                    width: 60,
                    height: 90,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: t.border,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: t.chip,
                  }}
                >
                  <Text
                    style={{ fontSize: 12, color: t.muted, fontWeight: "800" }}
                  >
                    No poster
                  </Text>
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{ fontWeight: "900", color: t.text }}
                >
                  {item.title}
                </Text>
                <Text style={{ marginTop: 4, color: t.muted }}>
                  ⭐ {item.vote_average?.toFixed(1) ?? "—"}
                </Text>

                <Text style={{ marginTop: 8, color: t.muted, fontSize: 12 }}>
                  Swipe left to delete
                </Text>
              </View>
            </Pressable>
          </Swipeable>
        )}
      />
    </View>
  );
}
