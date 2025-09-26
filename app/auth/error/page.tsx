"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/app/components/Header";
import { XCircle } from "lucide-react";

const getErrorMessage = (code: string | null): string => {
  switch (code) {
    case "fb_error":
      return "Unable to authenticate with Facebook. Please try again or use a different login method.";
    default:
      return "An error occurred during authentication. Please try again.";
  }
};

const ErrorContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("msg");
  const errorMessage = getErrorMessage(errorCode);

  return (
    <div className="flex flex-col min-h-screen">
      <Header writeReview={false} />
      <div className="flex flex-1 items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <div className="rounded-md border border-red-300 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">{errorMessage}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => router.push("/login")}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthErrorPage = () => {
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
      <ErrorContent />
    </Suspense>
  );
};

export default AuthErrorPage;
