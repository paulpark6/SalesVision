
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

type ComboboxProps = {
    items: { value: string; label: string }[];
    placeholder: string;
    searchPlaceholder: string;
    noResultsMessage: string;
    value: string;
    onValueChange: (value: string) => void;
}

export function Combobox({ items, placeholder, searchPlaceholder, noResultsMessage, value, onValueChange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
         <div className="relative w-full">
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                onClick={() => setOpen(true)}
                className="w-full"
            />
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-2 top-1/2 -translate-y-1/2" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command filter={(value, search) => {
            const item = items.find(i => i.value === value);
            if (item?.label.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
        }}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{noResultsMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    const selectedItem = items.find(i => i.value === currentValue);
                    onValueChange(selectedItem ? selectedItem.label : "")
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.toLowerCase() === item.label.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
