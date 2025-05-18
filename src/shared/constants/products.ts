// Type assertions for the product data
export const PRODUCTS = {
  FEATURED: [
    {
      id: 1,
      name: "Logo-print T-shirt",
      price: "₹30000",
      originalPrice: "₹52000",
      image: "https://cdn-images.farfetch-contents.com/14/94/45/03/14944503_26152014_1000.jpg",
      discount: "-35%",
      department: "Menswear",
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
      deliveryInfo: "Free standard delivery on orders over ₹10000",
      inStock: true,
      images: [
        "https://cdn-images.farfetch-contents.com/14/94/45/03/14944503_26152019_1000.jpg",
        "https://cdn-images.farfetch-contents.com/14/94/45/03/14944503_26152020_1000.jpg",
        "https://cdn-images.farfetch-contents.com/14/94/45/03/14944503_26152022_1000.jpg",
        "https://cdn-images.farfetch-contents.com/14/94/45/03/14944503_26152023_1000.jpg"
      ]
    },
    {
      id: 2,
      name: "Fox-embroidered tote bag",
      price: "₹19500",
      originalPrice: "₹24000",
      image: "https://cdn-images.farfetch-contents.com/29/73/55/63/29735563_58872663_1000.jpg",
      discount: "-15%",
      department: "Womenswear",
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
      deliveryInfo: "Free standard delivery on orders over ₹10000",
      inStock: true,
      images: [
        "https://cdn-images.farfetch-contents.com/29/73/55/63/29735563_58872660_1000.jpg",
        "https://cdn-images.farfetch-contents.com/29/73/55/63/29735563_58872658_1000.jpg",
        "https://cdn-images.farfetch-contents.com/29/73/55/63/29735563_58872659_1000.jpg",
        "https://cdn-images.farfetch-contents.com/29/73/55/63/29735563_58872657_1000.jpg"
      ]
    },
    {
      id: 3,
      name: "Low-top sneakers",
      price: "₹41000",
      originalPrice: "₹56000",
      image: "https://cdn-images.farfetch-contents.com/12/98/16/61/12981661_13701332_1000.jpg",
      discount: "-27%",
      department: "Menswear",
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
      deliveryInfo: "Free express delivery on orders over ₹25000",
      inStock: true,
      images: [
        "https://cdn-images.farfetch-contents.com/12/98/16/61/12981661_13701333_1000.jpg",
        "https://cdn-images.farfetch-contents.com/12/98/16/61/12981661_13701334_1000.jpg",
        "https://cdn-images.farfetch-contents.com/12/98/16/61/12981661_13701335_1000.jpg"
      ]
    },
    {
      id: 4,
      name: "Printed shirt",
      price: "₹42600",
      originalPrice: "₹94700",
      image: "https://cdn-images.farfetch-contents.com/29/15/02/62/29150262_58298482_1000.jpg",
      discount: "-55%",
      department: "Kidswear", 
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
      deliveryInfo: "Free standard delivery on orders over ₹10000",
      inStock: true,
      images: [
        "https://cdn-images.farfetch-contents.com/29/15/02/62/29150262_58298528_1000.jpg"
      ]
    }
  ],
  CATEGORY_IMAGES: [
    {
      title: "WOMENSWEAR",
      image: "https://c.bannerflow.net/io/api/image/optimize?u=https%3A%2F%2Fc.bannerflow.net%2Faccounts%2Ffarfetch%2F5885fca2b801c913d4b04244%2Fpublished%2F11548405%2F13641053%2F8fa0bda0-8e92-48b3-a512-c22f543d2caf.jpg&w=1024&h=1134&q=85&f=webp&rt=contain",
      link: "/womenswear"
    },
    {
      title: "MENSWEAR",
      image: "https://c.bannerflow.net/io/api/image/optimize?u=https%3A%2F%2Fc.bannerflow.net%2Faccounts%2Ffarfetch%2F5885fca2b801c913d4b04244%2Fpublished%2F11547995%2F13641886%2F20433b5b-8a43-4667-8d60-8c7579dbf198.jpg&w=1024&h=1134&q=85&f=webp&rt=contain",
      link: "/menswear"
    },
    {
      title: "KIDSWEAR",
      image: "https://cdn-static.farfetch-contents.com/cms-ccloud/caas/v1/media/10437128/data/efed7f6eba7143808e7cf17ecd45b2dc/3x4_four-columns/480/2025-04-30-kw-webapp-givenchy-kids-pre-s-givenchy-kids-multicategory-img.jpeg",
      link: "/kidswear"
    }
  ],
  RELATED: [
    {
      id: 5,
      name: "Jazz Wolf T-shirt",
      price: "₹37400",
      originalPrice: "₹44700",
      image: "https://cdn-images.farfetch-contents.com/18/73/09/64/18730964_40458386_1000.jpg",
      discount: "-15%",
      department: "Kidswear",
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
      deliveryInfo: "Free standard delivery on orders over ₹10000",
      inStock: true,
      images: [
        "https://cdn-images.farfetch-contents.com/18/73/09/64/18730964_40459185_1000.jpg"
      ]
    },
    {
      id: 6,
      name: "Logo-print cotton T-shirt",
      price: "₹37400",
      originalPrice: "₹58800",
      image: "https://cdn-images.farfetch-contents.com/23/38/95/01/23389501_53614590_1000.jpg",
      discount: "-35%",
      department: "Menswear",
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
      deliveryInfo: "Free standard delivery on orders over ₹10000",
      inStock: true,
      images: [
        "https://cdn-images.farfetch-contents.com/23/38/95/01/23389501_53614570_1000.jpg"
      ]
    },
    {
      id: 7,
      name: "Core logo-print cotton T-shirt",
      price: "₹41000",
      originalPrice: null,
      image: "https://cdn-images.farfetch-contents.com/22/37/80/53/22378053_52327243_1000.jpg",
      discount: null,
      department: "Menswear",
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
      deliveryInfo: "Free standard delivery on orders over ₹10000",
      inStock: true,
      images: [
        "https://cdn-images.farfetch-contents.com/22/37/80/53/22378053_52327242_1000.jpg",
        "https://cdn-images.farfetch-contents.com/22/37/80/53/22378053_52327239_1000.jpg",
        "https://cdn-images.farfetch-contents.com/22/37/80/53/22378053_52327231_1000.jpg",
        "https://cdn-images.farfetch-contents.com/22/37/80/53/22378053_52327238_1000.jpg"
      ]
    },
    {
      id: 8,
      name: "Champagne cotton T-shirt",
      price: "₹42600",
      originalPrice: "₹94700",
      image: "https://cdn-images.farfetch-contents.com/22/55/31/99/22553199_52606605_1000.jpg",
      discount: "-55%",
      department: "Menswear",
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
      deliveryInfo: "Free standard delivery on orders over ₹10000",
      inStock: true,
      images: [
        "https://cdn-images.farfetch-contents.com/22/55/31/99/22553199_52606621_1000.jpg",
        "https://cdn-images.farfetch-contents.com/22/55/31/99/22553199_52606602_1000.jpg",
        "https://cdn-images.farfetch-contents.com/22/55/31/99/22553199_52606601_1000.jpg",
        "https://cdn-images.farfetch-contents.com/22/55/31/99/22553199_52606599_1000.jpg"
      ]
    },
    {
      id: 9,
      name: "Lion Outline T-shirt",
      price: "₹56600",
      originalPrice: null,
      image: "https://cdn-images.farfetch-contents.com/25/06/62/89/25066289_55284274_1000.jpg",
      discount: null,
      department: "Menswear",
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
      deliveryInfo: "Free standard delivery on orders over ₹10000",
      inStock: true,
      images: [
        "https://cdn-images.farfetch-contents.com/25/06/62/89/25066289_55284259_1000.jpg",
        "https://cdn-images.farfetch-contents.com/25/06/62/89/25066289_55284284_1000.jpg",
        "https://cdn-images.farfetch-contents.com/25/06/62/89/25066289_55284261_1000.jpg",
        "https://cdn-images.farfetch-contents.com/25/06/62/89/25066289_55284272_1000.jpg"
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