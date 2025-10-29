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

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    // Get response as text first to handle BOM characters
    const text = await res.text();

    // Remove BOM character if present
    const cleanText = text.replace(/^\uFEFF/, "");

    try {
        const data = JSON.parse(cleanText);
        return data.data;
    } catch (error) {
        console.error("Failed to parse JSON response:", error);
        console.error("Response text:", cleanText.substring(0, 200) + "...");
        throw new Error("Invalid JSON response from server");
    }
}

/**
 * Creates unique locations from coffee shops data
 */
export function createUniqueLocations(
    coffeeShops: CoffeeShop[]
): LocationItem[] {
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
