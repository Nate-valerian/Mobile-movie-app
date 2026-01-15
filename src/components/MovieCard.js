import { useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { useWatchlist } from "../hooks/useWatchlist";

const poster = (path) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : null;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function MovieCard({ movie, onPress }) {
  const t = useTheme();
  const { has } = useWatchlist();
  const [saved, setSaved] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const flash = useRef(new Animated.Value(0)).current;

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

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 30,
        bounciness: 0,
      }),
      Animated.timing(flash, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 22,
        bounciness: 8,
      }),
      Animated.timing(flash, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const uri = poster(movie.poster_path);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{ flex: 1, transform: [{ scale }] }}
    >
      <View
        style={{
          borderRadius: 16,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: t.border,
          backgroundColor: t.card,
        }}
      >
        {uri ? (
          <View>
            <Image
              source={{ uri }}
              style={{ width: "100%", aspectRatio: 2 / 3 }}
            />

            {/* Shimmer/flash overlay */}
            <Animated.View
              pointerEvents="none"
              style={{
                position: "absolute",
                inset: 0,
                opacity: flash.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.16],
                }),
                backgroundColor: "#fff",
              }}
            />
          </View>
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
              style={{ color: t.primaryText, fontWeight: "900", fontSize: 12 }}
            >
              Saved
            </Text>
          </View>
        ) : null}
      </View>

      <Text
        numberOfLines={1}
        style={{ marginTop: 6, fontWeight: "800", color: t.text }}
      >
        {movie.title}
      </Text>
      <Text style={{ marginTop: 2, color: t.muted }}>
        ⭐ {movie.vote_average?.toFixed(1) ?? "—"}
      </Text>
    </AnimatedPressable>
  );
}
