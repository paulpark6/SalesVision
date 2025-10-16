
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  value?: Date;
  onSelect?: (date?: Date) => void;
  disabled?: boolean;
};

export function DatePicker({ value, onSelect, disabled = false }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  React.useEffect(() => {
    if (disabled && isOpen) {
      setIsOpen(false);
    }
  }, [disabled, isOpen]);

  const handleSelect = (selectedDate?: Date) => {
    if (disabled) {
      return;
    }
    setDate(selectedDate);
    if (onSelect) {
      onSelect(selectedDate);
    }
    setIsOpen(false); // Close popover on select
  }

  const handleOpenChange = (open: boolean) => {
    if (!disabled) {
      setIsOpen(open);
    }
  };

  return (
    <Popover open={disabled ? false : isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
