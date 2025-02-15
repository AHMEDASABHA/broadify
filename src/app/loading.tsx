import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Skeleton className="h-10 w-40 rounded-md mb-4" />
      <Skeleton className="h-6 w-60 rounded-md mb-2" />
      <Skeleton className="h-6 w-80 rounded-md mb-2" />
      <Skeleton className="h-6 w-72 rounded-md mb-2" />
      <Skeleton className="h-6 w-64 rounded-md mb-2" />
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  );
}
