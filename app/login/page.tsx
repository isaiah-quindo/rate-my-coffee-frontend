"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { LoginRequest } from "@/types/auth";
import { AuthError } from "@/app/utilities/authUtils";
import Header from "../components/Header";
import { KeyRound, Mail, CheckCircle2, Facebook } from "lucide-react";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
  const handleFacebookLogin = async () => {
    setIsFacebookLoading(true);
    setGeneralError("");

    try {
      // Get the current redirect parameter to pass it along
      const redirectTo = searchParams.get("redirect") || "/";
      const callbackUrl = `${
        window.location.origin
      }/auth/facebook/callback?redirect=${encodeURIComponent(redirectTo)}`;

      console.log("Attempting Facebook login with callback URL:", callbackUrl);
      console.log("Backend URL:", backendBaseUrl);

      // Call the backend to get the Facebook OAuth URL
      const response = await fetch(
        `${backendBaseUrl}/api/auth/facebook/redirect?callback_url=${encodeURIComponent(
          callbackUrl
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        throw new Error(
          `Failed to get Facebook login URL: ${response.status} ${response.statusText}`
        );
      }

      const responseText = await response.text();
      console.log("Raw response text:", responseText);

      // Remove BOM and any leading/trailing whitespace
      const cleanedText = responseText.replace(/^\uFEFF/, "").trim();
      console.log("Cleaned response text:", cleanedText);

      const data = JSON.parse(cleanedText);
      console.log("Parsed response data:", data);

      if (data.url) {
        // Redirect to the Facebook OAuth URL
        window.location.href = data.url;
      } else {
        throw new Error("No Facebook login URL received");
      }
    } catch (error) {
      console.error("Facebook login error:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        setGeneralError(
          "Cannot connect to the server. Please check if the backend is running."
        );
      } else {
        setGeneralError(
          `Failed to initiate Facebook login: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    } finally {
      setIsFacebookLoading(false);
    }
  };

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

    try {
      await login(formData);
      setShowSuccess(true);
      // Redirect after showing success message
      setTimeout(() => {
        const redirectTo = searchParams.get("redirect") || "/";
        router.push(redirectTo);
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
      <div className="flex flex-1 items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                href="/register"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                create a new account
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
                      You have successfully logged in!
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
                    type="email"
                    id="input-email-label"
                    name="email"
                    className={`py-3 px-4 ps-11 block w-full border-gray-200 rounded-lg text-md focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none ${
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
                  {errors.email && (
                    <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
                      <svg
                        className="h-5 w-5 text-red-500"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  )}
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-2" id="email-error">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`peer py-3 px-4 ps-11 block w-full bg-white border-gray-200 rounded-lg text-md focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none ${
                      errors.password ? "border-red-300" : "border-gray-200"
                    }`}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50">
                    <KeyRound size={16} />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>
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
                  ? "Signing in..."
                  : "Sign in"}
              </button>
            </div>

            <div className="relative pt-6">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={isFacebookLoading || isSubmitting || showSuccess}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFacebookLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Facebook size={16} />
                    Continue with Facebook
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const LoginPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
