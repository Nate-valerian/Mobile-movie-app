import { useCallback, useEffect, useState } from "react";
import {
  addToWatchlist,
  getWatchlist,
  isInWatchlist,
  removeFromWatchlist,
} from "../storage/watchlist.storage";

export function useWatchlist() {
  const [list, setList] = useState([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const data = await getWatchlist();
    setList(data);
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (movie) => {
    const next = await addToWatchlist(movie);
    setList(next);
  }, []);

  const remove = useCallback(async (movieId) => {
    const next = await removeFromWatchlist(movieId);
    setList(next);
  }, []);

  const has = useCallback(async (movieId) => {
    return await isInWatchlist(movieId);
  }, []);

  return { list, ready, refresh, add, remove, has };
}

export default useWatchlist;
