"use client"

import * as React from "react"
import { parseISO } from "date-fns"
import { th } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const TH_TZ = "Asia/Bangkok"

function toThaiDate(isoString: string): Date {
  const d = parseISO(isoString)
  return d
}

function toISODateString(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TH_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  return formatter.format(date)
}

function formatDisplayDate(date: Date, locale?: "th" | "en"): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "th-TH", {
    timeZone: TH_TZ,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

type DatePickerProps = {
  value?: string
  onChange?: (isoDate: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  locale?: "th" | "en"
  className?: string
  fromDate?: Date
  toDate?: Date
}

export function DatePicker({
  value,
  onChange,
  placeholder = "เลือกวันที่",
  disabled = false,
  locale = "th",
  className,
  fromDate,
  toDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const selected = value ? toThaiDate(value) : undefined

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange?.(toISODateString(date))
    } else {
      onChange?.(undefined)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {selected ? formatDisplayDate(selected, locale) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          locale={locale === "th" ? th : undefined}
          fromDate={fromDate}
          toDate={toDate}
          captionLayout="dropdown"
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
