# AWS Expense Tracker Deployment Guide

This guide covers deploying the gamified expense tracker to AWS using EC2 and RDS.

## Prerequisites

- AWS Account with appropriate permissions
- PostgreSQL 12+ (RDS)
- Node.js 18+ (EC2)
- Git
- SSL Certificate (for production)

## Step 1: Setup AWS RDS Database

### Create RDS PostgreSQL Instance

1. Go to AWS RDS Console
2. Click "Create database"
3. Configure:
   - **Engine**: PostgreSQL 14+
   - **Instance class**: db.t3.micro (or higher based on needs)
   - **Storage**: 20GB (minimum)
   - **DB name**: `expensetracker`
   - **Master username**: `postgres`
   - **Master password**: Create a strong password
   - **Public accessibility**: No (keep private)

4. Create a database subnet group in the same VPC as your EC2 instance
5. Configure security group to allow:
   - Inbound: PostgreSQL (5432) from EC2 security group
   - Outbound: All traffic

### Run Database Migrations

\`\`\`bash
# After EC2 setup, SSH into your instance and run:
cd /var/www/expensetracker
psql postgresql://username:password@your-rds-endpoint.rds.amazonaws.com:5432/expensetracker < scripts/01-init-schema.sql
\`\`\`

## Step 2: Setup AWS EC2 Instance

### Launch EC2 Instance

1. Go to AWS EC2 Console
2. Launch a new instance with:
   - **AMI**: Ubuntu 22.04 LTS (free tier eligible)
   - **Instance type**: t3.micro or t3.small
   - **Security group**: Allow:
     - SSH (22) from your IP
     - HTTP (80) from anywhere
     - HTTPS (443) from anywhere
     - Outbound: All traffic (for RDS access)

### Connect via SSH

\`\`\`bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
\`\`\`

### Install Dependencies

\`\`\`bash
# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL client (to run migrations)
sudo apt-get install -y postgresql-client

# Install Nginx (reverse proxy)
sudo apt-get install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2

# Install certbot for SSL
sudo apt-get install -y certbot python3-certbot-nginx
\`\`\`

### Setup Application

\`\`\`bash
# Create app directory
sudo mkdir -p /var/www/expensetracker
sudo chown ubuntu:ubuntu /var/www/expensetracker

# Clone repository or upload files
cd /var/www/expensetracker
git clone your-repo-url .
# or
scp -i your-key.pem -r ./expensetracker/* ubuntu@your-ec2-public-ip:/var/www/expensetracker/

# Install dependencies
npm install

# Build Next.js app
npm run build
\`\`\`

### Configure Environment Variables

\`\`\`bash
# Create .env.local
sudo nano /var/www/expensetracker/.env.local
\`\`\`

Add the following:

\`\`\`env
# Database
DATABASE_URL=postgresql://username:password@your-rds-endpoint.rds.amazonaws.com:5432/expensetracker

# Next.js
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRATION=7d
\`\`\`

### Setup Database

\`\`\`bash
cd /var/www/expensetracker
psql postgresql://username:password@your-rds-endpoint.rds.amazonaws.com:5432/expensetracker < scripts/01-init-schema.sql
\`\`\`

### Configure Nginx

\`\`\`bash
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

Enable the config:

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/expensetracker /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

### Setup SSL Certificate

\`\`\`bash
sudo certbot --nginx -d your-domain.com
\`\`\`

### Start Application with PM2

\`\`\`bash
cd /var/www/expensetracker

# Start the application
pm2 start npm --name "expensetracker" -- start

# Save PM2 config to restart on reboot
pm2 startup
pm2 save
\`\`\`

### Monitor Application

\`\`\`bash
# View logs
pm2 logs expensetracker

# Monitor processes
pm2 monit

# Check app status
pm2 status
\`\`\`

## Step 3: Database Administration

### Create Admin User

\`\`\`bash
psql postgresql://username:password@your-rds-endpoint.rds.amazonaws.com:5432/expensetracker

-- Run this SQL
INSERT INTO users (email, password_hash, name, theme, is_admin)
VALUES ('admin@expensetracker.com', crypt('admin-password', gen_salt('bf')), 'Admin', 'dark', true);
\`\`\`

### Backup Database

\`\`\`bash
# Create backup
pg_dump postgresql://username:password@your-rds-endpoint.rds.amazonaws.com:5432/expensetracker > backup_$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup_*.sql s3://your-backup-bucket/
\`\`\`

### Restore Database

\`\`\`bash
psql postgresql://username:password@your-rds-endpoint.rds.amazonaws.com:5432/expensetracker < backup_*.sql
\`\`\`

## Monitoring & Maintenance

### Application Performance

\`\`\`bash
# Check disk space
df -h

# Check memory usage
free -h

# Check process status
pm2 status
\`\`\`

### Database Performance

Monitor RDS in AWS Console for:
- CPU utilization
- Database connections
- Storage usage
- Read/Write latency

### Log Management

\`\`\`bash
# Application logs
pm2 logs expensetracker

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
\`\`\`

## Security Best Practices

1. **Update Security Groups**:
   - Restrict SSH access to your IP
   - Only allow EC2 instance to access RDS

2. **Database Passwords**:
   - Use strong, randomly generated passwords
   - Store in AWS Secrets Manager

3. **Environment Variables**:
   - Never commit `.env.local` to git
   - Use `.env.local.example` as template

4. **SSL Certificates**:
   - Auto-renew with certbot
   - Monitor expiration dates

5. **Regular Backups**:
   - Daily RDS automated backups
   - Weekly manual backups to S3

6. **Updates**:
   - Regularly update system packages
   - Keep Node.js and npm updated

## Troubleshooting

### Database Connection Issues

\`\`\`bash
# Test connection
psql postgresql://username:password@your-rds-endpoint.rds.amazonaws.com:5432/expensetracker -c "SELECT 1"

# Check security groups allow port 5432
# Verify RDS endpoint is correct
\`\`\`

### Application Won't Start

\`\`\`bash
# Check PM2 logs
pm2 logs expensetracker

# Verify environment variables
echo $DATABASE_URL

# Check disk space
df -h
\`\`\`

### Nginx Issues

\`\`\`bash
# Test configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log

# Restart
sudo systemctl restart nginx
\`\`\`

## Cost Optimization

- Use t3 instance types (burstable, cost-effective)
- Enable RDS automated backups (included)
- Use RDS storage auto-scaling
- Monitor usage and adjust instance size as needed
- Set up AWS Budgets for cost alerts

## Production Deployment Checklist

- [ ] Database migrations completed
- [ ] Environment variables configured securely
- [ ] SSL certificate installed
- [ ] PM2 configured to auto-restart
- [ ] Nginx reverse proxy working
- [ ] Database backups automated
- [ ] Monitoring and alerts configured
- [ ] Security groups properly configured
- [ ] Admin user created
- [ ] Application tested end-to-end
\`\`\`

```json file="" isHidden
