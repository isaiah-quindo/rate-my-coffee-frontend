"use client";
import React, { useEffect, useMemo, useState } from "react";
import { CoffeeShop } from "@/types/coffeeShop";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  CircleX,
  CircleQuestionMark,
} from "lucide-react";
import StarRatingDisplay from "./StarRatingDisplay";
import RangeSlider from "./RangeSlider";
import { reviewModalConfigs } from "./reviewModals";

export default function WriteReviewStepper({ shop }: { shop?: CoffeeShop }) {
  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
  const [coffeeQuality, setCoffeeQuality] = useState<number>(0);
  const [vibe, setVibe] = useState<number>(0);
  const [service, setService] = useState<number>(0);
  const [valueRating, setValueRating] = useState<number>(0);
  const [wifi, setWifi] = useState<number>(0);
  const [noise, setNoise] = useState<number>(0);
  const [seating, setSeating] = useState<number>(0);
  const [outlets, setOutlets] = useState<number>(0);
  const [cleanliness, setCleanliness] = useState<number>(0);
  const [food, setFood] = useState<number>(0);
  const [locationConvenience, setLocationConvenience] = useState<number>(0);
  const [consistency, setConsistency] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [orderedItems, setOrderedItems] = useState<string[]>([""]);
  const [body, setBody] = useState<number>(0);
  const [acidity, setAcidity] = useState<number>(0);
  const [aroma, setAroma] = useState<number>(0);
  const [flavour, setFlavour] = useState<number>(0);
  const [aftertaste, setAftertaste] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdPost, setCreatedPost] = useState<{ id: number } | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const hasAnyRating =
    coffeeQuality > 0 ||
    vibe > 0 ||
    service > 0 ||
    valueRating > 0 ||
    wifi > 0 ||
    noise > 0 ||
    seating > 0 ||
    outlets > 0 ||
    cleanliness > 0 ||
    food > 0 ||
    locationConvenience > 0 ||
    consistency > 0;

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleFileRemove = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadPhotosWithPostId = async (postId: number, files: File[]) => {
    const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("post_id", postId.toString());

        await fetch(`${BASE}/api/coffee-shops/${shop?.id}/photos`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      } catch (err) {
        console.error(`Failed to upload photo with post_id ${postId}:`, err);
      }
    }
  };

  const handleSubmit = async () => {
    if (!shop?.id) return;
    if (!hasAnyRating) return;

    try {
      setIsSubmitting(true);

      const ratings: Record<string, number> = {};
      if (coffeeQuality > 0) ratings.coffee_quality = coffeeQuality;
      if (vibe > 0) ratings.vibe = vibe;
      if (service > 0) ratings.service = service;
      if (valueRating > 0) ratings.value = valueRating;
      if (wifi > 0) ratings.wifi = wifi;
      if (noise > 0) ratings.noise = noise;
      if (seating > 0) ratings.seating = seating;
      if (outlets > 0) ratings.outlets = outlets;
      if (cleanliness > 0) ratings.cleanliness = cleanliness;
      if (food > 0) ratings.food = food;
      if (locationConvenience > 0)
        ratings.location_convenience = locationConvenience;
      if (consistency > 0) ratings.consistency = consistency;

      const tasteProfile: Record<string, number> = {};
      if (body > 0) tasteProfile.body = body;
      if (acidity > 0) tasteProfile.acidity = acidity;
      if (aroma > 0) tasteProfile.aroma = aroma;
      if (flavour > 0) tasteProfile.flavour = flavour;
      if (aftertaste > 0) tasteProfile.aftertaste = aftertaste;

      const cleanedOrderedItems = orderedItems
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        body: comment.trim() || null,
        ratings,
        ordered_items: cleanedOrderedItems,
        taste_profile:
          Object.keys(tasteProfile).length > 0 ? tasteProfile : null,
      };

      const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
      const endpoint = `${BASE ?? ""}/api/coffee-shops/${encodeURIComponent(
        String(shop.id)
      )}/reviews`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to submit review: ${response.status}`);
      }

      const reviewData = await response.json();
      setCreatedPost({ id: reviewData.id });

      // Upload selected photos with the post_id
      if (selectedFiles.length > 0) {
        await uploadPhotosWithPostId(reviewData.id, selectedFiles);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalConfigs = reviewModalConfigs;

  return (
    <>
      <div className="p-4 bg-white w-full">
        {/* Stepper */}
        <div data-hs-stepper="">
          {/* Stepper Nav */}
          <ul className="relative flex flex-row gap-x-2">
            <li
              className="flex items-center gap-x-2 shrink basis-0 flex-1 group"
              data-hs-stepper-nav-item='{
        "index": 1
      }'
            >
              <span className="min-w-7 min-h-7 group inline-flex items-center text-xs align-middle">
                <span className="size-7 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full group-focus:bg-gray-200 hs-stepper-active:bg-purple-600 hs-stepper-active:text-white hs-stepper-success:bg-purple-600 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600">
                  <span className="hs-stepper-success:hidden hs-stepper-completed:hidden">
                    1
                  </span>
                  <Check className="hidden shrink-0 size-3 hs-stepper-success:block" />
                </span>
              </span>
              <div className="w-full h-px flex-1 bg-gray-200 group-last:hidden hs-stepper-success:bg-purple-600 hs-stepper-completed:bg-teal-600"></div>
            </li>

            <li
              className="flex items-center gap-x-2 shrink basis-0 flex-1 group"
              data-hs-stepper-nav-item='{
        "index": 2
      }'
            >
              <span className="min-w-7 min-h-7 group inline-flex items-center text-xs align-middle">
                <span className="size-7 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full group-focus:bg-gray-200 hs-stepper-active:bg-purple-600 hs-stepper-active:text-white hs-stepper-success:bg-purple-600 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600">
                  <span className="hs-stepper-success:hidden hs-stepper-completed:hidden">
                    2
                  </span>
                  <Check className="hidden shrink-0 size-3 hs-stepper-success:block" />
                </span>
              </span>
              <div className="w-full h-px flex-1 bg-gray-200 group-last:hidden hs-stepper-success:bg-purple-600 hs-stepper-completed:bg-teal-600"></div>
            </li>

            <li
              className="flex items-center gap-x-2 shrink basis-0 group"
              data-hs-stepper-nav-item='{
          "index": 3
        }'
            >
              <span className="min-w-7 min-h-7 group inline-flex items-center text-xs align-middle">
                <span className="size-7 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full group-focus:bg-gray-200 hs-stepper-active:bg-purple-600 hs-stepper-active:text-white hs-stepper-success:bg-purple-600 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600">
                  <span className="hs-stepper-success:hidden hs-stepper-completed:hidden">
                    3
                  </span>
                  <Check className="hidden shrink-0 size-3 hs-stepper-success:block" />
                </span>
              </span>
              <div className="w-full h-px flex-1 bg-gray-200 group-last:hidden hs-stepper-success:bg-purple-600 hs-stepper-completed:bg-teal-600"></div>
            </li>
            {/* End Item */}
          </ul>
          {/* End Stepper Nav */}

          {/* Stepper Content */}
          <div className="mt-5 sm:mt-8">
            {/* First Content */}
            <div
              data-hs-stepper-content-item='{
        "index": 1
      }'
            >
              <p className="text-sm text-gray-500">
                Rate at least one of the following
              </p>
              <div className="p-4 h-auto flex justify-between items-center border-b-1 border-gray-100">
                <p className="text-xl font-bold text-gray-500">
                  Rate the{" "}
                  <span className="text-purple-500">coffee quality</span>
                  <span className="block text-gray-400 text-sm font-normal">
                    Consider the flavour, freshness, and consistency of the
                    coffee drinks.
                  </span>
                </p>
                <StarRatingDisplay
                  value={coffeeQuality}
                  readOnly={false}
                  onChange={(val) => setCoffeeQuality(val)}
                />
              </div>

              <div className="p-4 h-auto flex justify-between items-center border-b-1 border-gray-100">
                <p className="text-xl font-bold text-gray-500">
                  Rate the <span className="text-purple-500">vibe</span>
                  <span className="block text-gray-400 text-sm font-normal">
                    Consider the coffee shop’s look, feel, and overall
                    atmosphere.
                  </span>
                </p>
                <StarRatingDisplay
                  value={vibe}
                  readOnly={false}
                  onChange={(val) => setVibe(val)}
                />
              </div>

              <div className="p-4 h-auto flex justify-between items-center border-b-1 border-gray-100">
                <p className="text-xl font-bold text-gray-500">
                  Rate the <span className="text-purple-500">service</span>
                  <span className="block text-gray-400 text-sm font-normal">
                    Think about the staff’s friendliness, speed, and
                    attentiveness.
                  </span>
                </p>
                <StarRatingDisplay
                  value={service}
                  readOnly={false}
                  onChange={(val) => setService(val)}
                />
              </div>

              <div className="p-4 h-auto flex justify-between items-center border-b-1 border-gray-100">
                <p className="text-xl font-bold text-gray-500">
                  Rate the <span className="text-purple-500">value</span>
                  <span className="block text-gray-400 text-sm font-normal">
                    Assess whether the prices reflect the quality and experience
                    provided.
                  </span>
                </p>
                <StarRatingDisplay
                  value={valueRating}
                  readOnly={false}
                  onChange={(val) => setValueRating(val)}
                />
              </div>

              <div className="p-4 h-auto flex justify-between items-center border-b-1 border-gray-100">
                <p className="text-xl font-bold text-gray-500">
                  Rate the <span className="text-purple-500">wifi</span>
                  <span className="block text-gray-400 text-sm font-normal">
                    Rate the reliability and speed of the internet connection.
                  </span>
                </p>
                <StarRatingDisplay
                  value={wifi}
                  readOnly={false}
                  onChange={(val) => setWifi(val)}
                />
              </div>

              <div className="p-4 h-auto flex justify-between items-center border-b-1 border-gray-100">
                <p className="text-xl font-bold text-gray-500">
                  Rate the <span className="text-purple-500">noise</span>
                  <span className="block text-gray-400 text-sm font-normal">
                    Consider whether the noise levels are comfortable for
                    conversation or working. 1 is very noisy, 5 is very quiet.
                  </span>
                </p>
                <StarRatingDisplay
                  value={noise}
                  readOnly={false}
                  onChange={(val) => setNoise(val)}
                />
              </div>

              <div className="p-4 h-auto flex justify-between items-center border-b-1 border-gray-100">
                <p className="text-xl font-bold text-gray-500">
                  Rate the <span className="text-purple-500">seating</span>
                  <span className="block text-gray-400 text-sm font-normal">
                    Consider the availability, comfort, and layout of seating
                    options.
                  </span>
                </p>
                <StarRatingDisplay
                  value={seating}
                  readOnly={false}
                  onChange={(val) => setSeating(val)}
                />
              </div>

              <div className="p-4 h-auto flex justify-between items-center border-b-1 border-gray-100">
                <p className="text-xl font-bold text-gray-500">
                  Rate the <span className="text-purple-500">outlets</span>
                  <span className="block text-gray-400 text-sm font-normal">
                    Consider the accessibility and abundance of power outlets
                    for device charging.
                  </span>
                </p>
                <StarRatingDisplay
                  value={outlets}
                  readOnly={false}
                  onChange={(val) => setOutlets(val)}
                />
              </div>

              <div className="p-4 h-auto flex justify-between items-center border-b-1 border-gray-100">
                <p className="text-xl font-bold text-gray-500">
                  Rate the <span className="text-purple-500">cleanliness</span>
                  <span className="block text-gray-400 text-sm font-normal">
                    Consider the overall cleanliness and organization of the
                    coffee shop.
                  </span>
                </p>
                <StarRatingDisplay
                  value={cleanliness}
                  readOnly={false}
                  onChange={(val) => setCleanliness(val)}
                />
              </div>

              <div className="p-4 h-auto flex justify-between items-center border-b-1 border-gray-100">
                <p className="text-xl font-bold text-gray-500">
                  Rate the <span className="text-purple-500">food</span>
                  <span className="block text-gray-400 text-sm font-normal">
                    Rate the quality, freshness, and variety of food offerings.
                  </span>
                </p>
                <StarRatingDisplay
                  value={food}
                  readOnly={false}
                  onChange={(val) => setFood(val)}
                />
              </div>

              <div className="p-4 h-auto flex justify-between items-center border-b-1 border-gray-100">
                <p className="text-xl font-bold text-gray-500">
                  Rate the{" "}
                  <span className="text-purple-500">location convenience</span>
                  <span className="block text-gray-400 text-sm font-normal">
                    Consider how easy it is to access the shop by walking,
                    driving, or public transport.
                  </span>
                </p>
                <StarRatingDisplay
                  value={locationConvenience}
                  readOnly={false}
                  onChange={(val) => setLocationConvenience(val)}
                />
              </div>

              <div className="p-4 h-auto flex justify-between items-center ">
                <p className="text-xl font-bold text-gray-500">
                  Rate the <span className="text-purple-500">consistency</span>
                  <span className="block text-gray-400 text-sm font-normal">
                    Think about whether the service, atmosphere, and coffee
                    quality are reliably good with each visit.
                  </span>
                </p>
                <StarRatingDisplay
                  value={consistency}
                  readOnly={false}
                  onChange={(val) => setConsistency(val)}
                />
              </div>
            </div>
            {/* End First Content */}

            {/* Second Content */}
            <div
              data-hs-stepper-content-item='{
        "index": 2
      }'
              style={{ display: "none" }}
            >
              <div className="p-4 h-auto flex flex-col items-stretch gap-4">
                <p className="text-xl font-bold text-gray-500">
                  Write a <span className="text-purple-500">comment</span>
                  <span className="block text-gray-400 text-sm font-normal">
                    Comment is required.
                  </span>
                </p>
                <div className="max-w-full">
                  <textarea
                    id="textarea-email-label"
                    className="py-2 px-3 sm:py-3 sm:px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-pruple-500 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none"
                    rows={6}
                    placeholder="Share the pros, cons and what to expect when visiting this coffee shop..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>

                <p className="text-xl font-bold text-gray-500">
                  Upload <span className="text-purple-500">photos</span>
                  <span className="block text-gray-400 text-sm font-normal">
                    Upload photos you think are relevant to the review.
                  </span>
                </p>

                {/* Simple File Upload */}
                <div className="flex flex-col gap-4">
                  {/* File Input */}
                  <div className="relative">
                    <input
                      type="file"
                      id="photo-upload"
                      multiple
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer p-8 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors"
                    >
                      <div className="text-center">
                        <span className="inline-flex justify-center items-center size-12 mb-4">
                          <svg
                            className="shrink-0 w-12 h-auto text-purple-600"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                            <circle cx="12" cy="13" r="3"></circle>
                          </svg>
                        </span>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </div>
                        <p className="mt-1 text-xs text-gray-400">
                          PNG, JPG, WEBP up to 5MB each
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Photo Previews */}
                  {selectedFiles.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-auto object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleFileRemove(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                            {file.name.length > 15
                              ? `${file.name.substring(0, 15)}...`
                              : file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* End Second Content */}

            {/* First Content */}
            <div
              data-hs-stepper-content-item='{
        "index": 3
      }'
              style={{ display: "none" }}
            >
              <div className="p-4 h-auto flex flex-col items-stretch gap-4">
                <p className="text-xl font-bold text-gray-500">
                  What did you <span className="text-purple-500">order</span>?
                </p>
                {/* Input Group */}
                <div className="space-y-3 max-w-96">
                  {orderedItems.map((item, index) => (
                    <div key={index} className="relative">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const next = [...orderedItems];
                          next[index] = e.target.value;
                          setOrderedItems(next);
                        }}
                        className="py-2.5 sm:py-3 ps-4 pe-8 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none"
                        placeholder="Enter item"
                      />
                      {orderedItems.length > 1 && (
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => {
                            setOrderedItems((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                          className="inline-flex absolute top-[15px] end-2.5 text-red-400 cursor-pointer"
                        >
                          <CircleX size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <p className="mt-3 text-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (orderedItems.length < 3) {
                          setOrderedItems((prev) => [...prev, ""]);
                        }
                      }}
                      disabled={orderedItems.length >= 3}
                      className="py-1.5 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-full border border-dashed border-gray-200 bg-white text-gray-800 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <svg
                        className="shrink-0 size-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="M12 5v14"></path>
                      </svg>
                      Add Item
                    </button>
                  </p>
                </div>
                {/* End Input Group */}

                <p className="text-xl font-bold text-gray-500">
                  <span className="text-purple-500">Taste profile</span> of the
                  coffee you ordered.
                  <span className="block text-gray-400 text-sm font-normal">
                    Hey! If you know your coffee taste profile, you can help us
                    make a more accurate review. It's optional.
                  </span>
                </p>
                <div className="h-auto flex flex-col gap-4 items-start ">
                  <p className="text-md font-bold text-gray-500 align-middle">
                    Rate the <span className="text-purple-500">body</span>
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      aria-expanded="false"
                      aria-controls="bodyModal"
                      data-hs-overlay="#bodyModal"
                      className="inline-block cursor-pointer ms-1 align-middle hover:text-purple-500"
                    >
                      <CircleQuestionMark size={20} />
                    </button>
                  </p>
                  <div className="flex flex-row gap-2 items-center w-full">
                    <RangeSlider
                      min={0}
                      max={5}
                      step={1}
                      value={body}
                      onValueChange={(val) => setBody(val)}
                      className="flex-1"
                    />
                    <p className="text-md font-bold text-gray-500">{body}</p>
                  </div>
                </div>

                <div className="h-auto flex flex-col gap-4 items-start ">
                  <p className="text-md font-bold text-gray-500">
                    Rate the <span className="text-purple-500">acidity</span>
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      aria-expanded="false"
                      aria-controls="acidityModal"
                      data-hs-overlay="#acidityModal"
                      className="inline-block cursor-pointer ms-1 align-middle hover:text-purple-500"
                    >
                      <CircleQuestionMark size={20} />
                    </button>
                  </p>
                  <div className="flex flex-row gap-2 items-center w-full">
                    <RangeSlider
                      min={0}
                      max={5}
                      step={1}
                      value={acidity}
                      onValueChange={(val) => setAcidity(val)}
                      className="flex-1"
                    />
                    <p className="text-md font-bold text-gray-500">{acidity}</p>
                  </div>
                </div>

                <div className="h-auto flex flex-col gap-4 items-start ">
                  <p className="text-md font-bold text-gray-500 align-middle">
                    Rate the <span className="text-purple-500">aroma</span>
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      aria-expanded="false"
                      aria-controls="aromaModal"
                      data-hs-overlay="#aromaModal"
                      className="inline-block cursor-pointer ms-1 align-middle hover:text-purple-500"
                    >
                      <CircleQuestionMark size={20} />
                    </button>
                  </p>
                  <div className="flex flex-row gap-2 items-center w-full">
                    <RangeSlider
                      min={0}
                      max={5}
                      step={1}
                      value={aroma}
                      onValueChange={(val) => setAroma(val)}
                      className="flex-1"
                    />
                    <p className="text-md font-bold text-gray-500">{aroma}</p>
                  </div>
                </div>

                <div className="h-auto flex flex-col gap-4 items-start ">
                  <p className="text-md font-bold text-gray-500 align-middle">
                    Rate the <span className="text-purple-500">Flavour</span>
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      aria-expanded="false"
                      aria-controls="flavourModal"
                      data-hs-overlay="#flavourModal"
                      className="inline-block cursor-pointer ms-1 align-middle hover:text-purple-500"
                    >
                      <CircleQuestionMark size={20} />
                    </button>
                  </p>
                  <div className="flex flex-row gap-2 items-center w-full">
                    <RangeSlider
                      min={0}
                      max={5}
                      step={1}
                      value={flavour}
                      onValueChange={(val) => setFlavour(val)}
                      className="flex-1"
                    />
                    <p className="text-md font-bold text-gray-500">{flavour}</p>
                  </div>
                </div>

                <div className="h-auto flex flex-col gap-4 items-start ">
                  <p className="text-md font-bold text-gray-500 align-middle">
                    Rate the <span className="text-purple-500">Aftertaste</span>
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      aria-expanded="false"
                      aria-controls="aftertasteModal"
                      data-hs-overlay="#aftertasteModal"
                      className="inline-block cursor-pointer ms-1 align-middle hover:text-purple-500"
                    >
                      <CircleQuestionMark size={20} />
                    </button>
                  </p>
                  <div className="flex flex-row gap-2 items-center w-full">
                    <RangeSlider
                      min={0}
                      max={5}
                      step={1}
                      value={aftertaste}
                      onValueChange={(val) => setAftertaste(val)}
                      className="flex-1"
                    />
                    <p className="text-md font-bold text-gray-500">
                      {aftertaste}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* End First Content */}

            {/* Final Content */}
            <div
              data-hs-stepper-content-item='{
        "isFinal": true
      }'
              style={{ display: "none" }}
            >
              <div className="p-4 h-auto flex flex-col items-center gap-4 text-center">
                <p className="text-xl font-bold text-gray-700">
                  Thank you for submitting your review!
                </p>
                <p className="text-gray-500 text-sm font-normal">
                  We appreciate your feedback and will help people find the best
                  coffee shops.
                </p>
                <a
                  href={`/coffee-shops/${shop?.slug}`}
                  className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:outline-hidden focus:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft />
                  Go back to the shop
                </a>
              </div>
            </div>
            {/* End Final Content */}

            {/* Button Group */}
            <div className="mt-5 flex justify-between items-center gap-x-2">
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                data-hs-stepper-back-btn=""
              >
                <ChevronLeft />
                Back
              </button>
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:outline-hidden focus:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                data-hs-stepper-next-btn=""
              >
                Next
                <ChevronRight />
              </button>
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:outline-hidden focus:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                data-hs-stepper-finish-btn=""
                style={{ display: "none" }}
                onClick={handleSubmit}
                disabled={
                  isSubmitting || comment.trim().length === 0 || !hasAnyRating
                }
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              {/* <button
                type="reset"
                className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:outline-hidden focus:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                data-hs-stepper-reset-btn=""
                style={{ display: "none" }}
              >
                Reset
              </button> */}
            </div>
            {/* End Button Group */}
          </div>
          {/* End Stepper Content */}
        </div>
        {/* End Stepper */}
      </div>

      {/* Modals */}
      {modalConfigs.map((modal) => (
        <div
          key={modal.id}
          id={modal.id}
          className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none"
          role="dialog"
          tabIndex={-1}
          aria-labelledby={`${modal.id}-label`}
        >
          <div className="pointer-events-auto hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all md:max-w-2xl md:w-full m-3 md:mx-auto flex items-center">
            <div className="w-full max-h-full overflow-hidden flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
              <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
                <h3
                  id={`${modal.id}-label`}
                  className="font-bold text-gray-800"
                >
                  {modal.title}
                </h3>
                <button
                  type="button"
                  className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Close"
                  data-hs-overlay={`#${modal.id}`}
                >
                  <span className="sr-only">Close</span>
                  <CircleX />
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <div className="-m-1.5 overflow-hidden">
                      <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                          {modal.intro && (
                            <p className="text-gray-500 text-sm font-normal">
                              {modal.intro}
                            </p>
                          )}
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                                >
                                  Rating
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                                >
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {modal.rows.map((row) => (
                                <tr key={row.rating}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                    {row.rating}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {row.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200">
                <button
                  type="button"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  data-hs-overlay={`#${modal.id}`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
