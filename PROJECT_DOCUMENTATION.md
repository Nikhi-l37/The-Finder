# Project Documentation: Local Inventory System

## 1. Project Overview
The **Local Inventory Project** is a location-based inventory management system designed for local shops. It provides an end-to-end marketplace experience allowing sellers to create shops, list products with images, and manage their inventory. On the consumer side, users can discover shops and products based on their geographical location. It features secure OTP-based login with email verification.

---

## 2. Architecture & Tech Stack

### Frontend (Client)
A modern Single Page Application (SPA) built for performance and responsive UI.
- **Framework:** React.js 19
- **Build Tool:** Vite
- **Routing:** React Router v7
- **UI Library:** Material UI (MUI) & Emotion (CSS modules for styling)
- **Mapping/Geolocation:** Leaflet & React-Leaflet
- **HTTP Client:** Axios

### Backend (Server)
A RESTful API that handles business logic, geolocation queries, and authentication.
- **Runtime:** Node.js
- **Web Framework:** Express.js 5
- **Database Driver:** `pg` (PostgreSQL client)
- **Authentication:** JSON Web Tokens (JWT) & BcryptJS for password hashing
- **Email Delivery:** SendGrid Mail API (`@sendgrid/mail`) / general SMTP support
- **File Uploads:** Multer (for handling product/shop image uploads)
- **Security:** Express Rate Limit, CORS.

### Database
- **Engine:** PostgreSQL (Hosted on **Supabase**)
- **Extensions Used:**
  - `postgis`: Powers complex geolocation queries (e.g., finding shops near a user).
  - `pg_trgm`: Enables fast text-based fuzzy search for products and shops.
- **Key Tables:** Users, Shops, Products, Categories, OTP (`seller_login_otp`).

---

## 3. Directory Structure

```text
/
├── client/                     # Frontend Application
│   ├── public/                 # Static assets
│   ├── src/                    # React Source Code
│   │   ├── api.js              # Axios configuration & API calls
│   │   ├── components/         # Reusable UI components (ProductManager, Map, etc.)
│   │   ├── context/            # React Context (e.g., ThemeContext)
│   │   ├── pages/              # Route definitions (Home, Auth, Dashboard, etc.)
│   │   └── main.jsx            # React application entry point
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
│
├── server/                     # Backend Application
│   ├── middleware/             # Express middlewares (Auth, validation, uploads)
│   ├── scripts/                # Database migration and utility scripts
│   ├── uploads/                # Local storage for uploaded images
│   ├── utils/                  # Helper utilities (Email/SMTP, OTP generation)
│   ├── db.js                   # Database connection pool setup
│   ├── index.js                # Express app entry and route mounting
│   ├── schema.sql              # Core database schema
│   └── package.json            # Backend dependencies
│
└── supabase/                   # Supabase configuration
    └── migrations/             # SQL Migration files (e.g., OTP table generation)
```

---

## 4. Key Features

1. **Location-Based Search:** Utilizes PostGIS database queries via Leaflet maps allowing users to visualize and navigate nearby shops.
2. **Shop & Product Management:** Sellers get access to a dashboard to create storefronts, add/edit items, manage categories, and upload media.
3. **Robust Authentication:** Secure sign-up/login pipeline containing rate limits, JWT sessions, Bcrypt password hashes, and a newly implemented Secure OTP-based login (Email Verification).
4. **Fuzzy Searching:** High-performance database indexing (`pg_trgm`) ensuring fast auto-complete and search results.
5. **Theme Support:** Context-managed light/dark UI themes across the dashboard.

---

## 5. Development & Deployment Processes

### Local Setup
1. **Database:** Provisions to Supabase or local Postgres instance with `postgis` and `pg_trgm` extensions enabled.
2. **Backend Engine:** 
   - Uses `.env` configuration for `DATABASE_URL`, `JWT_SECRET`, and `SMTP` configs. 
   - Starts via `npm run dev` (run by Nodemon).
3. **Frontend Engine:**
   - Starts via `npm run dev` routing to Vite's local dev server. Proxy configuration is handled to bypass CORS locally to the API.

### Build Process
- **Frontend Build:** The client executes `npm run build`, generating a minified, chunk-split vanilla HTML/JS/CSS bundle in `client/dist`.
- **Backend Deployment:** The Node.js application expects a production runtime environment running `npm start`. If deploying on a self-managed server (like EC2 as per your previous message), an NGINX reverse-proxy or process manager like PM2 is generally advised to serve the Frontend bundle and route `/api` traffic to the backend process.

---

## 6. Migration Data
All structural changes tracking should rely on `server/scripts/` (e.g., `migrate_v3.js`, `migrate_search.js`) or executing raw queries from `supabase/migrations/` sequentially. The system uses a dedicated SQL execution approach over ORM abstraction tools.