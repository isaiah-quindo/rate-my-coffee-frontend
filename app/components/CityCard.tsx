import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Props = {
  city: string;
  count: number;
};

export default function CityCard({ city, count }: Props) {
  return (
    <Link
      className="group flex flex-col bg-white border border-gray-200 rounded-xl hover:shadow-lg focus:outline-hidden focus:shadow-lg transition duration-400 ease-in-out"
      href={`/areas/${city.toLowerCase().replace(/ /g, "-")}`}
    >
      <div className="p-4 md:p-5">
        <div className="flex justify-between items-center gap-x-3">
          <div className="grow">
            <h3 className="group-hover:text-purple-600 font-semibold text-gray-800">
              {city}
            </h3>
            <p className="text-sm text-gray-500">{count} coffee shops</p>
          </div>
          <div>
            <ChevronRight size={24} className="text-gray-500" />
          </div>
        </div>
      </div>
    </Link>
  );
}
