"use client"
 
import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker"

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (dates: { startDate: Date | null; endDate: Date | null }) => void;
}

export default function DateRangePicker({ className, onDateChange }: DateRangePickerProps) {
    const [value, setValue] = React.useState<DateValueType>({ 
        startDate: null, 
        endDate: null
    });

    const handleValueChange = (newValue: DateValueType) => {
        if (newValue) {
            setValue(newValue);
            if (onDateChange) {
                onDateChange({
                    startDate: newValue.startDate ? new Date(newValue.startDate) : null,
                    endDate: newValue.endDate ? new Date(newValue.endDate) : null
                });
            }
        }
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Datepicker 
                value={value} 
                onChange={handleValueChange}
                showShortcuts={true}
                primaryColor="blue" 
                inputClassName="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            /> 
        </div>
    );
}
