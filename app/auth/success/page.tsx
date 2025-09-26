"use client";
import { useEffect, useState } from "react";
import { User } from "@/types/auth";

export default function AuthSuccess() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Hit Laravel API with credentials (cookies included)
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  if (!user) return <p>Loading user...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-semibold">Welcome, {user.name} 👋</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
