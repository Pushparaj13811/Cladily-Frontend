# Cladily Backend

### Version: 1.0.0

The backend system for Cladily powers an advanced e-commerce platform, handling user management, product catalog, order processing, inventory, reviews, and more. Built with Node.js and Express, it ensures a scalable, secure, and efficient online shopping experience.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Project Overview

Cladily is an e-commerce platform specifically designed for a clothing company. It includes features like user authentication, product management, shopping cart, order management, inventory control, and more. The backend system is responsible for processing and managing all operations behind the scenes, ensuring a smooth user experience on the front end.

## Technologies Used

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: NoSQL database used for storing and managing data.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **JWT**: JSON Web Token for securing API endpoints.
- **Cloudinary**: Cloud storage service for images and other media files.

## Database Schema

The backend system consists of the following tables/models:

### Users

- **Admin**: Manages site operations, including credentials, roles, and permissions.
- **User**: Regular customers with login info, personal details, and preferences.
- **Guest**: Non-registered users who can browse and add items to their cart or wishlists.

### Products

- **Product**: Items available for sale, with details like name, description, price, and stock quantity.
- **Product_Image**: Images associated with products.
- **Product_Variant**: Different versions of products like sizes or colors.
- **Product_Type**: Categorizes products into types or groups.

### Reviews

- **Review**: User feedback on products, including ratings and comments.

### Orders

- **Order_Item**: Details of items within an order.
- **Order_Status**: Tracks the order status throughout its lifecycle.

### Shopping_Carts

- **Shopping_Carts**: Stores user cart items.

### Wish_Lists

- **Wish_Lists**: Stores user wishlist items.

### Additional Models

- **Addresses**
- **Payment_Methods**
- **Coupons**
- **Shipping_Options**
- **Product_Tags**
- **Discounts**
- **Return_Requests**
- **Order_Tracking**
- **Inventory**
- **Suppliers**
- **Customer_Support_Tickets**
- **Admin_Roles**
- **Product_Recommendations**
- **Transaction_History**

## API Endpoints

All API endpoints are defined in the [`routes/api.js`](./path/to/your/routes/api.js) file.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Pushparaj13811/Cladily.git
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**  
   Create a `.env` file in the root directory and include the following:
   ```env
   PORT=<your-port>
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

## Usage

Once the server is up and running, you can use tools like Postman to interact with the API or connect your frontend application to it.

## Environment Variables

- **PORT**: The port number where the server runs.
- **MONGO_URI**: The MongoDB connection string.
- **JWT_SECRET**: Secret key for signing JWT tokens.
- **CLOUDINARY_CLOUD_NAME**: Cloudinary cloud name for media storage.
- **CLOUDINARY_API_KEY**: Cloudinary API key.
- **CLOUDINARY_API_SECRET**: Cloudinary API secret.

## Contributing

This is a private repository for Cladily. Only employees assigned to contribute to this project are permitted to do so. Please contact the repository maintainer if you are assigned to contribute and require access.

## License

This project is licensed under the terms of the [LICENSE](./LICENSE).

## Contact

For any inquiries or support, please reach out to:

- **Email**: pushparajmehta002@gmail.com
