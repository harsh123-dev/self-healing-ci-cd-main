import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

if (!AUTH_SERVICE_URL) {
  throw new Error("AUTH_SERVICE_URL not defined");
}

const cars = [
  { id: 1, name: "Tesla Model S", price: 80000 },
  { id: 2, name: "BMW M4", price: 75000 },
  { id: 3, name: "Audi R8", price: 150000 }
];

app.get("/api/cars", (req, res) => {
  const {
    page = "1",
    pageSize = "10",
    make,
    search,
    sort
  } = req.query;

  let result = [...cars];

  // Filter by make
  if (make) {
    result = result.filter(car =>
      car.name.toLowerCase().includes(make.toLowerCase())
    );
  }

  // Text search
  if (search) {
    result = result.filter(car =>
      car.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sorting
  if (sort === "price_asc") {
    result.sort((a, b) => a.price - b.price);
  }

  if (sort === "price_desc") {
    result.sort((a, b) => b.price - a.price);
  }

  // Pagination
  const pageNumber = parseInt(page);
  const pageSizeNumber = parseInt(pageSize);

  const total = result.length;
  const totalPages = Math.ceil(total / pageSizeNumber);

  const startIndex = (pageNumber - 1) * pageSizeNumber;
  const paginatedData = result.slice(
    startIndex,
    startIndex + pageSizeNumber
  );

  res.json({
    data: paginatedData,
    total,
    page: pageNumber,
    pageSize: pageSizeNumber,
    totalPages
  });
});


app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "catalog-service" });
});

app.listen(PORT, () => {
  console.log(`Catalog service running on port ${PORT}`);
});

