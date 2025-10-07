import React from "react";
import { sanityClient } from "@/app/lib/sanity";
import { BlogPosts } from "@/types/blogPosts";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import BlogPostCard from "./components/BlogPostCard";
import BlogSidebar from "./components/BlogSidebar";

async function getPosts() {
  const query = `*[_type == 'post'] | order(_createdAt desc) {
        title,
        "slug": slug.current,
        publishedAt,
        mainImage,
        body[]{
          ...,
          _type == "image" => {
            ...,
            asset->
          }
        },
        author-> {
          name,
          image
        }
      }`;
  const data = await sanityClient.fetch(query);
  return data;
}

const BlogPage = async () => {
  const data: BlogPosts[] = await getPosts();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col flex-1 gap-4 w-full max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-8">
        <div className="flex sm:flex-row flex-col gap-8">
          <div className="blog-posts-container flex flex-col flex-1 gap-4 w-full sm:w-2/3">
            <h1 className="text-2xl font-semibold text-gray-800">Blog</h1>
            {data.map((data: BlogPosts, key) => (
              <BlogPostCard data={data} key={key} />
            ))}
          </div>
          <BlogSidebar />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;
