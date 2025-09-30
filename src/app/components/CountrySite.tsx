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

  return (
    <div className="w-full my-20">
      <div>
        <iframe></iframe>
      </div>
    </div>
  );
}
