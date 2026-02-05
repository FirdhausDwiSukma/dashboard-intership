"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/app/lib/utils"
// Removed Button import as it's not available
import { Calendar } from "@/app/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/components/ui/popover"

interface DatePickerProps {
    date?: Date
    setDate: (date?: Date) => void
    placeholder?: string
}

export function DatePicker({ date, setDate, placeholder = "Pick a date" }: DatePickerProps) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    const [tempDate, setTempDate] = React.useState<Date | undefined>(date)

    // Sync internal state when prop changes
    React.useEffect(() => {
        setTempDate(date)
        if (date) {
            setInputValue(format(date, "MM/dd/yyyy"))
        } else {
            setInputValue("")
        }
    }, [date])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        const parsedDate = parse(e.target.value, "MM/dd/yyyy", new Date())
        if (isValid(parsedDate)) {
            setTempDate(parsedDate)
        }
    }

    const handleDaySelect = (selected: Date | undefined) => {
        setTempDate(selected)
        if (selected) {
            setInputValue(format(selected, "MM/dd/yyyy"))
        } else {
            setInputValue("")
        }
    }

    const handleToday = () => {
        const today = new Date()
        setTempDate(today)
        setInputValue(format(today, "MM/dd/yyyy"))
    }

    const handleApply = () => {
        setDate(tempDate)
        setOpen(false)
    }

    const handleCancel = () => {
        setTempDate(date)
        if (date) {
            setInputValue(format(date, "MM/dd/yyyy"))
        } else {
            setInputValue("")
        }
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        "w-full justify-start text-left font-normal flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>{placeholder}</span>}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700" align="start">
                {/* Header: Input + Today Button */}
                <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="M / D / YYYY"
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={handleToday}
                        className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Today
                    </button>
                </div>

                <Calendar
                    mode="single"
                    selected={tempDate}
                    onSelect={handleDaySelect}
                    initialFocus
                    classNames={{
                        day_selected: "bg-[#7c3aed] text-white hover:bg-[#7c3aed] hover:text-white focus:bg-[#7c3aed] focus:text-white rounded-full", // Purple color approximately matching image
                        day_today: "bg-gray-100 text-gray-900",
                    }}
                />

                {/* Footer: Cancel + Apply */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#7c3aed] rounded-lg hover:bg-[#6d28d9] transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
