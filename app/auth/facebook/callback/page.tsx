"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import Header from "@/app/components/Header";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const FacebookCallbackForm: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>("");
  const { checkAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");
        if (error) {
          setStatus("error");
          setMessage(
            errorDescription || "Facebook login was cancelled or failed"
          );
          return;
        }

        // Get the code from Facebook
        const code = searchParams.get("code");
        if (!code) {
          setStatus("error");
          setMessage("No authorization code received from Facebook");
          return;
        }

        console.log("Received code from Facebook:", code);

        // Exchange code for token with our backend
        const backendBaseUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        const res = await fetch(
          `${backendBaseUrl}/api/auth/facebook/callback?code=${encodeURIComponent(
            code
          )}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            credentials: "include",
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Backend exchange failed:", errorText);
          try {
            // Try to parse error as JSON
            const cleanedError = errorText.replace(/^\uFEFF/, "").trim();
            const errorData = JSON.parse(cleanedError);
            throw new Error(
              errorData.message || "Failed to complete Facebook login"
            );
          } catch (parseError) {
            // If can't parse JSON, use raw error text
            throw new Error(`Failed to complete Facebook login: ${errorText}`);
          }
        }

        // Parse response and handle BOM character
        const responseText = await res.text();
        console.log("Raw response:", responseText);

        // Remove BOM and any leading/trailing whitespace
        const cleanedText = responseText.replace(/^\uFEFF/, "").trim();
        console.log("Cleaned response:", cleanedText);

        const data = JSON.parse(cleanedText);

        // Only proceed if we got both token and user
        if (!data.token || !data.user) {
          throw new Error("Incomplete authentication data received");
        }

        // Store auth data
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Small delay to ensure token is stored before checking auth
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Update auth context
        await checkAuth();

        setStatus("success");
        setMessage("Successfully logged in with Facebook!");

        // Redirect after short delay
        setTimeout(() => {
          const redirectTo = searchParams.get("redirect") || "/";
          router.replace(redirectTo);
        }, 600);
      } catch (error) {
        console.error("Facebook callback error:", error);
        setStatus("error");

        // Don't show technical errors to the user
        const userMessage =
          "Unable to complete Facebook login. Please try again.";
        setMessage(userMessage);
      }
    };

    handleCallback();
  }, [searchParams, checkAuth, router]);

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />;
      case "success":
        return <CheckCircle2 className="h-8 w-8 text-green-600" />;
      case "error":
        return <XCircle className="h-8 w-8 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return "bg-blue-50 border-blue-300";
      case "success":
        return "bg-green-50 border-green-300";
      case "error":
        return "bg-red-50 border-red-300";
    }
  };

  const getTextColor = () => {
    switch (status) {
      case "loading":
        return "text-blue-700";
      case "success":
        return "text-green-700";
      case "error":
        return "text-red-700";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header writeReview={false} />
      <div className="flex flex-1 items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">{getStatusIcon()}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {status === "loading" && "Processing Facebook Login..."}
              {status === "success" && "Login Successful!"}
              {status === "error" && "Login Failed"}
            </h2>
            <div className={`rounded-md border p-4 ${getStatusColor()}`}>
              <p className={`text-sm font-medium ${getTextColor()}`}>
                {message}
              </p>
            </div>
            {status === "loading" && (
              <p className="mt-4 text-sm text-gray-600">
                Please wait while we complete your login...
              </p>
            )}
            {status === "success" && (
              <p className="mt-4 text-sm text-gray-600">
                Redirecting you to the homepage...
              </p>
            )}
            {status === "error" && (
              <div className="mt-4">
                <button
                  onClick={() => router.push("/login")}
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FacebookCallbackPage: React.FC = () => {
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
      <FacebookCallbackForm />
    </Suspense>
  );
};

export default FacebookCallbackPage;
