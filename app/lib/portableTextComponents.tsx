/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { urlFor } from "./sanity";
import { PortableTextComponents } from "@portabletext/react";
import type { PortableTextMarkComponentProps } from "@portabletext/react";
import { SanityImage, SanityLink } from "@/types/sanity";

export const portableTextComponents: Partial<PortableTextComponents> = {
  types: {
    image: ({ value }: { value: any }) => {
      // Check if the image has a valid asset (either reference or expanded)
      if (!value?.asset) {
        console.warn("Image missing asset:", value);
        return null;
      }

      try {
        const imageUrl = urlFor(value).url();
        return (
          <div className="relative w-full my-8">
            <Image
              src={imageUrl}
              alt={value.alt || "Blog post image"}
              width={800}
              height={600}
              className="w-full h-auto rounded-xl"
            />
            {value.alt && (
              <p className="text-sm text-gray-500 text-center mt-2 italic">
                {value.alt}
              </p>
            )}
          </div>
        );
      } catch (error) {
        console.error("Error rendering image:", error, value);
        return null;
      }
    },
  },
  marks: {
    link: ({ children, value }: PortableTextMarkComponentProps<SanityLink>) => {
      const rel = !value?.href?.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a
          href={value?.href}
          rel={rel}
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h1: (props: any) => (
      <h1 className="text-4xl font-bold mt-8 mb-4">{props.children}</h1>
    ),
    h2: (props: any) => (
      <h2 className="text-3xl font-bold mt-8 mb-4">{props.children}</h2>
    ),
    h3: (props: any) => (
      <h3 className="text-2xl font-bold mt-8 mb-4">{props.children}</h3>
    ),
    h4: (props: any) => (
      <h4 className="text-xl font-bold mt-8 mb-4">{props.children}</h4>
    ),
    normal: (props: any) => <p className="mb-4">{props.children}</p>,
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-gray-200 pl-4 my-4 italic">
        {props.children}
      </blockquote>
    ),
  },
  list: {
    bullet: (props: any) => (
      <ul className="list-disc ml-4 mb-4">{props.children}</ul>
    ),
    number: (props: any) => (
      <ol className="list-decimal ml-4 mb-4">{props.children}</ol>
    ),
  },
};
