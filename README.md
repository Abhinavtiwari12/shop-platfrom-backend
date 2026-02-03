# Shop Platform Backend (E-Commerce Style)
A scalable and secure RESTful backend for an e-commerce platform built with Node.js, Express.js, and MongoDB. The system supports User & Owner roles, product management, authentication, and search analytics to track user behavior and generate business insights.

#Features
Authentication & Security :-
JWT-based Authentication (Login / Logout / Protected Routes),
Password hashing using bcrypt,
HTTP-only cookies for secure token storage,
Centralized error handling middleware.

Role-Based Access Control (RBAC) :-
User → Browse & search products,
Owner → Full product management + analytics access.

Product Management :-
Create, update, delete products,
Product listing & search,
Search count tracking,
Optimized MongoDB queries.

Search Tracking & Analytics :-
Stores user searched products,
Stores search keywords,
User-wise search history,
Most searched products,
Most searched keywords,
MongoDB aggregation pipelines for analytics.

Architecture :-
MVC structure,
Reusable services,
Clean and modular codebase,
RESTful APIs.

=> Tech Stack
Node.js,
Express.js,
MongoDB & Mongoose,
JWT,
Multer,
Cloudinary,
bcrypt,
Postman (API Testing).

API Highlights

Auth :-
POST /api/auth/register,
POST /api/auth/login,
POST /api/auth/logout.

Products ;-
GET /api/products,
POST /api/products (Owner only),
PUT /api/products/:id (Owner only),
DELETE /api/products/:id (Owner only).

Search & Analytics :-
GET /api/search/history,
GET /api/analytics/most-searched-products,
GET /api/analytics/most-searched-keywords.
