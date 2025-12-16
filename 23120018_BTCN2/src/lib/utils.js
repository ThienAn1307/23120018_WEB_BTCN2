import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const API_PAGE_LIMIT = 10;

export async function fetchPaginatedMovies(apiFn, staticArgs = [], totalItems = 30) {
  if (totalItems <= API_PAGE_LIMIT) {
    const result = await apiFn(...staticArgs, 1, totalItems);
    return result.data;
  }

  const totalPages = Math.ceil(totalItems / API_PAGE_LIMIT);
  const pagePromises = [];  
  for (let page = 1; page <= totalPages; page++) {
    pagePromises.push(apiFn(...staticArgs, page, API_PAGE_LIMIT));
  }

  const results = await Promise.all(pagePromises);
  const allMovies = results.flatMap(result => result.data);
  return allMovies.slice(0, totalItems);
}

export async function fetchAllReviews(apiFn, movieId, totalItems = 100) {
  // Fetch reviews by repeatedly calling the API with different internal pagination
  // Since the API only accepts movieId, we rely on the backend to handle pagination
  try {
    const result = await apiFn(movieId);
    return result.data || [];
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return [];
  }
}

export async function fetchAllMoviesBySearch(apiFn, params = {}, totalItems = 100) {
  // Fetch all movies by search with pagination
  if (totalItems <= API_PAGE_LIMIT) {
    const result = await apiFn({ ...params, page: 1, limit: totalItems });
    return result.data || [];
  }

  const allMovies = [];
  const seenIds = new Set(); // Track unique movie IDs
  const defaultParams = { page: 1, limit: API_PAGE_LIMIT };
  const totalPages = Math.ceil(totalItems / API_PAGE_LIMIT);
  
  for (let page = 1; page <= totalPages; page++) {
    const finalParams = { ...defaultParams, ...params, page };
    try {
      const result = await apiFn(finalParams);
      
      if (!result.data || result.data.length === 0) {
        break;
      }
      
      // Filter out duplicates
      const uniqueMovies = result.data.filter(movie => {
        const movieId = movie.id || movie._id;
        if (seenIds.has(movieId)) {
          return false;
        }
        seenIds.add(movieId);
        return true;
      });
      
      allMovies.push(...uniqueMovies);
      
      if (allMovies.length >= totalItems) {
        break;
      }
      
      if (result.data.length < API_PAGE_LIMIT) {
        break;
      }
    } catch (err) {
      console.error(`❌ Lỗi khi fetch phim:`, err);
      break;
    }
  }
  
  const finalResults = allMovies.slice(0, totalItems);
  return finalResults;
}