import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterPanel from "@/components/FilterPanel";
import CarGrid from "@/components/CarGrid";
import { useCarStore } from "@/store/carStore";

const CarsPage = () => {
  const [searchParams] = useSearchParams();
  const { setFilters } = useCarStore();

  // Apply URL params as initial filters
  useEffect(() => {
    const search = searchParams.get("search");
    const make = searchParams.get("make");
    const category = searchParams.get("category");

    const urlFilters: any = {};
    if (search) urlFilters.search = search;
    if (make) urlFilters.make = make.split(",");
    if (category) urlFilters.category = category.split(",");

    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 md:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Browse Our Collection
            </h1>
            <p className="text-muted-foreground">
              Discover premium vehicles from around the world
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <FilterPanel />
          </motion.div>

          {/* Car Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CarGrid />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarsPage;
