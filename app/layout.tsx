import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import PrelineScriptWrapper from "./components/PrelineScriptWrapper";
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "RateMyCoffee",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <GoogleOAuthProvider
                    clientId={process.env.GOOGLE_CLIENT_ID || ""}>
                    <AuthProvider>{children}</AuthProvider>
                </GoogleOAuthProvider>
                <PrelineScriptWrapper />
            </body>
            <GoogleAnalytics gaId="G-CPFDQ1RMRV" />
        </html>
    );
}
