import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMovieDetails } from "../../src/api/tmdb";
import { useTheme } from "../../src/hooks/useTheme";
import { useWatchlist } from "../../src/hooks/useWatchlist";

const poster = (path) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : null;
const profile = (path) =>
  path ? `https://image.tmdb.org/t/p/w185${path}` : null;

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const t = useTheme();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { add, remove, has } = useWatchlist();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const d = await getMovieDetails(id);
        if (mounted) setData(d);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    (async () => {
      const ok = await has(Number(id));
      setSaved(ok);
    })();
  }, [id, has]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!data)
    return (
      <View style={{ flex: 1, backgroundColor: t.bg, padding: 16 }}>
        <Text style={{ color: t.text }}>Movie not found.</Text>
      </View>
    );

  const trailer = data?.videos?.results?.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  const cast = data?.credits?.cast ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1, backgroundColor: t.bg }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* Top bar (Back button + label) */}
        <View
          style={{
            padding: 12,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: t.border,
            backgroundColor: t.card,
            marginBottom: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              onPress={() => router.back()}
              hitSlop={16}
              android_ripple={{ color: t.chip }}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingVertical: 12, // bigger
                paddingHorizontal: 14, // bigger
                borderRadius: 16,
                borderWidth: 1,
                borderColor: t.border,
                backgroundColor: pressed ? t.chip : t.bg, // nice press effect
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <Ionicons name="chevron-back" size={22} color={t.text} />
              <Text style={{ color: t.text, fontWeight: "900", fontSize: 16 }}>
                Back
              </Text>
            </Pressable>

            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                textAlign: "right",
                marginLeft: 12,
                color: t.muted,
                fontWeight: "900",
                fontSize: 16,
              }}
            >
              Movie Details
            </Text>
          </View>

          <Text style={{ marginTop: 5, color: t.muted }}>
            Trailer • Watchlist • Cast
          </Text>
        </View>

        {/* Poster */}
        {poster(data.poster_path) ? (
          <Image
            source={{ uri: poster(data.poster_path) }}
            style={{ width: "100%", aspectRatio: 2 / 3, borderRadius: 22 }}
          />
        ) : null}

        {/* Title + Meta */}
        <Text
          style={{
            fontSize: 26,
            fontWeight: "900",
            marginTop: 14,
            color: t.text,
          }}
        >
          {data.title}
        </Text>

        <Text style={{ marginTop: 8, color: t.muted }}>
          ⭐ {data.vote_average?.toFixed(1)} • {data.release_date} •{" "}
          {data.runtime ? `${data.runtime} min` : "—"}
        </Text>

        {/* Genre chips (fills the upper part nicely) */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 12,
          }}
        >
          {(data.genres ?? []).slice(0, 4).map((g) => (
            <View
              key={g.id}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: t.border,
                backgroundColor: t.chip,
              }}
            >
              <Text style={{ color: t.text, fontWeight: "800" }}>{g.name}</Text>
            </View>
          ))}
        </View>

        {/* Copy link row (your existing button) */}
        <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
          <Pressable
            onPress={async () => {
              const url = `https://www.themoviedb.org/movie/${data.id}`;
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              await Clipboard.setStringAsync(url);
            }}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: t.border,
              backgroundColor: t.card,
            }}
          >
            <Text style={{ color: t.text, fontWeight: "900" }}>Copy Link</Text>
          </Pressable>
        </View>

        {/* Overview */}
        <Text
          style={{ marginTop: 14, fontSize: 16, lineHeight: 22, color: t.text }}
        >
          {data.overview}
        </Text>

        {/* Actions */}
        <View style={{ marginTop: 16, gap: 10 }}>
          {trailer ? (
            <Pressable
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                await WebBrowser.openBrowserAsync(
                  `https://www.youtube.com/watch?v=${trailer.key}`
                );
              }}
              style={{
                padding: 14,
                borderRadius: 16,
                alignItems: "center",
                backgroundColor: t.primary,
              }}
            >
              <Text style={{ color: t.primaryText, fontWeight: "900" }}>
                Watch Trailer
              </Text>
            </Pressable>
          ) : (
            <View
              style={{
                padding: 14,
                borderRadius: 16,
                alignItems: "center",
                borderWidth: 1,
                borderColor: t.border,
              }}
            >
              <Text style={{ color: t.muted, fontWeight: "800" }}>
                No trailer available
              </Text>
            </View>
          )}

          <Pressable
            onPress={async () => {
              if (!saved) {
                await add({
                  id: data.id,
                  title: data.title,
                  poster_path: data.poster_path,
                  vote_average: data.vote_average,
                  release_date: data.release_date,
                });
                setSaved(true);
              } else {
                await remove(data.id);
                setSaved(false);
              }
            }}
            style={{
              padding: 14,
              borderRadius: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: t.border,
              backgroundColor: t.card,
            }}
          >
            <Text style={{ color: t.text, fontWeight: "900" }}>
              {saved ? "Remove from Watchlist" : "Save to Watchlist"}
            </Text>
          </Pressable>
        </View>

        {/* Cast */}
        <Text
          style={{
            marginTop: 22,
            fontSize: 18,
            fontWeight: "900",
            color: t.text,
          }}
        >
          Top Cast
        </Text>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={cast.slice(0, 15)}
          keyExtractor={(p) => String(p.cast_id || p.credit_id || p.id)}
          contentContainerStyle={{ gap: 12, paddingVertical: 12 }}
          renderItem={({ item }) => (
            <View
              style={{
                width: 120,
                borderWidth: 1,
                borderColor: t.border,
                backgroundColor: t.card,
                borderRadius: 18,
                padding: 10,
              }}
            >
              {profile(item.profile_path) ? (
                <Image
                  source={{ uri: profile(item.profile_path) }}
                  style={{ width: "100%", height: 120, borderRadius: 14 }}
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: 120,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: t.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: t.muted, fontWeight: "800" }}>
                    No photo
                  </Text>
                </View>
              )}

              <Text
                numberOfLines={1}
                style={{ marginTop: 8, fontWeight: "900", color: t.text }}
              >
                {item.name}
              </Text>
              <Text numberOfLines={1} style={{ marginTop: 2, color: t.muted }}>
                {item.character}
              </Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// import { useLocalSearchParams, useRouter } from "expo-router";
