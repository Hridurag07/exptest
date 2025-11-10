# Authentication Guide

## Overview
The Expense Tracker now has a complete authentication system with proper login, signup, and logout functionality.

## User Accounts

### Sign Up (Create New Account)
1. On the sign-in page, click "Don't have an account? Sign up"
2. Fill in:
   - Name
   - Email
   - Password (minimum 6 characters)
   - Choose your theme (Light or Dark)
3. Click "Create Account"
4. You'll be automatically logged in and redirected to the dashboard

### Login (Existing Account)
1. On the sign-in page, enter your email and password
2. Click "Sign In"
3. If credentials are correct, you'll be redirected to the dashboard
4. If incorrect, you'll see an error message

### Admin Login
1. On the sign-in page, click "Admin Login" at the bottom
2. Enter the admin PIN: **0487**
3. Click "Access Admin Panel"
4. You'll be logged in with admin privileges and can access the Admin page

## Features

### Logout
- Click the logout button (power icon) in the top right of any page
- This will clear all your session data and return you to the sign-in page

### Protected Pages
All dashboard pages are protected and require authentication:
- Dashboard
- Transactions
- Objectives
- Rewards
- Customize Avatar
- Admin Panel

If you try to access any of these pages without being logged in, you'll be automatically redirected to the sign-in page.

## Admin Features
When logged in as admin (PIN: 0487):
- Access to the Admin page from the navigation menu
- Ability to unlock all features instantly
- Unlock all levels, rewards, badges, and avatar cosmetics

## Security Notes
- Passwords are stored locally in browser localStorage
- This is a demo app - in production, use proper backend authentication
- Admin PIN: 0487
- All user data is stored locally and cleared on logout
