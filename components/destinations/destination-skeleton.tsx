
// components/destinations/destination-skeleton.tsx
export default function DestinationSkeleton() {
    return (
      <div className="bg-space-dark/50 rounded-xl overflow-hidden border border-space-light/10 animate-pulse">
        <div className="h-64 bg-white/5"></div>
        <div className="p-6">
          <div className="h-8 bg-white/5 rounded-md mb-3 w-3/4"></div>
          <div className="h-4 bg-white/5 rounded-md mb-2 w-full"></div>
          <div className="h-4 bg-white/5 rounded-md mb-2 w-full"></div>
          <div className="h-4 bg-white/5 rounded-md mb-5 w-2/3"></div>
          <div className="flex items-center justify-between mb-5">
            <div className="h-4 bg-white/5 rounded-md w-1/3"></div>
            <div className="h-4 bg-white/5 rounded-md w-1/3"></div>
          </div>
          <div className="h-10 bg-white/5 rounded-md w-full"></div>
        </div>
      </div>
    );
  }
  