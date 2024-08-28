import React from 'react';
import SliderComponent from '../components/SliderComponent';
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
        <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image Slider */}
            <div className="flex justify-center">
                <SliderComponent imageUrls={product.imageUrls} />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary mb-2">{product.name}</h1>
                    <p className="text-2xl text-secondary font-semibold mb-4">₹{product.price}</p>

                    {/* Size Options */}
                    {product.sizes && (
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Select Size:</h3>
                            <div className="flex gap-2">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        className="px-4 py-2 text-sm bg-primary rounded-lg hover:bg-secondary hover:text-primary"
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Product Description */}
                    <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4">
                    <button className="flex-1 bg-secondary text-primary text-lg py-3 rounded-lg transition">
                        Add to Cart
                    </button>
                    <button className="flex-1 bg-green-100 text-secondary text-lg py-3 rounded-lg hover:bg-green-100 transition">
                        Wishlist
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SingleProduct;
