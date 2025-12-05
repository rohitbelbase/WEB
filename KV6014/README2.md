# Group Project – Next.js + Prisma Authentication

This project is a working prototype with:
- Next.js 16 (Turbopack)
- Prisma ORM with SQLite
- NextAuth (Credentials Provider)
- Sign-up / Login / Profile edit structure

## Setup
1. Clone the repo  
   ```bash
   git clone https://github.com/<org-or-username>/<repo>.git
   cd <repo>
   npm install
2. Create .env.local using template
   NEXTAUTH_SECRET=your_own_secret
   NEXTAUTH_URL=http://localhost:3000
   DATABASE_URL="file:./prisma/dev.db"
3. Run database migrations
   npx prisma migrate dev --schema=prisma/schema.prisma
4. Start the dev server
   npm run dev
