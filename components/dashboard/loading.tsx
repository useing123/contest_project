
// components/dashboard/loading.tsx
export default function Loading() {
    return (
      <div className="w-full space-y-3">
        <div className="h-10 bg-white/5 animate-pulse rounded-md"></div>
        <div className="h-64 bg-white/5 animate-pulse rounded-md"></div>
      </div>
    );
  }