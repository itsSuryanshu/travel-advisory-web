"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  //DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface ParsedData {
  Country: string;
  "Risk Level": string;
  Description: string;
  "Last Updated": string;
}

interface DrawerProps {
  data: ParsedData[];
}

const CountryBox = ({
  name,
  risk,
  description,
}: {
  name: string;
  risk: string;
  description: string;
}) => {
  const colorGuide: Record<string, string> = {
    "normal-precautions": "#75ef75",
    "increased-caution": "#e2e65b",
    "reconsider-travel": "#ff7d3c",
    "do-not-travel": "#d42e2e",
  };
  return (
    <div
      className="flex flex-col items-start gap-2 font-mono p-4 h-[150px] rounded-xl border border-black backdrop-blur-md"
      style={{ backgroundColor: colorGuide[risk] }}
    >
      <span className="font-bold text-lg">{name}</span>
      <div className="font-medium text-sm">{risk}</div>
      <p className="font-normal text-sm">{description}</p>
    </div>
  );
};

export default function Search({ data }: DrawerProps) {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="justify-between gap-2 w-[100px] h-8 rounded-full border-gray-700 bg-white/50 backdrop-blur-md"
        >
          Gallery
          {open === false ? <ChevronRight /> : <ChevronDown />}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col h-full bg-white/80 backdrop-blur-sm outline-black">
        {/* Header */}
        <div className="flex-shrink-0 font-mono text-2xl italic underline mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle>Country Gallery</DrawerTitle>
          </DrawerHeader>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 w-full min-h-0">
          <div className="flex flex-wrap gap-4 justify-center py-4">
            {data.map((d) => (
              <div key={d.Country} className="flex-shrink-0 w-80">
                <CountryBox
                  name={d.Country}
                  risk={d["Risk Level"]}
                  description={d.Description}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="flex-shrink-0 font-mono text-md mx-auto w-full">
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="border-black rounded-full">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
