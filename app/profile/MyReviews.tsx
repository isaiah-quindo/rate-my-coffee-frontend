"use client";

import React from "react";
import { Post } from "@/types/post";
import MyPostCard from "@/app/components/MyPostCard";
import { authService } from "@/app/utilities/authUtils";

type Props = {
  userId: number;
};

export default function MyReviews({}: Props) {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const [total, setTotal] = React.useState<number>(0);
  const [lastPage, setLastPage] = React.useState<number>(1);

  const pageSize = 3;
  const hasMore = page < lastPage;

  const fetchPosts = async (pageToLoad: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const BASE = process.env.NEXT_PUBLIC_BACKEND_URL as string | undefined;
      if (!BASE) throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");

      const res = await fetch(
        `${BASE}/api/users/me/posts?posts_per_page=${pageSize}&posts_page=${pageToLoad}&include=shop`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authService.getToken()}`,
          },
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to load reviews (${res.status})`);
      }

      const json = await res.json();

      // ✅ Laravel pagination structure
      const newPosts = Array.isArray(json.data) ? json.data : [];

      setPosts((prev) => {
        const merged = [...prev, ...newPosts];
        // remove duplicates by id just in case
        return merged.filter(
          (post, index, self) =>
            index === self.findIndex((p) => p.id === post.id)
        );
      });

      setTotal(json.total || 0);
      setLastPage(json.last_page || 1);
      setPage(json.current_page || pageToLoad);
    } catch (e) {
      setError((e as Error).message ?? "Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Load first page only once
  React.useEffect(() => {
    fetchPosts(1);
  }, []);

  const loadMore = () => {
    if (hasMore) {
      fetchPosts(page + 1);
    }
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isLoading && posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          You haven&apos;t written any reviews yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <MyPostCard key={post.id} post={post} shopPhotos={[]} />
      ))}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {posts.length} of {total} reviews
          </p>
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoading}
            className="self-start py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-transparent bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                <span className="ml-2">Loading...</span>
              </>
            ) : (
              `Load more (${Math.max(total - posts.length, 0)} left)`
            )}
          </button>
        </div>
      )}
    </div>
  );
}
