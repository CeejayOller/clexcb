/* eslint-disable @next/next/no-img-element */
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F1729] py-4 px-6 w-full sm:fixed  bottom-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-white/80">
        <p className="text-center md:text-left">
          © 2024 Cloud Express Customs Brokerage. All rights Reserved.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 text-center">
          <a href="/privacy-policy">Privacy Policy</a>
          <span className="hidden sm:inline text-white/60">|</span>
          <a href="/terms-and-conditions">Terms and Conditions</a>
          <span className="hidden sm:inline text-white/60">|</span>
          <a href="/fraud-prevention">Fraud Prevention</a>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <a href="#" aria-label="Facebook">
            <img
              src="/socials/facebook.svg"
              alt="Facebook"
              className="w-5 h-5 opacity-80 hover:opacity-100"
            />
          </a>
          <a href="#" aria-label="Instagram">
            <img
              src="/socials/instagram.svg"
              alt="Instagram"
              className="w-5 h-5 opacity-80 hover:opacity-100"
            />
          </a>
          <a href="#" aria-label="Twitter">
            <img
              src="/socials/x.svg"
              alt="Twitter"
              className="w-5 h-5 opacity-80 hover:opacity-100"
            />
          </a>
          <a href="#" aria-label="TikTok">
            <img
              src="/socials/tiktok.svg"
              alt="TikTok"
              className="w-5 h-5 opacity-80 hover:opacity-100"
            />
          </a>
          <a href="#" aria-label="LinkedIn">
            <img
              src="/socials/linkedin.svg"
              alt="LinkedIn"
              className="w-5 h-5 opacity-80 hover:opacity-100"
            />
          </a>
          <a href="#" aria-label="YouTube">
            <img
              src="/socials/youtube.svg"
              alt="YouTube"
              className="w-5 h-5 opacity-80 hover:opacity-100"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
