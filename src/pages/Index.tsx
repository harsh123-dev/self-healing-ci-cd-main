import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Sparkles, Car } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { useCarStore } from "@/store/carStore";

const Index = () => {
  const { cars, fetchCars } = useCarStore();

  useEffect(() => {
    fetchCars();
  }, []);

  const featuredCars = cars.filter(c => c.gltfModelUrl).slice(0, 4);
  const evCars = cars.filter(c => c.category === 'ev').slice(0, 4);

  const features = [
    {
      icon: Sparkles,
      title: "Interactive 3D Viewing",
      description: "Explore every angle with our immersive 3D car viewer. Rotate, zoom, and inspect details like never before.",
    },
    {
      icon: Zap,
      title: "Electric Future",
      description: "Discover our extensive collection of EVs from leading manufacturers worldwide.",
    },
    {
      icon: Shield,
      title: "Verified Sellers",
      description: "Every listing is verified. Buy with confidence from trusted dealerships and private sellers.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-gradient">Velocity Motors</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the future of car shopping with cutting-edge technology and a curated selection.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl text-center glow-hover"
              >
                <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured 3D Cars Section */}
      {featuredCars.length > 0 && (
        <section className="py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
            >
              <div>
                <p className="text-primary font-medium mb-2">Featured Collection</p>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Cars with 3D Viewing
                </h2>
              </div>
              <Link to="/cars">
                <Button variant="outline" className="group">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCars.map((car, index) => (
                <CarCard key={car.id} car={car} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Electric Vehicles Section */}
      {evCars.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
            >
              <div>
                <p className="text-primary font-medium mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Electric Future
                </p>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Electric Vehicles
                </h2>
              </div>
              <Link to="/cars?category=ev">
                <Button variant="outline" className="group">
                  View All EVs
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {evCars.map((car, index) => (
                <CarCard key={car.id} car={car} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-6">
              <Car className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Find Your <span className="text-gradient">Dream Car</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Browse our complete collection of premium vehicles with advanced filtering and 3D viewing capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cars">
                <Button variant="hero" size="xl" className="pulse-glow">
                  Browse Collection
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline" size="xl">
                  Admin Panel
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
