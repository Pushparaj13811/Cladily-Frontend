// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import {
    companyName,
    companyAddress,
    companyEmail,
    companyPhone,
    facebookUrl,
    instagramUrl,
    linkedinUrl,
    twitterUrl
} from '../../constants/constants';

const Footer = () => {
    return (
            <footer className="bg-[#285c3f] text-[#c8f1d9] py-8">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex flex-wrap gap-6 justify-between items-start">
                    {/* About Section */}
                    <div className="w-full md:w-1/2 lg:w-1/4 mb-6">
                        <h3 className="text-lg font-heading font-bold mb-4">About Us</h3>
                        <p className="text-justify font-body">
                            We are a company dedicated to providing the best products and services to our customers. Our mission is to ensure satisfaction and build lasting relationships.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="w-full md:w-1/2 lg:w-1/4 mb-6">
                        <h3 className="text-lg font-bold font-heading mb-4">Quick Links</h3>
                        <ul className="space-y-2 font-body">
                            <li><Link to="/" className="hover:underline">Home</Link></li>
                            <li><Link to="/products" className="hover:underline">Products</Link></li>
                            <li><Link to="/categories" className="hover:underline">Categories</Link></li>
                            <li><Link to="/about" className="hover:underline">About</Link></li>
                            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="w-full md:w-1/2 lg:w-1/4 mb-6">
                        <h3 className="text-lg font-bold mb-4 font-heading">Contact Us</h3>
                        <p className='font-body' >Email: <a href={`mailto:${companyEmail}`} className="font-body hover:underline">{companyEmail}</a></p>
                        <p className='font-body' >Phone: <a href={`tel:${companyPhone}`} className="font-body hover:underline">{companyPhone}</a></p>
                        <p className='font-body' >Address: {companyAddress}</p>
                    </div>

                    {/* Social Media */}
                    <div className="w-full lg:w-1/4 mb-6">
                        <h3 className="text-lg font-bold font-heading mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            <a href={facebookUrl} className="text-[#c8f1d9] hover:text-white" aria-label="Facebook">
                                <FaFacebookF size={20} />
                            </a>
                            <a href={twitterUrl} className="text-[#c8f1d9] hover:text-white" aria-label="Twitter">
                                <FaTwitter size={20} />
                            </a>
                            <a href={instagramUrl} className="text-[#c8f1d9] hover:text-white" aria-label="Instagram">
                                <FaInstagram size={20} />
                            </a>
                            <a href={linkedinUrl} className="text-[#c8f1d9] hover:text-white" aria-label="LinkedIn">
                                <FaLinkedinIn size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t font-heading border-[#c8f1d9] pt-4 mt-8 text-center">
                    <p className="text-sm">&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
