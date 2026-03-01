import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Check,
  X,
  AlertCircle,
  LogIn,
  LogOut,
  Car,
  Settings,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCarStore } from "@/store/carStore";
import { Car as CarType } from "@/types/car";
import { formatPriceShort, getCategoryLabel } from "@/lib/formatters";

const useAuth = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    if (token) {
      setUser({ username: "admin" }); // simple decode substitute
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch("http://13.204.159.55:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser({ username });
      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return {
    isLoggedIn: !!token,
    user,
    login,
    logout,
    token,
  };
};


// Empty car template
const emptyCarForm: Omit<CarType, "id" | "createdAt" | "updatedAt"> = {
  make: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  currency: "INR",
  category: "sedan",
  mileage: "",
  power: "",
  transmission: "auto",
  images: [],
  thumbnail: "",
  gltfModelUrl: null,
  description: "",
  features: [],
  seller: {
    company: "",
    location: "",
    is_small_brand: false,
  },
};

const AdminPage = () => {
  const { cars, loading, fetchCars, createCar, updateCar, deleteCar } = useCarStore();
  const { isLoggedIn, user, login, logout } = useAuth();

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [carForm, setCarForm] = useState(emptyCarForm);
  const [featuresInput, setFeaturesInput] = useState("");
  const [imagesInput, setImagesInput] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!login(loginForm.username, loginForm.password)) {
      setLoginError("Invalid credentials. Try admin / admin123");
    }
  };

  const resetForm = () => {
    setCarForm(emptyCarForm);
    setFeaturesInput("");
    setImagesInput("");
    setFormError("");
  };

  const openEditDialog = (car: CarType) => {
    setSelectedCar(car);
    setCarForm({
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      currency: car.currency,
      category: car.category,
      mileage: car.mileage,
      power: car.power,
      transmission: car.transmission,
      images: car.images,
      thumbnail: car.thumbnail,
      gltfModelUrl: car.gltfModelUrl,
      description: car.description,
      features: car.features,
      seller: { ...car.seller },
    });
    setFeaturesInput(car.features.join(", "));
    setImagesInput(car.images.join("\n"));
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (car: CarType) => {
    setSelectedCar(car);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = (): boolean => {
    if (!carForm.make.trim()) {
      setFormError("Make is required");
      return false;
    }
    if (!carForm.model.trim()) {
      setFormError("Model is required");
      return false;
    }
    if (carForm.price <= 0) {
      setFormError("Price must be greater than 0");
      return false;
    }
    if (!carForm.description.trim()) {
      setFormError("Description is required");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = async (isEdit: boolean) => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    console.log({ event: isEdit ? "update_car_submit" : "create_car_submit", carForm });

    try {
      const processedForm = {
        ...carForm,
        features: featuresInput.split(",").map((f) => f.trim()).filter(Boolean),
        images: imagesInput.split("\n").map((i) => i.trim()).filter(Boolean),
        thumbnail: imagesInput.split("\n")[0]?.trim() || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop",
      };

      if (isEdit && selectedCar) {
        await updateCar(selectedCar.id, processedForm);
        setIsEditDialogOpen(false);
      } else {
        await createCar(processedForm);
        setIsAddDialogOpen(false);
      }
      resetForm();
    } catch (error) {
      console.error({ event: "form_submit_error", error });
      setFormError("Failed to save car. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCar) return;

    setIsSubmitting(true);
    console.log({ event: "delete_car_confirm", carId: selectedCar.id });

    try {
      await deleteCar(selectedCar.id);
      setIsDeleteDialogOpen(false);
      setSelectedCar(null);
    } catch (error) {
      console.error({ event: "delete_error", error });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Login form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 md:pt-28 pb-16 flex items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="glass-card rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Admin Login</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Sign in to manage car listings
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="Enter username"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Enter password"
                    className="mt-1"
                  />
                </div>

                {loginError && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {loginError}
                  </p>
                )}

                <Button type="submit" variant="hero" className="w-full">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Demo credentials: admin / admin123
                </p>
              </form>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 md:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your car inventory • Logged in as{" "}
                <span className="text-primary">{user?.username}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" onClick={() => resetForm()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Car
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Car</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new car to the catalog.
                    </DialogDescription>
                  </DialogHeader>
                  <CarForm
                    carForm={carForm}
                    setCarForm={setCarForm}
                    featuresInput={featuresInput}
                    setFeaturesInput={setFeaturesInput}
                    imagesInput={imagesInput}
                    setImagesInput={setImagesInput}
                    formError={formError}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="hero"
                      onClick={() => handleSubmit(false)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Add Car
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: "Total Cars", value: cars.length, icon: Car },
              { label: "With 3D Models", value: cars.filter((c) => c.gltfModelUrl).length, icon: Settings },
              { label: "EV Models", value: cars.filter((c) => c.category === "ev").length, icon: Car },
              { label: "Luxury", value: cars.filter((c) => c.category === "luxury" || c.category === "sports").length, icon: Car },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 rounded-xl">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Make</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>3D</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && cars.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    cars.slice(0, 20).map((car) => (
                      <TableRow key={car.id}>
                        <TableCell>
                          <img
                            src={car.thumbnail}
                            alt={car.model}
                            className="w-16 h-12 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{car.make}</TableCell>
                        <TableCell>{car.model}</TableCell>
                        <TableCell>{car.year}</TableCell>
                        <TableCell>{formatPriceShort(car.price, car.currency)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {getCategoryLabel(car.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {car.gltfModelUrl ? (
                            <Check className="w-4 h-4 text-primary" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="iconSm"
                              onClick={() => openEditDialog(car)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="iconSm"
                              onClick={() => openDeleteDialog(car)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Car</DialogTitle>
            <DialogDescription>
              Update the details for {selectedCar?.make} {selectedCar?.model}
            </DialogDescription>
          </DialogHeader>
          <CarForm
            carForm={carForm}
            setCarForm={setCarForm}
            featuresInput={featuresInput}
            setFeaturesInput={setFeaturesInput}
            imagesInput={imagesInput}
            setImagesInput={setImagesInput}
            formError={formError}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="hero"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Car</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCar?.make} {selectedCar?.model}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

// Car Form Component
interface CarFormProps {
  carForm: Omit<CarType, "id" | "createdAt" | "updatedAt">;
  setCarForm: React.Dispatch<React.SetStateAction<Omit<CarType, "id" | "createdAt" | "updatedAt">>>;
  featuresInput: string;
  setFeaturesInput: (value: string) => void;
  imagesInput: string;
  setImagesInput: (value: string) => void;
  formError: string;
}

const CarForm = ({
  carForm,
  setCarForm,
  featuresInput,
  setFeaturesInput,
  imagesInput,
  setImagesInput,
  formError,
}: CarFormProps) => {
  return (
    <div className="space-y-4 py-4">
      {formError && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {formError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="make">Make *</Label>
          <Input
            id="make"
            value={carForm.make}
            onChange={(e) => setCarForm({ ...carForm, make: e.target.value })}
            placeholder="e.g., Tesla"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            value={carForm.model}
            onChange={(e) => setCarForm({ ...carForm, model: e.target.value })}
            placeholder="e.g., Model S"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            value={carForm.year}
            onChange={(e) => setCarForm({ ...carForm, year: parseInt(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            value={carForm.price}
            onChange={(e) => setCarForm({ ...carForm, price: parseInt(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={carForm.currency}
            onValueChange={(value: "INR" | "USD" | "EUR") =>
              setCarForm({ ...carForm, currency: value })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={carForm.category}
            onValueChange={(value: CarType["category"]) =>
              setCarForm({ ...carForm, category: value })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hatchback">Hatchback</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="ev">Electric</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="transmission">Transmission</Label>
          <Select
            value={carForm.transmission}
            onValueChange={(value: "manual" | "auto") =>
              setCarForm({ ...carForm, transmission: value })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Automatic</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="power">Power</Label>
          <Input
            id="power"
            value={carForm.power}
            onChange={(e) => setCarForm({ ...carForm, power: e.target.value })}
            placeholder="e.g., 300 HP"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            value={carForm.mileage}
            onChange={(e) => setCarForm({ ...carForm, mileage: e.target.value })}
            placeholder="e.g., 20 kmpl"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={carForm.description}
          onChange={(e) => setCarForm({ ...carForm, description: e.target.value })}
          placeholder="Describe the car..."
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="features">Features (comma-separated)</Label>
        <Input
          id="features"
          value={featuresInput}
          onChange={(e) => setFeaturesInput(e.target.value)}
          placeholder="Sunroof, Leather Seats, ADAS"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="images">Image URLs (one per line)</Label>
        <Textarea
          id="images"
          value={imagesInput}
          onChange={(e) => setImagesInput(e.target.value)}
          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="gltfModelUrl">3D Model URL (optional)</Label>
        <Input
          id="gltfModelUrl"
          value={carForm.gltfModelUrl || ""}
          onChange={(e) => setCarForm({ ...carForm, gltfModelUrl: e.target.value || null })}
          placeholder="https://example.com/model.glb"
          className="mt-1"
        />
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Seller Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sellerCompany">Company</Label>
            <Input
              id="sellerCompany"
              value={carForm.seller.company}
              onChange={(e) =>
                setCarForm({
                  ...carForm,
                  seller: { ...carForm.seller, company: e.target.value },
                })
              }
              placeholder="Company name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="sellerLocation">Location</Label>
            <Input
              id="sellerLocation"
              value={carForm.seller.location}
              onChange={(e) =>
                setCarForm({
                  ...carForm,
                  seller: { ...carForm.seller, location: e.target.value },
                })
              }
              placeholder="City, Country"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
