import { View } from "react-native";
import Skeleton from "./Skeleton";

export default function MovieCardSkeleton() {
  return (
    <View style={{ flex: 1 }}>
      <Skeleton
        style={{ width: "100%", aspectRatio: 2 / 3, borderRadius: 18 }}
      />
      <Skeleton style={{ height: 14, marginTop: 10, borderRadius: 10 }} />
      <Skeleton
        style={{ height: 12, marginTop: 8, width: "50%", borderRadius: 10 }}
      />
    </View>
  );
}
