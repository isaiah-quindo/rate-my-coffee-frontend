import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchCoffeeShopsAndLocations } from "../utilities/dataUtils";

const about = async () => {
  const { coffeeShops, locations: uniqueLocations } =
    await fetchCoffeeShopsAndLocations();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header locations={uniqueLocations} coffeeShops={coffeeShops} />
      <main className="max-w-7xl mx-6 md:mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 bg-white border border-gray-200 rounded-lg my-6">
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
          <p className="text-gray-600">
            At RateMyCoffee, our mission is simple: to share genuine experiences
            and honest reviews about coffee shops from fellow coffee lovers.
            This site started as a personal project born from our passion for
            coffee and love of discovering great local spots. We created this
            platform to bring together a community where coffee enthusiasts can
            help each other find the best brews, atmospheres, and places to
            relax.
          </p>
          <p className="text-gray-600">
            We want to be upfront, RateMyCoffee is not perfect yet. It&apos;s a
            work in progress, and we&apos;re committed to making it better over
            time, adding features and improving based on your feedback. Every
            review, rating, and story shared helps build a more vibrant and
            useful resource for all coffee lovers who visit.
          </p>
          <p className="text-gray-600">
            Thank you for being part of this journey. Together, we can celebrate
            the joy of coffee and support the wonderful coffee shops that make
            our daily rituals special.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default about;
