# oAI Chat – t3.chat Clone

A full-featured, open-source AI chat application inspired by [t3.chat](https://t3.gg/chat), built with modern technologies and packed with advanced features.

## 🔑 Features

- 🤖 Chat with multiple AI models via OpenRouter
- 🔐 Authentication using Supabase (Google sign-in supported)
- 💬 Persistent chat history with syncing
- 🌱 Branching chat conversations
- 🧠 Personalized memory for user context
- 🔑 BYOK (Bring Your Own API Key) support

## ⚙️ Tech Stack

- **Frontend:** Vite + React + TailwindCSS
- **Backend:** Express.js + Prisma
- **Database:** Supabase(Auth) + Neon.tech
- **Hosting:** Netlify (Frontend) + AWS (API)

## 🚀 Live Demo

👉 Try it here: [oaichat.netlify.app](https://oaichat.netlify.app)

---

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/OM3X4/oAI.git
cd oAI
```

### 2. Supabase Setup

- Create a new project on [Supabase](https://supabase.com)
- Enable **Google Authentication** under Authentication > Providers
- Retrieve the following values:

  - `SUPABASE_URL` and `SUPABASE_ANON_KEY`: Found in Project Settings → API
  - `JWT_SECRET`: Found in Project Settings → API → JWT Settings

### 3. Backend Setup

Navigate to the `backend` directory and create a `.env` file:

```env
# .env (Backend)
DATABASE_URL=your_postgres_ipv4_connection_string
JWT_SECRET=your_supabase_jwt_secret
KEY_HASH_SECRET=your_32_byte_base64_encoded_key
```

Generate a valid 32-byte Base64 key using Node.js:

```js
console.log(require('crypto').randomBytes(32).toString('base64'));
```

Install dependencies and initialize Prisma:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### 4. Frontend Setup

Navigate to the `client` directory and create a `.env` file:

```env
# .env (Client)
VITE_API_URL=http://localhost:PORT              # Replace with your backend port
VITE_SUPABASE_PROJECT_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Then start the development server:

```bash
cd client
npm install
npm run dev
```

### 5. CORS Configuration

In `backend/index.js`, ensure CORS is correctly configured to allow the frontend origin:

```js
const corsOptions = {
  origin: ["http://localhost:4000", "https://oaichat.netlify.app"],
  credentials: true
};
```

---

Happy building! 🚀
