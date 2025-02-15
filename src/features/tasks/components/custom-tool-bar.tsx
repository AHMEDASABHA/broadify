import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface CustomToolbarProps {
  date: string | Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}

export function CustomToolbar({ date, onNavigate }: CustomToolbarProps) {
  return (
    <div className="flex mb-4 gap-2 items-center w-full lg:w-auto justify-center lg:justify-start">
      <Button
        variant="ghost"
        size="icon"
        className="flex items-center"
        onClick={() => onNavigate("PREV")}
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div className="flex items-center border border-input rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto">
        <CalendarIcon className="size-4 mr-2" />
        <p className="text-sm font-medium">{format(date, "MMMM yyyy")}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="flex items-center"
        onClick={() => onNavigate("NEXT")}
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}
