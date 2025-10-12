"use client";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { CheckCircle2, XCircle } from "lucide-react";
import type { CredentialResponse } from "@react-oauth/google";

export default function GoogleLoginButton() {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const { checkAuth } = useAuth();

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const response = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    credential: credentialResponse.credential,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage("Login Failed. Please try again.");
                throw new Error(data.message || "Authentication failed");
            }

            // Store the token where the app expects it
            localStorage.setItem("auth_token", data.token);

            // Refresh auth context immediately
            await checkAuth();
            setSuccessMessage("You have successfully logged in!");

            // Redirect to dashboard
            router.push("/");
        } catch (error) {
            console.error("Google authentication error:", error);
            // Handle error (show error message to user)
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-3">
            {successMessage ? (
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
                                {successMessage}
                            </p>
                        </div>
                    </div>
                </div>
            ) : errorMessage ? (
                <div className="rounded-md bg-red-50 border border-red-300 p-4 animate-slide-in">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <XCircle
                                className="h-5 w-5 text-red-700"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-700">
                                {errorMessage}
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => {
                    setErrorMessage("Login Failed. Please try again.");
                }}
                type="standard"
                logo_alignment="center"
                text="signin_with"
                shape="rectangular"
                theme="outline"
                size="large"
                width="100%"
            />
        </div>
    );
}
