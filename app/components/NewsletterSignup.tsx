"use client";
import React from "react";
import Script from "next/script";

const NewsletterSignup = () => {
  return (
    <>
      <Script
        src="/scripts/mailerlite.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.ml) {
            window.ml("account", "1788630");
          }
        }}
      />
      <div className="ml-embedded" data-form="qSEXqM"></div>
    </>
  );
};

export default NewsletterSignup;
