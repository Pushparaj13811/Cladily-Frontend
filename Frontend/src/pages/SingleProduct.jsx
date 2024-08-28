import React from 'react';
import SingleProductCard from '../components/SingleProductCard';
import { useLocation } from 'react-router-dom';
import { products } from '../constants/constants';

function SingleProduct() {
    const location = useLocation();
    const id = location.pathname.split("/")[2];

    const product = products.find(product => product.id === id);

    if (!product) {
        return <div className="text-center p-4 text-red-500 text-lg font-semibold">Product not found</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <SingleProductCard
                    productName={product.name}
                    productPrice={product.price}
                    productSize={product.sizes}
                    productDescription={product.description}
                    imageUrls={product.imageUrls}
                />
            </div>
        </div>
    );
}

export default SingleProduct;
