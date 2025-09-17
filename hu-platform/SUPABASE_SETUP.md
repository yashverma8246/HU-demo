# Supabase Setup Instructions

## Environment Variables Setup

To connect your application to Supabase, you need to create a `.env.local` file in the root of your project with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## How to Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in to your account
2. Create a new project or select an existing one
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **anon public** key → Use as `VITE_SUPABASE_ANON_KEY`

## Example .env.local file

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE5NTYzNTUyMDB9.your-anon-key-here
```

## Database Schema

Create the following tables in your Supabase database. You can run these SQL commands in the Supabase SQL Editor:

### 1. Create the projects table:
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  demo_url TEXT,
  tech_stack TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);
```

### 2. Create the events table:
```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'UPCOMING',
  type TEXT NOT NULL,
  prize_pool TEXT,
  participants TEXT,
  location TEXT NOT NULL,
  date TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  team_size TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Create the event_registrations table:
```sql
CREATE TABLE event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  team_info JSONB,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);
```

### 4. Create the user_calendars table:
```sql
CREATE TABLE user_calendars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);
```

### 5. Enable Row Level Security (RLS):
```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_calendars ENABLE ROW LEVEL SECURITY;

-- Create policies for projects table
CREATE POLICY "Users can view all projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Users can insert their own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Create policies for events table
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);

-- Create policies for event_registrations table
CREATE POLICY "Users can view their own registrations" ON event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register for events" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for user_calendars table
CREATE POLICY "Users can view their own calendar" ON user_calendars FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add events to their calendar" ON user_calendars FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove events from their calendar" ON user_calendars FOR DELETE USING (auth.uid() = user_id);
```

Make sure your Supabase database has the following tables:

### projects
- id (uuid, primary key)
- title (text)
- description (text)
- repo_url (text)
- demo_url (text, nullable)
- tech_stack (text)
- created_at (timestamp)
- user_id (uuid, foreign key to auth.users)

### events
- id (uuid, primary key)
- title (text)
- description (text)
- status (text)
- type (text)
- prize_pool (text)
- participants (text)
- location (text)
- date (text)
- start_date (timestamp)
- end_date (timestamp)
- team_size (text)
- tags (text[])

### event_registrations
- id (uuid, primary key)
- event_id (uuid, foreign key to events)
- user_id (uuid, foreign key to auth.users)
- team_info (jsonb, nullable)
- registered_at (timestamp)

### user_calendars
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- event_id (uuid, foreign key to events)
- added_at (timestamp)

## Testing the Connection

After setting up your environment variables, you can test the connection by:

1. Starting your development server: `npm run dev`
2. Navigate to `/test-supabase` in your browser
3. Click the "Test Supabase" button
4. Check the console and toast notifications for connection status

## Troubleshooting

- Make sure your `.env.local` file is in the root directory of your project
- Restart your development server after adding environment variables
- Check that your Supabase project is active and not paused
- Verify that your database tables exist and have the correct schema
- Ensure Row Level Security (RLS) policies are properly configured if needed
