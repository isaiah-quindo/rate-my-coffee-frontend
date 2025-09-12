"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { RegisterRequest } from "@/types/auth";
import { AuthError } from "@/app/utilities/authUtils";
import Header from "../components/Header";
import { CheckCircle2, User2, Mail, KeyRound } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setGeneralError("");

    // Client-side validation
    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: "Passwords do not match" });
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters long" });
      setIsSubmitting(false);
      return;
    }

    try {
      await register(formData);
      setShowSuccess(true);

      // Track user registration
      sendGAEvent("event", "sign_up", {
        method: "email",
      });

      // Redirect after showing success message
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.errors) {
          // Convert array of errors to single error message for each field
          const fieldErrors: Record<string, string> = {};
          Object.entries(error.errors).forEach(([field, messages]) => {
            fieldErrors[field] = Array.isArray(messages)
              ? messages[0]
              : messages;
          });
          setErrors(fieldErrors);
        } else {
          setGeneralError(error.message);
        }
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header writeReview={false} />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                href="/login"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {showSuccess ? (
              <div className="rounded-md bg-green-50 border border-green-300 p-4 animate-slide-in">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle2
                      className="h-5 w-5 text-green-700"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-700">
                      Your account has been created successfully!
                    </p>
                  </div>
                </div>
              </div>
            ) : generalError ? (
              <div className="rounded-md border border-red-300 bg-red-50 p-4 animate-slide-in">
                <div className="text-sm text-red-700">{generalError}</div>
              </div>
            ) : null}

            <div className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`py-3 px-4 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none ${
                      errors.name ? "border-red-300" : "border-gray-200"
                    }`}
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
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
                    className={`py-3 px-4 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 ${
                      errors.email ? "border-red-300" : "border-gray-200"
                    }`}
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    aria-describedby="email-error"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 text-gray-500">
                    <Mail size={16} />
                  </div>
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 mt-2" id="email-error">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`py-3 px-4 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 ${
                      errors.password ? "border-red-300" : "border-gray-200"
                    }`}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    aria-describedby="password-error password-hint"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 text-gray-500">
                    <KeyRound size={16} />
                  </div>
                </div>
                {errors.password && (
                  <p
                    className="items-center pointer-events-none pe-3 text-sm text-red-600 mt-2"
                    id="password-error"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    className={`py-3 px-4 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 ${
                      errors.password_confirmation
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                    autoComplete="new-password"
                    required
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    aria-describedby="password-confirmation-error"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 text-gray-500">
                    <KeyRound size={16} />
                  </div>
                </div>
                {errors.password_confirmation && (
                  <p
                    className="items-center pointer-events-none pe-3 text-sm text-red-600 mt-2"
                    id="password-confirmation-error"
                  >
                    {errors.password_confirmation}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || showSuccess}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {showSuccess
                  ? "Success!"
                  : isSubmitting
                  ? "Creating account..."
                  : "Create account"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-purple-600 hover:text-purple-500">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-purple-600 hover:text-purple-500">
                  Privacy Policy
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
