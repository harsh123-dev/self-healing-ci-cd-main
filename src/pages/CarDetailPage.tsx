import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Gauge,
  Settings2,
  Fuel,
  Calendar,
  MapPin,
  Building2,
  Phone,
  MessageCircle,
  Heart,
  Share2,
  Zap,
  Check,
  Loader2,
  AlertCircle,
  Box,
  Image as ImageIcon,
} from "lucide-react";
import { useCarStore } from "@/store/carStore";
import { formatPrice, getCategoryLabel } from "@/lib/formatters";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModelViewer from "@/components/ModelViewer";
import ImageGallery from "@/components/ImageGallery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CarDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedCar, loading, error, fetchCarById, clearSelectedCar } = useCarStore();
  const [viewMode, setViewMode] = useState<"3d" | "gallery">("gallery");

  useEffect(() => {
    if (id) {
      fetchCarById(id);
    }
    return () => clearSelectedCar();
  }, [id]);

  useEffect(() => {
    // Default to 3D view if model available
    if (selectedCar?.gltfModelUrl) {
      setViewMode("3d");
    }
  }, [selectedCar]);

  const handleContactSeller = () => {
    console.log({ event: "contact_seller_clicked", carId: id });
    alert("Contact form would open here. This is a demo!");
  };

  const handleTestDrive = () => {
    console.log({ event: "test_drive_requested", carId: id });
    alert("Test drive booking would open here. This is a demo!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading car details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedCar) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Car not found</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate("/cars")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to listings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const car = selectedCar;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 md:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
          >
            <Link to="/cars" className="hover:text-foreground transition-colors">
              Cars
            </Link>
            <span>/</span>
            <Link
              to={`/cars?make=${car.make}`}
              className="hover:text-foreground transition-colors"
            >
              {car.make}
            </Link>
            <span>/</span>
            <span className="text-foreground">{car.model}</span>
          </motion.div>

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left column - Media */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              {/* View mode toggle */}
              {car.gltfModelUrl && (
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "3d" ? "filterActive" : "filter"}
                    size="sm"
                    onClick={() => setViewMode("3d")}
                    className="gap-2"
                  >
                    <Box className="w-4 h-4" />
                    3D View
                  </Button>
                  <Button
                    variant={viewMode === "gallery" ? "filterActive" : "filter"}
                    size="sm"
                    onClick={() => setViewMode("gallery")}
                    className="gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Photos
                  </Button>
                </div>
              )}

              {/* Media viewer */}
              {viewMode === "3d" && car.gltfModelUrl ? (
                <ModelViewer
                  modelUrl={car.gltfModelUrl}
                  alt={`${car.make} ${car.model} 3D model`}
                  posterImage={car.thumbnail}
                />
              ) : (
                <ImageGallery
                  images={car.images}
                  alt={`${car.make} ${car.model}`}
                />
              )}
            </motion.div>

            {/* Right column - Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Title and badges */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="category-chip">
                    {getCategoryLabel(car.category)}
                  </Badge>
                  {car.gltfModelUrl && (
                    <Badge className="bg-primary/90 text-primary-foreground border-0 gap-1">
                      <Zap className="w-3 h-3" />
                      3D Available
                    </Badge>
                  )}
                  <Badge variant="outline">{car.year}</Badge>
                </div>
                <p className="text-lg text-muted-foreground">{car.make}</p>
                <h1 className="text-4xl md:text-5xl font-bold">{car.model}</h1>
              </div>

              {/* Price */}
              <div className="glass-card p-6 rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="text-3xl md:text-4xl font-bold text-gradient">
                  {formatPrice(car.price, car.currency)}
                </p>
              </div>

              {/* Quick specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Gauge, label: "Power", value: car.power },
                  { icon: Settings2, label: "Transmission", value: car.transmission === "auto" ? "Automatic" : "Manual" },
                  { icon: Fuel, label: "Mileage", value: car.mileage },
                  { icon: Calendar, label: "Year", value: car.year.toString() },
                ].map((spec) => (
                  <div key={spec.label} className="glass-card p-4 rounded-lg text-center">
                    <spec.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground">{spec.label}</p>
                    <p className="text-sm font-medium">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">About this car</h3>
                <p className="text-muted-foreground">{car.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="gap-1">
                      <Check className="w-3 h-3 text-primary" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Seller info */}
              <div className="glass-card p-4 rounded-xl">
                <h3 className="text-lg font-semibold mb-3">Seller</h3>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-secondary">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{car.seller.company}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {car.seller.location}
                    </p>
                    {car.seller.is_small_brand && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Independent Seller
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  onClick={handleTestDrive}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Request Test Drive
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleContactSeller}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Seller
                </Button>
              </div>

              {/* Secondary actions */}
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="w-4 h-4" />
                  Save
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarDetailPage;
