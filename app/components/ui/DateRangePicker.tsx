"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/app/lib/utils"
import { Button } from "@/app/components/ui/button"
import { Calendar } from "@/app/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/components/ui/popover"
// Import default styles to fix layout structure immediately for v9
import "react-day-picker/style.css";

interface DateRangePickerProps {
    onChange: (range: DateRange | undefined) => void;
    initialRange?: DateRange;
    disabled?: boolean;
    className?: string;
}

export default function DateRangePicker({
    className,
    onChange,
    initialRange,
    disabled,
}: DateRangePickerProps) {
    const [date, setDate] = React.useState<DateRange | undefined>(
        initialRange || {
            from: new Date(),
            to: addDays(new Date(), 20),
        })

    React.useEffect(() => {
        if (initialRange) {
            setDate(initialRange)
        }
    }, [initialRange])

    const handleSelect = (selectedDate: DateRange | undefined) => {
        setDate(selectedDate)
        onChange(selectedDate)
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        id="date"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-start text-left font-normal flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d94333] focus:border-transparent transition-all hover:bg-gray-50",
                            !date && "text-muted-foreground",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 text-[#d94333]" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
