# oAI Chat – t3.chat Clone

A full-featured, open-source AI chat app inspired by [t3.chat](https://t3.gg/chat).

## 🔑 Features
- 🤖 Chat with multiple AI models (OpenRouter)
- 🔐 Supabase Auth + sync
- 🔁 Chat history
- 🌱 Branching chats
- 🧠 Memory & personalization
- 🔑 BYOK (Bring Your Own Key)

## ⚙️ Stack
- Frontend: Vite + React + Tailwind
- Backend: Express.js on Railway
- DB: Supabase + Neon.tech
- Hosting: Netlify (Frontend), Railway (API)

## 🚀 Try It Live
👉 [oaichat.netlify.app](https://oaichat.netlify.app)


🚀 Deployment

Follow these steps to set up and run the project locally:
1. Clone the Repository

git clone https://github.com/OM3X4/oAI.git .

2. Set Up Supabase

    Create a Supabase project

    Enable Google Authentication

    Retrieve the following values:

        JWT_SECRET → Found in Supabase Project Settings → API → JWT Secret

        SUPABASE_URL and SUPABASE_ANON_KEY → Found in API Settings

3. Backend Setup

Go to the Backend folder and create a .env file:

# .env (Backend)
DATABASE_URL=your_postgres_ipv4_connection_string
JWT_SECRET=your_supabase_jwt_secret
KEY_HASH_SECRET=your_32_byte_base64_encoded_key

Then run:

npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev

4. Frontend Setup

Navigate to the Client folder and create a .env file:

# .env (Client)
VITE_API_URL=http://localhost:PORT  # Replace with your backend port
VITE_SUPABASE_PROJECT_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

Then run:

npm install
npm run dev

5. Final Backend Config

In Backend/index.js, update the CORS origin whitelist or app config to include the frontend URL (e.g. http://localhost:5173 or whatever your frontend is running on).
