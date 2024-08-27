// src/components/HeroSection.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="relative bg-[#c8f1d9] text-[#285c3f] py-16 lg:py-24">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between">
                    {/* Text Content */}
                    <div className="lg:w-1/3 mb-12 lg:mb-0">
                        <h1 className="text-4xl font-heading lg:text-5xl font-bold mb-4 leading-tight">
                            Discover the Elegance of Luxury Clothing
                        </h1>
                        <p className="text-lg font-body mb-6 leading-relaxed">
                            Explore our exclusive collection of premium garments crafted to offer unparalleled comfort and style. Indulge in the finest fabrics and timeless designs that redefine luxury.
                        </p>
                        <Link to="/shop" className="inline-block font-body bg-[#285c3f] text-[#c8f1d9] hover:bg-[#285c4f] py-3 px-6 rounded-lg font-semibold">
                            Shop Now
                        </Link>
                    </div>

                    {/* Image */}
                    <div className="lg:w-1/2">
                        <img 
                            src="https://via.placeholder.com/600x400" 
                            alt="Luxury Clothing" 
                            className="w-full h-auto rounded-lg shadow-lg" 
                        />
                    </div>
                </div>
            </div>

            {/* Decorative Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#285c3f] to-transparent opacity-50"></div>
        </section>
    );
};

export default HeroSection;
