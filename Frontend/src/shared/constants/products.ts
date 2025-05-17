// Type assertions for the product data
export const PRODUCTS = {
  FEATURED: [
    {
      id: 1,
      name: "Logo-print T-shirt",
      brand: "AMIRI",
      price: "30000",
      originalPrice: "52000",
      image: "https://cdn.farfetch-contents.com/20/90/97/25/20909725_52308245_1000.jpg",
      discount: "-35%",
      description: "Crafted from premium cotton, this logo-print T-shirt from AMIRI features the brand's signature logo design, offering a relaxed silhouette with a comfortable fit.",
      material: "100% Cotton",
      care: ["Machine wash cold", "Do not bleach", "Do not tumble dry", "Iron on low heat"],
      features: ["Relaxed fit", "Crew neck", "Short sleeves", "Logo print on front", "Ribbed collar"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Black", code: "#000000" },
        { name: "White", code: "#FFFFFF" },
      ],
      category: "Clothing",
      subcategory: "T-shirts",
      rating: 4.7,
      ratingCount: 124,
      deliveryInfo: "Free standard delivery on orders over $100",
      inStock: true,
      images: [
        "https://cdn.farfetch-contents.com/20/90/97/25/20909725_52308245_1000.jpg",
        "https://cdn.farfetch-contents.com/20/90/97/25/20909725_52308246_1000.jpg",
        "https://cdn.farfetch-contents.com/20/90/97/25/20909725_52308247_1000.jpg",
        "https://cdn.farfetch-contents.com/20/90/97/25/20909725_52308248_1000.jpg"
      ]
    },
    {
      id: 2,
      name: "Fox-embroidered tote bag",
      brand: "Maison Kitsuné",
      price: "19500",
      originalPrice: "24000",
      image: "https://cdn.farfetch-contents.com/19/46/93/30/19469330_43329717_1000.jpg",
      discount: "-15%",
      description: "Carry your essentials in style with this Fox-embroidered tote bag from Maison Kitsuné. Made from durable canvas with the iconic fox embroidery.",
      material: "100% Cotton Canvas",
      care: ["Spot clean only", "Do not wash", "Do not bleach", "Do not iron"],
      features: ["Top handles", "Fox embroidery", "Interior pocket", "Canvas construction", "Spacious design"],
      sizes: ["One Size"],
      colors: [
        { name: "Beige", code: "#F5F5DC" },
      ],
      category: "Accessories",
      subcategory: "Bags",
      rating: 4.5,
      ratingCount: 86,
      deliveryInfo: "Free standard delivery on orders over $100",
      inStock: true,
      images: [
        "https://cdn.farfetch-contents.com/19/46/93/30/19469330_43329717_1000.jpg",
        "https://cdn.farfetch-contents.com/19/46/93/30/19469330_43329718_1000.jpg",
        "https://cdn.farfetch-contents.com/19/46/93/30/19469330_43329719_1000.jpg",
        "https://cdn.farfetch-contents.com/19/46/93/30/19469330_43329720_1000.jpg"
      ]
    },
    {
      id: 3,
      name: "Low-top sneakers",
      brand: "Visvim",
      price: "41000",
      originalPrice: "56000",
      image: "https://cdn.farfetch-contents.com/18/81/27/30/18812730_41088834_1000.jpg",
      discount: "-27%",
      description: "These low-top sneakers from Visvim feature a minimalist design crafted from premium materials, providing both comfort and style for everyday wear.",
      material: "Upper: Leather, Sole: Rubber",
      care: ["Clean with a soft dry cloth", "Store in a cool dry place", "Use shoe trees to maintain shape"],
      features: ["Low-top design", "Lace-up front", "Cushioned insole", "Rubber outsole", "Contrast stitching"],
      sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
      colors: [
        { name: "White", code: "#FFFFFF" },
        { name: "Black", code: "#000000" },
      ],
      category: "Shoes",
      subcategory: "Sneakers",
      rating: 4.8,
      ratingCount: 64,
      deliveryInfo: "Free express delivery on orders over $250",
      inStock: true,
      images: [
        "https://cdn.farfetch-contents.com/18/81/27/30/18812730_41088834_1000.jpg",
        "https://cdn.farfetch-contents.com/18/81/27/30/18812730_41088835_1000.jpg",
        "https://cdn.farfetch-contents.com/18/81/27/30/18812730_41088836_1000.jpg",
        "https://cdn.farfetch-contents.com/18/81/27/30/18812730_41088837_1000.jpg"
      ]
    },
    {
      id: 4,
      name: "Printed shirt",
      brand: "Casablanca",
      price: "42600",
      originalPrice: "94700",
      image: "https://cdn.farfetch-contents.com/20/03/52/93/20035293_45451325_1000.jpg",
      discount: "-55%",
      description: "A statement piece from Casablanca, this printed shirt features a vibrant design on premium silk fabric, perfect for making a bold fashion statement.",
      material: "100% Silk",
      care: ["Dry clean only", "Do not wash", "Do not bleach", "Iron on low heat", "Store on hanger"],
      features: ["Regular fit", "Camp collar", "Short sleeves", "All-over print", "Button front"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Multi", code: "#MULTICOLOR" },
      ],
      category: "Clothing",
      subcategory: "Shirts",
      rating: 4.6,
      ratingCount: 42,
      deliveryInfo: "Free standard delivery on orders over $100",
      inStock: true,
      images: [
        "https://cdn.farfetch-contents.com/20/03/52/93/20035293_45451325_1000.jpg",
        "https://cdn.farfetch-contents.com/20/03/52/93/20035293_45451326_1000.jpg",
        "https://cdn.farfetch-contents.com/20/03/52/93/20035293_45451327_1000.jpg",
        "https://cdn.farfetch-contents.com/20/03/52/93/20035293_45451328_1000.jpg"
      ]
    }
  ],
  CATEGORY_IMAGES: [
    {
      title: "WOMENSWEAR",
      image: "https://cdn.farfetch-contents.com/12/39/83/84/12398384_21644739_1000.jpg",
      link: "/womenswear"
    },
    {
      title: "MENSWEAR",
      image: "https://cdn.farfetch-contents.com/12/31/24/38/12312438_11703901_1000.jpg",
      link: "/menswear"
    },
    {
      title: "KIDSWEAR",
      image: "https://cdn.farfetch-contents.com/18/87/53/66/18875366_41179055_1000.jpg",
      link: "/kidswear"
    }
  ],
  RELATED: [
    {
      id: 5,
      name: "Jazz Wolf T-shirt",
      brand: "AMIRI",
      price: "37400",
      originalPrice: "44700",
      image: "https://cdn.farfetch-contents.com/18/80/99/88/18809988_41056592_1000.jpg",
      discount: "-15%",
      description: "Featuring a unique Jazz Wolf graphic print, this T-shirt from AMIRI combines artistic design with premium cotton for a comfortable, stylish piece.",
      material: "100% Cotton",
      care: ["Machine wash cold", "Do not bleach", "Do not tumble dry", "Iron on low heat"],
      features: ["Relaxed fit", "Crew neck", "Short sleeves", "Graphic print on front", "Ribbed collar"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Black", code: "#000000" },
      ],
      category: "Clothing",
      subcategory: "T-shirts",
      rating: 4.5,
      ratingCount: 38,
      deliveryInfo: "Free standard delivery on orders over $100",
      inStock: true,
      images: [
        "https://cdn.farfetch-contents.com/18/80/99/88/18809988_41056592_1000.jpg",
        "https://cdn.farfetch-contents.com/18/80/99/88/18809988_41056593_1000.jpg",
        "https://cdn.farfetch-contents.com/18/80/99/88/18809988_41056594_1000.jpg",
        "https://cdn.farfetch-contents.com/18/80/99/88/18809988_41056595_1000.jpg"
      ]
    },
    {
      id: 6,
      name: "Logo-print cotton T-shirt",
      brand: "AMIRI",
      price: "37400",
      originalPrice: "58800",
      image: "https://cdn.farfetch-contents.com/19/03/19/96/19031996_41850370_1000.jpg",
      discount: "-35%",
      description: "This logo-print cotton T-shirt from AMIRI features the brand's iconic logo design on premium cotton fabric, offering a perfect blend of comfort and style.",
      material: "100% Cotton",
      care: ["Machine wash cold", "Do not bleach", "Do not tumble dry", "Iron on low heat"],
      features: ["Regular fit", "Crew neck", "Short sleeves", "Logo print on front", "Ribbed collar"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "White", code: "#FFFFFF" },
      ],
      category: "Clothing",
      subcategory: "T-shirts",
      rating: 4.6,
      ratingCount: 52,
      deliveryInfo: "Free standard delivery on orders over $100",
      inStock: true,
      images: [
        "https://cdn.farfetch-contents.com/19/03/19/96/19031996_41850370_1000.jpg",
        "https://cdn.farfetch-contents.com/19/03/19/96/19031996_41850371_1000.jpg",
        "https://cdn.farfetch-contents.com/19/03/19/96/19031996_41850372_1000.jpg",
        "https://cdn.farfetch-contents.com/19/03/19/96/19031996_41850373_1000.jpg"
      ]
    },
    {
      id: 7,
      name: "Core logo-print cotton T-shirt",
      brand: "AMIRI",
      price: "41000",
      originalPrice: null,
      image: "https://cdn.farfetch-contents.com/19/03/24/70/19032470_41851407_1000.jpg",
      discount: null,
      description: "From AMIRI's core collection, this logo-print T-shirt features the brand's signature design on luxurious cotton fabric for everyday premium style.",
      material: "100% Cotton",
      care: ["Machine wash cold", "Do not bleach", "Do not tumble dry", "Iron on low heat"],
      features: ["Regular fit", "Crew neck", "Short sleeves", "Logo print on chest", "Ribbed collar"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Grey", code: "#808080" },
      ],
      category: "Clothing",
      subcategory: "T-shirts",
      rating: 4.8,
      ratingCount: 26,
      deliveryInfo: "Free standard delivery on orders over $100",
      inStock: true,
      images: [
        "https://cdn.farfetch-contents.com/19/03/24/70/19032470_41851407_1000.jpg",
        "https://cdn.farfetch-contents.com/19/03/24/70/19032470_41851408_1000.jpg",
        "https://cdn.farfetch-contents.com/19/03/24/70/19032470_41851409_1000.jpg",
        "https://cdn.farfetch-contents.com/19/03/24/70/19032470_41851410_1000.jpg"
      ]
    },
    {
      id: 8,
      name: "Champagne cotton T-shirt",
      brand: "AMIRI",
      price: "42600",
      originalPrice: "94700",
      image: "https://cdn.farfetch-contents.com/19/03/24/97/19032497_41857061_1000.jpg",
      discount: "-55%",
      description: "The Champagne cotton T-shirt from AMIRI features luxury-inspired graphics on premium cotton fabric, creating a perfect blend of casual wear and high fashion.",
      material: "100% Cotton",
      care: ["Machine wash cold", "Do not bleach", "Do not tumble dry", "Iron on low heat"],
      features: ["Regular fit", "Crew neck", "Short sleeves", "Graphic print", "Ribbed collar"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Black", code: "#000000" },
      ],
      category: "Clothing",
      subcategory: "T-shirts",
      rating: 4.7,
      ratingCount: 34,
      deliveryInfo: "Free standard delivery on orders over $100",
      inStock: true,
      images: [
        "https://cdn.farfetch-contents.com/19/03/24/97/19032497_41857061_1000.jpg",
        "https://cdn.farfetch-contents.com/19/03/24/97/19032497_41857062_1000.jpg",
        "https://cdn.farfetch-contents.com/19/03/24/97/19032497_41857063_1000.jpg",
        "https://cdn.farfetch-contents.com/19/03/24/97/19032497_41857064_1000.jpg"
      ]
    },
    {
      id: 9,
      name: "Lion Outline T-shirt",
      brand: "AMIRI",
      price: "56600",
      originalPrice: null,
      image: "https://cdn.farfetch-contents.com/19/03/24/92/19032492_41855915_1000.jpg",
      discount: null,
      description: "The Lion Outline T-shirt from AMIRI features an intricate lion design, showcasing detailed craftsmanship on high-quality cotton fabric.",
      material: "100% Cotton",
      care: ["Machine wash cold", "Do not bleach", "Do not tumble dry", "Iron on low heat"],
      features: ["Regular fit", "Crew neck", "Short sleeves", "Lion outline graphic", "Ribbed collar"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "White", code: "#FFFFFF" },
      ],
      category: "Clothing",
      subcategory: "T-shirts",
      rating: 4.9,
      ratingCount: 21,
      deliveryInfo: "Free standard delivery on orders over $100",
      inStock: true,
      images: [
        "https://cdn.farfetch-contents.com/19/03/24/92/19032492_41855915_1000.jpg",
        "https://cdn.farfetch-contents.com/19/03/24/92/19032492_41855916_1000.jpg",
        "https://cdn.farfetch-contents.com/19/03/24/92/19032492_41855917_1000.jpg",
        "https://cdn.farfetch-contents.com/19/03/24/92/19032492_41855918_1000.jpg"
      ]
    }
  ],
  SALE_BANNER: {
    title: "Sale is here: up to 50% off",
    ctaWomen: "Shop Women",
    ctaMen: "Shop Men",
    hrefWomen: "/womenswear/sale",
    hrefMen: "/menswear/sale"
  }
}; 