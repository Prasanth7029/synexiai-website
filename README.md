
---

```markdown
# 🌐 SynexiAI Website

> **A modern AI-driven portfolio and innovation hub built with React, Vite, Tailwind CSS, Framer Motion, and Netlify Functions.**  
> Experience the fusion of technology, creativity, and purpose — built to scale and inspire.

---

## 🚀 Project Overview

The **SynexiAI Website** is a high-performance, modular web application showcasing the SynexiAI ecosystem — a future-ready AI and technology platform.  
It features interactive components, animations, light/dark themes, serverless functions, and CI/CD automation with Netlify.

---

## 🧱 Tech Stack

| Category | Technologies |
|-----------|---------------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, React Icons |
| Backend / API | Netlify Functions (Serverless, Node.js-based) |
| Build / Deploy | Netlify CLI, GitHub Actions |
| Other Tools | Axios, Typewriter Effect, ESLint, Prettier |
| Design System | Light/Dark theme via CSS variables + Tailwind classes |

---

## 🧩 Folder Structure

```

synexiai-website/
├── public/                # Static assets (images, videos, icons)
├── src/
│   ├── components/        # UI components (HeroBanner, FeatureCard, etc.)
│   ├── pages/             # Pages (HomePage, AboutPage, VisionPage, ContactPage)
│   ├── content/           # Data (projects, testimonials, milestones)
│   ├── lib/               # Helper functions (API, constants)
│   ├── styles/            # Global and Tailwind styles
│   ├── functions/         # Netlify Functions (serverless APIs)
│   ├── App.jsx            # Root component
│   └── main.jsx           # Vite entry point
├── package.json
├── tailwind.config.js
├── netlify.toml
└── README.md

````

---

## ⚙️ Prerequisites

Make sure you have the following installed:
- **Node.js 20.x** (LTS recommended)
- **npm 10.x** or higher
- **Git** for version control
- **Netlify CLI** (for local functions testing)

Install Netlify CLI globally:
```bash
npm install -g netlify-cli
````

---

## 🧰 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Prasanth7029/synexiai-website.git
cd synexiai-website
```

### 2️⃣ Install Dependencies

```bash
npm install
```

---

## 🧪 Run Locally (Development)

Start the local development server:

```bash
npm run dev
```

This runs the app on:
👉 [http://localhost:5173](http://localhost:5173)

It supports **hot reload**, so any code or CSS changes update instantly.

---

## 🧠 Running Serverless Functions

To test Netlify functions locally:

```bash
netlify functions:serve --port=9999
```

This runs your API routes (e.g., `/api/ai-facts`, `/api/contact`) on
👉 [http://localhost:9999/.netlify/functions/your-function-name]

Functions are stored inside the `/src/functions` or `/netlify/functions` directory (based on your config).

---

## 🏗️ Build for Production

Generate optimized production build:

```bash
npm run build
```

The output will be in the `/dist` folder, ready to deploy.

You can preview the production build locally:

```bash
npm run preview
```

---

## ☁️ Deploy to Netlify

### Option 1: Automatic via GitHub

1. Push your repo to GitHub.
2. Go to [Netlify Dashboard](https://app.netlify.com/).
3. Click **“New Site from Git” → GitHub → Select Repo.**
4. Set build command:

   ```
   npm run build
   ```

   and publish directory:

   ```
   dist
   ```
5. Deploy! 🌍

---

### Option 2: Manual via Netlify CLI

If you prefer CLI deployment:

```bash
npm run deploy:netlify
```

Or manually:

```bash
netlify deploy --prod
```

When first prompted:

* **Build command:** `npm run build`
* **Publish directory:** `dist`
* **Functions directory:** `netlify/functions`

---

## 🔄 Continuous Deployment (CI/CD)

Whenever you push to your main branch, Netlify automatically:

* Installs dependencies
* Builds the project
* Deploys the latest version live 🚀

You can customize build settings via **netlify.toml**.

---

## 🎨 Theming

The app supports **light/dark mode** using:

* CSS variables (`--color-bg`, `--text-color`, etc.)
* Tailwind’s `dark:` classes

You can toggle themes dynamically — fully compatible with Tailwind and Framer Motion transitions.

---

## 🧠 Troubleshooting

| Issue                        | Possible Fix                            |
| ---------------------------- | --------------------------------------- |
| `EBADENGINE` warning         | Use Node 20.x and npm 10.x              |
| Netlify function not running | Check `netlify.toml` function path      |
| CORS or 403 errors           | Verify API base URLs and `.env` setup   |
| Build fails on Netlify       | Clear cache & reinstall deps (`npm ci`) |

---

## 🌟 Future Enhancements

* 🌍 Multi-language support (i18n)
* 🧩 AI Chat Integration (SynexiAI Assistant)
* 🧱 Admin Dashboard
* ⚡ Edge Functions for dynamic routing
* 💬 Blog & CMS integration (Notion / Sanity / Ghost)

---

## 🧾 License

This project is licensed under the **MIT License** — free to use, modify, and share.

---

## 💬 Contact

**Developer:** [Venkat Sai Prasanth Kunchanapalli](mailto:venkatsai.prasanth@gmail.com)
**Website:** [https://www.synexiai.online](https://www.synexiai.online)

---

> *"Built with ❤️, caffeine, and an unstoppable dream — SynexiAI, where innovation meets identity."*

```

---

Would you like me to generate this as a **`README.md` file** you can directly drop into your project folder (I can also include a mini banner + badge section at the top — GitHub-ready)?
```
