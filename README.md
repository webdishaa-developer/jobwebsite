# Recluta Talent Management — Full Stack Website

**Company:** Recluta Talent Management Private Limited  
**CIN:** U93090CT2020PTC010332  
**Founded:** 24 December 2020  

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion, GSAP |
| Backend | Node.js, Express.js, TypeScript |
| Database | MySQL + Prisma ORM |
| Auth | JWT + bcrypt |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer |
| UI Components | Shadcn UI + Radix UI |

---

## 📁 Project Structure

```
recluta/
├── frontend/          # Next.js 14 App Router frontend
│   ├── src/
│   │   ├── app/       # Pages (App Router)
│   │   │   ├── (main)/    # Public pages with navbar/footer
│   │   │   │   ├── page.tsx        # Home
│   │   │   │   ├── about/          # About page
│   │   │   │   ├── services/       # Services page
│   │   │   │   ├── jobs/           # Jobs listing + detail
│   │   │   │   ├── careers/        # Internal careers
│   │   │   │   └── contact/        # Contact form
│   │   │   └── admin/             # Admin panel
│   │   │       ├── page.tsx        # Login
│   │   │       ├── dashboard/      # Analytics dashboard
│   │   │       ├── jobs/           # Job management
│   │   │       ├── applicants/     # Application management
│   │   │       ├── testimonials/   # Testimonial management
│   │   │       └── updates/        # Blog/updates management
│   │   ├── components/
│   │   │   ├── home/       # Home page sections
│   │   │   ├── layout/     # Navbar, Footer
│   │   │   └── shared/     # Reusable components
│   │   ├── lib/        # API client, utilities
│   │   ├── types/      # TypeScript types
│   │   └── styles/     # Global CSS
│   └── public/
│
└── backend/           # Node.js + Express API
    ├── src/
    │   ├── server.ts   # App entry point
    │   ├── controllers/ # Route handlers
    │   ├── routes/      # Express routes
    │   ├── middleware/  # Auth, validation
    │   ├── utils/       # Email, logger, slugify
    │   └── config/      # Cloudinary config
    └── prisma/
        ├── schema.prisma  # Database schema
        └── seed.ts        # Sample data seed
```

---

## ⚡ Quick Setup

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Cloudinary account (free tier works)
- Gmail/SMTP credentials

---

### 1. Clone & Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
```

### 2. Setup Database

```bash
# Create MySQL database
mysql -u root -p -e "CREATE DATABASE recluta_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run Prisma migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Seed with sample data
npm run db:seed
```

### 3. Start Backend

```bash
npm run dev
# Runs on http://localhost:5000
```

---

### 4. Configure Frontend

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
npm install
```

### 5. Start Frontend

```bash
npm run dev
# Runs on http://localhost:3000
```

---

## 🔐 Admin Access

After seeding, log in at `http://localhost:3000/admin`:

| Field | Value |
|-------|-------|
| Email | info@reclutasolutions.in |
| Password | Admin@Recluta2024! |

> **Change the password immediately** after first login via the admin panel.

---

## 🌐 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/jobs` | List jobs (filter, search, paginate) |
| GET | `/api/v1/jobs/slug/:slug` | Job detail by slug |
| POST | `/api/v1/applications/job/:jobId` | Apply for job |
| GET | `/api/v1/testimonials` | List testimonials |
| POST | `/api/v1/contact` | Submit contact form |

### Protected (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Admin login |
| GET | `/api/v1/admin/dashboard` | Dashboard analytics |
| POST | `/api/v1/jobs` | Create job |
| PUT | `/api/v1/jobs/:id` | Update job |
| DELETE | `/api/v1/jobs/:id` | Delete job |
| GET | `/api/v1/applications` | List all applications |
| PATCH | `/api/v1/applications/:id/status` | Update application status |

---

## 🚀 Production Deployment

### Backend (on VPS / Railway / Render)

```bash
cd backend

# Build
npm run build

# Set NODE_ENV=production in environment
# Set DATABASE_URL to production MySQL
# Start
npm start
```

### Frontend (on Vercel — recommended)

```bash
cd frontend

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://api.reclutasolutions.in/api/v1
# NEXT_PUBLIC_SITE_URL=https://reclutasolutions.in

vercel --prod
```

### Nginx reverse proxy (example)

```nginx
server {
    server_name api.reclutasolutions.in;
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📋 Environment Variables Reference

### Backend `.env`
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://reclutasolutions.in
DATABASE_URL=mysql://user:pass@host:3306/recluta_db
JWT_SECRET=<min 32 random chars>
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=<different random string>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@reclutasolutions.in
SMTP_PASS=<gmail app password>
EMAIL_FROM=info@reclutasolutions.in
EMAIL_FROM_NAME=Recluta Talent Management
ADMIN_EMAIL=info@reclutasolutions.in
ADMIN_PASSWORD=<strong password>
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=https://api.reclutasolutions.in/api/v1
NEXT_PUBLIC_SITE_URL=https://reclutasolutions.in
NEXT_PUBLIC_WHATSAPP_NUMBER=919522299615
```

---

## 📞 Contact

**Recluta Talent Management Pvt Ltd**  
📧 info@reclutasolutions.in  
📞 +91 95222 99615  
📍 Bilaspur, Chhattisgarh — 495001  

---

*Built with ❤️ for Recluta Talent Management Pvt Ltd*
