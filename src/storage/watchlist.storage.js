import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "WATCHLIST_V1";

export async function getWatchlist() {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveWatchlist(list) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function addToWatchlist(movie) {
  const list = await getWatchlist();
  const exists = list.some((m) => m.id === movie.id);
  if (exists) return list;

  const next = [movie, ...list];
  await saveWatchlist(next);
  return next;
}

export async function removeFromWatchlist(movieId) {
  const list = await getWatchlist();
  const next = list.filter((m) => m.id !== movieId);
  await saveWatchlist(next);
  return next;
}

export async function isInWatchlist(movieId) {
  const list = await getWatchlist();
  return list.some((m) => m.id === movieId);
}
