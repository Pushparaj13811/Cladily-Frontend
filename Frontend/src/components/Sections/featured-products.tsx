import { useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Sample data - would typically come from an API
const SAMPLE_PRODUCTS = [
  {
    id: "1",
    brand: "Maison Kitsuné",
    name: "Fox Tote Bag",
    price: 2500,
    originalPrice: 3200,
    discount: 20,
    currency: "INR",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df41a97a?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    ],
    availableSizes: ["S", "M", "L"],
  },
  {
    id: "2",
    brand: "AMIRI",
    name: "Logo Print T-shirt",
    price: 4800,
    originalPrice: 6000,
    discount: 20,
    currency: "INR",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=776&q=80",
    ],
    availableSizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "3",
    brand: "Visvim",
    name: "Canvas Sneakers",
    price: 12000,
    currency: "INR",
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=928&q=80",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    ],
    availableSizes: ["40", "41", "42", "43", "44"],
  },
  {
    id: "4",
    brand: "Casablanca",
    name: "Silk Vacation Shirt",
    price: 9200,
    originalPrice: 11500,
    discount: 20,
    currency: "INR",
    images: [
      "https://images.unsplash.com/photo-1603252109360-909baaf261c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
      "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    ],
    availableSizes: ["S", "M", "L", "XL"],
  },
];

const CATEGORIES = ["All", "Clothing", "Shoes", "Bags", "Accessories"];

export function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-heading font-medium tracking-tight mb-2">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover our handpicked selection of the season's most coveted items, offering unparalleled quality and style.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <Button variant="outline">View All</Button>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex overflow-x-auto scrollbar-none -mx-4 px-4 pb-6">
          <div className="flex space-x-4">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {SAMPLE_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 