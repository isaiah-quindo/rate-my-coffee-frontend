"use client";
import React, { useEffect, useState } from "react";
import { Post } from "@/types/post";
import StarRatingDisplay from "@/app/components/StarRatingDisplay";
import { timeAgo, toStringArray } from "@/app/utilities/utils";
import { Clock } from "lucide-react";
import PhotoGallery from "./PhotoGallery";

type Props = {
  post: Post;
  shopPhotos: { url: string; post_id: number | null }[];
};

export default function PostCard({ post, shopPhotos }: Props) {
  const items = toStringArray(post.ordered_items);
  const postPhotos = shopPhotos.filter((photo) => photo.post_id === post.id);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="group flex flex-col gap-2 bg-white border border-gray-200 shadow-2xs rounded-xl overflow-hidden p-6">
      <div className="flex flex-row items-center gap-2">
        <StarRatingDisplay value={Number(post.overall_score) || 0} size={22} />
        <span className="text-sm font-bold text-gray-600 mt-1">
          {post.overall_score}
        </span>
      </div>
      <p className="flex flex-row items-center gap-1 text-xs text-gray-500">
        <Clock size={16} />
        {isMounted ? timeAgo(post.created_at) : "Loading..."}
      </p>
      {post.body && <p>{post.body}</p>}
      <div className="p-4 flex flex-col gap-3 bg-gray-100 rounded-lg">
        <div className="flex flex-col gap-2">
          {items.length > 0 && (
            <h4 className="text-sm font-semibold text-gray-800">
              Ordered Items
            </h4>
          )}
          <ul className="list-disc list-inside ms-4">
            {items.map((item, idx) => (
              <li key={`${item}-${idx}`} className="text-sm text-gray-500">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <h4 className="text-sm font-semibold text-gray-800 col-span-2">
            Ratings
          </h4>
          {Object.entries(post.ratings).map(([key, value]) => (
            <div key={key} className="grid grid-cols-4 items-center gap-2">
              <p className="text-sm text-gray-500 capitalize">
                {key.replace(/_/g, " ")}
              </p>
              <div className="progress-bar w-full h-auto bg-gray-200 rounded-full col-span-2">
                <div
                  className="progress-bar-fill bg-purple-500 p-1 rounded-full"
                  style={{ width: `${Number(value) * 20}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {post.taste_profile && (
            <h4 className="text-sm font-semibold text-gray-800 col-span-2">
              Taste Profile
            </h4>
          )}
          {Object.entries(post.taste_profile ?? {}).map(([key, value]) => (
            <div key={key} className="grid grid-cols-4 items-center gap-2">
              <p className="text-sm text-gray-500 capitalize">
                {key.replace(/_/g, " ")}
              </p>
              <div className="progress-bar w-full h-auto bg-gray-200 rounded-full col-span-2">
                <div
                  className="progress-bar-fill bg-purple-500 p-1 rounded-full"
                  style={{ width: `${Number(value) * 20}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">{value}</p>
            </div>
          ))}
          <PhotoGallery images={postPhotos.map((photo) => photo.url)} />
        </div>
      </div>
    </div>
  );
}
