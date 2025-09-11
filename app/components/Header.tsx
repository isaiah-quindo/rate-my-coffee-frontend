"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import SelectShopModal from "@/app/components/SelectShopModal";
import { CoffeeShop } from "@/types/coffeeShop";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

const Header = ({
  locations,
  coffeeShops,
  writeReview = true,
}: {
  locations?: { city_municipality: string; province: string | null }[];
  coffeeShops?: CoffeeShop[];
  writeReview?: boolean;
}) => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <>
      <header className="bg-white border-b border-gray-200 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full">
        <nav className="relative max-w-[85rem] w-full md:flex md:items-center md:justify-between md:gap-3 mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <Link
              className="flex flex-row items-center gap-1 font-semibold text-xl text-black focus:outline-hidden focus:opacity-80"
              href="/"
              aria-label="Brand"
            >
              <Image
                src="/images/logo-mark.svg"
                alt="RateMyCoffee"
                width={40}
                height={40}
              />
              RateMyCoffee
            </Link>
            <div className="md:hidden">
              <button
                type="button"
                className="hs-collapse-toggle relative size-9 flex justify-center items-center text-sm font-semibold rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                id="hs-header-classic-collapse"
                aria-expanded="false"
                aria-controls="hs-header-classic"
                aria-label="Toggle navigation"
                data-hs-collapse="#hs-header-classic"
              >
                <svg
                  className="hs-collapse-open:hidden size-4"
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
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
                <svg
                  className="hs-collapse-open:block shrink-0 hidden size-4"
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
                <span className="sr-only">Toggle navigation</span>
              </button>
            </div>
          </div>

          <div
            id="hs-header-classic"
            className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block"
            aria-labelledby="hs-header-classic-collapse"
          >
            <div className="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
              <div className="py-2 md:py-0 flex flex-col md:flex-row md:items-center md:justify-end gap-4 md:gap-4">
                {/* <a
                  className="p-2 flex items-center text-sm text-purple-600 focus:outline-hidden focus:text-purple-600"
                  href="/"
                  aria-current="page"
                >
                  <svg
                    className="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                  Home
                </a> */}

                <div className="relative flex flex-wrap items-center gap-x-2 md:ps-2.5 mt-1 md:mt-0 md:ms-1.5">
                  {user ? (
                    <div className="flex flex-row gap-2">
                      <Link
                        href="/profile"
                        type="button"
                        className="p-2 flex flex-row items-center flex-nowrap text-nowrap text-sm text-gray-800 hover:text-gray-500 focus:outline-hidden focus:text-gray-500"
                        id="hs-dropdown-custom-trigger"
                        data-hs-dropdown="#hs-dropdown-custom"
                      >
                        <User size={18} className="mr-2 flex-shrink-0" />
                        {user.name}
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                            <span className="ml-2">Signing out...</span>
                          </>
                        ) : (
                          <>
                            <LogOut size={16} />
                            <span>Sign out</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <Link
                      className="p-2 w-full flex items-center text-sm text-gray-800 hover:text-gray-500 focus:outline-hidden focus:text-gray-500"
                      href="/login"
                    >
                      <User size={18} className="mr-2" />
                      Log in
                    </Link>
                  )}
                </div>

                {writeReview && (
                  <button
                    type="button"
                    data-hs-overlay="#selectShopModal"
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:outline-hidden focus:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    Write a review
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
      <SelectShopModal locations={locations} coffeeShops={coffeeShops} />
    </>
  );
};

export default Header;
