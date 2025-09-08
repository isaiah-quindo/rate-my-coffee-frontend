"use client";
import { Rating } from "react-simple-star-rating";

type Props = {
  value: number | null | undefined;
  size?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
};

export default function StarRatingDisplay({
  value,
  size = 24,
  readOnly = true,
  onChange,
}: Props) {
  const ratingValue = typeof value === "number" ? value : 0;
  return (
    <Rating
      size={size}
      allowFraction
      initialValue={ratingValue}
      readonly={readOnly}
      onClick={(rate: number) => {
        if (onChange) onChange(rate);
      }}
      SVGclassName="inline-block"
    />
  );
}
