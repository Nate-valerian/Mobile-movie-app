import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { useWatchlist } from "../hooks/useWatchlist";

const poster = (path) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : null;

export default function MovieCard({ movie, onPress }) {
  const t = useTheme();
  const { has } = useWatchlist();

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const ok = await has(movie.id);
        if (mounted) setSaved(ok);
      } catch {}
    })();

    return () => {
      mounted = false;
    };
  }, [movie.id, has]);

  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <View
        style={{
          borderRadius: 12,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: t.border,
          backgroundColor: t.card,
        }}
      >
        {/* Poster */}
        {poster(movie.poster_path) ? (
          <Image
            source={{ uri: poster(movie.poster_path) }}
            style={{ width: "100%", aspectRatio: 2 / 3 }}
          />
        ) : (
          <View
            style={{
              width: "100%",
              aspectRatio: 2 / 3,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: t.chip,
            }}
          >
            <Text style={{ color: t.muted, fontWeight: "800" }}>No poster</Text>
          </View>
        )}

        {/* Saved badge */}
        {saved ? (
          <View
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 999,
              backgroundColor: t.primary,
            }}
          >
            <Text
              style={{
                color: t.primaryText,
                fontWeight: "900",
                fontSize: 12,
              }}
            >
              Saved
            </Text>
          </View>
        ) : null}
      </View>

      {/* Title */}
      <Text
        numberOfLines={1}
        style={{
          marginTop: 5,
          fontWeight: "800",
          color: t.text,
        }}
      >
        {movie.title}
      </Text>

      {/* Rating */}
      <Text
        style={{
          marginTop: 2,
          color: t.muted,
        }}
      >
        ⭐ {movie.vote_average?.toFixed(1) ?? "—"}
      </Text>
    </Pressable>
  );
}
