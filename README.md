# PDF Generator

A web application to generate PDFs from product data, allowing users to select brands, filter products with photos, and set minimum quantity thresholds. Built with Vue.js (frontend), Express (backend), and PDFKit for PDF generation.

## Live Application
- **Frontend**: GitHub Pages (auto-deployed on push to main)
- **Backend**: https://gen-pdf-0hb9.onrender.com/ (auto-deployed on push to main)

## Features
- Select multiple brands to include in the PDF
- Option to include only products with photos
- Filter products by minimum quantity
- Responsive UI with Tailwind CSS
- Dynamic PDF file names based on selected brands
- Automatic deployment via GitHub Actions

## Local Development Setup

### Backend
```bash
cd backend
npm install
npm start
```
Server runs on `http://localhost:3000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`

## Deployment

This project uses GitHub Actions for automatic deployment:
- **Frontend**: Deploys to GitHub Pages on push to `main` branch
- **Backend**: Triggers Render deployment on push to `main` branch

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup instructions.

## Tech Stack
- **Frontend**: Vue 3, Vite, Tailwind CSS, Axios
- **Backend**: Express.js, PDFKit, CORS
- **Deployment**: GitHub Actions, GitHub Pages, Render
