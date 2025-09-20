
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
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
import { Button } from "./button"

type ComboboxProps = {
    items: { value: string; label: string }[];
    placeholder: string;
    searchPlaceholder: string;
    noResultsMessage: string;
    value: string;
    onValueChange: (value: string) => void;
    onAddNew?: (newItem: string) => void;
}

export function Combobox({ items, placeholder, searchPlaceholder, noResultsMessage, value, onValueChange, onAddNew }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredItems = items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

  const showAddNew = onAddNew && searchQuery && !items.some(item => item.label.toLowerCase() === searchQuery.toLowerCase());

  // When the popover opens, if there's an existing value, we want the search to be empty
  // to show all options. But if the user starts typing, we use their query.
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
        setSearchQuery('');
    }
  }
  
  const displayValue = value || placeholder;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
        >
            <span className="truncate">
                {value ? items.find(item => item.label.toLowerCase() === value.toLowerCase())?.label : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {filteredItems.length === 0 && !showAddNew && (
                <CommandEmpty>{noResultsMessage}</CommandEmpty>
            )}
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setSearchQuery('');
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
              {showAddNew && (
                <CommandItem
                    onSelect={() => {
                        onAddNew(searchQuery);
                        setSearchQuery('');
                        setOpen(false);
                    }}
                    className="text-primary hover:!bg-primary/10"
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add "{searchQuery}"
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
