"use client";

import React from "react";
import { Post } from "@/types/post";
import PostCard from "@/app/components/PostCard";

type Props = {
  slug: string;
  initialPosts: Post[];
  total: number;
  pageSize: number;
  shopPhotos: { url: string; post_id: number | null }[];
};

export default function PaginatedPosts({
  slug,
  initialPosts,
  total,
  pageSize,
  shopPhotos,
}: Props) {
  const [posts, setPosts] = React.useState<Post[]>(initialPosts ?? []);
  const [page, setPage] = React.useState<number>(1); // initial page already loaded server-side
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const hasMore = posts.length < total;

  async function handleLoadMore() {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const BASE = process.env.BACKEND_URL as string | undefined;
      if (!BASE) throw new Error("Missing BACKEND_URL");
      const nextPage = page + 1;
      const res = await fetch(
        `${BASE}/api/coffee-shops/${encodeURIComponent(
          slug
        )}?posts_per_page=${pageSize}&posts_page=${nextPage}`,
        { headers: { Accept: "application/json" }, cache: "no-store" }
      );
      if (!res.ok) throw new Error(`Failed to load more posts (${res.status})`);
      const json = await res.json();
      const nextPosts: Post[] = Array.isArray(json?.posts) ? json.posts : [];
      setPosts((prev) => [...prev, ...nextPosts]);
      setPage(nextPage);
    } catch (e) {
      setError((e as string) ?? "Failed to load more posts");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} shopPhotos={shopPhotos} />
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {hasMore && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {posts.length} of {total} reviews
          </p>
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoading}
            className="self-start py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-transparent bg-gray-200 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer hover:bg-gray-300"
          >
            {isLoading
              ? "Loading…"
              : `Load more (${Math.max(total - posts.length, 0)} left)`}
          </button>
        </div>
      )}
    </div>
  );
}
