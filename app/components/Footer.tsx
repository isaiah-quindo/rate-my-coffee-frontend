"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const NewsletterSignup = dynamic(() => import("./NewsletterSignup"), {
  ssr: false,
});

const Footer = () => {
  return (
    <>
      <footer className="mt-auto bg-gray-900 w-full">
        <div className="mt-auto w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <div className="col-span-full lg:col-span-2 px-5 lg:px-0">
              <Link
                className="flex flex-row items-center gap-1 text-xl font-semibold text-white focus:outline-hidden focus:opacity-80"
                href="/"
                aria-label="Brand"
              >
                <Image
                  src="/images/logo-mark-white.svg"
                  alt="RateMyCoffee"
                  width={40}
                  height={40}
                />
                RateMyCoffee
              </Link>
            </div>

            {/* <div className="col-span-1">
              <h4 className="font-semibold text-gray-100">Product</h4>

              <div className="mt-3 grid space-y-3">
                <p>
                  <a
                    className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                    href="#"
                  >
                    Pricing
                  </a>
                </p>
                <p>
                  <a
                    className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                    href="#"
                  >
                    Changelog
                  </a>
                </p>
                <p>
                  <a
                    className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                    href="#"
                  >
                    Docs
                  </a>
                </p>
              </div>
            </div> */}

            <div className="col-span-1 px-5">
              <h4 className="font-semibold text-gray-100">Company</h4>

              <div className="mt-3 grid space-y-3">
                <p>
                  <Link
                    className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                    href="/about"
                  >
                    About us
                  </Link>
                </p>
                <p>
                  <Link
                    className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                    href="/privacy-policy"
                  >
                    Privacy Policy
                  </Link>
                </p>
                <p>
                  <Link
                    className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-hidden focus:text-gray-200"
                    href="/terms"
                  >
                    Terms and Conditions
                  </Link>
                </p>
              </div>
            </div>
            <div className="col-span-2">
              <h4 className="font-semibold text-gray-100 px-5">
                Stay up to date
              </h4>
              <NewsletterSignup />
              <p className="text-sm text-gray-400 px-5">
                Sign up for our newsletter to get the latest news, updates, and
                promotions from your favorite coffee shops.
              </p>
            </div>
          </div>
          {/* End Grid */}

          <div className="mt-5 sm:mt-12 grid gap-y-2 sm:gap-y-0 sm:flex sm:justify-between sm:items-center px-5 lg:px-0">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <p className="text-sm text-gray-400">© 2025 RateMyCoffee.</p>
            </div>

            <div>
              <Link
                className="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 focus:outline-hidden focus:bg-white/10 disabled:opacity-50 disabled:pointer-events-none"
                href="https://facebook.com/ratemycoffee"
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
