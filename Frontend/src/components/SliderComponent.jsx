import React from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SliderComponent = ({ imageUrls }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        centerMode: true,
        centerPadding: '0',
        autoplay: true,
        autoplaySpeed: 2000,
    };

    return (
        <div className="relative w-full h-80 md:h-96 mb-12">
            {imageUrls && imageUrls.length > 0 && (
                <Slider {...settings}>
                    {imageUrls.map((url, index) => (
                        <div key={index} className="flex justify-center">
                            <img
                                src={url}
                                alt={`Slide ${index}`}
                                className="object-cover w-full h-96 md:h-96 mb-8 xl:h-[26rem]"
                            />
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    );
};

export default SliderComponent;
