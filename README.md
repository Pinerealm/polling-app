# Polling App

A modern Next.js application for creating and managing polls with user authentication, real-time voting, and analytics. Built with Supabase for backend services and real-time database functionality.

## Features

- **User Authentication**: Sign up, sign in, and user management with Supabase Auth
- **Poll Creation**: Create polls with multiple options, descriptions, and expiration dates
- **Poll Management**: View, edit, and delete your polls
- **Voting System**: Vote on polls with support for single or multiple votes
- **Real-time Results**: See live voting results and analytics
- **Responsive Design**: Modern UI built with Tailwind CSS and Shadcn components
- **Database Integration**: Full-stack application with Supabase PostgreSQL database
- **Row Level Security**: Secure data access with RLS policies

## Project Structure

```
polling-app/
├── app/
│   ├── (auth)/                 # Authentication routes
│   │   ├── login/             # Login page
│   │   └── signup/            # Signup page
│   ├── (dashboard)/           # Protected dashboard routes
│   │   ├── layout.tsx         # Dashboard layout with navigation
│   │   └── dashboard/         # Main dashboard page
│   ├── polls/                 # Poll-related pages
│   │   ├── page.tsx           # Browse all polls
│   │   └── create/            # Create new poll
│   ├── api/                   # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   └── polls/             # Poll management endpoints
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/
│   ├── ui/                    # Shadcn UI components
│   │   ├── button.tsx         # Button component
│   │   ├── input.tsx          # Input component
│   │   └── card.tsx           # Card components
│   ├── forms/                 # Form components
│   │   ├── auth-form.tsx      # Authentication form
│   │   └── create-poll-form.tsx # Poll creation form
│   ├── auth/                  # Authentication components
│   ├── providers/             # Context providers
│   └── polls/                 # Poll-specific components
│       └── poll-card.tsx      # Poll display card
├── lib/
│   └── utils.ts               # Utility functions
├── supabase/                  # Supabase configuration and schema
│   └── schema.sql             # Database schema
├── types/
│   └── index.ts               # TypeScript type definitions
├── SUPABASE_SETUP.md          # Supabase setup guide
├── env.example                # Environment variables template
└── package.json               # Dependencies and scripts
```

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd polling-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up Supabase:
   - Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md)
   - Create a `.env.local` file with your Supabase credentials

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Key Components

### Authentication
- Supabase Auth integration with email/password
- Protected routes and layouts
- User profile management

### Poll Management
- Create polls with multiple options
- Set expiration dates and voting rules
- View and manage your created polls
- Database-backed persistence

### Poll Display
- Responsive poll cards with voting options
- Real-time vote counting and percentages
- Search and filter functionality

## Database Schema

The app uses the following Supabase tables:

- **`profiles`** - User profiles (extends Supabase auth)
- **`polls`** - Poll information and settings
- **`poll_options`** - Available options for each poll
- **`votes`** - User votes on poll options

All tables include Row Level Security (RLS) policies for secure data access.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login with Supabase
- `POST /api/auth/signup` - User registration with Supabase

### Polls
- `GET /api/polls` - Fetch all polls
- `POST /api/polls` - Create new poll
- `GET /api/polls/[id]` - Get specific poll
- `PUT /api/polls/[id]` - Update poll
- `DELETE /api/polls/[id]` - Delete poll

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Database URL for direct connections
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## Development Status

This project has evolved from a scaffold to a fully functional application:

✅ **Completed**:
- Project structure and routing
- UI components and layouts with Shadcn/ui
- Supabase integration and database schema
- Authentication system with Supabase Auth
- Form components for authentication and poll creation
- API endpoints for polls and authentication
- Row Level Security policies
- Responsive design and navigation

🔄 **In Progress**:
- Real-time voting updates
- Advanced poll analytics
- User profile customization

📋 **Planned**:
- Real-time updates with Supabase subscriptions
- Advanced analytics and charts
- Poll sharing and embedding
- Mobile app
- Social authentication providers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For Supabase setup and configuration, refer to the [Supabase Setup Guide](./SUPABASE_SETUP.md).
