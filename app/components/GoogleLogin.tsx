import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import type { CredentialResponse } from "@react-oauth/google";

export default function GoogleLoginButton() {
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
        throw new Error(data.message || "Authentication failed");
      }

      // Store the token where the app expects it
      localStorage.setItem("auth_token", data.token);

      // Refresh auth context immediately
      await checkAuth();

      // Redirect to dashboard
      router.push("/");
    } catch (error) {
      console.error("Google authentication error:", error);
      // Handle error (show error message to user)
    }
  };

  return (
    <div className="google-btn w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.log("Login Failed");
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
