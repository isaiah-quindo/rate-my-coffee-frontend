import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Image from "next/image";
import BlogSidebar from "../components/BlogSidebar";
import { BlogPosts } from "@/types/blogPosts";
import { sanityClient, urlFor } from "@/app/lib/sanity";
import { format } from "date-fns";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/app/lib/portableTextComponents";
import { CalendarIcon, TagIcon, UserIcon } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

// Function to generate metadata
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found | Rate My Coffee",
    };
  }

  return {
    title: `${post.title} | RateMyCoffee`,
    description: post.excerpt || "Read this interesting coffee blog post",
    authors: post.author ? [{ name: post.author.name }] : [],
    keywords: post.categories
      ?.map((cat: { title: string }) => cat.title)
      .join(", "),
    openGraph: {
      title: `${post.title} | Rate My Coffee`,
      description: post.excerpt || "Read this interesting coffee blog post",
      type: "article",
      authors: post.author?.name,
      images: urlFor(post.mainImage).url(),
      siteName: "Rate My Coffee",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "Read this interesting coffee blog post",
      images: urlFor(post.mainImage).url(),
      creator: post.author?.name,
    },
  };
}

async function getPostBySlug(slug: string): Promise<BlogPosts | null> {
  const query = `*[_type == 'post' && slug.current == $slug][0]{
    title,
    publishedAt,
    author->{
      name,
      image,
      bio
    },
    categories[]->{
      title,
      description
    },
    mainImage,
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->
      }
    },
    "excerpt": array::join(string::split((pt::text(body)), "")[0..255], "") + "..."
}`;
  const data = await sanityClient.fetch(query, { slug });
  return data;
}

const BlogPostPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const data: BlogPosts | null = await getPostBySlug(slug);

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col flex-1 gap-4 w-full max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-8">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex flex-col gap-4 w-full sm:w-2/3">
            <h1 className="text-2xl font-semibold text-gray-800">
              {data.title}
            </h1>
            <div className="flex flex-row items-center flex-wrap gap-3">
              {data.author && (
                <div className="flex items-center gap-2">
                  {data.author.image ? (
                    <Image
                      src={urlFor(data.author.image).url()}
                      alt={data.author.name || "Author"}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-8 h-8 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-500">
                    {data.author.name}
                  </span>
                </div>
              )}
              {data.publishedAt && (
                <p className="text-sm text-gray-500 flex flex-row items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  {format(new Date(data.publishedAt), "MMM d, yyyy")}
                </p>
              )}
              {data.categories && data.categories.length > 0 && (
                <p className="text-sm text-gray-500 flex flex-row items-center gap-1">
                  <TagIcon className="w-4 h-4" />
                  {data.categories.map((category) => category.title).join(", ")}
                </p>
              )}
            </div>
            {data.mainImage && (
              <Image
                src={urlFor(data.mainImage).url()}
                alt={data.title}
                width={500}
                height={500}
                className="w-full h-auto rounded-xl"
              />
            )}
            {data.body && (
              <div className="prose block">
                <PortableText
                  value={data.body}
                  components={portableTextComponents}
                />
              </div>
            )}
          </div>
          <BlogSidebar />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
