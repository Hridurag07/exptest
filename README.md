# Gamified Expense Tracker - Cloud Ready

A modern, gamified expense tracking application built with Next.js, designed for easy cloud deployment on AWS.

## Features

- **User Authentication**: Secure JWT-based authentication
- **Expense Tracking**: Log daily expenses with categories
- **Budget Management**: Set and monitor budgets
- **Gamification**: Earn points, levels, badges, and rewards
- **Income Tracking**: Record multiple income sources
- **Spending Limits**: Set spending thresholds with alerts
- **Progress Tracking**: Visual stats and achievements
- **Avatar Customization**: Personalize your avatar with cosmetics
- **Admin Dashboard**: Manage users and system overview
- **Dark Mode**: Light and dark theme support

## Quick Start

### Local Development

\`\`\`bash
# Clone repository
git clone <your-repo>
cd expensetracker

# Install dependencies
npm install

# Setup local database
createdb expensetracker
psql expensetracker < scripts/01-init-schema.sql

# Configure environment
cp .env.local.example .env.local

# Start development server
npm run dev
\`\`\`

Visit `http://localhost:3000` and login with:
- **Email**: test@example.com
- **Password**: testpass

### Cloud Deployment (AWS)

See [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md) for complete setup instructions.

**Quick Summary:**
1. Create RDS PostgreSQL database
2. Launch EC2 Ubuntu instance
3. Install Node.js and dependencies
4. Configure Nginx reverse proxy
5. Setup SSL with Let's Encrypt
6. Deploy with PM2

## Architecture

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom theme
- **Components**: shadcn/ui component library
- **State Management**: React hooks + SWR for data fetching

### Backend
- **Runtime**: Node.js with Next.js API routes
- **Database**: PostgreSQL with Neon driver
- **Authentication**: JWT tokens with bcrypt password hashing
- **Session Management**: Database-backed sessions

### Deployment
- **Server**: AWS EC2 (t3.micro recommended)
- **Database**: AWS RDS PostgreSQL
- **Web Server**: Nginx reverse proxy
- **Process Manager**: PM2 with auto-restart
- **SSL**: Let's Encrypt certificates

## Environment Variables

Create `.env.local` file:

\`\`\`env
# Database Connection (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/expensetracker

# Next.js Configuration
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRATION=7d
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to existing account

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `DELETE /api/expenses/[id]` - Delete expense

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget

### User
- `GET /api/user/profile` - Get user profile
- `GET /api/progress` - Get user progress

### Admin
- `GET /api/admin/users` - List all users (admin only)

All endpoints require `Authorization: Bearer <token>` header.

## Project Structure

\`\`\`
expensetracker/
├── app/
│   ├── api/                    # API routes
│   ├── dashboard/              # Main app
│   ├── customize/              # Settings
│   ├── objectives/             # Goals
│   ├── rewards/                # Rewards
│   ├── transactions/           # Transactions
│   └── layout.tsx
├── components/
│   ├── auth/                   # Login/signup forms
│   ├── dashboard/              # Dashboard components
│   ├── expenses/               # Expense widgets
│   ├── budgets/                # Budget management
│   ├── gamification/           # Badges, progress
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── auth.ts                 # Auth logic
│   ├── auth-utils.ts           # Token verification
│   ├── api-client.ts           # API client
│   ├── db.ts                   # Database connection
│   ├── storage.ts              # Local storage + cloud sync
│   └── types.ts                # TypeScript types
├── scripts/
│   └── 01-init-schema.sql      # Database schema
├── public/                     # Static assets
└── middleware.ts               # JWT verification
\`\`\`

## Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts and authentication
- **user_progress** - Points, levels, streaks
- **expenses** - Expense records
- **budgets** - Budget definitions
- **income** - Income records
- **objectives** - Daily/weekly/monthly goals
- **spending_limits** - Spending thresholds
- **badges** - Achievement badges
- **rewards** - Reward redemptions
- **sessions** - JWT token management

See `scripts/01-init-schema.sql` for full schema.

## Development

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Start Development Server
\`\`\`bash
npm run dev
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

## Deployment

### Local Docker (Optional)
\`\`\`bash
docker-compose up -d
npm run dev
\`\`\`

### AWS Deployment

Follow the comprehensive guide in [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)

Key steps:
1. Create RDS PostgreSQL database
2. Launch EC2 instance
3. Install dependencies
4. Configure environment variables
5. Setup Nginx
6. Install SSL certificate
7. Start with PM2

## Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens for stateless authentication
- HTTPS enforced in production
- SQL injection prevention via parameterized queries
- CORS properly configured
- Secure cookie settings

## Performance

- Database connection pooling via Neon
- Optimized queries with indexes
- Static asset caching
- Nginx gzip compression
- Next.js image optimization

## Monitoring & Maintenance

### Logs
\`\`\`bash
# Application logs
pm2 logs expensetracker

# Nginx logs
sudo tail -f /var/log/nginx/access.log
\`\`\`

### Database Backups
\`\`\`bash
# Create backup
pg_dump <DATABASE_URL> > backup.sql

# Upload to S3
aws s3 cp backup.sql s3://bucket-name/
\`\`\`

### Metrics
- Monitor EC2 CPU and memory usage
- Check RDS database connections
- Track application response times
- Monitor error rates

## Troubleshooting

### Connection Issues
\`\`\`bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1"

# Check security group rules
# Verify EC2 and RDS are in same VPC
\`\`\`

### Application Won't Start
\`\`\`bash
# Check PM2 logs
pm2 logs expensetracker

# Verify environment variables
env | grep DATABASE_URL
\`\`\`

### Database Errors
\`\`\`bash
# Check active connections
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity"

# Verify schema exists
psql $DATABASE_URL -c "\dt"
\`\`\`

## Contributing

1. Create a branch for your feature
2. Make changes and test locally
3. Submit pull request with description

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)
2. See [CLOUD_SETUP_GUIDE.md](./CLOUD_SETUP_GUIDE.md)
3. Review [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)
4. Open an issue on GitHub

## Tech Stack

- **Frontend**: React 18, Next.js 14, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Infrastructure**: AWS EC2, RDS, Nginx
- **Tools**: PM2, Let's Encrypt, Git

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Social features (sharing, competitions)
- [ ] Advanced analytics and insights
- [ ] Multi-currency support
- [ ] API rate limiting and webhook support

---

**Made with ❤️ for better financial management**
