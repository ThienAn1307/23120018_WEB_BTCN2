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