// import * as WebBrowser from "expo-web-browser";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Image,
//   Pressable,
//   ScrollView,
//   Text,
// } from "react-native";
// import { getMovieDetails } from "../../src/api/tmdb";
// import { useWatchlist } from "../../src/hooks/useWatchlist";

// const poster = (path) =>
//   path ? `https://image.tmdb.org/t/p/w500${path}` : null;

// export default function MovieDetails() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const { add, remove, has } = useWatchlist();
//   const [saved, setSaved] = useState(false);

//   useEffect(() => {
//     let mounted = true;

//     (async () => {
//       try {
//         setLoading(true);
//         const d = await getMovieDetails(id);
//         if (mounted) setData(d);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, [id]);

//   useEffect(() => {
//     (async () => {
//       const ok = await has(Number(id));
//       setSaved(ok);
//     })();
//   }, [id, has]);

//   if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
//   if (!data)
//     return <Text style={{ marginTop: 40, padding: 16 }}>Movie not found.</Text>;

//   const trailer = data?.videos?.results?.find(
//     (v) => v.site === "YouTube" && v.type === "Trailer"
//   );

//   return (
//     <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
//       <Pressable onPress={() => router.back()}>
//         <Text style={{ marginBottom: 12 }}>← Back</Text>
//       </Pressable>

//       {poster(data.poster_path) ? (
//         <Image
//           source={{ uri: poster(data.poster_path) }}
//           style={{ width: "100%", aspectRatio: 2 / 3, borderRadius: 20 }}
//         />
//       ) : null}

//       <Text style={{ fontSize: 26, fontWeight: "800", marginTop: 14 }}>
//         {data.title}
//       </Text>

//       <Text style={{ marginTop: 8, opacity: 0.8 }}>
//         ⭐ {data.vote_average?.toFixed(1)} • {data.release_date}
//       </Text>

//       <Text style={{ marginTop: 14, fontSize: 16, lineHeight: 22 }}>
//         {data.overview}
//       </Text>

//       {trailer ? (
//         <Pressable
//           onPress={() =>
//             WebBrowser.openBrowserAsync(
//               `https://www.youtube.com/watch?v=${trailer.key}`
//             )
//           }
//           style={{
//             marginTop: 16,
//             padding: 14,
//             borderRadius: 14,
//             alignItems: "center",
//             backgroundColor: "black",
//           }}
//         >
//           <Text style={{ color: "white", fontWeight: "700" }}>
//             Watch Trailer
//           </Text>
//         </Pressable>
//       ) : null}

//       <Pressable
//         onPress={async () => {
//           if (!saved) {
//             await add({
//               id: data.id,
//               title: data.title,
//               poster_path: data.poster_path,
//               vote_average: data.vote_average,
//               release_date: data.release_date,
//             });
//             setSaved(true);
//           } else {
//             await remove(data.id);
//             setSaved(false);
//           }
//         }}
//         style={{
//           marginTop: 12,
//           padding: 14,
//           borderRadius: 14,
//           alignItems: "center",
//           borderWidth: 1,
//           borderColor: "#ddd",
//         }}
//       >
//         <Text style={{ fontWeight: "800" }}>
//           {saved ? "Remove from Watchlist" : "Save to Watchlist"}
//         </Text>
//       </Pressable>

//       <Text style={{ marginTop: 22, fontSize: 18, fontWeight: "700" }}>
//         Top Cast
//       </Text>
//       {data?.credits?.cast?.slice(0, 10).map((p) => (
//         <Text key={p.cast_id || p.credit_id} style={{ marginTop: 6 }}>
//           {p.name} — {p.character}
//         </Text>
//       ))}
//     </ScrollView>
//   );
// }
