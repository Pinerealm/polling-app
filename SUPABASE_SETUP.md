# Supabase Setup Guide for Polling App

This guide will walk you through setting up Supabase for your polling app, including database setup, authentication, and environment configuration.

## 🚀 Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `polling-app` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (usually 2-3 minutes)

### 2. Get Your Project Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### 3. Set Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Database URL for direct connections
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and run the SQL script
4. Verify the tables are created in **Table Editor**

## 🗄️ Database Schema

The app creates the following tables:

- **`profiles`** - User profiles (extends Supabase auth)
- **`polls`** - Poll information and settings
- **`poll_options`** - Available options for each poll
- **`votes`** - User votes on poll options

### Key Features:

- **Row Level Security (RLS)** enabled on all tables
- **Automatic profile creation** when users sign up
- **Vote validation** to prevent duplicate votes
- **Poll expiration** support
- **Multiple voting** options per poll

## 🔐 Authentication Setup

### 1. Configure Auth Settings

1. Go to **Authentication** → **Settings**
2. Configure the following:

#### Site URL
```
http://localhost:3000 (for development)
https://yourdomain.com (for production)
```

#### Redirect URLs
```
http://localhost:3000/dashboard
https://yourdomain.com/dashboard
```

### 2. Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link

### 3. Social Providers (Optional)

1. Go to **Authentication** → **Providers**
2. Configure providers like Google, GitHub, etc.
3. Add the provider credentials

## 🛡️ Security & RLS Policies

The app includes comprehensive Row Level Security policies:

- **Profiles**: Users can only access their own profile
- **Polls**: Anyone can view active polls, users can manage their own
- **Options**: Anyone can view, creators can manage
- **Votes**: Users can only vote once per option per poll

## 🔧 Development Workflow

### 1. Start Development Server

```bash
pnpm dev
```

### 2. Test Authentication

1. Visit `/login` or `/signup`
2. Create a test account
3. Verify you're redirected to `/dashboard`

### 3. Test Poll Creation

1. Sign in to your account
2. Go to `/polls/create`
3. Create a test poll
4. Verify it appears in the polls list

## 📱 Real-time Features

Supabase provides real-time subscriptions out of the box. The app is set up to:

- **Real-time poll updates** when votes are cast
- **Live user presence** (can be extended)
- **Instant notifications** for new polls

## 🚀 Production Deployment

### 1. Update Environment Variables

```bash
# Production environment
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

### 2. Update Supabase Settings

1. **Site URL**: Update to your production domain
2. **Redirect URLs**: Add your production dashboard URL
3. **CORS Origins**: Add your production domain

### 3. Database Backups

1. Go to **Settings** → **Database**
2. Enable **Point in Time Recovery**
3. Set up automated backups

## 🐛 Troubleshooting

### Common Issues:

#### 1. "Invalid API key" error
- Verify your environment variables are correct
- Check that you're using the **anon key**, not the service role key

#### 2. Authentication not working
- Verify your redirect URLs are correct
- Check that RLS policies are properly set up
- Ensure the `handle_new_user` function exists

#### 3. Database connection errors
- Verify your database password is correct
- Check that your IP is not blocked
- Ensure the database is running

#### 4. RLS policy errors
- Verify all tables have RLS enabled
- Check that policies are properly written
- Test policies with the Supabase policy tester

### Debug Mode

Enable debug logging by adding to your environment:

```bash
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Integration Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

## 🔄 Database Migrations

For future schema changes:

1. Create migration files in `supabase/migrations/`
2. Use Supabase CLI for local development
3. Test migrations in staging before production

## 📊 Monitoring & Analytics

1. **Database Performance**: Monitor query performance in **Logs**
2. **Authentication**: Track sign-ups and logins in **Authentication** → **Users**
3. **API Usage**: Monitor API calls in **Logs** → **API**

---

Your Supabase setup is now complete! The app includes:
- ✅ User authentication with Supabase Auth
- ✅ Secure database with RLS policies
- ✅ Real-time capabilities
- ✅ Type-safe database operations
- ✅ Production-ready configuration

Start building your polling app! 🎉
