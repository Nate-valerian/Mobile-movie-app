import { useRef } from "react";
import {
  Animated,
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

// Matches your Home density
const SCREEN_PADDING = 16;
const GAP = 10; // match Home grid gap
const RADIUS = 16; // match MovieCard tightness
const IMAGE_H = 112; // tuned: balanced vs grid posters (more movies visible)

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function FeaturedCard({ item, cardWidth, onPressMovie }) {
  const t = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const flash = useRef(new Animated.Value(0)).current;

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

  const uri = img(item.backdrop_path || item.poster_path);

  return (
    <AnimatedPressable
      onPress={() => onPressMovie?.(item)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{
        width: cardWidth,
        transform: [{ scale }],
      }}
    >
      <View
        style={{
          borderRadius: RADIUS,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: t.border,
          backgroundColor: t.card,
        }}
      >
        {/* Image */}
        {uri ? (
          <View>
            <Image
              source={{ uri }}
              style={{ width: "100%", height: IMAGE_H }}
              resizeMode="cover"
            />

            {/* “Shimmer flash” overlay on press (simple + classy) */}
            <Animated.View
              pointerEvents="none"
              style={{
                position: "absolute",
                inset: 0,
                opacity: flash.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.18],
                }),
                backgroundColor: "#fff",
              }}
            />
          </View>
        ) : (
          <View
            style={{
              width: "100%",
              height: IMAGE_H,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: t.muted, fontWeight: "800" }}>No image</Text>
          </View>
        )}

        {/* Text */}
        <View style={{ padding: 10 }}>
          <Text
            numberOfLines={1}
            style={{ color: t.text, fontWeight: "900", fontSize: 13 }}
          >
            {item.title}
          </Text>
          <Text
            numberOfLines={1}
            style={{ marginTop: 4, color: t.muted, fontSize: 12 }}
          >
            ⭐ {item.vote_average?.toFixed(1) ?? "—"}
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}

export default function FeaturedCarousel({
  title = "Featured",
  movies = [],
  onPressMovie,
}) {
  const t = useTheme();
  if (!movies.length) return null;

  const cardWidth = (width - SCREEN_PADDING * 2 - GAP) / 2;

  return (
    <View style={{ marginBottom: 12 }}>
      <View
        style={{
          marginBottom: 8,
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "900", color: t.text }}>
          {title}
        </Text>
        <Text style={{ color: t.muted, fontSize: 12 }}>Swipe</Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={(m) => String(m.id)}
        contentContainerStyle={{ gap: GAP }}
        snapToInterval={cardWidth + GAP}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <FeaturedCard
            item={item}
            cardWidth={cardWidth}
            onPressMovie={onPressMovie}
          />
        )}
      />
    </View>
  );
}

// import {
//   Dimensions,
//   FlatList,
//   Image,
//   Pressable,
//   Text,
//   View,
// } from "react-native";
// import { useTheme } from "../hooks/useTheme";

// const { width } = Dimensions.get("window");

// const img = (path) => (path ? `https://image.tmdb.org/t/p/w780${path}` : null);

// export default function FeaturedCarousel({
//   title = "Featured",
//   movies = [],
//   onPressMovie,
// }) {
//   const t = useTheme();
//   if (!movies.length) return null;

//   const screenPadding = 16; // matches your screens
//   const gap = 12;
//   const cardWidth = (width - screenPadding * 2 - gap) / 2;

//   return (
//     <View style={{ marginBottom: 12 }}>
//       <View
//         style={{
//           marginBottom: 8,
//           flexDirection: "row",
//           alignItems: "baseline",
//           justifyContent: "space-between",
//         }}
//       >
//         <Text style={{ fontSize: 16, fontWeight: "900", color: t.text }}>
//           {title}
//         </Text>
//         <Text style={{ color: t.muted, fontSize: 12 }}>Swipe</Text>
//       </View>

//       <FlatList
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         data={movies}
//         keyExtractor={(m) => String(m.id)}
//         contentContainerStyle={{ gap }}
//         snapToInterval={cardWidth + gap}
//         decelerationRate="fast"
//         renderItem={({ item }) => {
//           const uri = img(item.backdrop_path || item.poster_path);

//           return (
//             <Pressable
//               onPress={() => onPressMovie?.(item)}
//               style={{
//                 width: cardWidth,
//                 borderRadius: 18,
//                 overflow: "hidden",
//                 borderWidth: 1,
//                 borderColor: t.border,
//                 backgroundColor: t.card,
//               }}
//             >
//               {uri ? (
//                 <Image
//                   source={{ uri }}
//                   style={{ width: "100%", height: 110 }}
//                   resizeMode="cover"
//                 />
//               ) : (
//                 <View
//                   style={{
//                     width: "100%",
//                     height: 110,
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Text style={{ color: t.muted, fontWeight: "800" }}>
//                     No image
//                   </Text>
//                 </View>
//               )}

//               <View style={{ padding: 10 }}>
//                 <Text
//                   numberOfLines={1}
//                   style={{ color: t.text, fontWeight: "900", fontSize: 13 }}
//                 >
//                   {item.title}
//                 </Text>
//                 <Text
//                   numberOfLines={1}
//                   style={{ marginTop: 4, color: t.muted, fontSize: 12 }}
//                 >
//                   ⭐ {item.vote_average?.toFixed(1) ?? "—"}
//                 </Text>
//               </View>
//             </Pressable>
//           );
//         }}
//       />
//     </View>
//   );
// }
