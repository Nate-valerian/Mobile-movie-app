const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.EXPO_PUBLIC_TMDB_KEY;

async function request(path) {
  if (!API_KEY) {
    throw new Error("Missing EXPO_PUBLIC_TMDB_KEY");
  }

  const url =
    `${BASE_URL}${path}` +
    (path.includes("?") ? "&" : "?") +
    `api_key=${API_KEY}`;

  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error("Network request failed (cannot reach TMDB).");
  }

  if (!res.ok) {
    let body = "";
    try {
      body = await res.text();
    } catch {}
    throw new Error(`TMDB ${res.status} ${res.statusText} — ${body}`);
  }

  return res.json();
}

/* ================== API FUNCTIONS ================== */

export const getTrending = () => request("/trending/movie/day");

export const searchMovies = (query) =>
  request(`/search/movie?query=${encodeURIComponent(query)}`);

export const getMovieDetails = (id) =>
  request(`/movie/${id}?append_to_response=videos,credits`);
