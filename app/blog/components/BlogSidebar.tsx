import React from "react";
import Link from "next/link";

const BlogSidebar = () => {
  return (
    <div className="blog-sidebar flex-col w-full sm:w-1/3">
      <div className="relative overflow-hidden rounded-xl">
        {/* Gradients */}
        <div
          aria-hidden="true"
          className="flex absolute -top-96 start-1/2 transform -translate-x-1/2 h-screen"
        >
          <div className="bg-linear-to-r from-violet-300/50 to-purple-100 blur-3xl w-100 h-175 rotate-[-60deg] transform -translate-x-40"></div>
          <div className="bg-linear-to-tl from-purple-50 via-purple-100 to-purple-50 blur-3xl w-[1440px] h-[1000px] rounded-fulls origin-top-left -rotate-12 -translate-x-60"></div>
        </div>
        {/* End Gradients */}

        <div className="relative z-10">
          <div className="flex flex-col justify-center items-center max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 h-[600px]">
            <div className="max-w-4xl text-center mx-auto">
              {/* <p className="inline-block text-sm font-medium bg-clip-text bg-linear-to-l from-purple-600 to-violet-500 text-transparent">
                Preline: A vision for 2023
              </p> */}

              {/* Title */}
              <div className="mt-5 max-w-4xl">
                <h2 className="block font-semibold text-gray-800 text-xl sm:text-2xl">
                  Help people discover the best coffee shops in your area.
                </h2>
              </div>
              {/* End Title */}

              <div className="mt-5 max-w-4xl text-center">
                <p className="text-lg text-gray-500 text-md md:text-lg">
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
    </div>
  );
};

export default BlogSidebar;
