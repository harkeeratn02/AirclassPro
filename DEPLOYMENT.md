# Deployment Guide: AirclassPRO Production Web App

This project is now a full-stack production-ready application. Follow these instructions to deploy it as a public website.

## 1. Prerequisites
- A [Vercel](https://vercel.com) account.
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## 2. Secure Your API Key
The application is configured to use a server-side proxy (`/api/ai`). This ensures your `GEMINI_API_KEY` is never exposed to the user's browser.

## 3. Deploy to Vercel

1. **Push to GitHub**: Initialize a Git repository and push your code to a new GitHub repository.
2. **Import to Vercel**: Connect your GitHub account to Vercel and import the project.
3. **Configure Framework**: Vercel should automatically detect **Vite**.
4. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Environment Variables**:
   - Add `GEMINI_API_KEY` with your actual key from Google AI Studio.
   - Add `NODE_ENV` set to `production`.

## 4. Local Development

To run the full-stack app locally:
1. Copy `.env.example` to `.env`.
2. Fill in your `GEMINI_API_KEY`.
3. Run `npm install`.
4. Start the dev server: `npm run dev`.

## 5. Security Best Practices
- **Rate Limiting**: For a production app with many users, consider adding rate-limiting middleware (like `express-rate-limit`) to the `/api/ai` route in `server.ts`.
- **CORS**: Ensure your CORS settings in `server.ts` only allow requests from your production domain.
- **Unauthorized Usage**: The current implementation proxies all requests. You may want to add a simple authentication layer or secret token shared between frontend and backend to prevent other websites from using your API.

## 6. Mobile Compatibility
The app uses Tailwind CSS with a mobile-first approach. It is fully responsive and tested for:
- iPhone (Safari/Chrome)
- Android (Chrome)
- Tablets and Desktops
