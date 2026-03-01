import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Zap, Gauge, Settings2 } from "lucide-react";
import { Car } from "@/types/car";
import { formatPriceShort, getCategoryLabel } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";

interface CarCardProps {
  car: Car;
  index?: number;
}

const CarCard = ({ car, index = 0 }: CarCardProps) => {
  const hasModel = !!car.gltfModelUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link to={`/cars/${car.id}`}>
        <div className="relative rounded-xl overflow-hidden glass-card glow-hover transition-all duration-300 group-hover:-translate-y-1">
          {/* Image container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
            <img
              src={car.thumbnail}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            
            {/* 3D badge */}
            {hasModel && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary/90 text-primary-foreground border-0 gap-1">
                  <Zap className="w-3 h-3" />
                  3D View
                </Badge>
              </div>
            )}

            {/* Category badge */}
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="category-chip">
                {getCategoryLabel(car.category)}
              </Badge>
            </div>

            {/* View button on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="p-3 rounded-full bg-primary/90 text-primary-foreground shadow-glow">
                <Eye className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Make and Model */}
            <div className="mb-2">
              <p className="text-sm text-muted-foreground">{car.make}</p>
              <h3 className="text-lg font-bold truncate">{car.model}</h3>
            </div>

            {/* Specs row */}
            <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Gauge className="w-3 h-3" />
                {car.power}
              </span>
              <span className="flex items-center gap-1">
                <Settings2 className="w-3 h-3" />
                {car.transmission === "auto" ? "Automatic" : "Manual"}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{car.year}</span>
              <span className="price-badge px-3 py-1 rounded-full text-sm">
                {formatPriceShort(car.price, car.currency)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CarCard;
