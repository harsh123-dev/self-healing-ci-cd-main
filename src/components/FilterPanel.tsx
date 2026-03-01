import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown,
  Check 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCarStore } from "@/store/carStore";
import { categoryLabels, getCurrencySymbol, formatPriceShort } from "@/lib/formatters";

const FilterPanel = () => {
  const {
    filters,
    makes,
    categories,
    priceRange,
    setFilters,
    resetFilters,
    fetchMakes,
    fetchCategories,
    fetchPriceRange,
  } = useCarStore();

  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 0]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState<"INR" | "USD" | "EUR">("INR");

  useEffect(() => {
    fetchMakes();
    fetchCategories();
    fetchPriceRange(activeCurrency);
  }, []);

  useEffect(() => {
    fetchPriceRange(activeCurrency);
    setFilters({ currency: activeCurrency, minPrice: undefined, maxPrice: undefined });
  }, [activeCurrency]);

  useEffect(() => {
    if (priceRange.min !== 0 || priceRange.max !== 0) {
      setLocalPriceRange([priceRange.min, priceRange.max]);
    }
  }, [priceRange]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search: searchInput || undefined });
  };

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]]);
  };

  const applyPriceFilter = () => {
    setFilters({ 
      minPrice: localPriceRange[0], 
      maxPrice: localPriceRange[1] 
    });
  };

  const toggleMake = (make: string) => {
    const currentMakes = filters.make || [];
    const newMakes = currentMakes.includes(make)
      ? currentMakes.filter((m) => m !== make)
      : [...currentMakes, make];
    setFilters({ make: newMakes.length > 0 ? newMakes : undefined });
  };

  const toggleCategory = (category: string) => {
    const currentCategories = filters.category || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];
    setFilters({ category: newCategories.length > 0 ? newCategories : undefined });
  };

  const activeFilterCount = [
    filters.make?.length,
    filters.category?.length,
    filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0,
    filters.search ? 1 : 0,
  ].reduce((sum, count) => sum + (count || 0), 0);

  const sortOptions = [
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "year_desc", label: "Year: Newest First" },
    { value: "year_asc", label: "Year: Oldest First" },
  ];

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search cars..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 bg-card border-border/50"
            />
          </div>
          <Button type="submit" variant="outline" size="icon">
            <Search className="w-4 h-4" />
          </Button>
        </form>

        <div className="flex gap-2">
          <Select
            value={filters.sort}
            onValueChange={(value: any) => setFilters({ sort: value })}
          >
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={isFiltersOpen ? "filterActive" : "filter"}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-1 px-1.5 py-0 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {activeFilterCount > 0 && (
            <Button variant="ghost" size="icon" onClick={resetFilters}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="glass-card rounded-xl p-4 space-y-6">
              {/* Currency Toggle */}
              <div>
                <label className="text-sm font-medium mb-2 block text-muted-foreground">
                  Currency
                </label>
                <div className="flex gap-2">
                  {(["INR", "USD", "EUR"] as const).map((currency) => (
                    <Button
                      key={currency}
                      variant={activeCurrency === currency ? "filterActive" : "filter"}
                      size="sm"
                      onClick={() => setActiveCurrency(currency)}
                    >
                      {getCurrencySymbol(currency)} {currency}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-muted-foreground">
                    Price Range
                  </label>
                  <span className="text-sm text-primary">
                    {formatPriceShort(localPriceRange[0], activeCurrency)} - {formatPriceShort(localPriceRange[1], activeCurrency)}
                  </span>
                </div>
                <Slider
                  value={localPriceRange}
                  min={priceRange.min}
                  max={priceRange.max}
                  step={Math.floor((priceRange.max - priceRange.min) / 100)}
                  onValueChange={handlePriceChange}
                  onValueCommit={applyPriceFilter}
                  className="mb-2"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-medium mb-2 block text-muted-foreground">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={filters.category?.includes(category) ? "filterActive" : "filter"}
                      size="sm"
                      onClick={() => toggleCategory(category)}
                      className="gap-1"
                    >
                      {filters.category?.includes(category) && (
                        <Check className="w-3 h-3" />
                      )}
                      {categoryLabels[category] || category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Makes */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <span>Brands ({makes.length})</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {makes.map(({ make, count }) => (
                      <Button
                        key={make}
                        variant={filters.make?.includes(make) ? "filterActive" : "filter"}
                        size="sm"
                        onClick={() => toggleMake(make)}
                        className="gap-1"
                      >
                        {filters.make?.includes(make) && (
                          <Check className="w-3 h-3" />
                        )}
                        {make}
                        <span className="text-xs opacity-60">({count})</span>
                      </Button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="filter-tag gap-1">
              Search: "{filters.search}"
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setSearchInput("");
                  setFilters({ search: undefined });
                }}
              />
            </Badge>
          )}
          {filters.make?.map((make) => (
            <Badge key={make} variant="secondary" className="filter-tag gap-1">
              {make}
              <X className="w-3 h-3 cursor-pointer" onClick={() => toggleMake(make)} />
            </Badge>
          ))}
          {filters.category?.map((cat) => (
            <Badge key={cat} variant="secondary" className="filter-tag gap-1">
              {categoryLabels[cat] || cat}
              <X className="w-3 h-3 cursor-pointer" onClick={() => toggleCategory(cat)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
