# Local Development Guide

Getting started with local development of the Expense Tracker.

## Quick Start

\`\`\`bash
# 1. Clone the repository
git clone <your-repo-url>
cd expensetracker

# 2. Install dependencies
npm install

# 3. Setup local database
createdb expensetracker
psql expensetracker < scripts/01-init-schema.sql

# 4. Create .env.local
cp .env.local.example .env.local

# 5. Start development server
npm run dev
\`\`\`

Visit `http://localhost:3000`

## Full Setup Instructions

### 1. Prerequisites

- **Node.js**: v18+ ([Download](https://nodejs.org))
- **PostgreSQL**: 12+ ([Download](https://www.postgresql.org/download))
- **Git**: ([Download](https://git-scm.com))

### 2. Database Setup

\`\`\`bash
# Start PostgreSQL service
# macOS: brew services start postgresql
# Ubuntu: sudo systemctl start postgresql
# Windows: Start via pgAdmin

# Create database and user
createdb expensetracker

# Import schema
psql expensetracker < scripts/01-init-schema.sql

# Verify
psql expensetracker -c "\\dt"
\`\`\`

### 3. Environment Setup

\`\`\`bash
# Copy example env
cp .env.local.example .env.local

# Update DATABASE_URL to local PostgreSQL
# DATABASE_URL=postgresql://localhost:5432/expensetracker
\`\`\`

### 4. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 5. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The app runs on `http://localhost:3000`

### 6. Create Test Accounts

\`\`\`bash
psql expensetracker

-- Regular user (password: testpass)
INSERT INTO users (email, password_hash, name, theme, is_admin)
VALUES (
  'test@example.com',
  crypt('testpass', gen_salt('bf')),
  'Test User',
  'light',
  false
);

-- Admin user (password: adminpass)
INSERT INTO users (email, password_hash, name, theme, is_admin)
VALUES (
  'admin@expensetracker.com',
  crypt('adminpass', gen_salt('bf')),
  'Admin',
  'dark',
  true
);
\`\`\`

## Common Development Tasks

### Run in Debug Mode

\`\`\`bash
npm run dev -- --verbose
\`\`\`

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Run Linter

\`\`\`bash
npm run lint
\`\`\`

### Database Debugging

\`\`\`bash
# Connect to database
psql expensetracker

-- List all tables
\dt

-- View table structure
\d expenses

-- Run raw SQL
SELECT * FROM users LIMIT 5;
\`\`\`

### API Testing

Use tools like:
- **Postman**: [https://postman.com](https://postman.com)
- **Insomnia**: [https://insomnia.rest](https://insomnia.rest)
- **cURL**: Command line

Example:

\`\`\`bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "theme": "light"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get expenses (with token)
curl -X GET http://localhost:3000/api/expenses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
\`\`\`

## Troubleshooting

### PostgreSQL Connection Error

\`\`\`bash
# Check if PostgreSQL is running
psql --version

# macOS
brew services start postgresql

# Ubuntu
sudo systemctl start postgresql

# Windows: Use pgAdmin
\`\`\`

### Module Not Found Errors

\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Port 3000 Already in Use

\`\`\`bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
\`\`\`

### Database Migration Failed

\`\`\`bash
# Drop and recreate database
dropdb expensetracker
createdb expensetracker
psql expensetracker < scripts/01-init-schema.sql
\`\`\`

## Project Structure

\`\`\`
expensetracker/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── expenses/
│   │   ├── budgets/
│   │   └── ...
│   ├── dashboard/
│   ├── customize/
│   ├── objectives/
│   └── layout.tsx
├── lib/                          # Utilities
│   ├── auth.ts                   # Auth logic
│   ├── auth-utils.ts             # Token verification
│   ├── api-client.ts             # API client
│   ├── storage.ts                # Storage/cache layer
│   ├── db.ts                     # Database connection
│   └── types.ts                  # TypeScript types
├── components/                   # React components
│   ├── auth/
│   ├── dashboard/
│   ├── expenses/
│   ├── budgets/
│   └── ui/                       # shadcn/ui components
├── scripts/                      # Database scripts
│   └── 01-init-schema.sql
├── public/                       # Static assets
├── .env.local.example            # Example env file
├── package.json
└── tsconfig.json
\`\`\`

## Performance Tips

- Use React DevTools to check re-renders
- Monitor Network tab for API call performance
- Use Chrome DevTools Performance tab
- Check database query performance in PostgreSQL

## Useful VSCode Extensions

- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **Thunder Client** - API testing
- **PostgreSQL** - Database extension
- **Tailwind CSS IntelliSense**
