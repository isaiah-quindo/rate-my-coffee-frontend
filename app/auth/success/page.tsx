"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

const SuccessPage = () => {
  const router = useRouter();
  const { checkAuth } = useAuth();

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

        // Sync auth context
        await checkAuth();

        // Get stored redirect path or default to home
        const redirectTo = localStorage.getItem("redirect_after_login") || "/";
        localStorage.removeItem("redirect_after_login"); // Clean up

        // Redirect to intended page
        router.replace(redirectTo);
      } catch (error) {
        console.error("Error syncing auth state:", error);
        router.replace("/login");
      }
    };

    handleSuccess();
  }, [router, checkAuth]);

  // Show loading state while processing
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
    </div>
  );
};

export default SuccessPage;
