import { CoffeeShop } from "@/types/coffeeShop";

export type LocationItem = {
  city_municipality: string;
  province: string | null;
};

/**
 * Fetches all coffee shops from the API
 */
export async function fetchAllCoffeeShops(): Promise<CoffeeShop[]> {
  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${BASE}/api/coffee-shops`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.data;
}

/**
 * Creates unique locations from coffee shops data
 */
export function createUniqueLocations(coffeeShops: CoffeeShop[]): LocationItem[] {
  return Array.from(
    new Map(
      coffeeShops
        .filter((s) => !!s.city_municipality)
        .map((s) => [
          `${(s.city_municipality ?? "").trim()}|${(s.province ?? "").trim()}`,
          {
            city_municipality: (s.city_municipality ?? "").trim(),
            province: (s.province ?? "").trim() || null,
          },
        ])
    ).values()
  );
}

/**
 * Fetches all coffee shops and creates unique locations
 */
export async function fetchCoffeeShopsAndLocations(): Promise<{
  coffeeShops: CoffeeShop[];
  locations: LocationItem[];
}> {
  const coffeeShops = await fetchAllCoffeeShops();
  const locations = createUniqueLocations(coffeeShops);
  return { coffeeShops, locations };
}

