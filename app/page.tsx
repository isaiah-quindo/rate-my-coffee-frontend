import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import CoffeeCard from "./components/CoffeeCard";
import CityCard from "./components/CityCard";
import Link from "next/link";
import { Metadata } from "next";
import { fetchCoffeeShopsAndLocations } from "./utilities/dataUtils";
import { CoffeeShop } from "@/types/coffeeShop";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "RateMyCoffee",
  description: "Help people discover the best coffee shops in your area.",
  keywords: [
    "coffee",
    "coffee shops",
    "coffee reviews",
    "coffee shop reviews",
    "coffee shop",
    "coffee shop reviews",
  ],
  openGraph: {
    title: "RateMyCoffee",
    description: "Help people discover the best coffee shops in your area.",
    images: ["/images/default-cover.png"],
  },
  alternates: {
    canonical: "https://ratemycoffee.com",
  },
};

export default async function Home() {
  // Fetch all shops once to compute city counts and top list
  const { coffeeShops, locations: uniqueLocations } =
    await fetchCoffeeShopsAndLocations();

  // Derive top 12 by review count (posts_total -> rating_count_cache -> posts.length)
  const reviewCount = (s: CoffeeShop): number => {
    const shopWithPosts = s as CoffeeShop & {
      posts_total?: number;
      posts?: unknown[];
    };
    if (typeof shopWithPosts.posts_total === "number")
      return shopWithPosts.posts_total;
    if (typeof s.rating_count_cache === "number")
      return s.rating_count_cache ?? 0;
    if (Array.isArray(shopWithPosts.posts)) return shopWithPosts.posts.length;
    return 0;
  };
  const top = [...coffeeShops]
    .sort((a, b) => reviewCount(b) - reviewCount(a))
    .slice(0, 12);

  const cities = [
    "Taguig City",
    "Makati City",
    "Mandaluyong City",
    "Quezon City",
    "Manila City",
    "Pasig City",
    "Baguio City",
    "Las Pinas City",
    "Cebu City",
    "Iloilo City",
    "Davao City",
  ];

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
      <Header locations={uniqueLocations} coffeeShops={top} />
      <Hero locations={uniqueLocations} />
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto relative z-[0]">
        {/* City Cards Section */}
        <div data-hs-scroll-nav className="relative px-0 lg:px-6">
          <div className="flex flex-row gap-2 mb-2 justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Popular Cities
            </h3>
            <div className="flex flex-row gap-2">
              <button
                type="button"
                className="hs-scroll-nav-prev bg-gray-100 rounded-lg p-2 hover:bg-gray-200 cursor-pointer"
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                className="hs-scroll-nav-next bg-gray-100 rounded-lg p-2 hover:bg-gray-200 cursor-pointer"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <nav className="hs-scroll-nav-body flex flex-nowrap overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-x-mandatory snap-mandatory flex flex-row gap-4 sm:gap-4 mb-6 pb-4">
            {cities
              .sort((a, b) => (countsByCity[b] ?? 0) - (countsByCity[a] ?? 0))
              .map((city) => (
                <CityCard
                  key={city}
                  city={city}
                  count={countsByCity[city] ?? 0}
                />
              ))}
          </nav>
        </div>

        {/* Coffee Shops Section */}
        <div data-hs-scroll-nav className="relative px-0 lg:px-6">
          <div className="flex flex-row mb-2 justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Popular Coffee Shops
            </h3>
            <div className="flex flex-row gap-2">
              <button
                type="button"
                className="hs-scroll-nav-prev bg-gray-100 rounded-lg p-2 hover:bg-gray-200 cursor-pointer"
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                className="hs-scroll-nav-next bg-gray-100 rounded-lg p-2 hover:bg-gray-200 cursor-pointer"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <nav className="hs-scroll-nav-body flex flex-nowrap overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory flex flex-row gap-4 sm:gap-4 mb-0 pb-4">
            {top
              .sort((a, b) => {
                const countDiff =
                  (b.rating_count_cache ?? 0) - (a.rating_count_cache ?? 0);
                if (countDiff !== 0) return countDiff;

                return (
                  (b.rating_overall_cache ?? 0) - (a.rating_overall_cache ?? 0)
                );
              })
              .map((coffeeShop: CoffeeShop) => (
                <CoffeeCard
                  key={coffeeShop.id}
                  coffeeShop={coffeeShop}
                  imageUrl={
                    coffeeShop.cover_photo?.url ?? "/images/default-cover.png"
                  }
                />
              ))}
          </nav>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </div>
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Gradients */}
        <div
          aria-hidden="true"
          className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
        >
          <div className="bg-linear-to-r from-violet-300/50 to-purple-100 blur-3xl w-100 h-175 rotate-[-60deg] transform -translate-x-40"></div>
          <div className="bg-linear-to-tl from-purple-50 via-purple-100 to-purple-50 blur-3xl w-[1440px] h-200 rounded-fulls origin-top-left -rotate-12 -translate-x-60"></div>
        </div>
        {/* End Gradients */}

        <div className="relative z-10">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            <div className="max-w-4xl text-center mx-auto">
              {/* <p className="inline-block text-sm font-medium bg-clip-text bg-linear-to-l from-purple-600 to-violet-500 text-transparent">
                Preline: A vision for 2023
              </p> */}

              {/* Title */}
              <div className="mt-5 max-w-4xl">
                <h2 className="block font-semibold text-gray-800 text-4xl sm:text-6xl">
                  Help people discover the best coffee shops in your area.
                </h2>
              </div>
              {/* End Title */}

              <div className="mt-5 max-w-4xl text-center">
                <p className="text-lg text-gray-60 text-md md:text-xl">
                  Have a favorite local coffee shop? Let us know about it.
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-8 gap-3 flex justify-center">
                <Link
                  className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:outline-hidden focus:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
                  href="https://docs.google.com/forms/d/e/1FAIpQLScsH0FEZBoRMFicHglHOAIBadYsE5br-VPOansJgEqeI28-XQ/viewform?usp=sharing&ouid=103746460556767068424"
                  target="_blank"
                >
                  Add my favorite coffee shop
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              </div>
              {/* End Buttons */}
            </div>
          </div>
        </div>
      </div>
      {/* End Hero */}
      <Footer />
    </>
  );
}
