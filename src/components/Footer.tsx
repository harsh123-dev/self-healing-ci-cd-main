import { Link } from "react-router-dom";
import { Car, Github, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    explore: [
      { label: "All Cars", to: "/cars" },
      { label: "Electric Vehicles", to: "/cars?category=ev" },
      { label: "Luxury Cars", to: "/cars?category=luxury" },
      { label: "Sports Cars", to: "/cars?category=sports" },
    ],
    brands: [
      { label: "Tesla", to: "/cars?make=Tesla" },
      { label: "BMW", to: "/cars?make=BMW" },
      { label: "Ferrari", to: "/cars?make=Ferrari" },
      { label: "Porsche", to: "/cars?make=Porsche" },
    ],
  };

  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-lg font-bold">Velocity</span>
                <span className="text-lg font-bold text-primary">Motors</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Your premium destination for discovering and exploring the world's finest automobiles in stunning 3D.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Github, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg bg-secondary hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Explore
            </h4>
            <ul className="space-y-3">
              {links.explore.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Popular Brands
            </h4>
            <ul className="space-y-3">
              {links.brands.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Stay Updated
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get notified about new arrivals and exclusive offers.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="flex-1 px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Velocity Motors. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
