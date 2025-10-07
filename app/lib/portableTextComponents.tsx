/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { urlFor } from "./sanity";
import { PortableTextComponents } from "@portabletext/react";
import type { PortableTextMarkComponentProps } from "@portabletext/react";
import { SanityImage, SanityLink } from "@/types/sanity";

export const portableTextComponents: Partial<PortableTextComponents> = {
  types: {
    image: ({ value }: { value: SanityImage }) => {
      return (
        <div className="relative w-full">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || " "}
            width={500}
            height={500}
            className="w-full h-auto rounded-xl"
          />
        </div>
      );
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
