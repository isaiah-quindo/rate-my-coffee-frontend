"use client";
// ProtectedRoute component used for protected routes
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login page if user is not authenticated
      const currentPath = window.location.pathname + window.location.search;
      const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(
        currentPath
      )}`;
      router.push(loginUrl);
    }
  }, [user, isLoading, router, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Don't render children if user is not authenticated
  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
