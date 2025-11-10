# Complete Beginner's Guide to Deploy Expense Tracker on AWS

This guide will walk you through every single step to get your app running on AWS. Even if you've never used AWS before, you'll be able to follow this.

## Table of Contents
1. [Setting Up RDS Database](#1-setting-up-rds-database)
2. [Setting Up EC2 Server](#2-setting-up-ec2-server)
3. [Deploying Your Application](#3-deploying-your-application)
4. [Setting Up Your Domain (Optional)](#4-setting-up-your-domain-optional)

---

## 1. Setting Up RDS Database

Your RDS database is like a remote filing cabinet where all user data (login credentials, expenses, etc.) will be stored.

### Step 1.1: Create RDS Instance

1. Log into your AWS Console: https://console.aws.amazon.com
2. Search for "RDS" in the search bar
3. Click "Databases" → "Create database"
4. Select these options exactly:
   - **Choose a database creation method**: Easy create
   - **Engine type**: PostgreSQL
   - **DB instance class**: db.t3.micro (Free tier eligible)
   - **DB instance identifier**: `expensetracker`
   - **Master username**: `postgres`
   - **Master password**: Create a strong password (SAVE THIS!)
     - Example: `MySecurePass123!@#`

5. Click "Create database"
6. **Wait 5-10 minutes** for the database to be created

### Step 1.2: Get Your Database Connection Info

1. Once created, click on your database name "expensetracker"
2. Scroll down to find "Endpoint"
3. Copy the endpoint URL (looks like: `expensetracker.xxxxx.us-east-1.rds.amazonaws.com`)
4. **Save this** - you'll need it later

### Step 1.3: Allow EC2 to Connect to RDS

1. In the RDS dashboard, find your database
2. Click on "VPC security groups" (blue link)
3. Click the security group that appears
4. Click "Edit inbound rules"
5. Click "Add rule"
   - Type: PostgreSQL
   - Source: 0.0.0.0/0 (for now, we'll restrict this later)
6. Click "Save rules"

---

## 2. Setting Up EC2 Server

Your EC2 instance is like a computer in the cloud where your website will run 24/7.

### Step 2.1: Launch EC2 Instance

1. Go to AWS Console → Search "EC2"
2. Click "Instances" → "Launch instances"
3. Configure these settings:

**Name**: `expense-tracker-server`

**AMI (Operating System)**: 
- Search for "Ubuntu"
- Select "Ubuntu Server 22.04 LTS" (Free tier eligible)

**Instance type**: `t3.micro` (Free tier eligible)

**Key pair (login)**:
- Click "Create new key pair"
- Name: `expense-tracker-key`
- File format: `.pem`
- Click "Create key pair"
- **This file downloads automatically - SAVE IT SAFELY**

**Network settings** (Security group):
- Click "Create security group"
- Name: `expense-tracker-sg`
- Add these rules:
  - Type: SSH, Port: 22, Source: My IP
  - Type: HTTP, Port: 80, Source: 0.0.0.0/0
  - Type: HTTPS, Port: 443, Source: 0.0.0.0/0

**Storage**: 
- Size: 20 GB (default is fine)

4. Click "Launch instance"
5. **Wait 2-3 minutes** for the instance to start

### Step 2.2: Connect to Your EC2 Instance

1. Go to EC2 → Instances
2. Select your instance
3. Click "Connect" button
4. Choose "EC2 Instance Connect" tab
5. Click "Connect"
6. A terminal window will open - you're now connected!

**Alternative** (if you want to use your own terminal):
1. Click "Connect" → "SSH client" tab
2. Copy the command that looks like:
   \`\`\`
   ssh -i "expense-tracker-key.pem" ubuntu@ec2-xxx-xxx-xxx-xxx.compute-1.amazonaws.com
   \`\`\`
3. Open your computer's terminal and paste it

### Step 2.3: Install Required Software

Copy and paste these commands **one by one** into your EC2 terminal:

\`\`\`bash
sudo apt-get update
\`\`\`

Wait for it to finish, then:

\`\`\`bash
sudo apt-get upgrade -y
\`\`\`

Wait, then:

\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
\`\`\`

Then:

\`\`\`bash
sudo apt-get install -y nodejs postgresql-client nginx
\`\`\`

Then:

\`\`\`bash
sudo npm install -g pm2
\`\`\`

Then:

\`\`\`bash
sudo apt-get install -y certbot python3-certbot-nginx
\`\`\`

**All packages are now installed!**

### Step 2.4: Create Application Folder

\`\`\`bash
sudo mkdir -p /var/www/expensetracker
sudo chown ubuntu:ubuntu /var/www/expensetracker
cd /var/www/expensetracker
\`\`\`

---

## 3. Deploying Your Application

### Step 3.1: Upload Your Code from GitHub

**Option A: Using Git (Recommended)**

\`\`\`bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git .
\`\`\`

Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub details.

**Option B: Manual Upload**

1. Go to your GitHub repo
2. Click "Code" → "Download ZIP"
3. Extract the ZIP on your computer
4. Open terminal/command prompt in that folder
5. Run:
\`\`\`bash
scp -i /path/to/expense-tracker-key.pem -r ./* ubuntu@YOUR-EC2-IP:/var/www/expensetracker/
\`\`\`

Replace `YOUR-EC2-IP` with your EC2 instance's public IP (find it in AWS Console)

### Step 3.2: Install Node Dependencies

In your EC2 terminal:

\`\`\`bash
cd /var/www/expensetracker
npm install
npm run build
\`\`\`

This takes 2-5 minutes. Wait for it to finish.

### Step 3.3: Set Up Environment Variables

Create the `.env.local` file:

\`\`\`bash
nano .env.local
\`\`\`

Copy and paste this, **replacing the values**:

\`\`\`env
# Database Connection
DATABASE_URL=postgresql://postgres:YOUR_RDS_PASSWORD@YOUR_RDS_ENDPOINT:5432/expensetracker

# Next.js
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://YOUR_DOMAIN_OR_EC2_IP

# JWT Secret (create a random string)
JWT_SECRET=your-super-secret-jwt-key-generate-random-32-chars-here
JWT_EXPIRATION=7d
\`\`\`

**How to fill in the values:**

1. **YOUR_RDS_PASSWORD**: The password you created for RDS (e.g., `MySecurePass123!@#`)
2. **YOUR_RDS_ENDPOINT**: Copy from RDS dashboard (e.g., `expensetracker.c5gvbfr4g1sw.us-east-1.rds.amazonaws.com`)
3. **YOUR_DOMAIN_OR_EC2_IP**: Your EC2 public IP (find in AWS Console) or domain name if you have one
4. **JWT_SECRET**: Any random string (can generate one: `openssl rand -base64 32`)

To save:
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

### Step 3.4: Create Database Tables

\`\`\`bash
psql postgresql://postgres:YOUR_RDS_PASSWORD@YOUR_RDS_ENDPOINT:5432/expensetracker < scripts/01-init-schema.sql
\`\`\`

Replace the password and endpoint with your actual values.

You should see many "CREATE TABLE" messages - that's good!

### Step 3.5: Set Up Nginx Reverse Proxy

Create the Nginx config:

\`\`\`bash
sudo nano /etc/nginx/sites-available/expensetracker
\`\`\`

Paste this:

\`\`\`nginx
upstream nextjs_app {
  server 127.0.0.1:3000;
}

server {
  listen 80;
  server_name _;

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

Save with `Ctrl + X`, `Y`, `Enter`

Enable it:

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/expensetracker /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

### Step 3.6: Start Your Application with PM2

\`\`\`bash
cd /var/www/expensetracker
pm2 start npm --name "expensetracker" -- start
pm2 startup
pm2 save
\`\`\`

Your app is now running! 🎉

### Step 3.7: Check If It's Working

\`\`\`bash
pm2 logs expensetracker
\`\`\`

You should see messages like "ready - started server on 0.0.0.0:3000"

If there are errors, read them carefully - they usually tell you what's wrong.

### Step 3.8: Access Your Application

1. Go to AWS Console → EC2 → Instances
2. Find your instance and copy its "Public IPv4 address"
3. Open your browser and go to: `http://YOUR_PUBLIC_IP`

Your app should load! ✅

---

## 4. Setting Up Your Domain (Optional)

If you have a domain name and want to use it instead of the IP address:

### Step 4.1: Point Domain to EC2

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS settings
3. Create an A record:
   - Name: `@` (or leave blank)
   - Value: Your EC2 public IP
   - TTL: 3600

4. Wait 15-30 minutes for DNS to update

### Step 4.2: Update Nginx Config for Domain

\`\`\`bash
sudo nano /etc/nginx/sites-available/expensetracker
\`\`\`

Change `server_name _;` to `server_name yourdomain.com www.yourdomain.com;`

Save and restart:

\`\`\`bash
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

### Step 4.3: Add SSL Certificate (HTTPS)

\`\`\`bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
\`\`\`

Follow the prompts - it will set up HTTPS automatically!

---

## Useful Commands to Remember

### View Application Logs
\`\`\`bash
pm2 logs expensetracker
\`\`\`

### Restart Application
\`\`\`bash
pm2 restart expensetracker
\`\`\`

### Stop Application
\`\`\`bash
pm2 stop expensetracker
\`\`\`

### Check Application Status
\`\`\`bash
pm2 status
\`\`\`

### Connect to Database
\`\`\`bash
psql postgresql://postgres:PASSWORD@ENDPOINT:5432/expensetracker
\`\`\`

### View Nginx Logs
\`\`\`bash
sudo tail -f /var/log/nginx/error.log
\`\`\`

---

## Common Issues & Solutions

### "Connection refused" Error
- Check if EC2 security group allows port 80 and 443
- Make sure PM2 app is running: `pm2 status`

### "Database connection failed"
- Verify RDS endpoint is correct in `.env.local`
- Check RDS security group allows EC2 to connect
- Verify password is correct

### App is slow or won't load
- Check EC2 instance has enough memory: `free -h`
- Check disk space: `df -h`
- View PM2 logs: `pm2 logs expensetracker`

### Changes not showing up
- Stop and restart the app: `pm2 restart expensetracker`
- Check logs for build errors: `pm2 logs expensetracker`

---

## Cost Estimate

- **EC2 t3.micro**: $0 (first year with free tier) or ~$7-10/month
- **RDS db.t3.micro**: $0 (first year with free tier) or ~$15-20/month
- **Bandwidth**: $0-5/month depending on usage
- **Total**: Roughly $20-30/month after free tier expires

To see your costs anytime:
1. AWS Console → Billing Dashboard
2. See your current month's spending

---

## Next Steps

1. Test your app thoroughly at `http://YOUR_EC2_IP`
2. Create test accounts and add sample data
3. Once stable, connect your domain (Step 4)
4. Set up HTTPS/SSL (Step 4.3)
5. Monitor logs regularly: `pm2 logs expensetracker`
6. Set up a backup strategy for your database

**Congratulations! Your app is now live on AWS! 🚀**
