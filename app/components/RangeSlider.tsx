"use client";
// RangeSlider component used in WriteReviewStepper.tsx
import React from "react";

interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min = 0,
  max = 5,
  step = 1,
  value,
  defaultValue,
  onValueChange,
  id = "steps-range-slider-usage",
  name,
  className,
  disabled,
  orientation = "horizontal",
}) => {
  const baseClasses = `w-full bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden
  [&::-webkit-slider-thumb]:w-2.5
  [&::-webkit-slider-thumb]:h-2.5
  [&::-webkit-slider-thumb]:-mt-0.5
  [&::-webkit-slider-thumb]:appearance-none
  [&::-webkit-slider-thumb]:bg-white
  [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(127,86,217,1)]
  [&::-webkit-slider-thumb]:rounded-full
  [&::-webkit-slider-thumb]:transition-all
  [&::-webkit-slider-thumb]:duration-150
  [&::-webkit-slider-thumb]:ease-in-out

  [&::-moz-range-thumb]:w-2.5
  [&::-moz-range-thumb]:h-2.5
  [&::-moz-range-thumb]:appearance-none
  [&::-moz-range-thumb]:bg-white
  [&::-moz-range-thumb]:border-4
  [&::-moz-range-thumb]:border-purple-600
  [&::-moz-range-thumb]:rounded-full
  [&::-moz-range-thumb]:transition-all
  [&::-moz-range-thumb]:duration-150
  [&::-moz-range-thumb]:ease-in-out

  [&::-webkit-slider-runnable-track]:w-full
  [&::-webkit-slider-runnable-track]:h-2
  [&::-webkit-slider-runnable-track]:bg-gray-100
  [&::-webkit-slider-runnable-track]:rounded-full
 
  [&::-moz-range-track]:w-full
  [&::-moz-range-track]:h-2
  [&::-moz-range-track]:bg-gray-100
  [&::-moz-range-track]:rounded-full`;

  const classes = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <input
      type="range"
      className={classes}
      id={id}
      name={name}
      aria-orientation={orientation}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onChange={(e) => onValueChange?.(e.currentTarget.valueAsNumber)}
    />
  );
};

export default RangeSlider;
