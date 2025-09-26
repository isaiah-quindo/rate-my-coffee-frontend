"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

// Loading component
const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
  </div>
);

// Main content component that uses searchParams
const SuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        // Remove Facebook's #_=_ hash if present
        if (window.location.hash === "#_=_") {
          history.replaceState(
            "",
            document.title,
            window.location.pathname + window.location.search
          );
        }

        // Get token and user from URL params
        const token = searchParams.get("token");
        const userJson = searchParams.get("user");

        if (!token || !userJson) {
          setStatus("error");
          setMessage("No authentication data received");
          return;
        }

        try {
          const user = JSON.parse(userJson);
          console.log("Received user data:", user);

          // Store authentication data
          localStorage.setItem("auth_token", token);
          localStorage.setItem("user", JSON.stringify(user));

          // Small delay to ensure storage is complete
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Sync auth context
          await checkAuth();

          setStatus("success");
          setMessage("Successfully logged in with Facebook!");

          // Get stored redirect path or default to home
          const redirectTo =
            localStorage.getItem("redirect_after_login") || "/";
          localStorage.removeItem("redirect_after_login"); // Clean up

          // Small delay to show success message
          setTimeout(() => {
            router.replace(redirectTo);
          }, 600);
        } catch (parseError) {
          console.error("Failed to parse user data:", parseError);
          throw new Error("Invalid authentication data received");
        }
      } catch (error) {
        console.error("Error handling success:", error);
        setStatus("error");
        setMessage("Failed to complete login process");
        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      }
    };

    handleSuccess();
  }, [router, checkAuth, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        {status === "loading" && (
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
        )}
        {status === "success" && (
          <div className="text-green-600 font-medium">{message}</div>
        )}
        {status === "error" && (
          <div className="text-red-600 font-medium">{message}</div>
        )}
      </div>
    </div>
  );
};

// Wrap the content component with Suspense
const SuccessPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessPage;
