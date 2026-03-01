import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Menu, X, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/cars", label: "Browse Cars" },
    { to: "/admin", label: "Admin" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card border-b border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="p-2 rounded-lg bg-primary/10 border border-primary/20"
              >
                <Car className="w-6 h-6 text-primary" />
              </motion.div>
              <div>
                <span className="text-xl font-bold tracking-tight">
                  Velocity
                </span>
                <span className="text-xl font-bold text-primary">Motors</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant={isActive(link.to) ? "filterActive" : "ghost"}
                    className="px-4"
                  >
                    {link.to === "/admin" && <Settings className="w-4 h-4 mr-1" />}
                    {link.label}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/cars">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </Link>
              <Link to="/cars">
                <Button variant="hero" size="sm">
                  View Collection
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden glass-card border-t border-border/30"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
              >
                <Button
                  variant={isActive(link.to) ? "filterActive" : "ghost"}
                  className="w-full justify-start"
                >
                  {link.to === "/admin" && <Settings className="w-4 h-4 mr-2" />}
                  {link.label}
                </Button>
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              <Link to="/cars" onClick={() => setIsMenuOpen(false)}>
                <Button variant="hero" className="w-full">
                  View Collection
                </Button>
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
