# Cloud Expense Tracker Setup Guide

Complete guide for setting up the Expense Tracker in the cloud using AWS RDS and EC2.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Database Setup](#database-setup)
3. [AWS RDS Configuration](#aws-rds-configuration)
4. [AWS EC2 Configuration](#aws-ec2-configuration)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

## Local Development Setup

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- PostgreSQL 12+ ([Download](https://www.postgresql.org/download))
- Git

### Installation Steps

1. **Clone or extract the project**

\`\`\`bash
cd expensetracker
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
\`\`\`

3. **Setup local PostgreSQL database**

\`\`\`bash
# Create database
createdb expensetracker

# Run migrations
psql expensetracker < scripts/01-init-schema.sql
\`\`\`

4. **Configure environment variables**

\`\`\`bash
# Copy example env file
cp .env.local.example .env.local

# Edit with your local database details
nano .env.local
\`\`\`

Update `.env.local`:

\`\`\`env
DATABASE_URL=postgresql://localhost:5432/expensetracker
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your-secret-key-for-local-dev
JWT_EXPIRATION=7d
NODE_ENV=development
\`\`\`

5. **Run development server**

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` in your browser.

6. **Create test admin account**

\`\`\`bash
# Open PostgreSQL
psql expensetracker

-- Create test user (password: testpass123)
INSERT INTO users (email, password_hash, name, theme, is_admin)
VALUES (
  'test@example.com',
  crypt('testpass123', gen_salt('bf')),
  'Test User',
  'light',
  false
);

-- Create test admin (password: admin123)
INSERT INTO users (email, password_hash, name, theme, is_admin)
VALUES (
  'admin@expensetracker.com',
  crypt('admin123', gen_salt('bf')),
  'Admin User',
  'dark',
  true
);
\`\`\`

## Database Setup

### PostgreSQL Extensions

The project uses PostgreSQL cryptographic functions. Enable them:

\`\`\`bash
psql expensetracker

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enable uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\`\`\`

### Running Migrations

From the project root:

\`\`\`bash
# Development
psql expensetracker < scripts/01-init-schema.sql

# Production (via SSH on EC2)
psql postgresql://user:password@rds-endpoint:5432/expensetracker < scripts/01-init-schema.sql
\`\`\`

## AWS RDS Configuration

### Create RDS PostgreSQL Instance

1. Go to [AWS RDS Console](https://console.aws.amazon.com/rds)
2. Click **Create database**
3. Configure settings:

| Setting | Value |
|---------|-------|
| Engine | PostgreSQL 14+ |
| Template | Free tier (optional) |
| DB instance identifier | `expensetracker-db` |
| Master username | `postgres` |
| Master password | *Strong password* |
| Instance class | db.t3.micro |
| Storage type | gp2 |
| Allocated storage | 20 GB |
| Public accessibility | No |

4. **Additional Configuration**:
   - DB name: `expensetracker`
   - Database port: 5432
   - Backup retention: 7 days
   - Multi-AZ: No (for cost savings)

5. **Security Group Settings**:
   - Create new security group: `expensetracker-rds-sg`
   - Allow inbound: PostgreSQL (5432) from EC2 security group
   - Allow outbound: All traffic

6. Click **Create database** and wait for completion (~5-10 minutes)

### Post-Creation Setup

1. Get RDS endpoint from AWS Console
2. Install PostgreSQL client locally:

\`\`\`bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Windows - Use pgAdmin or download PostgreSQL
\`\`\`

3. Test connection:

\`\`\`bash
psql -h your-rds-endpoint.rds.amazonaws.com -U postgres -d expensetracker
\`\`\`

4. Run migrations:

\`\`\`bash
psql -h your-rds-endpoint.rds.amazonaws.com -U postgres -d expensetracker < scripts/01-init-schema.sql
\`\`\`

## AWS EC2 Configuration

### Launch EC2 Instance

1. Go to [AWS EC2 Console](https://console.aws.amazon.com/ec2)
2. Click **Launch instances**
3. Configure:

| Setting | Value |
|---------|-------|
| Name | `expensetracker-app` |
| AMI | Ubuntu 22.04 LTS |
| Instance type | t3.micro |
| Key pair | Create new or select existing |
| Security group | Create new: `expensetracker-app-sg` |

4. **Security Group Inbound Rules**:

| Type | Protocol | Port | Source |
|------|----------|------|--------|
| SSH | TCP | 22 | Your IP |
| HTTP | TCP | 80 | 0.0.0.0/0 |
| HTTPS | TCP | 443 | 0.0.0.0/0 |

5. Click **Launch instance** and wait for startup

### Connect to EC2

\`\`\`bash
# Change permissions on key pair
chmod 400 your-key-pair.pem

# SSH into instance
ssh -i your-key-pair.pem ubuntu@your-ec2-public-ip
\`\`\`

### Install Dependencies

\`\`\`bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL client
sudo apt-get install -y postgresql-client

# Install Nginx
sudo apt-get install -y nginx

# Install PM2
sudo npm install -g pm2

# Install SSL tool
sudo apt-get install -y certbot python3-certbot-nginx
\`\`\`

### Setup Application

\`\`\`bash
# Create app directory
sudo mkdir -p /var/www/expensetracker
sudo chown ubuntu:ubuntu /var/www/expensetracker
cd /var/www/expensetracker

# Clone repository (or use SCP to upload files)
git clone your-repo-url .

# Install dependencies
npm install

# Build Next.js
npm run build
\`\`\`

### Configure Environment

\`\`\`bash
# Create production env file
nano .env.local
\`\`\`

Add:

\`\`\`env
DATABASE_URL=postgresql://user:password@your-rds-endpoint.rds.amazonaws.com:5432/expensetracker
NEXT_PUBLIC_API_URL=https://your-domain.com
JWT_SECRET=generate-a-random-32-char-string
JWT_EXPIRATION=7d
NODE_ENV=production
\`\`\`

Generate JWT secret:

\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

### Setup Nginx Reverse Proxy

\`\`\`bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/expensetracker
\`\`\`

Add:

\`\`\`nginx
upstream nextjs_app {
  server 127.0.0.1:3000;
}

server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://nextjs_app;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
\`\`\`

Enable config:

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/expensetracker /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

### Setup SSL with Let's Encrypt

\`\`\`bash
sudo certbot --nginx -d your-domain.com
sudo systemctl enable certbot.timer
\`\`\`

### Start Application

\`\`\`bash
cd /var/www/expensetracker

# Start with PM2
pm2 start npm --name "expensetracker" -- start

# Set to restart on reboot
pm2 startup
pm2 save

# Check status
pm2 status
\`\`\`

## Deployment

### Update Existing Deployment

\`\`\`bash
# SSH into EC2
ssh -i your-key-pair.pem ubuntu@your-ec2-public-ip

# Navigate to app
cd /var/www/expensetracker

# Pull latest code
git pull origin main

# Install new dependencies if any
npm install

# Build
npm run build

# Restart app
pm2 restart expensetracker

# View logs
pm2 logs expensetracker
\`\`\`

### Database Backup

\`\`\`bash
# Create backup
pg_dump -h your-rds-endpoint.rds.amazonaws.com -U postgres expensetracker > backup_$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup_*.sql s3://your-backup-bucket/
\`\`\`

### Database Restore

\`\`\`bash
psql -h your-rds-endpoint.rds.amazonaws.com -U postgres expensetracker < backup_*.sql
\`\`\`

## Monitoring

### Application Health

\`\`\`bash
# Check PM2 status
pm2 status

# View logs
pm2 logs expensetracker --lines 100

# Monitor in real-time
pm2 monit
\`\`\`

### System Resources

\`\`\`bash
# CPU and memory
free -h
top

# Disk usage
df -h
du -sh /var/www/expensetracker

# Network
netstat -tuln | grep :3000
\`\`\`

### Database Monitoring

In AWS Console:
- CPU Utilization
- Database Connections
- Storage Used
- Read/Write Latency

## Troubleshooting

### Connection Issues

\`\`\`bash
# Test RDS connection
psql -h your-rds-endpoint.rds.amazonaws.com -U postgres -d expensetracker -c "SELECT 1"

# Check security group allows port 5432
# Verify EC2 instance is in same VPC as RDS
\`\`\`

### Application Won't Start

\`\`\`bash
# Check logs
pm2 logs expensetracker

# Verify environment variables
cat .env.local

# Check disk space
df -h

# Try starting manually to see errors
npm run build && npm start
\`\`\`

### Nginx Issues

\`\`\`bash
# Test config
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Check access logs
sudo tail -f /var/log/nginx/access.log

# Restart Nginx
sudo systemctl restart nginx
\`\`\`

### Database Issues

\`\`\`bash
# Check table exists
psql postgresql://user:password@rds-endpoint:5432/expensetracker -c "\dt"

# Check connections
psql postgresql://user:password@rds-endpoint:5432/expensetracker -c "SELECT * FROM pg_stat_activity"

# Kill inactive connections if needed
psql postgresql://user:password@rds-endpoint:5432/expensetracker -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'expensetracker' AND pid <> pg_backend_pid();"
\`\`\`

### SSL Certificate Issues

\`\`\`bash
# Renew certificate manually
sudo certbot renew --dry-run

# Check certificate status
sudo certbot certificates

# Renew if expired
sudo certbot renew
\`\`\`

## Security Checklist

- [ ] RDS is not publicly accessible
- [ ] EC2 security group restricts SSH to your IP
- [ ] Database password is strong (20+ characters)
- [ ] JWT_SECRET is randomly generated (32+ characters)
- [ ] SSL certificate is installed
- [ ] Automated backups are enabled
- [ ] .env.local is not in version control
- [ ] Regular database backups are scheduled
- [ ] Monitoring alerts are configured
- [ ] EC2 and RDS are in same VPC

## Cost Estimation (Monthly)

- EC2 t3.micro: ~$8-10
- RDS db.t3.micro: ~$15-20
- Data transfer: ~$0-5
- Storage: ~$1-2
- **Total: ~$25-37/month**

*Costs vary by region and usage. Enable AWS Budgets for alerts.*
