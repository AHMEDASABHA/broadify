import { differenceInDays, format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskDateProps {
  value: string;
  className?: string;
}

export function TaskDate({ value, className }: TaskDateProps) {
  const today = new Date();
  const endDate = new Date(value);
  const diffInDays = differenceInDays(today, endDate);

  let textColor = "text-muted-foreground";
  if (diffInDays <= 3) {
    textColor = "text-red-500";
  } else if (diffInDays <= 7) {
    textColor = "text-orange-500";
  } else if (diffInDays <= 14) {
    textColor = "text-yellow-500";
  }
  // const formattedDate = format(endDate, "MMM d, yyyy");

  return (
    <div className={cn(textColor)}>
      <span className={cn("truncate", className)}>{format(value, "PPP")}</span>
    </div>
  );
}
