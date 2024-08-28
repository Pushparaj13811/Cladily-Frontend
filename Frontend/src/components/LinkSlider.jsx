import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';


function LinkSlider({ navLinks }) {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }

    return (
        <div className="relative overflow-hidden flex justify-center text-center w-full h-16">
            <div className="space-x-6 text-center w-full lg:w-1/2 ">
                <Slider {...settings}>
                    {navLinks.map((link) => (
                        <Link
                            to={link.link}
                            key={link.name}
                            className="slider-item"
                        >
                            {link.name}
                        </Link>

                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default LinkSlider;
