# Travel Blog (Budget Explorer)

Full-stack travel blog platform with JSON file database, image uploads, admin panel, SEO-ready blog detail pages, and animated UX.

## Stack
- Frontend: React + React Router + Framer Motion + Swiper
- Backend: Node.js + Express + Multer + JSON file storage

## Run
`ash
# Backend
cd backend && npm install && node server.js

# Frontend
cd frontend && npm install && npm start
`

## Environment
Create ackend/.env from ackend/.env.example:
`env
PORT=5000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=travel2024
`

## Implemented Core Features
- Slug-based blog routes and view count increment
- JSON file database helpers for blogs/comments/faqs
- Multer local image upload and cleanup on update/delete
- SEO tags + OG tags + JSON-LD support in blog page
- GET /sitemap.xml dynamic from published blogs
- GET /robots.txt
- Blog search (300ms debounce), category filter, and featured carousel
- Admin auth + protected routes + create/edit/delete/toggle publish
- Preview mode before publish
- Comment system with likes + DiceBear avatar
- FAQ filter/search accordion
- Animated 404 page
- Responsive UI with a bold travel aesthetic
