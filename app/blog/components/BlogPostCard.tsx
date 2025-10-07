import React from "react";
import { BlogPosts } from "@/types/blogPosts";
import { urlFor } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { PortableText } from "@portabletext/react";
import { cardPortableTextComponents } from "./cardPortableTextComponents";
import { CalendarIcon } from "lucide-react";

const BlogPostCard = ({ data }: { data: BlogPosts }) => {
  return (
    <div className="max-w-full group flex flex-col sm:flex-row h-auto bg-white border border-gray-200 shadow-2xs rounded-xl overflow-hidden hover:shadow-lg transition-all duration-400 ease-in-out">
      <div className="relative overflow-hidden w-full sm:w-1/3 h-auto">
        {data.mainImage ? (
          <Image
            className="h-full w-full object-cover"
            src={urlFor(data.mainImage).url()}
            alt={data.title}
            width={500}
            height={500}
          />
        ) : (
          <div className="w-full h-full min-h-40 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No image available</span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start flex-1 gap-2 p-4">
        <h3 className="text-lg font-bold text-gray-800">
          <Link href={`/blog/${data.slug}`}>{data.title}</Link>
        </h3>
        {data.publishedAt && (
          <p className="text-sm text-gray-500 flex flex-row items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            {format(new Date(data.publishedAt), "MMM d, yyyy")}
          </p>
        )}
        <div className="prose block line-clamp-2">
          <PortableText
            value={data.body}
            components={cardPortableTextComponents}
          />
        </div>
        <Link
          className="self-end bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-all duration-400 ease-in-out"
          href={`/blog/${data.slug}`}
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogPostCard;
