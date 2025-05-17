import { useParams } from "react-router-dom";

export default function SingleProduct() {
  const { productId } = useParams<{ productId: string }>();
  
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-heading font-medium tracking-tight mb-8">
        Product Details
      </h1>
      
      <div className="border border-border rounded-lg p-8">
        <p className="text-lg mb-4">
          Product ID: <span className="text-primary">{productId}</span>
        </p>
        <p className="text-muted-foreground">
          This is a placeholder for the product details page. 
          In a real application, this would display detailed information about the product.
        </p>
      </div>
    </div>
  );
} 