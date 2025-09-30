"use client";

import { X } from "lucide-react";

interface CountrySiteProps {
  country: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CountrySite({
  country,
  isOpen,
  onClose,
}: CountrySiteProps) {
  if (!isOpen || !country) return null;

  // Format the country name for the URL (lowercase, replace spaces with hyphens)
  const formattedCountry = country.toLowerCase().replace(/\s+/g, "-");
  const travelUrl = `https://travel.gc.ca/destinations/${formattedCountry}`;

  return (
    <div className="fixed top-0 right-0 h-full w-2/5 bg-white/50 backdrop-blur-md shadow-2xl z-50 border-l border-black rounded-tl-4xl rounded-bl-4xl font-[family-name:var(--font-geist-mono)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-black bg-white/50 rounded-tl-4xl">
        <h2 className="text-xl font-semibold text-gray-800">
          Travel Advisory - {country}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors border-1 border-black"
          aria-label="Close"
        >
          <X size={20} className="text-black" />
        </button>
      </div>

      {/* Iframe Container */}
      <div className="h-full pb-16 rounded-bl-4xl">
        <iframe
          src={travelUrl}
          className="w-full h-full border-0 rounded-bl-4xl"
          title={`Travel Advisory for ${country}`}
          loading="lazy"
        />
      </div>
    </div>
  );
}
