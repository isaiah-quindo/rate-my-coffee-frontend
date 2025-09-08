import Header from "./components/Header";
import Hero from "./components/Hero";
import CoffeeCard from "./components/CoffeeCard";
import CityCard from "./components/CityCard";
import { fetchCoffeeShopsAndLocations } from "./utilities/dataUtils";
import { CoffeeShop } from "@/types/coffeeShop";

export default async function Home() {
  const { coffeeShops, locations: uniqueLocations } =
    await fetchCoffeeShopsAndLocations();

  const countsByCity = coffeeShops.reduce<Record<string, number>>(
    (acc, shop) => {
      const city = shop.city_municipality ?? "Unknown";
      acc[city] = (acc[city] ?? 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <>
      <Header locations={uniqueLocations} coffeeShops={coffeeShops} />
      <Hero locations={uniqueLocations} />
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        {/* City Cards Section */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mb-6">
          <CityCard
            city="Quezon City"
            count={countsByCity["Quezon City"] ?? 0}
          />
          <CityCard
            city="Mandaluyong City"
            count={countsByCity["Mandaluyong City"] ?? 0}
          />
          <CityCard
            city="Makati City"
            count={countsByCity["Makati City"] ?? 0}
          />
          <CityCard
            city="Manila City"
            count={countsByCity["Manila City"] ?? 0}
          />
        </div>

        {/* Coffee Shops Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coffeeShops.map((coffeeShop: CoffeeShop, idx: number) => (
            <CoffeeCard
              key={coffeeShop.id}
              coffeeShop={coffeeShop}
              imageUrl={
                coffeeShop.cover_photo?.url ?? "/images/default-cover.png"
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}
