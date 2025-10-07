import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImage } from "@/types/sanity";

export const sanityClient = createClient({
    apiVersion: "2024-01-01",
    dataset: "production",
    projectId: "kvwe36ng",
    useCdn: true,
})

const builder = imageUrlBuilder(sanityClient);



export function urlFor(source: SanityImage) {
    return builder.image(source);
}