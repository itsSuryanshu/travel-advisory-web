"use client";

import { useState } from "react";
import { Search as SearchIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ParsedData {
  Country: string;
  "Risk Level": string;
  Description: string;
  "Last Updated": string;
}

interface SearchProps {
  data: ParsedData[];
  onCountrySelect: (country: string | null) => void;
}

export default function Search({ data, onCountrySelect }: SearchProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const selectedCountry = data.find((country) => country.Country === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[150px] h-8 border-gray-700 justify-between rounded-full"
        >
          {selectedCountry ? selectedCountry.Country : "Search"}
          <SearchIcon className="ml-2 h-4 w-4 shrink-0 text-black opacity-75" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search by name..." />
          <CommandEmpty>No countries found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {data.map((country) => (
                <CommandItem
                  key={country.Country}
                  value={country.Country}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    onCountrySelect(newValue || null);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={`mr-2 h-4 w-4 ${
                      value === country.Country ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {country.Country}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
