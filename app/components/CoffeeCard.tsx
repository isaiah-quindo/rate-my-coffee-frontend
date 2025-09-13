import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CoffeeShop } from "@/types/coffeeShop";
import StarRatingDisplay from "./StarRatingDisplay";
import { MapPin } from "lucide-react";

const CoffeeCard: React.FC<{
  coffeeShop: CoffeeShop;
  imageUrl: string;
}> = async ({ coffeeShop, imageUrl }) => {
  return (
    <Link href={`/coffee-shops/${coffeeShop.slug}`}>
      <div className="w-93 group flex flex-col h-full bg-white border border-gray-200 shadow-2xs rounded-xl overflow-hidden hover:shadow-lg transition-all duration-400 ease-in-out">
        <div className="relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={coffeeShop.name}
            className="h-52 w-full object-cover rounded-t-xl hover:scale-105 transition-all duration-400 ease-in-out"
            width={500}
            height={500}
          />
        </div>
        <div className="flex flex-col gap-2 p-4 md:p-6">
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 truncate">
              {coffeeShop.name}
            </h3>
            <div className="flex flex-row items-center gap-1">
              <MapPin size={16} className="text-gray-500 flex-shrink-0" />
              <span className="text-gray-500 text-sm truncate">
                {coffeeShop.barangay}, {coffeeShop.city_municipality}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start justify-between gap-0 md:flex-row md:items-center md:gap-2">
            <span className="flex flex-row items-center gap-2 mb-1 text-sm font-semibold uppercase text-blue-600">
              <StarRatingDisplay
                value={Number(coffeeShop.rating_overall_cache) || 0}
                size={22}
              />
              <span className="text-sm font-bold text-gray-600 mt-1">
                {coffeeShop.rating_overall_cache ?? "No ratings yet"}
              </span>
            </span>
            <span className="text-sm text-gray-600">
              {coffeeShop.rating_count_cache ?? 0} reviews
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CoffeeCard;
