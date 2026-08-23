# Local Inventory Project

A location-based inventory management system for local shops, powered by Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js v16 or higher
- A Supabase account (free tier works!)
- npm or yarn

### 1. Clone and Install

```bash
git clone <repository-url>
cd local-inventory-project

cd server
npm install

cd ../client
npm install
```

### 2. Set Up Supabase Database

#### A. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Navigate to **Settings** → **Database**
4. Find your connection string: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

#### B. Enable Required Extensions

In Supabase Dashboard:
1. Go to **Database** → **Extensions**
2. Enable:
   - ✅ **postgis** (for geolocation features)
   - ✅ **pg_trgm** (for fuzzy search)

#### C. Create Database Schema

1. Go to **SQL Editor** in Supabase Dashboard
2. Open `server/schema.sql`
3. Copy, paste, and click **Run**

### 3. Configure Environment Variables

```bash
cd server
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_USER=postgres
DATABASE_HOST=db.xxxxx.supabase.co
DATABASE_NAME=postgres
DATABASE_PASSWORD=your_database_password
DATABASE_PORT=5432

JWT_SECRET=generate_a_secure_random_string
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Verify Setup

```bash
cd server
npm run setup        # Check if everything is configured
npm run troubleshoot # Test database connection
```

### 5. Start the Application

```bash
# Terminal 1: Start the backend
cd server
npm start
# Runs on http://localhost:3001

# Terminal 2: Start the frontend
cd client
npm run dev
# Runs on http://localhost:5173
```

## 📁 Project Structure

```
local-inventory-project/
├── server/
│   ├── db.js
│   ├── index.js
│   ├── auth.js
│   ├── shop.js
│   ├── product.js
│   ├── search.js
│   ├── middleware/
│   ├── scripts/
│   └── .env
├── client/
│   └── src/
└── supabase/
    └── migrations/
```

## 🔧 Available Scripts

### Server (`cd server`)
- `npm start` - Start server
- `npm run setup` - Verify setup
- `npm run troubleshoot` - Diagnose connection issues
- `npm run migrate:v3` - Run database migrations
- `npm run migrate:search` - Create search indexes

### Client (`cd client`)
- `npm run dev` - Start development server
- `npm run build` - Build for production

## 🌐 API Endpoints

### Public
- `GET /api/health`
- `POST /api/sellers/register`
- `POST /api/sellers/login`
- `GET /api/search?q=query&lat=17.385&lon=78.486`
- `GET /api/products/shop/:shopId`

### Protected (Require JWT)
- `POST /api/shops`
- `POST /api/products`
- `PATCH /api/shops/status`

## 🔐 Authentication

Login returns a JWT token directly. Include it in requests:

```javascript
headers: {
  'x-auth-token': 'your_jwt_token_here'
}
```

## 🗺️ Features

- 📍 Location-based search
- 🔍 Fuzzy text search
- 👤 Seller authentication (email + password → JWT)
- 🏪 Shop management
- 📦 Product management
- 🏷️ Categories
- 🕒 Operating hours
- 📸 Image uploads

## 🔍 Troubleshooting

```bash
cd server
npm run troubleshoot
```

### Common Problems

1. **"Cannot find module 'pg'"** → Run `npm install` in server directory
2. **"Connection refused"** → Check if Supabase project is active
3. **"PostGIS not found"** → Enable PostGIS extension in Supabase
4. **"Too many connections"** → Use port 6543 (pooler mode)

## 🔒 Security Notes

- Never commit `.env` files (already in `.gitignore`)
- Use strong JWT secrets (minimum 32 characters)
- Rotate database passwords regularly
