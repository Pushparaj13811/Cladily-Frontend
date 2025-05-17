import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  {
    name: "Womenswear",
    description: "Discover elegant collections for the modern woman",
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=772&q=80",
    link: "/womenswear",
  },
  {
    name: "Menswear",
    description: "Sophisticated styles for the contemporary man",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    link: "/menswear",
  },
  {
    name: "Kidswear",
    description: "Playful and practical designs for children",
    image: "https://images.unsplash.com/photo-1611042553484-d61f84e54784?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    link: "/kidswear",
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-heading font-medium tracking-tight mb-12 text-center">
          Choose a Department
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map((category, index) => (
            <CategoryCard 
              key={category.name}
              category={category} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  category: {
    name: string;
    description: string;
    image: string;
    link: string;
  };
  index: number;
}

function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="group relative overflow-hidden rounded-lg aspect-[3/4]"
    >
      {/* Background image */}
      <div className="absolute inset-0 bg-black/20 z-10 transition-opacity group-hover:bg-black/40" />
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Content overlay */}
      <div className="relative h-full z-20 flex flex-col justify-end p-6 text-white">
        <div className="transform transition-transform duration-500 group-hover:translate-y-0 translate-y-4">
          <h3 className={cn(
            "text-3xl font-heading uppercase mb-2 tracking-wide",
            index === 0 ? "text-left" : index === 1 ? "text-center" : "text-right"
          )}>
            {category.name}
          </h3>
          
          <p className={cn(
            "text-sm text-white/80 mb-6 max-w-xs transform transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0",
            index === 0 ? "text-left" : index === 1 ? "text-center mx-auto" : "text-right ml-auto"
          )}>
            {category.description}
          </p>
          
          <Link 
            to={category.link}
            className={cn(
              "inline-flex items-center text-sm font-medium border-b border-white pb-1 transition-colors hover:text-primary/90 hover:border-primary/90",
              index === 0 ? "" : index === 1 ? "mx-auto" : "ml-auto"
            )}
          >
            Explore Collection
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 