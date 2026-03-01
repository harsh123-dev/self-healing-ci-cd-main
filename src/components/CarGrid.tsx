import { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Car as CarIcon } from "lucide-react";
import { useCarStore } from "@/store/carStore";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";

const CarGrid = () => {
  const { cars, loading, error, pagination, fetchCars, setPage } = useCarStore();

  useEffect(() => {
    fetchCars();
  }, []);

  if (loading && cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading cars...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-10 h-10 text-destructive mb-4" />
        <p className="text-destructive mb-2">Error loading cars</p>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => fetchCars()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="p-4 rounded-full bg-muted mb-4">
          <CarIcon className="w-10 h-10 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium mb-2">No cars found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="text-foreground font-medium">{cars.length}</span> of{" "}
          <span className="text-foreground font-medium">{pagination.total}</span> cars
        </p>
        {loading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cars.map((car, index) => (
          <CarCard key={car.id} car={car} index={index} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 pt-8"
        >
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === 1}
            onClick={() => setPage(pagination.page - 1)}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum: number;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={pagination.page === pageNum ? "filterActive" : "ghost"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className="w-9"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => setPage(pagination.page + 1)}
          >
            Next
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default CarGrid;
