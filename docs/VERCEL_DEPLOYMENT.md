# DocNest — Vercel Web Portals Hosting Guide

> **Deploying Doctor Portal & Master Admin Panel on Vercel (Free)**

---

## 🚀 1. Deploying Doctor Web Portal (`apps/doctor-web`)

### Method A: Vercel Web Dashboard (Recommended)
1. Go to [https://vercel.com](https://vercel.com) and log in.
2. Click **Add New...** -> **Project**.
3. Select your GitHub repository **`FrozenLionMax/DocNest`**.
4. Configure Project Settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: Select `apps/doctor-web`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
5. Click **Deploy**.
6. *(Optional)* Add Environment Variables under **Settings -> Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://YOUR_PROJECT.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `YOUR_ANON_KEY`

---

## 🚀 2. Deploying Master Admin Panel (`apps/admin-web`)

### Method A: Vercel Web Dashboard (Recommended)
1. Click **Add New...** -> **Project**.
2. Select **`FrozenLionMax/DocNest`** again.
3. Configure Project Settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: Select `apps/admin-web`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
4. Click **Deploy**.

---

## 🔗 Live Domain Customization
Once deployed, Vercel gives you instant HTTPS URLs (e.g. `doctor-docnest.vercel.app`).
You can add custom domains like `doctor.docnest.in` and `admin.docnest.in` under **Settings -> Domains** for free.
