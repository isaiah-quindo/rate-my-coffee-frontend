import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { PortableTextBlock } from "@portabletext/types";

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  } | {
    _id: string;
    url: string;
    [key: string]: any;
  };
  alt?: string;
}

export interface SanityLink {
  _type: "link";
  href: string;
}

export interface SanityAuthor {
  _type: "author";
  name: string;
  image?: SanityImage;
  bio?: PortableTextBlock[];
}
