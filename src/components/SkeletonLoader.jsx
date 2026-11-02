export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-64 bg-gray-200" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-4 bg-gray-200 rounded w-3/4" />

        {/* Category */}
        <div className="h-3 bg-gray-200 rounded w-1/2" />

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-8 bg-gray-200 rounded" />
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 w-16 bg-gray-200 rounded" />
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text content */}
          <div className="flex-1 space-y-6">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded w-full" />
              <div className="h-10 bg-gray-200 rounded w-3/4" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
            <div className="h-12 bg-gray-200 rounded-full w-40" />
          </div>

          {/* Image placeholder */}
          <div className="flex-1">
            <div className="w-full h-80 lg:h-[480px] bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
