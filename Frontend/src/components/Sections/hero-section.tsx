import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Content */}
          <motion.div 
            className="lg:w-1/2 space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-medium tracking-tight">
              Discover the Elegance of <span className="text-primary">Luxury</span> Fashion
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Explore our exclusive collection of premium garments crafted to offer unparalleled comfort and style. 
              Indulge in the finest fabrics and timeless designs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link to="/womenswear">Shop Women</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/menswear">Shop Men</Link>
              </Button>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div 
            className="relative lg:w-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1588117260148-b47818741c74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80"
              alt="Luxury fashion"
              className="w-full h-auto rounded-md shadow-lg"
            />
            <div className="absolute -bottom-6 -right-6 h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 bg-primary/20 rounded-full -z-10" />
            <div className="absolute -top-6 -left-6 h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 bg-primary/20 rounded-full -z-10" />
          </motion.div>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-24 h-64 md:w-32 md:h-80 bg-gradient-to-r from-primary/10 to-transparent -z-10" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-24 h-64 md:w-32 md:h-80 bg-gradient-to-l from-primary/10 to-transparent -z-10" />
    </section>
  );
} 