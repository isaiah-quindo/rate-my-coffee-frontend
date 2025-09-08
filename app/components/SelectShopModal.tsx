"use client";

import React from "react";
import { CoffeeShop } from "@/types/coffeeShop";
import { useRouter } from "next/navigation";
import { LocationItem } from "@/app/utilities/dataUtils";

export default function SelectShopModal({
  locations,
  coffeeShops,
}: {
  locations?: { city_municipality: string; province: string | null }[];
  coffeeShops?: CoffeeShop[];
}) {
  const [selectedCity, setSelectedCity] = React.useState<string>("");
  const [citySearchTerm, setCitySearchTerm] = React.useState("");
  const [showCitySuggestions, setShowCitySuggestions] = React.useState(false);
  const [filteredCities, setFilteredCities] = React.useState(locations ?? []);

  // Filter cities based on search term
  React.useEffect(() => {
    if (citySearchTerm.trim() === "") {
      setFilteredCities(locations ?? []);
    } else {
      const filtered = (locations ?? []).filter(
        (location) =>
          location.city_municipality
            .toLowerCase()
            .includes(citySearchTerm.toLowerCase()) ||
          (location.province &&
            location.province
              .toLowerCase()
              .includes(citySearchTerm.toLowerCase()))
      );
      setFilteredCities(filtered);
    }
  }, [citySearchTerm, locations]);

  const [selectedShopId, setSelectedShopId] = React.useState<number | null>(
    null
  );

  // Filter coffee shops based on selected city
  const filteredShops = React.useMemo(() => {
    if (!selectedCity || !coffeeShops) return [];
    return coffeeShops.filter(
      (shop) => shop.city_municipality === selectedCity
    );
  }, [selectedCity, coffeeShops]);

  function handleCityInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCitySearchTerm(e.target.value);
    setShowCitySuggestions(true);
  }

  function handleCitySelect(location: {
    city_municipality: string;
    province: string | null;
  }) {
    setCitySearchTerm(`${location.city_municipality}, ${location.province}`);
    setSelectedCity(location.city_municipality);
    setShowCitySuggestions(false);
  }

  function resetState() {
    setSelectedCity("");
    setCitySearchTerm("");
    setSelectedShopId(null);
  }

  return (
    <div
      id="selectShopModal"
      className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none"
      role="dialog"
      tabIndex={-1}
      aria-labelledby="selectShopModalLabel"
      onAnimationEnd={resetState}
    >
      <div className="pointer-events-auto hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all md:max-w-xl md:w-full m-3 md:mx-auto flex items-center">
        <div className="w-full max-h-full overflow-hidden flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
          <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
            <h3 id="selectShopModalLabel" className="font-bold text-gray-800">
              Write a review
            </h3>
            <button
              type="button"
              className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Close"
              data-hs-overlay="#selectShopModal"
              onClick={resetState}
            >
              <span className="sr-only">Close</span>
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <div className="relative">
                <div className="relative">
                  <input
                    className="py-2.5 ps-4 pe-9 block w-full border border-gray-300 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500"
                    type="text"
                    id="modal-city-combobox-input"
                    placeholder="Start typing your city..."
                    value={citySearchTerm}
                    onChange={handleCityInputChange}
                    onFocus={() => setShowCitySuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowCitySuggestions(false), 200)
                    }
                    autoComplete="off"
                  />
                  <div
                    className="absolute top-1/2 end-3 -translate-y-1/2"
                    aria-expanded="false"
                    role="button"
                  >
                    <svg
                      className="shrink-0 size-3.5 text-gray-500"
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
                      <path d="m7 15 5 5 5-5"></path>
                      <path d="m7 9 5-5 5 5"></path>
                    </svg>
                  </div>
                </div>
                {showCitySuggestions && filteredCities.length > 0 && (
                  <div className="absolute z-50 w-full max-h-72 mt-1 p-1 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto">
                    {filteredCities.map((location, index) => (
                      <div
                        key={index}
                        className="cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100"
                        onClick={() => handleCitySelect(location)}
                      >
                        <div className="flex justify-between items-center w-full">
                          <div>
                            <span>
                              {location.city_municipality}, {location.province}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coffee shop
              </label>
              <div className="max-h-56 overflow-auto rounded-lg border border-gray-200">
                {!selectedCity && (
                  <div className="p-3 text-sm text-gray-500">
                    Choose a city first
                  </div>
                )}
                {selectedCity && filteredShops.length === 0 && (
                  <div className="p-3 text-sm text-gray-500">
                    No shops found
                  </div>
                )}
                {selectedCity &&
                  filteredShops.map((shop) => (
                    <label
                      key={shop.id}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="select-shop-radio"
                        className="shrink-0"
                        checked={selectedShopId === shop.id}
                        onChange={() => setSelectedShopId(shop.id)}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">
                          {shop.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {shop.street_address}{" "}
                          {shop.barangay ? `, ${shop.barangay}` : ""}
                        </span>
                      </div>
                    </label>
                  ))}
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-2">
            <button
              type="button"
              data-hs-overlay="#selectShopModal"
              onClick={resetState}
              className="py-2 px-3 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            {selectedShopId ? (
              <a
                href={`/coffee-shops/${
                  filteredShops.find((s) => s.id === selectedShopId)?.slug
                }/write`}
                onClick={resetState}
                className="py-2 px-3 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 inline-flex items-center justify-center"
              >
                Continue
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="py-2 px-3 text-sm rounded-lg bg-purple-600 text-white disabled:opacity-50 disabled:pointer-events-none"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
