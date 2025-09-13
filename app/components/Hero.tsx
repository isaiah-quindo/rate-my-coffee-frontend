"use client";
import React from "react";

const Hero = ({
  locations,
}: {
  locations: { city_municipality: string; province: string | null }[];
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [filteredLocations, setFilteredLocations] = React.useState(locations);

  // Filter locations based on search term
  React.useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(
        (location) =>
          location.city_municipality
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (location.province &&
            location.province.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredLocations(filtered);
    }
  }, [searchTerm, locations]);

  function handleSearchClick() {
    if (!searchTerm.trim()) return;
    // Extract just the city name (before the comma) for the slug
    const cityName = searchTerm.split(",")[0].trim();
    const slug = cityName.toLowerCase().replace(/\s+/g, "-");
    window.location.href = `/areas/${encodeURIComponent(slug)}`;
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  }

  function handleLocationSelect(location: {
    city_municipality: string;
    province: string | null;
  }) {
    setSearchTerm(`${location.city_municipality}, ${location.province}`);
    setShowSuggestions(false);
  }
  return (
    <div className="relative backdrop-grayscale bg-[url('/images/hero-bg.jpg')] bg-cover bg-center z-[100]">
      <div className="backdrop-blur-sm backdrop-opacity-100">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24">
          <div className="text-center">
            <h1 className="max-w-3xl mx-auto text-4xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Saan ba pwede mag kape, na masarap?
            </h1>

            <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
              <form>
                <div className="relative z-10 flex gap-x-3 p-3 bg-white border border-gray-200 rounded-lg shadow-lg shadow-gray-600">
                  <div className="w-full">
                    <div className="relative">
                      <div className="relative">
                        <input
                          className="py-2.5 sm:py-3 ps-4 pe-9 block w-full border-transparent rounded-lg sm:text-sm focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none"
                          type="text"
                          id="city-combobox-input"
                          placeholder="Search for your city..."
                          value={searchTerm}
                          onChange={handleInputChange}
                          onFocus={() => setShowSuggestions(true)}
                          onBlur={() =>
                            setTimeout(() => setShowSuggestions(false), 200)
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
                      {showSuggestions && filteredLocations.length > 0 && (
                        <div className="absolute z-10 w-full max-h-72 p-1 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                          {filteredLocations.map((location, index) => (
                            <div
                              key={index}
                              className="cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100"
                              onClick={() => handleLocationSelect(location)}
                            >
                              <div className="flex justify-between items-center w-full">
                                <div>
                                  <span>
                                    {location.city_municipality},{" "}
                                    {location.province}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <label className="block text-sm text-gray-700 font-medium">
                      <span className="sr-only">Search for your city</span>
                    </label>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleSearchClick}
                      className="size-11 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:outline-hidden focus:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <svg
                        className="shrink-0 size-5"
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
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
              <div className="hidden md:block absolute top-0 end-0 -translate-y-12 translate-x-20">
                <svg
                  className="w-16 h-auto text-purple-500"
                  width="121"
                  height="135"
                  viewBox="0 0 121 135"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="hidden md:block absolute bottom-0 start-0 translate-y-10 -translate-x-32">
                <svg
                  className="w-40 h-auto text-purple-700"
                  width="347"
                  height="188"
                  viewBox="0 0 347 188"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
