import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import CoffeeCard from "@/app/components/CoffeeCard";
import { CoffeeShop } from "@/types/coffeeShop";
import { fetchCoffeeShopsAndLocations } from "@/app/utilities/dataUtils";

type PageProps = {
  params: Promise<{ city: string }>;
};

export default async function CityPage({ params }: PageProps) {
  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { city } = await params;
  const cityName = city
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // Fetch shops for this city
  const res = await fetch(
    `${BASE}/api/coffee-shops?city_municipality=${encodeURIComponent(
      cityName
    )}`,
    { cache: "no-store", headers: { Accept: "application/json" } }
  );
  const data = await res.json();
  const shops: CoffeeShop[] = data.data;

  // Fetch all coffee shops and locations for the modal
  const { coffeeShops: allShops, locations: uniqueLocations } =
    await fetchCoffeeShopsAndLocations();

  return (
    <div className="flex flex-col min-h-screen">
      <Header locations={uniqueLocations} coffeeShops={allShops} />
      <div className="bg-gray-50 flex-1">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Coffee shops in {cityName}
            </h1>
            <span className="text-sm text-gray-500">
              {shops.length} Coffee Shops
            </span>
          </div>

          {shops.length === 0 ? (
            <p className="text-sm text-gray-500">No coffee shops found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shops.map((shop) => (
                <CoffeeCard
                  key={shop.id}
                  coffeeShop={shop}
                  imageUrl={
                    shop.cover_photo?.url ?? "/images/default-cover.png"
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
