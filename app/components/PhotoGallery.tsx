"use client";
import React from "react";
import Image from "next/image";

type Props = {
  images: string[];
  thumbnailSize?: { width: number; height: number };
};

export default function PhotoGallery({ images }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(0);

  const openAt = React.useCallback((index: number) => {
    setCurrent(index);
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => setIsOpen(false), []);
  const prev = React.useCallback(
    () => setCurrent((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = React.useCallback(
    () => setCurrent((i) => (i + 1) % images.length),
    [images.length]
  );

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, prev, next, close]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {images.map((src, idx) => (
        <button
          key={src + idx}
          type="button"
          onClick={() => openAt(idx)}
          className="w-34 h-34 hover:shadow-lg hover:scale-105 transition-all duration-400 ease-in-out"
        >
          <Image
            src={src}
            alt={`Photo ${idx + 1}`}
            width={160}
            height={160}
            className="w-full h-full object-cover rounded-xl cursor-pointer"
          />
        </button>
      ))}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={close}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[current]}
              alt={`Photo ${current + 1}`}
              width={1200}
              height={800}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={close}
              className="absolute top-2 right-2 text-white/90 bg-black/40 hover:bg-black/60 rounded-full px-3 py-1 cursor-pointer"
              aria-label="Close"
            >
              ×
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white/90 bg-black/40 hover:bg-black/60 rounded-full px-3 py-2 cursor-pointer"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/90 bg-black/40 hover:bg-black/60 rounded-full px-3 py-2 cursor-pointer"
                  aria-label="Next"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
