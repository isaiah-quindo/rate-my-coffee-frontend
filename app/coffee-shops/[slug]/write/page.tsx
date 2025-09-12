import React from "react";
import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import WriteReviewStepper from "@/app/components/WriteReviewStepper";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { CoffeeShop } from "@/types/coffeeShop";
import { fetchCoffeeShopsAndLocations } from "@/app/utilities/dataUtils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PostsPage({ params }: PageProps) {
  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { slug } = await params;
  const res = await fetch(
    `${BASE}/api/coffee-shops/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
      headers: { Accept: "application/json" },
    }
  );
  const shop: CoffeeShop = await res.json();

  // Fetch all coffee shops and locations for the modal
  const { coffeeShops, locations } = await fetchCoffeeShopsAndLocations();

  return (
    <ProtectedRoute>
      <Header locations={locations} coffeeShops={coffeeShops} />
      <div className="flex flex-col gap-4 h-96 relative">
        <Image
          src={"/images/write-review-bg.png"}
          alt={"Write a Review"}
          width={2000}
          height={700}
          className="w-full h-full object-cover"
        />
        <h2 className="text-2xl md:text-4xl font-bold text-center text-black absolute top-1/6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          Write a Review for {shop.name}
        </h2>
      </div>
      <div className="flex flex-col gap-4 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-8">
        <WriteReviewStepper shop={shop} />
      </div>
      <Footer />
    </ProtectedRoute>
  );
}
