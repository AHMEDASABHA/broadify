"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "./form";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  className?: string;
  placeholder?: string;
  isItForm: boolean;
}

export function DatePicker({
  value,
  onChange,
  className,
  placeholder,
  isItForm = false,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {isItForm ? (
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-[200px] pl-3 text-left font-normal",
                !value && "text-muted-foreground",
                className
              )}
            >
              {value ? (
                format(value, "PPP")
              ) : (
                <span>{placeholder || "Pick a date"}</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        ) : (
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] pl-3 text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
          >
            {value ? (
              format(value, "PPP")
            ) : (
              <span>{placeholder || "Pick a date"}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Calendar
          mode="single"
          required
          selected={value}
          onSelect={onChange}
          disabled={(date) => date < new Date("1900-01-01")}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
