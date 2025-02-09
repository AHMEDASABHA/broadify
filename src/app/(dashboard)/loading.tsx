import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="flex justify-center items-center h-full">
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  );
}
