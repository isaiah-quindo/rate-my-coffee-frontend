import React from "react";
import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Metadata } from "next";
import { CoffeeShop, ShopHour } from "@/types/coffeeShop";
import { fetchCoffeeShopsAndLocations } from "@/app/utilities/dataUtils";
import {
  MapPin,
  Wifi,
  Plug,
  SquareParking,
  Armchair,
  CreditCard,
  Smartphone,
  Accessibility,
  PawPrint,
  Vegan,
  Beaker,
  Coffee,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Clock,
} from "lucide-react";
import StarRatingDisplay from "@/app/components/StarRatingDisplay";
import PhotoGallery from "@/app/components/PhotoGallery";
import { convertTo12Hour } from "@/app/utilities/utils";
import PaginatedPosts from "@/app/components/PaginatedPosts";

type PageProps = {
  params: { slug: string };
};

async function fetchShopBySlug(slug: string): Promise<CoffeeShop> {
  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(
    `${BASE}/api/coffee-shops/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
      headers: { Accept: "application/json" },
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to load coffee shop: ${slug}`);
  }
  return res.json();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let shop: CoffeeShop | null = null;
  try {
    shop = await fetchShopBySlug(slug);
  } catch (error) {
    console.error(error);
    return {
      title: `RateMyCoffee`,
      description: "Help people discover the best coffee shops in your area.",
    };
  }

  if (!shop) {
    return {
      title: `RateMyCoffee`,
      description: "Help people discover the best coffee shops in your area.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const ogImage =
    shop.cover_photo?.url || shop.photos?.[0]?.url || "/default-og.png";

  return {
    title: `${shop.name} | RateMyCoffee`,
    description:
      shop.description ?? "Discover this coffee shop on RateMyCoffee.",
    keywords: shop.tags ?? [],
    openGraph: {
      title: shop.name,
      description: shop.description ?? undefined,
      images: [ogImage],
      url: siteUrl ? `${siteUrl}/coffee-shops/${slug}` : undefined,
      type: "article",
    },
    alternates: siteUrl
      ? { canonical: `${siteUrl}/coffee-shops/${slug}` }
      : undefined,
  };
}

export default async function CoffeeShopPage({ params }: PageProps) {
  const { slug } = await params;
  const shop = await fetchShopBySlug(slug);

  // Fetch all coffee shops and locations for the modal
  const { coffeeShops: allShops, locations: uniqueLocations } =
    await fetchCoffeeShopsAndLocations();

  return (
    <div className="flex flex-col min-h-screen">
      <Header locations={uniqueLocations} coffeeShops={allShops} />
      <div className="bg-gray-50 flex-1">
        <div className="flex flex-row gap-4 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-8">
          <div className="cs-main-content flex flex-col gap-4 flex-1">
            <div className="group flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={shop.photos[0]?.url ?? "/images/default-cover.png"}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                  width={1000}
                  height={1000}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-3xl font-semibold text-white ">
                        {shop.name}
                      </h3>
                      <div className="flex flex-rowitems-center gap-2">
                        <MapPin size={20} className="text-gray-300" />
                        <span className="text-gray-300">
                          {shop.street_address}, {shop.barangay},{" "}
                          {shop.city_municipality}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6">
                <div className="flex flex-col items-start gap-0 md:flex-row md:items-center md:gap-2">
                  <div className="flex flex-row items-center gap-2">
                    <StarRatingDisplay
                      value={Number(shop.rating_overall_cache) || 0}
                      size={22}
                    />
                    <span className="text-sm font-bold text-gray-600 mt-1">
                      {shop.rating_overall_cache ?? "No ratings yet"}
                    </span>
                  </div>

                  <span className="text-sm text-gray-600 mt-1">
                    Based on {shop.rating_count_cache ?? 0} reviews
                  </span>
                </div>
                <p>{shop.description}</p>
                <div className="flex flex-row items-center flex-wrap gap-4 text-gray-500 text-sm">
                  {shop.has_wifi && (
                    <span className="flex flex-row items-center gap-1">
                      <Wifi size={16} />
                      {shop.has_wifi ? "Wifi" : "No wifi"}
                    </span>
                  )}
                  {shop.accepts_cards && (
                    <span className="flex flex-row items-center gap-1">
                      <CreditCard size={16} />
                      {shop.accepts_cards
                        ? "Cards accepted"
                        : "No cards accepted"}
                    </span>
                  )}
                  {shop.accepts_gcash && (
                    <span className="flex flex-row items-center gap-1">
                      <Smartphone size={16} />
                      {shop.accepts_gcash
                        ? "GCash accepted"
                        : "No GCash accepted"}
                    </span>
                  )}
                  {shop.parking_available && (
                    <span className="flex flex-row items-center gap-1">
                      <SquareParking size={16} />
                      {shop.parking_available
                        ? "Parking available"
                        : "No parking"}
                    </span>
                  )}
                  {shop.has_outlets && (
                    <span className="flex flex-row items-center gap-1">
                      <Plug size={16} />
                      {shop.has_outlets ? "Outlets" : "No outlets"}
                    </span>
                  )}
                  {shop.outdoor_seating && (
                    <span className="flex flex-row items-center gap-1">
                      <Armchair size={16} />
                      {shop.outdoor_seating
                        ? "Outdoor seating"
                        : "No outdoor seating"}
                    </span>
                  )}
                  {shop.wheelchair_accessible && (
                    <span className="flex flex-row items-center gap-1">
                      <Accessibility size={16} />
                      {shop.wheelchair_accessible
                        ? "Wheelchair accessible"
                        : "No wheelchair accessible"}
                    </span>
                  )}
                  {shop.pet_friendly && (
                    <span className="flex flex-row items-center gap-1">
                      <PawPrint size={16} />
                      {shop.pet_friendly ? "Pet friendly" : "No pet friendly"}
                    </span>
                  )}
                  {shop.vegan_options && (
                    <span className="flex flex-row items-center gap-1">
                      <Vegan size={16} />
                      {shop.vegan_options
                        ? "Vegan options"
                        : "No vegan options"}
                    </span>
                  )}
                  {shop.manual_brew && (
                    <span className="flex flex-row items-center gap-1">
                      <Beaker size={16} />
                      {shop.manual_brew ? "Manual brew" : "No manual brew"}
                    </span>
                  )}
                  {shop.decaf_available && (
                    <span className="flex flex-row items-center gap-1">
                      <Coffee size={16} />
                      {shop.decaf_available
                        ? "Decaf available"
                        : "No decaf available"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="reviews-sidebar-section flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-2 flex-1 flex flex-col gap-4">
                  <div className="flex flex-row items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Reviews ({shop.posts_total})
                    </h3>
                    <a
                      href={`/coffee-shops/${shop.slug}/write`}
                      className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:outline-hidden focus:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      Write a review
                    </a>
                  </div>
                  <PaginatedPosts
                    slug={shop.slug ?? ""}
                    initialPosts={shop.posts}
                    total={shop.posts_total}
                    pageSize={5}
                    shopPhotos={shop.photos}
                  />
                </div>
                <div className="cs-sidebar flex flex-col gap-4">
                  <div className="group flex flex-col gap-4 bg-white border border-gray-200 shadow-2xs rounded-xl overflow-hidden p-6">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Contact Information
                    </h4>
                    <div className="flex flex-col gap-2">
                      {shop.phone && (
                        <span className="flex flex-row items-center gap-2 text-gray-500">
                          <Phone size={16} />
                          <a
                            className="text-purple-500 hover:text-purple-600"
                            href={`tel:${shop.phone}`}
                          >
                            {shop.phone}
                          </a>
                        </span>
                      )}
                      {shop.email && (
                        <span className="flex flex-row items-center gap-2 text-gray-500">
                          <Mail size={16} />
                          <a
                            className="text-purple-500 hover:text-purple-600"
                            href={`mailto:${shop.email}`}
                          >
                            {shop.email}
                          </a>
                        </span>
                      )}
                      {shop.website_url && (
                        <span className="flex flex-row items-center gap-2 text-gray-500">
                          <Globe size={16} />
                          <a
                            className="text-purple-500 hover:text-purple-600"
                            href={shop.website_url ?? ""}
                          >
                            {shop.website_url}
                          </a>
                        </span>
                      )}
                      {shop.facebook_url && (
                        <span className="flex flex-row items-center gap-2 text-gray-500">
                          <Facebook size={16} />
                          <a
                            className="text-purple-500 hover:text-purple-600"
                            href={shop.facebook_url ?? ""}
                          >
                            {shop.facebook_url}
                          </a>
                        </span>
                      )}
                      {shop.instagram_handle && (
                        <span className="flex flex-row items-center gap-2 text-gray-500">
                          <Instagram size={16} />
                          <a
                            className="text-purple-500 hover:text-purple-600"
                            href={`https://www.instagram.com/${shop.instagram_handle}`}
                          >
                            {shop.instagram_handle}
                          </a>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="group flex flex-col gap-2 bg-white border border-gray-200 shadow-2xs rounded-xl overflow-hidden p-6">
                    <h4 className="flex flex-row items-center gap-2 text-lg font-semibold text-gray-800 mb-0">
                      <Clock size={16} /> Shop Hours
                    </h4>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      {Array.from({ length: 7 }).map((_, idx) => (
                        <React.Fragment key={idx}>
                          <span className="font-bold">
                            {
                              [
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                                "Sunday",
                              ][idx]
                            }
                          </span>
                          <span className="text-gray-500 text-right">
                            {Array.isArray(shop.hours)
                              ? (() => {
                                  const entries = shop.hours.filter(
                                    (h: ShopHour) => h.day_of_week === idx
                                  );
                                  if (entries.length === 0) return "Closed";
                                  const parts = entries.map((h: ShopHour) =>
                                    h.is_24h
                                      ? "Open 24h"
                                      : h.open_time && h.close_time
                                      ? `${convertTo12Hour(
                                          h.open_time
                                        )} - ${convertTo12Hour(h.close_time)}`
                                      : "Closed"
                                  );
                                  return parts.join(", ") || "Closed";
                                })()
                              : "Closed"}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="group flex flex-col gap-2 bg-white border border-gray-200 shadow-2xs rounded-xl overflow-hidden p-6">
                    <h4 className="flex flex-row items-center gap-2 text-lg font-semibold text-gray-800 mb-0">
                      Photos
                    </h4>
                    {!shop.photos ||
                      (shop.photos.length === 0 && (
                        <p className="text-sm text-gray-400">
                          No photos uploaded yet
                        </p>
                      ))}
                    <div className="flex flex-row flex-wrap gap-2">
                      <PhotoGallery
                        images={shop.photos.map(
                          (photo: { url: string }) => photo.url
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
