import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productNavLink } from '../constants/constants';
import LinkSlider from '../components/LinkSlider';
import { products } from "../constants/constants"


function Product() {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;
    const maxPagesToShow = 3;

    let showProductNav = "hidden";
    let showProductInHomepage = "hidden"
    let showProductInProductPage = "p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
    let showPagination = "flex justify-center p-4"
    if (location.pathname === "/") {
        showProductNav = "flex justify-center"
        showProductInHomepage = "p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        showProductInProductPage = "hidden"
        showPagination = "hidden"

    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(products.length / productsPerPage);

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = products.slice(startIndex, endIndex);
    const productsToShowInHomepage = products.slice(0, 5);

    const getPaginationButtons = () => {
        let startPage, endPage;

        if (totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = totalPages;
        } else {
            const half = Math.floor(maxPagesToShow / 2);
            if (currentPage <= half) {
                startPage = 1;
                endPage = maxPagesToShow;
            } else if (currentPage + half >= totalPages) {
                startPage = totalPages - maxPagesToShow + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - half;
                endPage = currentPage + half;
            }
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    };

    const paginationButtons = getPaginationButtons();


    return (
        <div>
            <h1 className="text-4xl font-bold font-heading text-secondary text-center p-4">Our Products</h1>

            {/* Product Navigation */}
            <div className={` text-center text-secondary ${showProductNav}`}>
                <LinkSlider navLinks={productNavLink} />
            </div>

            {/* Product Grid for homepage*/}
            <div className={`${showProductInHomepage}`}>
                {productsToShowInHomepage.map(product => (
                    <ProductCard
                        key={product.id}
                        productName={product.name}
                        price={product.price}
                        imageUrls={product.imageUrls}
                        sizes={product.sizes}
                    />
                ))}
            </div>

            {/* Product Grid for products page */}
            {/* Product Grid */}
            <div className={`${showProductInProductPage}`}>
                {productsToShow.map(product => (
                    <ProductCard
                        key={product.id}
                        productName={product.name}
                        price={product.price}
                        imageUrls={product.imageUrls}
                        sizes={product.sizes}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            <div className={showPagination}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary text-secondary'}`}
                >
                    &laquo;
                </button>
                {paginationButtons.map(pageNumber => (
                    <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 mx-1 rounded-md ${currentPage === pageNumber ? 'bg-secondary text-primary' : 'bg-primary text-secondary'}`}
                    >
                        {pageNumber}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary text-secondary'}`}
                >
                    &raquo;
                </button>
            </div>
            {/* Conditionally render the "View More" button */}
            {
                location.pathname === "/" && products.length > 5 && (
                    <div className="text-center p-4">
                        <Link
                            to="/products"
                            className="bg-secondary text-primary px-4 py-2 rounded"
                        >
                            View More
                        </Link>
                    </div>
                )
            }
        </div >
    );
}

export default Product;
