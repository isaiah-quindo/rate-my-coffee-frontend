import { PortableTextComponents } from "@portabletext/react";

// Function to truncate text to a specific number of words
const truncateText = (text: string, maxWords: number = 30) => {
  const words = text.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return text;
};

// Track if we've rendered the first paragraph
let hasRenderedFirstParagraph = false;

export const cardPortableTextComponents: Partial<PortableTextComponents> = {
  // Only render the first block of text
  block: {
    normal: ({ children }) => {
      // Reset flag at the start of rendering
      if (!hasRenderedFirstParagraph) {
        hasRenderedFirstParagraph = true;
        const text = children?.toString() || "";
        // Reset for next render
        setTimeout(() => {
          hasRenderedFirstParagraph = false;
        }, 0);
        return (
          <p className="text-gray-600 line-clamp-2">{truncateText(text)}</p>
        );
      }
      return null;
    },
    // Don't render other block types in the card
    h1: () => null,
    h2: () => null,
    h3: () => null,
    h4: () => null,
    blockquote: () => null,
  },
  // Don't render images in the card preview
  types: {
    image: () => null,
  },
  // Preserve links but don't render other marks
  marks: {
    link: ({ children }: { children: React.ReactNode }) => {
      return <span className="text-blue-600">{children}</span>;
    },
  },
  // Don't render lists in the card
  list: {
    bullet: () => null,
    number: () => null,
  },
};
