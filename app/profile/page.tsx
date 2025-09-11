"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import MyReviews from "./MyReviews";
import { User2, Mail, KeyRound } from "lucide-react";
import { AuthError } from "@/app/utilities/authUtils";
import { fetchCoffeeShopsAndLocations, type LocationItem } from "@/app/utilities/dataUtils";
import type { CoffeeShop } from "@/types/coffeeShop";

interface ProfileFormData {
  name: string;
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
}

interface ProfileFormErrors {
  name?: string;
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
  general?: string;
}

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
  });
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
      }));
    }
  }, [user, isLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof ProfileFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const endpoint =
        activeTab === "info"
          ? "/api/auth/user/profile"
          : "/api/auth/user/password";

      const payload =
        activeTab === "info"
          ? { name: formData.name }
          : {
              current_password: formData.current_password,
              password: formData.new_password,
              password_confirmation: formData.new_password_confirmation,
            };

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new AuthError(errorData);
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      if (activeTab === "password") {
        // Clear password fields after successful update
        setFormData((prev) => ({
          ...prev,
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        }));
      }
    } catch (error) {
      if (error instanceof AuthError && error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  // Fetch coffee shops and locations data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { coffeeShops, locations } = await fetchCoffeeShopsAndLocations();
        setCoffeeShops(coffeeShops);
        setLocations(locations);
      } catch (error) {
        console.error("Failed to fetch coffee shops and locations:", error);
      } finally {
        // no-op
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header locations={locations} coffeeShops={coffeeShops} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Profile Settings
          </h1>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("info")}
                className={`${
                  activeTab === "info"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`${
                  activeTab === "password"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Change Password
              </button>
            </nav>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg flex items-center animate-slide-in">
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {activeTab === "info"
                ? "Profile updated successfully!"
                : "Password changed successfully!"}
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === "info" ? (
              <>
                {/* Personal Information Form */}
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`py-3 px-4 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none ${
                        errors.name ? "border-red-300" : "border-gray-200"
                      }`}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      aria-describedby="name-error"
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 text-gray-500">
                      <User2 size={16} />
                    </div>
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-2" id="name-error">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="py-3 px-4 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                      value={user.email}
                      disabled
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 text-gray-500">
                      <Mail size={16} />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Change Password Form */}
                <div>
                  <div className="relative">
                    <input
                      type="password"
                      id="current_password"
                      name="current_password"
                      className={`py-3 px-4 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 ${
                        errors.current_password
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                      value={formData.current_password || ""}
                      onChange={handleInputChange}
                      placeholder="Current password"
                      aria-describedby="current-password-error"
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 text-gray-500">
                      <KeyRound size={16} />
                    </div>
                  </div>
                  {errors.current_password && (
                    <p
                      className="text-sm text-red-600 mt-2"
                      id="current-password-error"
                    >
                      {errors.current_password}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="password"
                      id="new_password"
                      name="new_password"
                      className={`py-3 px-4 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 ${
                        errors.new_password
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                      value={formData.new_password || ""}
                      onChange={handleInputChange}
                      placeholder="New password"
                      aria-describedby="new-password-error"
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 text-gray-500">
                      <KeyRound size={16} />
                    </div>
                  </div>
                  {errors.new_password && (
                    <p
                      className="text-sm text-red-600 mt-2"
                      id="new-password-error"
                    >
                      {errors.new_password}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="password"
                      id="new_password_confirmation"
                      name="new_password_confirmation"
                      className={`py-3 px-4 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 ${
                        errors.new_password_confirmation
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                      value={formData.new_password_confirmation || ""}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      aria-describedby="new-password-confirmation-error"
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 text-gray-500">
                      <KeyRound size={16} />
                    </div>
                  </div>
                  {errors.new_password_confirmation && (
                    <p
                      className="text-sm text-red-600 mt-2"
                      id="new-password-confirmation-error"
                    >
                      {errors.new_password_confirmation}
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting || showSuccess}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Saving..."
                  : showSuccess
                  ? "Saved!"
                  : activeTab === "info"
                  ? "Update Profile"
                  : "Change Password"}
              </button>
            </div>
          </form>

          {/* User's Posts Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Reviews
            </h2>
            <MyReviews userId={user.id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
